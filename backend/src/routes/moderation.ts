import type { FastifyInstance } from "fastify";
import { eq, and } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Block user
  fastify.post(
    "/api/blocks",
    { schema: { description: "Block a user", tags: ["moderation"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { blockedUserId: string; reason?: string };

      if (session.user.id === body.blockedUserId) {
        return reply.status(400).send({ error: "Cannot block yourself" });
      }

      // Check if already blocked
      const existing = await app.db.query.blockedUsers.findFirst({
        where: and(
          eq(schema.blockedUsers.blockerId, session.user.id),
          eq(schema.blockedUsers.blockedUserId, body.blockedUserId)
        ),
      });

      if (existing) {
        return reply.status(400).send({ error: "User already blocked" });
      }

      const created = await app.db
        .insert(schema.blockedUsers)
        .values({
          blockerId: session.user.id,
          blockedUserId: body.blockedUserId,
          reason: body.reason,
        })
        .returning();

      return { block: created[0], message: "User blocked" };
    }
  );

  // Unblock user
  fastify.delete(
    "/api/blocks/:userId",
    { schema: { description: "Unblock a user", tags: ["moderation"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { userId } = request.params as { userId: string };

      await app.db
        .delete(schema.blockedUsers)
        .where(
          and(
            eq(schema.blockedUsers.blockerId, session.user.id),
            eq(schema.blockedUsers.blockedUserId, userId)
          )
        );

      return { message: "User unblocked" };
    }
  );

  // Get blocked users
  fastify.get(
    "/api/blocks",
    { schema: { description: "Get list of blocked users", tags: ["moderation"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const blocks = await app.db.query.blockedUsers.findMany({
        where: eq(schema.blockedUsers.blockerId, session.user.id),
        with: { blocked: true },
      });

      return {
        blockedUsers: blocks.map((b) => ({
          id: b.id,
          blockedUser: b.blocked,
          blockedAt: b.createdAt,
        })),
        count: blocks.length,
      };
    }
  );

  // Report user
  fastify.post(
    "/api/reports",
    { schema: { description: "Report a user or conversation", tags: ["moderation"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as {
        reportedUserId?: string;
        conversationId?: string;
        reportType: string;
        description?: string;
      };

      if (!body.reportedUserId && !body.conversationId) {
        return reply.status(400).send({ error: "Must specify reportedUserId or conversationId" });
      }

      if (body.reportedUserId === session.user.id) {
        return reply.status(400).send({ error: "Cannot report yourself" });
      }

      const created = await app.db
        .insert(schema.reports)
        .values({
          reporterId: session.user.id,
          reportedUserId: body.reportedUserId,
          conversationId: body.conversationId,
          reportType: body.reportType,
          description: body.description,
          status: "pending",
        })
        .returning();

      return { report: created[0], message: "Report submitted" };
    }
  );

  // Get own reports
  fastify.get(
    "/api/reports",
    { schema: { description: "Get reports submitted by user", tags: ["moderation"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const reports = await app.db.query.reports.findMany({
        where: eq(schema.reports.reporterId, session.user.id),
        with: { reportedUser: true },
      });

      return { reports, count: reports.length };
    }
  );

  // Check if blocked
  fastify.get(
    "/api/blocks/status/:userId",
    { schema: { description: "Check if user is blocked", tags: ["moderation"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { userId } = request.params as { userId: string };

      // Check if current user blocked target user
      const blockedByMe = await app.db.query.blockedUsers.findFirst({
        where: and(
          eq(schema.blockedUsers.blockerId, session.user.id),
          eq(schema.blockedUsers.blockedUserId, userId)
        ),
      });

      // Check if target user blocked current user
      const blockedByTarget = await app.db.query.blockedUsers.findFirst({
        where: and(
          eq(schema.blockedUsers.blockerId, userId),
          eq(schema.blockedUsers.blockedUserId, session.user.id)
        ),
      });

      return {
        isBlocked: !!blockedByMe || !!blockedByTarget,
        blockedByMe: !!blockedByMe,
        blockedByTarget: !!blockedByTarget,
      };
    }
  );
}
