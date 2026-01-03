import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  decimal,
  varchar,
  date,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * User Profiles and Authentication Related Tables
 */

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: text("id").primaryKey(),
    phoneNumber: text("phone_number"),
    phoneVerified: boolean("phone_verified").default(false),
    dateOfBirth: text("date_of_birth"), // Store as ISO string
    sex: varchar("sex", { length: 10 }), // "male", "female", "other"
    location: text("location"),
    latitude: text("latitude"), // Store as string decimal
    longitude: text("longitude"), // Store as string decimal
    bio: text("bio"),
    interests: jsonb("interests"), // Array of interest tags
    verificationStatus: varchar("verification_status", { length: 50 }).default(
      "pending"
    ), // "pending", "approved", "rejected"
    verificationRejectionReason: text("verification_rejection_reason"),
    badges: jsonb("badges").default([]), // Array of badges: "verified", "premium", etc.
    profileCompleteness: integer("profile_completeness").default(0), // 0-100
    isPremium: boolean("is_premium").default(false),
    subscriptionTier: varchar("subscription_tier", { length: 50 }).default("free"), // "free", "premium", "vip"
    subscriptionExpiresAt: timestamp("subscription_expires_at"),
    lastActiveAt: timestamp("last_active_at"),
    isAcceptingChats: boolean("is_accepting_chats").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_user_verification_status").on(table.verificationStatus),
    index("idx_user_subscription_tier").on(table.subscriptionTier),
    index("idx_user_location").on(table.location),
  ]
);

/**
 * User Media (Photos and Videos)
 */

export const userMedia = pgTable(
  "user_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    mediaType: varchar("media_type", { length: 20 }).notNull(), // "photo", "video"
    storageKey: text("storage_key").notNull(), // Path to file in storage
    originalFileName: text("original_file_name"),
    fileSize: integer("file_size"),
    width: integer("width"),
    height: integer("height"),
    duration: integer("duration"), // Duration in seconds for videos
    isProfilePicture: boolean("is_profile_picture").default(false),
    displayOrder: integer("display_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_media_user_id").on(table.userId),
    index("idx_user_media_type").on(table.mediaType),
  ]
);

/**
 * Admin Users
 */

export const adminUsers = pgTable(
  "admin_users",
  {
    id: text("id").primaryKey(),
    adminEmail: text("admin_email").notNull().unique(),
    role: varchar("role", { length: 50 }).notNull(), // "super_admin", "moderator", "reviewer"
    permissions: jsonb("permissions").default([]), // Array of permission strings
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_admin_role").on(table.role)]
);

/**
 * Matching System
 */

export const userMatches = pgTable(
  "user_matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    matchedUserId: text("matched_user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    batchDate: date("batch_date").notNull(),
    matchScore: integer("match_score"), // 0-100 compatibility score
    viewedAt: timestamp("viewed_at"),
    interactionType: varchar("interaction_type", { length: 20 }), // "like", "pass", "skip"
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_matches_user_id").on(table.userId),
    index("idx_matches_batch_date").on(table.batchDate),
    unique("unique_match_pair").on(table.userId, table.matchedUserId),
  ]
);

export const matchPreferences = pgTable(
  "match_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    minAge: integer("min_age"),
    maxAge: integer("max_age"),
    preferredSex: varchar("preferred_sex", { length: 50 }), // Single or array
    maxDistance: integer("max_distance"), // In km
    acceptedLocations: jsonb("accepted_locations"), // Array of locations
    requiredInterests: jsonb("required_interests"), // Array of interest tags
    excludedInterests: jsonb("excluded_interests"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_match_preferences_user_id").on(table.userId)]
);

/**
 * Conversations and Messaging
 */

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user1Id: text("user1_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    user2Id: text("user2_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    initialOpenerMessage: text("initial_opener_message").notNull(),
    status: varchar("status", { length: 50 }).default("active"), // "active", "snoozed", "ended"
    snoozedUntil: timestamp("snoozed_until"),
    snoozeDuration: varchar("snooze_duration", { length: 20 }), // "12h", "24h"
    endedBy: text("ended_by"), // User ID who ended the conversation
    endedReason: text("ended_reason"),
    lastMessageAt: timestamp("last_message_at"),
    user1UnreadCount: integer("user1_unread_count").default(0),
    user2UnreadCount: integer("user2_unread_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_conversations_user1").on(table.user1Id),
    index("idx_conversations_user2").on(table.user2Id),
    index("idx_conversations_status").on(table.status),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_messages_conversation_id").on(table.conversationId),
    index("idx_messages_sender_id").on(table.senderId),
    index("idx_messages_created_at").on(table.createdAt),
  ]
);

/**
 * Subscription and Payments
 */

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    tier: varchar("tier", { length: 50 }).notNull(), // "free", "premium", "vip"
    status: varchar("status", { length: 50 }).notNull(), // "active", "inactive", "expired", "cancelled"
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    renewalDate: timestamp("renewal_date"),
    paymentProvider: varchar("payment_provider", { length: 50 }), // "apple_iap", "google_play", "stripe"
    transactionId: text("transaction_id"),
    autoRenewal: boolean("auto_renewal").default(true),
    referralCode: text("referral_code"),
    referredBy: text("referred_by").references(() => userProfiles.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("idx_subscriptions_user_id").on(table.userId),
    index("idx_subscriptions_tier").on(table.tier),
    index("idx_subscriptions_status").on(table.status),
    index("idx_subscriptions_referral_code").on(table.referralCode),
  ]
);

