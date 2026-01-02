import type { FastifyInstance } from "fastify";
import { eq, and, or } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Create conversation (opener)
  fastify.post(
    "/api/conversations",
    { schema: { description: "Create conversation with opener (min 36 chars)", tags: ["conversations"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { matchId: string; message: string };

      if (!body.message || body.message.length < 36) {
        return reply.status(400).send({ error: "Message must be at least 36 characters" });
      }

      const match = await app.db.query.userMatches.findFirst({
        where: eq(schema.userMatches.id, body.matchId),
      });

      if (!match) {
        return reply.status(404).send({ error: "Match not found" });
      }

      if (match.userId !== session.user.id && match.matchedUserId !== session.user.id) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      const user1Id = match.userId;
      const user2Id = match.matchedUserId;
      const isInitiator = session.user.id === user1Id;

      const created = await app.db
        .insert(schema.conversations)
        .values({
          user1Id,
          user2Id,
          initialOpenerMessage: body.message,
          status: "active",
        })
        .returning();

      return { conversation: created[0] };
    }
  );

  // Get active conversations
  fastify.get(
    "/api/conversations",
    { schema: { description: "Get user conversations", tags: ["conversations"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const conversations = await app.db.query.conversations.findMany({
        where: and(
          or(
            eq(schema.conversations.user1Id, session.user.id),
            eq(schema.conversations.user2Id, session.user.id)
          ),
          or(
            eq(schema.conversations.status, "active"),
            eq(schema.conversations.status, "snoozed")
          )
        ),
        with: { user1: true, user2: true, messages: true },
      });

      return { conversations };
    }
  );

  // Get conversation details
  fastify.get(
    "/api/conversations/:conversationId",
    { schema: { description: "Get conversation details", tags: ["conversations"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { conversationId } = request.params as { conversationId: string };

      const conversation = await app.db.query.conversations.findFirst({
        where: eq(schema.conversations.id, conversationId),
        with: { user1: true, user2: true, messages: true },
      });

      if (!conversation) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      if (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      return { conversation };
    }
  );

  // Snooze conversation
  fastify.post(
    "/api/conversations/:conversationId/snooze",
    { schema: { description: "Snooze conversation", tags: ["conversations"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { conversationId } = request.params as { conversationId: string };
      const body = request.body as { hours: number };

      const snoozedUntil = new Date(Date.now() + body.hours * 60 * 60 * 1000);

      const updated = await app.db
        .update(schema.conversations)
        .set({
          status: "snoozed",
          snoozedUntil,
          snoozeDuration: `${body.hours}h`,
        })
        .where(eq(schema.conversations.id, conversationId))
        .returning();

      if (updated.length === 0) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      return { conversation: updated[0] };
    }
  );

  // End conversation
  fastify.post(
    "/api/conversations/:conversationId/end",
    { schema: { description: "End conversation", tags: ["conversations"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { conversationId } = request.params as { conversationId: string };

      const updated = await app.db
        .update(schema.conversations)
        .set({
          status: "ended",
          endedBy: session.user.id,
        })
        .where(eq(schema.conversations.id, conversationId))
        .returning();

      if (updated.length === 0) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      return { conversation: updated[0] };
    }
  );
}
