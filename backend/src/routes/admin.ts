import type { FastifyInstance } from "fastify";
import { eq, desc, lte } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

// Simple admin middleware - check if user is admin
async function requireAdmin(app: App, request: any, reply: any) {
  const requireAuth = app.requireAuth();
  const session = await requireAuth(request, reply);
  if (!session) return null;

  const admin = await app.db.query.adminUsers.findFirst({
    where: eq(schema.adminUsers.id, session.user.id),
  });

  if (!admin) {
    reply.status(403).send({ error: "Admin access required" });
    return null;
  }

  return admin;
}

export function register(app: App, fastify: FastifyInstance) {
  // Get pending verification reviews (both paths for compatibility)
  const getPendingHandler = async (request: any, reply: any) => {
    const admin = await requireAdmin(app, request, reply);
    if (!admin) return;

    const pendingProfiles = await app.db.query.userProfiles.findMany({
      where: eq(schema.userProfiles.verificationStatus, "pending"),
      with: { media: true },
    });

    return {
      pendingReviews: pendingProfiles.length,
      profiles: pendingProfiles,
    };
  };

  fastify.get(
    "/api/admin/verification/pending",
    { schema: { description: "Get pending user profiles for verification", tags: ["admin"] } },
    getPendingHandler
  );

  fastify.get(
    "/api/admin/applications",
    { schema: { description: "Get pending verification applications", tags: ["admin"] } },
    getPendingHandler
  );

  // Approve user profile (both paths for compatibility)
  const approveHandler = async (request: any, reply: any) => {
    const admin = await requireAdmin(app, request, reply);
    if (!admin) return;

    const { userId, id } = request.params as { userId?: string; id?: string };
    const targetId = userId || id;

    const updated = await app.db
      .update(schema.userProfiles)
      .set({
        verificationStatus: "approved",
        badges: ["verified"],
      })
      .where(eq(schema.userProfiles.id, targetId))
      .returning();

    if (updated.length === 0) {
      return reply.status(404).send({ error: "User not found" });
    }

    return { profile: updated[0], message: "Profile approved" };
  };

  fastify.post(
    "/api/admin/verification/approve/:userId",
    { schema: { description: "Approve user profile", tags: ["admin"] } },
    approveHandler
  );

  fastify.post(
    "/api/admin/applications/:id/approve",
    { schema: { description: "Approve verification application", tags: ["admin"] } },
    approveHandler
  );

  // Reject user profile (both paths for compatibility)
  const rejectHandler = async (request: any, reply: any) => {
    const admin = await requireAdmin(app, request, reply);
    if (!admin) return;

    const { userId, id } = request.params as { userId?: string; id?: string };
    const targetId = userId || id;
    const body = request.body as { reason: string };

    const updated = await app.db
      .update(schema.userProfiles)
      .set({
        verificationStatus: "rejected",
        verificationRejectionReason: body.reason,
      })
      .where(eq(schema.userProfiles.id, targetId))
      .returning();

    if (updated.length === 0) {
      return reply.status(404).send({ error: "User not found" });
    }

    return { profile: updated[0], message: "Profile rejected" };
  };

  fastify.post(
    "/api/admin/verification/reject/:userId",
    { schema: { description: "Reject user profile", tags: ["admin"] } },
    rejectHandler
  );

  fastify.post(
    "/api/admin/applications/:id/reject",
    { schema: { description: "Reject verification application", tags: ["admin"] } },
    rejectHandler
  );

  // Get all users with pagination
  fastify.get(
    "/api/admin/users",
    { schema: { description: "Get all users", tags: ["admin"] } },
    async (request, reply) => {
      const admin = await requireAdmin(app, request, reply);
      if (!admin) return;

      const limit = Math.min((request.query as any).limit || 20, 100);
      const offset = (request.query as any).offset || 0;

      // Note: would need proper pagination queries with Drizzle
      const users = await app.db.query.userProfiles.findMany({
        with: { subscription: true },
      });

      return {
        users: users.slice(offset, offset + limit),
        total: users.length,
        limit,
        offset,
      };
    }
  );

  // Get user details
  fastify.get(
    "/api/admin/users/:userId",
    { schema: { description: "Get user details", tags: ["admin"] } },
    async (request, reply) => {
      const admin = await requireAdmin(app, request, reply);
      if (!admin) return;

      const { userId } = request.params as { userId: string };

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, userId),
        with: {
          media: true,
          subscription: true,
          blockedUsers: true,
          reports: true,
        },
      });

      if (!profile) {
        return reply.status(404).send({ error: "User not found" });
      }

      return { profile };
    }
  );

  // Get reports queue
  fastify.get(
    "/api/admin/reports",
    { schema: { description: "Get reports pending review", tags: ["admin"] } },
    async (request, reply) => {
      const admin = await requireAdmin(app, request, reply);
      if (!admin) return;

      const status = (request.query as any).status || "pending";

      const reports = await app.db.query.reports.findMany({
        where: eq(schema.reports.status, status),
        with: {
          reporter: true,
          reportedUser: true,
          conversation: true,
        },
      });

      return {
        status,
        reports,
        count: reports.length,
      };
    }
  );

  // Update report status
  fastify.post(
    "/api/admin/reports/:reportId",
    { schema: { description: "Update report status", tags: ["admin"] } },
    async (request, reply) => {
      const admin = await requireAdmin(app, request, reply);
      if (!admin) return;

      const { reportId } = request.params as { reportId: string };
      const body = request.body as { status: string; notes?: string };

      const updated = await app.db
        .update(schema.reports)
        .set({
          status: body.status as any,
          resolutionNotes: body.notes,
          resolvedBy: admin.id,
          resolvedAt: new Date(),
        })
        .where(eq(schema.reports.id, reportId))
        .returning();

      if (updated.length === 0) {
        return reply.status(404).send({ error: "Report not found" });
      }

      return { report: updated[0] };
    }
  );

  // Get platform analytics
  fastify.get(
    "/api/admin/analytics",
    { schema: { description: "Get platform analytics", tags: ["admin"] } },
    async (request, reply) => {
      const admin = await requireAdmin(app, request, reply);
      if (!admin) return;

      const allProfiles = await app.db.query.userProfiles.findMany();
      const approvedProfiles = allProfiles.filter((p) => p.verificationStatus === "approved");
      const premiumUsers = allProfiles.filter((p) => p.isPremium);

      const allSubscriptions = await app.db.query.subscriptions.findMany();
      const activeSubscriptions = allSubscriptions.filter((s) => s.status === "active");

      const allMatches = await app.db.query.userMatches.findMany();
      const allConversations = await app.db.query.conversations.findMany();
      const allReports = await app.db.query.reports.findMany();
      const pendingReports = allReports.filter((r) => r.status === "pending");

      return {
        analytics: {
          totalUsers: allProfiles.length,
          verifiedUsers: approvedProfiles.length,
          premiumUsers: premiumUsers.length,
          totalMatches: allMatches.length,
          totalConversations: allConversations.length,
          activeSubscriptions: activeSubscriptions.length,
          totalReports: allReports.length,
          pendingReports: pendingReports.length,
          subscriptionTierBreakdown: {
            free: allProfiles.filter((p) => p.subscriptionTier === "free").length,
            premium: allProfiles.filter((p) => p.subscriptionTier === "premium").length,
            vip: allProfiles.filter((p) => p.subscriptionTier === "vip").length,
          },
          verificationBreakdown: {
            pending: allProfiles.filter((p) => p.verificationStatus === "pending").length,
            approved: approvedProfiles.length,
            rejected: allProfiles.filter((p) => p.verificationStatus === "rejected").length,
          },
        },
      };
    }
  );

  // Suspend user
  fastify.post(
    "/api/admin/users/:userId/suspend",
    { schema: { description: "Suspend user account", tags: ["admin"] } },
    async (request, reply) => {
      const admin = await requireAdmin(app, request, reply);
      if (!admin) return;

      const { userId } = request.params as { userId: string };
      const body = request.body as { reason: string };

      // End all active conversations
      const userConversations = await app.db.query.conversations.findMany({
        where: (conv) => {
          const { or, eq } = require("drizzle-orm");
          return or(eq(conv.user1Id, userId), eq(conv.user2Id, userId));
        },
      });

      for (const conv of userConversations) {
        if (conv.status !== "ended") {
          await app.db
            .update(schema.conversations)
            .set({ status: "ended" })
            .where(eq(schema.conversations.id, conv.id));
        }
      }

      return { message: `User ${userId} suspended` };
    }
  );

  // Delete user
  fastify.delete(
    "/api/admin/users/:userId",
    { schema: { description: "Delete user account", tags: ["admin"] } },
    async (request, reply) => {
      const admin = await requireAdmin(app, request, reply);
      if (!admin) return;

      const { userId } = request.params as { userId: string };

      // Delete all associated data
      await app.db.delete(schema.userMedia).where(eq(schema.userMedia.userId, userId));
      await app.db.delete(schema.userProfiles).where(eq(schema.userProfiles.id, userId));

      return { message: `User ${userId} deleted` };
    }
  );
}
