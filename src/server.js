import http from "node:http";
import app from "./app.js";
import env from "./config/env.js";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`QueueStorm Warmup API running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