export const referralCodes = pgTable(
  "referral_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    createdBy: text("created_by")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    tier: varchar("tier", { length: 50 }).notNull(), // Subscription tier granted
    maxUses: integer("max_uses"),
    currentUses: integer("current_uses").default(0),
    expiresAt: timestamp("expires_at"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_referral_codes_code").on(table.code),
    index("idx_referral_codes_created_by").on(table.createdBy),
  ]
);

/**
 * Safety and Moderation
 */

export const blockedUsers = pgTable(
  "blocked_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    blockerId: text("blocker_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    blockedUserId: text("blocked_user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_blocked_users_blocker_id").on(table.blockerId),
    index("idx_blocked_users_blocked_user_id").on(table.blockedUserId),
    unique("unique_block_pair").on(table.blockerId, table.blockedUserId),
  ]
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    reportedUserId: text("reported_user_id").references(
      () => userProfiles.id,
      { onDelete: "cascade" }
    ),
    conversationId: uuid("conversation_id").references(
      () => conversations.id,
      { onDelete: "set null" }
    ),
    reportType: varchar("report_type", { length: 50 }).notNull(), // "inappropriate_photos", "fake_profile", "harassment", "spam", etc.
    description: text("description"),
    evidence: jsonb("evidence"), // Array of message IDs, photo IDs, etc.
    status: varchar("status", { length: 50 }).default("pending"), // "pending", "under_review", "resolved", "dismissed"
    resolutionNotes: text("resolution_notes"),
    resolvedBy: text("resolved_by"), // Admin ID
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_reports_reporter_id").on(table.reporterId),
    index("idx_reports_reported_user_id").on(table.reportedUserId),
    index("idx_reports_status").on(table.status),
    index("idx_reports_created_at").on(table.createdAt),
  ]
);

/**
 * Profile Viewing Tracking
 */

export const profileViews = pgTable(
  "profile_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    viewerId: text("viewer_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    viewedUserId: text("viewed_user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_profile_views_viewer_id").on(table.viewerId),
    index("idx_profile_views_viewed_user_id").on(table.viewedUserId),
  ]
);

/**
 * Email/Phone Verification Tokens
 */

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    type: varchar("type", { length: 50 }).notNull(), // "email", "phone"
    value: text("value").notNull(), // Email or phone number to verify
    expiresAt: timestamp("expires_at").notNull(),
    isUsed: boolean("is_used").default(false),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_verification_tokens_user_id").on(table.userId),
    index("idx_verification_tokens_token").on(table.token),
  ]
);

/**
 * Relations for Drizzle ORM
 */

export const userProfilesRelations = relations(userProfiles, ({ one, many }) => ({
  media: many(userMedia),
  matches: many(userMatches, { relationName: "user_matches" }),
  matchedBy: many(userMatches, { relationName: "matched_by" }),
  matchPreferences: one(matchPreferences),
  conversations1: many(conversations, { relationName: "user1_conversations" }),
  conversations2: many(conversations, { relationName: "user2_conversations" }),
  messages: many(messages),
  subscription: one(subscriptions),
  blockedUsers: many(blockedUsers, { relationName: "blocking" }),
  blockedByUsers: many(blockedUsers, { relationName: "blocked_by" }),
  reports: many(reports, { relationName: "user_reports" }),
  reportedBy: many(reports, { relationName: "reported_by" }),
  profileViews: many(profileViews, { relationName: "profile_views" }),
  viewedProfiles: many(profileViews, { relationName: "profile_views_by" }),
}));

export const userMediaRelations = relations(userMedia, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userMedia.userId],
    references: [userProfiles.id],
  }),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    user1: one(userProfiles, {
      fields: [conversations.user1Id],
      references: [userProfiles.id],
      relationName: "user1_conversations",
    }),
    user2: one(userProfiles, {
      fields: [conversations.user2Id],
      references: [userProfiles.id],
      relationName: "user2_conversations",
    }),
    messages: many(messages),
    reports: many(reports),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(userProfiles, {
    fields: [messages.senderId],
    references: [userProfiles.id],
  }),
}));

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    user: one(userProfiles, {
      fields: [subscriptions.userId],
      references: [userProfiles.id],
    }),
  })
);

export const blockedUsersRelations = relations(blockedUsers, ({ one }) => ({
  blocker: one(userProfiles, {
    fields: [blockedUsers.blockerId],
    references: [userProfiles.id],
    relationName: "blocking",
  }),
  blocked: one(userProfiles, {
    fields: [blockedUsers.blockedUserId],
    references: [userProfiles.id],
    relationName: "blocked_by",
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(userProfiles, {
    fields: [reports.reporterId],
    references: [userProfiles.id],
    relationName: "reported_by",
  }),
  reportedUser: one(userProfiles, {
    fields: [reports.reportedUserId],
    references: [userProfiles.id],
    relationName: "user_reports",
  }),
  conversation: one(conversations, {
    fields: [reports.conversationId],
    references: [conversations.id],
  }),
}));

export const profileViewsRelations = relations(
  profileViews,
  ({ one }) => ({
    viewer: one(userProfiles, {
      fields: [profileViews.viewerId],
      references: [userProfiles.id],
      relationName: "profile_views",
    }),
    viewed: one(userProfiles, {
      fields: [profileViews.viewedUserId],
      references: [userProfiles.id],
      relationName: "profile_views_by",
    }),
  })
);
