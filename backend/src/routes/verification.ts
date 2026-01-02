import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Get verification status
  fastify.get(
    "/api/verification/status",
    { schema: { description: "Get profile verification status", tags: ["verification"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      return {
        verificationStatus: profile.verificationStatus,
        badges: profile.badges,
        profileCompleteness: profile.profileCompleteness,
        rejectionReason: profile.verificationRejectionReason,
      };
    }
  );

  // Submit for verification (updates profile status to pending)
  fastify.post(
    "/api/verification/submit",
    { schema: { description: "Submit profile for verification", tags: ["verification"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      if (profile.verificationStatus === "pending") {
        return reply.status(400).send({ error: "Profile already submitted for verification" });
      }

      const updated = await app.db
        .update(schema.userProfiles)
        .set({
          verificationStatus: "pending",
          verificationRejectionReason: null,
        })
        .where(eq(schema.userProfiles.id, session.user.id))
        .returning();

      return { status: "pending", message: "Profile submitted for verification" };
    }
  );

  // Send email verification token
  fastify.post(
    "/api/verification/send-email-token",
    { schema: { description: "Send email verification token", tags: ["verification"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      // Create verification token
      const token = Math.random().toString(36).substr(2, 9).toUpperCase();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await app.db
        .insert(schema.verificationTokens)
        .values({
          userId: session.user.id,
          token,
          type: "email",
          value: session.user.email,
          expiresAt,
        });

      // TODO: Send email with token
      app.logger.info(`Email verification token created for user ${session.user.id}`);

      return { message: "Verification email sent", token }; // token for testing only
    }
  );

  // Verify email token
  fastify.post(
    "/api/verification/verify-email",
    { schema: { description: "Verify email with token", tags: ["verification"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { token: string };

      const verificationRecord = await app.db.query.verificationTokens.findFirst({
        where: eq(schema.verificationTokens.token, body.token),
      });

      if (!verificationRecord) {
        return reply.status(400).send({ error: "Invalid or expired token" });
      }

      if (verificationRecord.expiresAt < new Date()) {
        return reply.status(400).send({ error: "Token has expired" });
      }

      if (verificationRecord.userId !== session.user.id) {
        return reply.status(403).send({ error: "Token is for a different user" });
      }

      // Mark as used
      await app.db
        .update(schema.verificationTokens)
        .set({ isUsed: true, usedAt: new Date() })
        .where(eq(schema.verificationTokens.id, verificationRecord.id));

      return { message: "Email verified successfully" };
    }
  );

  // Send phone verification token
  fastify.post(
    "/api/verification/send-phone-token",
    { schema: { description: "Send phone verification token", tags: ["verification"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { phoneNumber: string };

      const token = Math.random().toString().substr(2, 6);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await app.db
        .insert(schema.verificationTokens)
        .values({
          userId: session.user.id,
          token,
          type: "phone",
          value: body.phoneNumber,
          expiresAt,
        });

      // TODO: Send SMS with token
      app.logger.info(`Phone verification token created for user ${session.user.id}`);

      return { message: "Verification code sent", token }; // token for testing only
    }
  );

  // Verify phone token
  fastify.post(
    "/api/verification/verify-phone",
    { schema: { description: "Verify phone with token", tags: ["verification"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { token: string };

      const verificationRecord = await app.db.query.verificationTokens.findFirst({
        where: eq(schema.verificationTokens.token, body.token),
      });

      if (!verificationRecord) {
        return reply.status(400).send({ error: "Invalid or expired token" });
      }

      if (verificationRecord.expiresAt < new Date()) {
        return reply.status(400).send({ error: "Token has expired" });
      }

      if (verificationRecord.userId !== session.user.id) {
        return reply.status(403).send({ error: "Token is for a different user" });
      }

      // Update profile with phone number and mark as verified
      await app.db
        .update(schema.userProfiles)
        .set({
          phoneNumber: verificationRecord.value,
          phoneVerified: true,
        })
        .where(eq(schema.userProfiles.id, session.user.id));

      // Mark token as used
      await app.db
        .update(schema.verificationTokens)
        .set({ isUsed: true, usedAt: new Date() })
        .where(eq(schema.verificationTokens.id, verificationRecord.id));

      return { message: "Phone verified successfully" };
    }
  );
}
