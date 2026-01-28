import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.join(__dirname, "engine.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const enginePackage = grpcObject.chronos.engine.v1

const client = new enginePackage.DecisionEngine(
  "localhost:50051", 
  grpc.credentials.createInsecure()
);

const stream = client.StreamDecisions();

//listen for decisions from server
stream.on("data", (decisionEnvelope: any)=>{
  console.log("\nDecision update received");
  console.log(JSON.stringify(decisionEnvelope, null , 2));
})

stream.on("error", (err: Error)=>{
  console.error("Stream error: ", err)
})

stream.on("end", ()=>{
  console.log("Stream ended by server")
})

//send events into the engine
const sessionId = "demo-session-1"
let sequence_number = 0;

function sendEvent(event: any){
  stream.write({
    session_id: sessionId,
    sequence_number: sequence_number++,
    event
  })
}

//simulate a timeline of events
sendEvent({
  type: "AGENT_JOINED",
  agent_id: "A",
  capacity: 7,
});

sendEvent({
  type: "AGENT_JOINED",
  agent_id: "B",
  capacity: 5,
});

sendEvent({
  type: "AGENT_REQUESTED",
  agent_id: "A",
  amount: 6,
});

sendEvent({
  type: "AGENT_REQUESTED",
  agent_id: "B",
  amount: 4,
});

sendEvent({
  type: "RESOURCE_ADDED",
  amount: 6,
});

sendEvent({
  type: "TIME_ADVANCED",
  tick: 1,
});

//close stream after events
setTimeout(()=>{
  console.log("\nClosing event streams")
  stream.end();
}, 1000)
