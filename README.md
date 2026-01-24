This is the determinstic decision making engine

run using bun run scripts

- ```bun run start:engine``` (to run engine directly in node env)
- ```bun run start:server``` (to run engine as a graphql server)
- ```bun run start:grpc``` (to run grpc server)

after running the server, open graphiql at http://localhost:4000/graphql

- run below example query to test the engine

```
query {
  decision(
    events: [
      {type: AgentJoined, agentId: "A", capacity: 7}
      {type: AgentJoined, agentId: "B", capacity: 5}
      {type: ResourceAdded, amount: 6}
      {type: AgentRequested, agentId: "A", amount: 6}
      {type: AgentRequested, agentId: "B", amount: 4}
      {type: TimeAdvanced, tick: 1}
    ], seed: 2000, topK: 3
  ) {
    options {
      allocation {
        agentId
        amount
      }
      score
      reasons {
        kind
        agentId
      }
    }
  }
}
```

- expected output:  

```
{
  "data": {
    "decision": {
      "options": [
        {
          "allocation": [
            {
              "agentId": "A",
              "amount": 4
            },
            {
              "agentId": "B",
              "amount": 2
            }
          ],
          "score": 11.17,
          "reasons": [
            {
              "kind": "Fulfillment",
              "agentId": "A"
            },
            {
              "kind": "Fulfillment",
              "agentId": "B"
            },
            {
              "kind": "ImbalancePenalty",
              "agentId": null
            }
          ]
        },
        {
          "allocation": [
            {
              "agentId": "A",
              "amount": 6
            }
          ],
          "score": 10,
          "reasons": [
            {
              "kind": "Fulfillment",
              "agentId": "A"
            }
          ]
        },
        {
          "allocation": [
            {
              "agentId": "A",
              "amount": 3
            },
            {
              "agentId": "B",
              "amount": 2
            }
          ],
          "score": 9.88,
          "reasons": [
            {
              "kind": "Fulfillment",
              "agentId": "A"
            },
            {
              "kind": "Fulfillment",
              "agentId": "B"
            },
            {
              "kind": "ImbalancePenalty",
              "agentId": null
            }
          ]
        }
      ]
    }
  }
}
```
