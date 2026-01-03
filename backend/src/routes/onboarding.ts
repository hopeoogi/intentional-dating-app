import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Get current onboarding step
  fastify.get(
    "/api/onboarding/status",
    { schema: { description: "Get current onboarding status", tags: ["onboarding"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      // Determine current status and next steps
      const statuses = [
        "account_created",
        "profile_completed",
        "media_uploaded",
        "verification_submitted",
        "approved",
        "subscribed",
        "active",
      ];

      const currentIndex = statuses.indexOf(profile.onboardingStatus);
      const nextSteps = statuses.slice(currentIndex + 1);

      const statusDetails = {
        account_created: {
          label: "Account Created",
          description: "Sign up complete",
          completed: true,
        },
        profile_completed: {
          label: "Profile Completed",
          description: "Add name, DOB, location, bio, interests",
          completed: profile.bio && profile.dateOfBirth && profile.location,
        },
        media_uploaded: {
          label: "Media Uploaded",
          description: "Upload at least one photo",
          completed: false, // Will check with media query
        },
        verification_submitted: {
          label: "Verification Submitted",
          description: "Submit verification application",
          completed: profile.verificationStatus !== null,
        },
        approved: {
          label: "Profile Approved",
          description: "Wait for admin approval",
          completed: profile.verificationStatus === "approved",
        },
        subscribed: {
          label: "Subscription Active",
          description: "Subscribe to a plan",
          completed: profile.subscriptionTier !== "free",
        },
        active: {
          label: "Ready to Date",
          description: "Start matching",
          completed: profile.onboardingStatus === "active",
        },
      };

      return {
        currentStatus: profile.onboardingStatus,
        nextSteps,
        progress: {
          current: currentIndex + 1,
          total: statuses.length,
          percentage: Math.round(((currentIndex + 1) / statuses.length) * 100),
        },
        statusDetails,
        completedSteps: statuses.slice(0, currentIndex + 1),
      };
    }
  );

  // Update onboarding status (internal use, called by other endpoints)
  fastify.post(
    "/api/onboarding/update-step",
    { schema: { description: "Update onboarding step (internal)", tags: ["onboarding"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as { step: string };

      const validSteps = [
        "account_created",
        "profile_completed",
        "media_uploaded",
        "verification_submitted",
        "approved",
        "subscribed",
        "active",
      ];

      if (!validSteps.includes(body.step)) {
        return reply.status(400).send({ error: "Invalid onboarding step" });
      }

      const updated = await app.db
        .update(schema.userProfiles)
        .set({ onboardingStatus: body.step })
        .where(eq(schema.userProfiles.id, session.user.id))
        .returning();

      if (updated.length === 0) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      return {
        onboardingStatus: updated[0].onboardingStatus,
        message: `Onboarding step updated to ${body.step}`,
      };
    }
  );

  // Get onboarding checklist with detailed requirements
  fastify.get(
    "/api/onboarding/checklist",
    { schema: { description: "Get detailed onboarding checklist", tags: ["onboarding"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
        with: { media: true, subscription: true },
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      const checklist = [
        {
          id: "profile_basic_info",
          title: "Complete Basic Info",
          description: "Add name, date of birth, location, and bio",
          required: true,
          completed: !!(profile.dateOfBirth && profile.location && profile.bio),
          details: {
            name: !!session.user.name,
            dateOfBirth: !!profile.dateOfBirth,
            location: !!profile.location,
            bio: !!profile.bio,
          },
        },
        {
          id: "add_photos",
          title: "Add Profile Photos",
          description: "Add at least 1 photo (up to 6 allowed)",
          required: true,
          completed: (profile.media || []).filter((m) => m.mediaType === "photo").length >= 1,
          details: {
            photoCount: (profile.media || []).filter((m) => m.mediaType === "photo").length,
            videoCount: (profile.media || []).filter((m) => m.mediaType === "video").length,
            maxPhotos: 6,
            maxVideos: 1,
          },
        },
        {
          id: "interests",
          title: "Set Interests",
          description: "Add at least 3 interests to improve matching",
          required: false,
          completed: Array.isArray(profile.interests) && profile.interests.length >= 3,
          details: {
            interestCount: Array.isArray(profile.interests) ? profile.interests.length : 0,
            minRequired: 3,
          },
        },
        {
          id: "submit_verification",
          title: "Submit for Verification",
          description: "Complete verification to unlock full features",
          required: true,
          completed: profile.verificationStatus === "pending" || profile.verificationStatus === "approved",
          details: {
            status: profile.verificationStatus,
            rejectionReason: profile.verificationRejectionReason,
          },
        },
        {
          id: "wait_approval",
          title: "Wait for Approval",
          description: "Admin team reviews and approves your profile",
          required: true,
          completed: profile.verificationStatus === "approved",
          details: {
            status: profile.verificationStatus,
            estimatedTime: "24-48 hours",
          },
        },
        {
          id: "subscribe",
          title: "Choose a Plan",
          description: "Subscribe to start matching and messaging",
          required: false,
          completed: profile.subscriptionTier !== "free",
          details: {
            currentTier: profile.subscriptionTier,
            expiresAt: profile.subscriptionExpiresAt,
          },
        },
      ];

      const allCompleted = checklist.every((item) => !item.required || item.completed);
      const completedCount = checklist.filter((item) => item.completed).length;

      return {
        checklist,
        progress: {
          completed: completedCount,
          total: checklist.length,
          percentage: Math.round((completedCount / checklist.length) * 100),
        },
        canStartMatching: allCompleted,
        nextAction: allCompleted
          ? "Start matching and messaging!"
          : checklist.find((item) => !item.completed)?.title || "All done!",
      };
    }
  );

  // Auto-detect and update onboarding status based on profile state
  fastify.post(
    "/api/onboarding/auto-detect",
    { schema: { description: "Auto-detect and update onboarding status", tags: ["onboarding"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
        with: { media: true, subscription: true },
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      let newStatus = "account_created";
      const hasProfileInfo = profile.dateOfBirth && profile.location && profile.bio;
      const hasMedia = (profile.media || []).length > 0;
      const hasVerificationSubmitted = profile.verificationStatus !== null;
      const isApproved = profile.verificationStatus === "approved";
      const hasSubscription = profile.subscriptionTier !== "free" && profile.subscriptionTier !== null;

      if (hasProfileInfo) newStatus = "profile_completed";
      if (hasProfileInfo && hasMedia) newStatus = "media_uploaded";
      if (hasProfileInfo && hasMedia && hasVerificationSubmitted)
        newStatus = "verification_submitted";
      if (hasProfileInfo && hasMedia && isApproved) newStatus = "approved";
      if (hasProfileInfo && hasMedia && isApproved && hasSubscription) newStatus = "subscribed";
      if (
        hasProfileInfo &&
        hasMedia &&
        isApproved &&
        hasSubscription &&
        profile.isAcceptingChats
      )
        newStatus = "active";

      const updated = await app.db
        .update(schema.userProfiles)
        .set({ onboardingStatus: newStatus })
        .where(eq(schema.userProfiles.id, session.user.id))
        .returning();

      return {
        previousStatus: profile.onboardingStatus,
        currentStatus: updated[0].onboardingStatus,
        statusChanged: profile.onboardingStatus !== updated[0].onboardingStatus,
      };
    }
  );
}
