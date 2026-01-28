import app from "./app";

Bun.serve({
  port: 3000,
  fetch: app.fetch,
})

console.log("Hono SSE bridge running on http://localhost:3000")
