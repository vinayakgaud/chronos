import { Hono } from "hono";
import { cors } from "hono/cors";
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();
app.use("*", secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'", "http://localhost:3000"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
  },
}))
app.use(cors());

const PROTO_PATH = path.join(__dirname, "../grpc/engine.proto")

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const enginePackage = grpcObject.chronos.engine.v1;

//serving html page from here, instead of opening the file manually
app.get("/", (c)=>{
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Chronos</title>
</head>
<body>
  <h1>Decision Stream</h1>
  <pre id="output"></pre>

  <script>
    const output = document.getElementById("output");
    const source = new EventSource("/stream");

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      output.textContent += JSON.stringify(data, null, 2) + "\\n\\n";
    };
  </script>
</body>
</html>
  `);
})

app.get("/stream", (c)=>{
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller){
      const client = new enginePackage.DecisionEngine(
        "localhost:50051",
        grpc.credentials.createInsecure()
      )

      const grpcStream = client.StreamDecisions()
      //grpc -> Browser(SSE)
      grpcStream.on("data", (decision: any)=>{
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(decision)}\n\n`)
        )
      })

      grpcStream.on("end", ()=>{
        controller.close()
      })

      grpcStream.on("error", (err: Error)=>{
        console.error(err)
        controller.close()
      })

      //seed demo events
      let sequence_number = 0;
      const sessionId = "browser-SSE-session"

      const send = (event: any)=>{
        grpcStream.write({
          session_id: sessionId,
          sequence_number: sequence_number++,
          event
        })
      }

      send({ type: "AGENT_JOINED", agent_id: "A", capacity: 7 })
      send({ type: "AGENT_JOINED", agent_id: "B", capacity: 5 })
      send({ type: "AGENT_REQUESTED", agent_id: "A", amount: 6 })
      send({ type: "AGENT_REQUESTED", agent_id: "B", amount: 4 })
      send({ type: "RESOURCE_ADDED", amount: 6 })
      send({ type: "TIME_ADVANCED", tick: 1 })

      c.req.raw.signal.addEventListener("abort", ()=>{
        grpcStream.end()
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers:{
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache",
      "Connection":"keep-alive",
      "X-Accel-Buffering":"no"
    }
  })
})

export default app;
