import app from "./app";

Bun.serve({
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 0, //disable timeout for SSE
})

console.log("Hono SSE bridge running on http://localhost:3000")
