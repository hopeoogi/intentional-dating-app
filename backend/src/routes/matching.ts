import type { FastifyInstance } from "fastify";
import { eq, ne, and } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Get daily match batch
  fastify.get(
    "/api/matches",
    { schema: { description: "Get daily match batch", tags: ["matching"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
        with: { matchPreferences: true },
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      if (profile.verificationStatus !== "approved") {
        return reply.status(403).send({ error: "Profile must be verified" });
      }

      // Daily limits by tier
      const limits: Record<string, number> = {
        free: 5,
        premium: 50,
        vip: 100,
      };

      const todayMatches = await app.db.query.userMatches.findMany({
        where: and(
          eq(schema.userMatches.userId, session.user.id),
          eq(schema.userMatches.batchDate, new Date().toISOString().split("T")[0])
        ),
      });

      const remaining = Math.max(0, (limits[profile.subscriptionTier] || 5) - todayMatches.length);

      if (remaining === 0) {
        return reply.status(200).send({ matches: [], remaining: 0 });
      }

      // Get potential matches excluding blocked and already matched users
      const blockedUsers = await app.db.query.blockedUsers.findMany({
        where: eq(schema.blockedUsers.blockerId, session.user.id),
      });

      const existingMatches = await app.db.query.userMatches.findMany({
        where: eq(schema.userMatches.userId, session.user.id),
      });

      const blockedIds = new Set(blockedUsers.map((b) => b.blockedUserId));
      const matchedIds = new Set(existingMatches.map((m) => m.matchedUserId));

      const candidates = await app.db.query.userProfiles.findMany({
        where: and(
          ne(schema.userProfiles.id, session.user.id),
          eq(schema.userProfiles.verificationStatus, "approved")
        ),
        with: { media: true },
      });

      const filtered = candidates
        .filter((c) => !blockedIds.has(c.id) && !matchedIds.has(c.id))
        .slice(0, remaining);

      // Create match records
      const matches = await Promise.all(
        filtered.map((candidate) =>
          app.db
            .insert(schema.userMatches)
            .values({
              userId: session.user.id,
              matchedUserId: candidate.id,
              batchDate: new Date().toISOString().split("T")[0],
              matchScore: Math.floor(Math.random() * 100),
            })
            .returning()
        )
      );

      return {
        matches: filtered.map((c) => ({ id: c.id, name: c.bio?.slice(0, 50), location: c.location })),
        count: matches.length,
        remaining: remaining - matches.length,
      };
    }
  );

  // Get match details
  fastify.get(
    "/api/matches/:matchId",
    { schema: { description: "Get match profile details", tags: ["matching"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { matchId } = request.params as { matchId: string };

      const match = await app.db.query.userMatches.findFirst({
        where: eq(schema.userMatches.id, matchId),
      });

      if (!match) {
        return reply.status(404).send({ error: "Match not found" });
      }

      if (match.userId !== session.user.id && match.matchedUserId !== session.user.id) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      const otherUserId = match.userId === session.user.id ? match.matchedUserId : match.userId;
      const otherProfile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, otherUserId),
        with: { media: true },
      });

      if (!otherProfile) {
        return reply.status(404).send({ error: "User not found" });
      }

      return { match, profile: otherProfile };
    }
  );

  // Record match interaction (like/pass/skip)
  fastify.post(
    "/api/matches/:matchId/interact",
    { schema: { description: "Record match interaction", tags: ["matching"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { matchId } = request.params as { matchId: string };
      const body = request.body as { action: "like" | "pass" | "skip" };

      const updated = await app.db
        .update(schema.userMatches)
        .set({
          interactionType: body.action,
          viewedAt: new Date(),
        })
        .where(eq(schema.userMatches.id, matchId))
        .returning();

      if (updated.length === 0) {
        return reply.status(404).send({ error: "Match not found" });
      }

      return { success: true };
    }
  );
}
