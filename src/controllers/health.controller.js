export function healthCheck(req, res) {
  res.json({
    status: "ok",
    service: "QueueStorm Warmup API",
    timestamp: new Date().toISOString(),
  });
}
