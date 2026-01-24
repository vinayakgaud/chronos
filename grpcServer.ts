import grpc from "@grpc/grpc-js"
import {engineProto, streamDecision} from "./src/grpc/server.ts"

const server = new grpc.Server();

server.addService(engineProto.DecisionEngine.service, {
  StreamDecisions: streamDecision
})

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), ()=>{
  console.log("gRPC Decision Engine running on :50051");
})
