import { createApplication } from "@specific-dev/framework";
import * as appSchema from './db/schema.js';
import * as authSchema from './db/auth-schema.js';

// Import route registration functions
import { register as registerProfiles } from './routes/profiles.js';
import { register as registerVerification } from './routes/verification.js';
import { register as registerAdmin } from './routes/admin.js';
import { register as registerMatching } from './routes/matching.js';
import { register as registerConversations } from './routes/conversations.js';
import { register as registerMessages } from './routes/messages.js';
import { register as registerSubscription } from './routes/subscription.js';
import { register as registerModeration } from './routes/moderation.js';
import { register as registerOnboarding } from './routes/onboarding.js';

// Combine both schemas
const schema = { ...appSchema, ...authSchema };

// Create application with combined schema
export const app = await createApplication(schema);

// Enable Better Auth for authentication
app.withAuth();

// Enable Storage for file uploads
app.withStorage();

// Export App type for use in route files
export type App = typeof app;

// Register all route modules
registerProfiles(app, app.fastify);
registerVerification(app, app.fastify);
registerAdmin(app, app.fastify);
registerMatching(app, app.fastify);
registerConversations(app, app.fastify);
registerMessages(app, app.fastify);
registerSubscription(app, app.fastify);
registerModeration(app, app.fastify);
registerOnboarding(app, app.fastify);

await app.run();
app.logger.info('Application running');
