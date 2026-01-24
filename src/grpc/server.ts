import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"
import path from "path"
import { Session } from "./session"
import {mapProtoEvent, mapDecision} from "./types"

const PROTO_PATH = path.join(__dirname, "./engine.proto")

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDef) as any;

export const engineProto = proto.chronos.engine.v1;

export function streamDecision(call: grpc.ServerDuplexStream<any, any>){
  //one session per stream
  const session = new Session(2000, 5);

  call.on("data", (envelope)=>{
    const {session_id, sequence_number, event} = envelope;

    //map proto event -> engine PrimitiveEvent
    const primitiveEvent = mapProtoEvent(event);

    const decisions = session.applyEvent(sequence_number, primitiveEvent)

    if(!decisions) return;

    call.write({
      session_id, 
      state_version: session.getVersion(),
      options: decisions.map(mapDecision)
    })
  })

  call.on("end", ()=>{
    call.end();
  })

  call.on("error", err=>{
    console.error("Stream error: ", err);
  })
}
