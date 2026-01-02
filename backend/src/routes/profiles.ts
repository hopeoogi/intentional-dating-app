import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, and } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Get current user profile
  fastify.get("/api/profile", async (request, reply) => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const profile = await app.db.query.userProfiles.findFirst({
      where: eq(schema.userProfiles.id, session.user.id),
      with: {
        media: true,
        matchPreferences: true,
        subscription: true,
      },
    });

    if (!profile) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    return profile;
  });

  // Create or update user profile
  fastify.put(
    "/api/profile",
    { schema: { description: "Create or update user profile", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as {
        phoneNumber?: string;
        dateOfBirth?: string;
        sex?: string;
        location?: string;
        latitude?: number;
        longitude?: number;
        bio?: string;
        interests?: string[];
      };

      // Check if profile exists
      const existingProfile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
      });

      if (existingProfile) {
        const updateData: any = {};
        if (body.phoneNumber !== undefined) updateData.phoneNumber = body.phoneNumber;
        if (body.dateOfBirth !== undefined) updateData.dateOfBirth = body.dateOfBirth;
        if (body.sex !== undefined) updateData.sex = body.sex;
        if (body.location !== undefined) updateData.location = body.location;
        if (body.latitude !== undefined) updateData.latitude = String(body.latitude);
        if (body.longitude !== undefined) updateData.longitude = String(body.longitude);
        if (body.bio !== undefined) updateData.bio = body.bio;
        if (body.interests !== undefined) updateData.interests = JSON.stringify(body.interests);
        updateData.updatedAt = new Date();

        const updated = await app.db
          .update(schema.userProfiles)
          .set(updateData)
          .where(eq(schema.userProfiles.id, session.user.id))
          .returning();

        return updated[0];
      } else {
        const insertData: any = {
          id: session.user.id,
        };
        if (body.phoneNumber !== undefined) insertData.phoneNumber = body.phoneNumber;
        if (body.dateOfBirth !== undefined) insertData.dateOfBirth = body.dateOfBirth;
        if (body.sex !== undefined) insertData.sex = body.sex;
        if (body.location !== undefined) insertData.location = body.location;
        if (body.latitude !== undefined) insertData.latitude = String(body.latitude);
        if (body.longitude !== undefined) insertData.longitude = String(body.longitude);
        if (body.bio !== undefined) insertData.bio = body.bio;
        if (body.interests !== undefined) insertData.interests = JSON.stringify(body.interests);

        const created = await app.db
          .insert(schema.userProfiles)
          .values(insertData)
          .returning();

        return created[0];
      }
    }
  );

  // Get profile by user ID
  fastify.get("/api/profiles/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const profile = await app.db.query.userProfiles.findFirst({
      where: eq(schema.userProfiles.id, userId),
      with: {
        media: true,
      },
    });

    if (!profile) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    // Track profile view if authenticated
    try {
      const sessionCheck = await requireAuth(request, reply);
      if (sessionCheck && sessionCheck.user.id !== userId) {
        await app.db
          .insert(schema.profileViews)
          .values({
            viewerId: sessionCheck.user.id,
            viewedUserId: userId,
          })
          .onConflictDoNothing();
      }
    } catch {
      // Not authenticated, skip view tracking
    }

    return profile;
  });

  // Upload photo
  fastify.post(
    "/api/profile/photos",
    { schema: { description: "Upload profile photo", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const data = await request.file({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
      if (!data) {
        return reply.status(400).send({ error: "No file provided" });
      }

      let buffer: Buffer;
      try {
        buffer = await data.toBuffer();
      } catch (err) {
        return reply.status(413).send({ error: "File too large" });
      }

      // Validate image file type
      const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validMimeTypes.includes(data.mimetype)) {
        return reply.status(400).send({ error: "Invalid image format. Use JPEG, PNG, or WebP." });
      }

      const key = `profile-photos/${session.user.id}/${Date.now()}-${data.filename}`;

      try {
        const uploadedKey = await app.storage.upload(key, buffer);
        const { url } = await app.storage.getSignedUrl(uploadedKey);

        const media = await app.db
          .insert(schema.userMedia)
          .values({
            userId: session.user.id,
            mediaType: "photo",
            storageKey: uploadedKey,
            originalFileName: data.filename,
            fileSize: buffer.length,
          })
          .returning();

        return {
          id: media[0].id,
          url,
          key: uploadedKey,
        };
      } catch (err) {
        app.logger.error(err, "Failed to upload photo");
        return reply.status(500).send({ error: "Failed to upload photo" });
      }
    }
  );

  // Upload video
  fastify.post(
    "/api/profile/videos",
    { schema: { description: "Upload profile video", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const data = await request.file({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB
      if (!data) {
        return reply.status(400).send({ error: "No file provided" });
      }

      let buffer: Buffer;
      try {
        buffer = await data.toBuffer();
      } catch (err) {
        return reply.status(413).send({ error: "File too large" });
      }

      // Validate video file type
      const validMimeTypes = ["video/mp4", "video/quicktime", "video/mpeg"];
      if (!validMimeTypes.includes(data.mimetype)) {
        return reply.status(400).send({ error: "Invalid video format. Use MP4, MOV, or MPEG." });
      }

      const key = `profile-videos/${session.user.id}/${Date.now()}-${data.filename}`;

      try {
        const uploadedKey = await app.storage.upload(key, buffer);
        const { url } = await app.storage.getSignedUrl(uploadedKey);

        const media = await app.db
          .insert(schema.userMedia)
          .values({
            userId: session.user.id,
            mediaType: "video",
            storageKey: uploadedKey,
            originalFileName: data.filename,
            fileSize: buffer.length,
          })
          .returning();

        return {
          id: media[0].id,
          url,
          key: uploadedKey,
        };
      } catch (err) {
        app.logger.error(err, "Failed to upload video");
        return reply.status(500).send({ error: "Failed to upload video" });
      }
    }
  );

  // Get all media for user
  fastify.get(
    "/api/profile/:userId/media",
    { schema: { description: "Get user media", tags: ["profiles"] } },
    async (request, reply) => {
      const { userId } = request.params as { userId: string };

      const media = await app.db.query.userMedia.findMany({
        where: eq(schema.userMedia.userId, userId),
        orderBy: (media) => [media.displayOrder, media.createdAt],
      });

      // Generate signed URLs
      const mediaWithUrls = await Promise.all(
        media.map(async (m) => {
          try {
            const { url } = await app.storage.getSignedUrl(m.storageKey);
            return { ...m, url };
          } catch {
            return m;
          }
        })
      );

      return mediaWithUrls;
    }
  );

  // Delete media
  fastify.delete(
    "/api/profile/media/:mediaId",
    { schema: { description: "Delete user media", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { mediaId } = request.params as { mediaId: string };

      const media = await app.db.query.userMedia.findFirst({
        where: eq(schema.userMedia.id, mediaId),
      });

      if (!media) {
        return reply.status(404).send({ error: "Media not found" });
      }

      if (media.userId !== session.user.id) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      try {
        await app.storage.delete(media.storageKey);
      } catch (err) {
        app.logger.warn(err, "Failed to delete file from storage");
      }

      await app.db.delete(schema.userMedia).where(eq(schema.userMedia.id, mediaId));

      return { success: true };
    }
  );

  // Set profile picture
  fastify.post(
    "/api/profile/set-profile-picture/:mediaId",
    { schema: { description: "Set profile picture", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { mediaId } = request.params as { mediaId: string };

      const media = await app.db.query.userMedia.findFirst({
        where: eq(schema.userMedia.id, mediaId),
      });

      if (!media) {
        return reply.status(404).send({ error: "Media not found" });
      }

      if (media.userId !== session.user.id) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      if (media.mediaType !== "photo") {
        return reply.status(400).send({ error: "Only photos can be profile pictures" });
      }

      // Unset old profile picture
      await app.db
        .update(schema.userMedia)
        .set({ isProfilePicture: false })
        .where(eq(schema.userMedia.userId, session.user.id));

      // Set new profile picture
      const updated = await app.db
        .update(schema.userMedia)
        .set({ isProfilePicture: true })
        .where(eq(schema.userMedia.id, mediaId))
        .returning();

      return updated[0];
    }
  );

  // Update match preferences
  fastify.put(
    "/api/match-preferences",
    { schema: { description: "Update match preferences", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const body = request.body as {
        minAge?: number;
        maxAge?: number;
        preferredSex?: string;
        maxDistance?: number;
        acceptedLocations?: string[];
        requiredInterests?: string[];
        excludedInterests?: string[];
      };

      const existing = await app.db.query.matchPreferences.findFirst({
        where: eq(schema.matchPreferences.userId, session.user.id),
      });

      if (existing) {
        const updated = await app.db
          .update(schema.matchPreferences)
          .set({
            minAge: body.minAge,
            maxAge: body.maxAge,
            preferredSex: body.preferredSex,
            maxDistance: body.maxDistance,
            acceptedLocations: body.acceptedLocations
              ? JSON.stringify(body.acceptedLocations)
              : undefined,
            requiredInterests: body.requiredInterests
              ? JSON.stringify(body.requiredInterests)
              : undefined,
            excludedInterests: body.excludedInterests
              ? JSON.stringify(body.excludedInterests)
              : undefined,
            updatedAt: new Date(),
          })
          .where(eq(schema.matchPreferences.userId, session.user.id))
          .returning();

        return updated[0];
      } else {
        const created = await app.db
          .insert(schema.matchPreferences)
          .values({
            userId: session.user.id,
            minAge: body.minAge,
            maxAge: body.maxAge,
            preferredSex: body.preferredSex,
            maxDistance: body.maxDistance,
            acceptedLocations: body.acceptedLocations
              ? JSON.stringify(body.acceptedLocations)
              : null,
            requiredInterests: body.requiredInterests
              ? JSON.stringify(body.requiredInterests)
              : null,
            excludedInterests: body.excludedInterests
              ? JSON.stringify(body.excludedInterests)
              : null,
          })
          .returning();

        return created[0];
      }
    }
  );

  // Get match preferences
  fastify.get(
    "/api/match-preferences",
    { schema: { description: "Get match preferences", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const preferences = await app.db.query.matchPreferences.findFirst({
        where: eq(schema.matchPreferences.userId, session.user.id),
      });

      if (!preferences) {
        return reply.status(404).send({ error: "Preferences not found" });
      }

      return preferences;
    }
  );

  // Toggle accepting chats
  fastify.post(
    "/api/profile/toggle-accepting-chats",
    { schema: { description: "Toggle accepting new chats", tags: ["profiles"] } },
    async (request, reply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const profile = await app.db.query.userProfiles.findFirst({
        where: eq(schema.userProfiles.id, session.user.id),
      });

      if (!profile) {
        return reply.status(404).send({ error: "Profile not found" });
      }

      const updated = await app.db
        .update(schema.userProfiles)
        .set({ isAcceptingChats: !profile.isAcceptingChats })
        .where(eq(schema.userProfiles.id, session.user.id))
        .returning();

      return updated[0];
    }
  );
}
