package main

import (
	"context"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	enginev1 "github.com/vinayakgaud/chronos/src/go-client/gen/enginev1"
)

func main() {
	//create connection to gRPC server
	conn, err := grpc.NewClient(
		"localhost:50051",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	//create typed client from generated code
	client := enginev1.NewDecisionEngineClient(conn)

	//create a context to control the stream lifetime
	ctx, cancel := context.WithCancel((context.Background()))
	defer cancel()

	//open bidirectional stream
	stream, err := client.StreamDecisions(ctx)
	if err != nil {
		log.Fatal(err)
	}

	//Send first event to wake the engine
	firstEvent := &enginev1.EventEnvelope{
		SessionId:      "go-session-1",
		SequenceNumber: 1,
		Event: &enginev1.Event{
			Type:     enginev1.EventType_AGENT_JOINED,
			AgentId:  "agent-go-1",
			Capacity: 10,
			Tick:     1,
			Amount:   0,
		},
	}

	secondEvent := &enginev1.EventEnvelope{
		SessionId:      "go-session-1",
		SequenceNumber: 2,
		Event: &enginev1.Event{
			Type:     enginev1.EventType_AGENT_JOINED,
			AgentId:  "agent-go-2",
			Capacity: 20,
			Tick:     1,
			Amount:   0,
		},
	}

	thirdEvent := &enginev1.EventEnvelope{
		SessionId:      "go-session-1",
		SequenceNumber: 3,
		Event: &enginev1.Event{
			Type:    enginev1.EventType_AGENT_REQUESTED,
			AgentId: "agent-go-1",
			Tick:    1,
			Amount:  6,
		},
	}

	log.Println("sending first event...")
	err = stream.Send(firstEvent)
	if err != nil {
		log.Fatal("send failed: ", err)
	}
	log.Println("event sent")
	log.Println("sending second event...")
	err = stream.Send(secondEvent)
	if err != nil {
		log.Fatal("send failed: ", err)
	}
	log.Println("event sent")
	log.Println("sending third event...")
	err = stream.Send(thirdEvent)
	if err != nil {
		log.Fatal("send failed: ", err)
	}
	log.Println("event sent")
	//receive messages forever (for now)
	for {
		decision, err := stream.Recv()
		if err != nil {
			log.Println("stream ended: ", err)
			return
		}

		log.Println("received decision: \n", decision)
	}
}
