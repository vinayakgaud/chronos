package main

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc"

	pb "chronos-go-client/gen"
)

func main() {
	//create connection to gRPC server
	conn, err := grpc.Dial(
		"localhost:50051",
		grpc.WithInsecure(),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	//create typed client from generated code
	client := pb.NewEngineClient(conn)

	//create a context to control the stream lifetime
	ctx, cancel := context.WithCancel((context.Background()))
	defer cancel()

	//open bidirectional stream
	stream, err := client.Stream(ctx)
	if err != nil {
		log.Fatal(err)
	}

	//receive messages forever (for now)
	for {
		event, err := stream.Recv()
		if err != nil{
			log.Println("stream ended: ", err)
			return
		}

		log.Println("received event: \n", event)
	}
}
