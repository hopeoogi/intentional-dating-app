import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Get subscription status
  fastify.get(
    "/api/subscription/status",
    { schema: { description: "Get subscription status", tags: ["subscription"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const subscription = await app.db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.userId, session.user.id),
      });

      if (!subscription) {
        return { tier: "free", status: "inactive" };
      }

      return subscription;
    }
  );

  // Create subscription
  fastify.post(
    "/api/subscription",
    { schema: { description: "Create/upgrade subscription", tags: ["subscription"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { tier: string };

      const existing = await app.db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.userId, session.user.id),
      });

      if (existing) {
        const updated = await app.db
          .update(schema.subscriptions)
          .set({
            tier: body.tier,
            status: "active",
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          })
          .where(eq(schema.subscriptions.id, existing.id))
          .returning();

        return { subscription: updated[0] };
      }

      const created = await app.db
        .insert(schema.subscriptions)
        .values({
          userId: session.user.id,
          tier: body.tier,
          status: "active",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .returning();

      return { subscription: created[0] };
    }
  );

  // Apply referral code
  fastify.post(
    "/api/subscription/referral",
    { schema: { description: "Apply referral code", tags: ["subscription"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { code: string };

      const code = await app.db.query.referralCodes.findFirst({
        where: eq(schema.referralCodes.code, body.code),
      });

      if (!code || !code.isActive) {
        return reply.status(400).send({ error: "Invalid referral code" });
      }

      if (code.maxUses && code.currentUses >= code.maxUses) {
        return reply.status(400).send({ error: "Referral code limit reached" });
      }

      if (code.expiresAt && code.expiresAt < new Date()) {
        return reply.status(400).send({ error: "Referral code expired" });
      }

      // Create subscription with referral tier
      const created = await app.db
        .insert(schema.subscriptions)
        .values({
          userId: session.user.id,
          tier: code.tier,
          status: "active",
          startDate: new Date(),
          referralCode: code.code,
          referredBy: code.createdBy,
        })
        .returning();

      // Increment referral code usage
      await app.db
        .update(schema.referralCodes)
        .set({ currentUses: (code.currentUses || 0) + 1 })
        .where(eq(schema.referralCodes.id, code.id));

      return { subscription: created[0], message: "Subscription activated with referral code" };
    }
  );

  // Cancel subscription
  fastify.post(
    "/api/subscription/cancel",
    { schema: { description: "Cancel subscription", tags: ["subscription"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const updated = await app.db
        .update(schema.subscriptions)
        .set({
          status: "cancelled",
          autoRenewal: false,
        })
        .where(eq(schema.subscriptions.userId, session.user.id))
        .returning();

      if (updated.length === 0) {
        return reply.status(404).send({ error: "No active subscription" });
      }

      return { message: "Subscription cancelled" };
    }
  );

  // Apple IAP webhook
  fastify.post(
    "/api/subscription/webhook/apple",
    { schema: { description: "Apple IAP webhook handler", tags: ["subscription"] } },
    async (request, reply) => {
      const body = request.body as {
        userId: string;
        transactionId: string;
        productId: string;
      };

      // TODO: Verify with Apple
      const tierMap: Record<string, string> = {
        "com.app.premium_monthly": "premium",
        "com.app.vip_monthly": "vip",
      };

      const tier = tierMap[body.productId] || "premium";

      const updated = await app.db
        .update(schema.subscriptions)
        .set({
          tier,
          status: "active",
          paymentProvider: "apple_iap",
          transactionId: body.transactionId,
        })
        .where(eq(schema.subscriptions.userId, body.userId))
        .returning();

      return { success: true };
    }
  );

  // Google Play IAP webhook
  fastify.post(
    "/api/subscription/webhook/google",
    { schema: { description: "Google Play IAP webhook handler", tags: ["subscription"] } },
    async (request, reply) => {
      const body = request.body as {
        userId: string;
        productId: string;
        purchaseToken: string;
      };

      // TODO: Verify with Google Play
      const tierMap: Record<string, string> = {
        "premium_monthly": "premium",
        "vip_monthly": "vip",
      };

      const tier = tierMap[body.productId] || "premium";

      const updated = await app.db
        .update(schema.subscriptions)
        .set({
          tier,
          status: "active",
          paymentProvider: "google_play",
          transactionId: body.purchaseToken,
        })
        .where(eq(schema.subscriptions.userId, body.userId))
        .returning();

      return { success: true };
    }
  );

  // Get subscription tiers
  fastify.get(
    "/api/subscription/tiers",
    { schema: { description: "Get available subscription tiers", tags: ["subscription"] } },
    async (request, reply) => {
      return {
        tiers: [
          {
            tier: "free",
            name: "Free",
            matchesPerDay: 5,
            features: ["Basic profile"],
          },
          {
            tier: "premium",
            name: "Premium",
            matchesPerDay: 50,
            price: "$19.99/month",
            features: ["50 matches/day", "Unlimited messaging"],
          },
          {
            tier: "vip",
            name: "VIP",
            matchesPerDay: 100,
            price: "$39.99/month",
            features: ["100 matches/day", "Priority support"],
          },
        ],
      };
    }
  );
}
