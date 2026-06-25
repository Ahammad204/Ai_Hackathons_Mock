import app from "./app.js";
import env from "./config/env.js";

// Vercel detects app.listen() and wraps the app as a serverless function.
// For local development, start with: npm run dev
app.listen(env.PORT, () => {
  console.log(`QueueStorm Warmup API running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

export default app;
