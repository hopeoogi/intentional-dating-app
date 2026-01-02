import type { FastifyInstance } from "fastify";
import { eq, and } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Send message
  fastify.post(
    "/api/messages",
    { schema: { description: "Send message in conversation", tags: ["messages"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { conversationId: string; content: string };

      if (!body.content || body.content.length === 0) {
        return reply.status(400).send({ error: "Message cannot be empty" });
      }

      const conversation = await app.db.query.conversations.findFirst({
        where: eq(schema.conversations.id, body.conversationId),
      });

      if (!conversation) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      if (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      if (conversation.status === "ended") {
        return reply.status(400).send({ error: "Conversation has ended" });
      }

      const message = await app.db
        .insert(schema.messages)
        .values({
          conversationId: body.conversationId,
          senderId: session.user.id,
          content: body.content,
        })
        .returning();

      // Update conversation last message timestamp
      await app.db
        .update(schema.conversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(schema.conversations.id, body.conversationId));

      return { message: message[0] };
    }
  );

  // Get messages
  fastify.get(
    "/api/messages/:conversationId",
    { schema: { description: "Get conversation messages", tags: ["messages"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { conversationId } = request.params as { conversationId: string };
      const limit = Math.min((request.query as any).limit || 50, 100);
      const offset = (request.query as any).offset || 0;

      const conversation = await app.db.query.conversations.findFirst({
        where: eq(schema.conversations.id, conversationId),
      });

      if (!conversation) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      if (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      const messages = await app.db.query.messages.findMany({
        where: eq(schema.messages.conversationId, conversationId),
        with: { sender: true },
      });

      return {
        messages: messages.slice(offset, offset + limit),
        total: messages.length,
      };
    }
  );

  // Mark messages as read
  fastify.post(
    "/api/messages/:conversationId/mark-read",
    { schema: { description: "Mark conversation messages as read", tags: ["messages"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { conversationId } = request.params as { conversationId: string };

      const conversation = await app.db.query.conversations.findFirst({
        where: eq(schema.conversations.id, conversationId),
      });

      if (!conversation) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      const otherUserId = conversation.user1Id === session.user.id ? conversation.user2Id : conversation.user1Id;

      // Mark all unread messages from other user as read
      await app.db
        .update(schema.messages)
        .set({ isRead: true, readAt: new Date() })
        .where(
          and(
            eq(schema.messages.conversationId, conversationId),
            eq(schema.messages.senderId, otherUserId),
            eq(schema.messages.isRead, false)
          )
        );

      return { success: true };
    }
  );

  // Get unread count
  fastify.get(
    "/api/messages/unread-count",
    { schema: { description: "Get total unread message count", tags: ["messages"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const messages = await app.db.query.messages.findMany({
        where: eq(schema.messages.isRead, false),
      });

      // Filter to only messages in conversations where user is participant
      const userConversations = await app.db.query.conversations.findMany({
        where: (conv) => {
          const { or, eq } = require("drizzle-orm");
          return or(eq(conv.user1Id, session.user.id), eq(conv.user2Id, session.user.id));
        },
      });

      const userConvIds = new Set(userConversations.map((c) => c.id));
      const unreadCount = messages.filter((m) => userConvIds.has(m.conversationId)).length;

      return { unreadCount };
    }
  );
}
