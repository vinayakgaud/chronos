This is the determinstic decision making engine

run using bun run scripts

- ```bun run start:engine``` (to run engine directly in node env)
- ```bun run start:server``` (to run engine as a graphql server)

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
    ]
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
              "amount": 3
            },
            {
              "agentId": "B",
              "amount": 3
            }
          ],
          "score": 0,
          "reasons": [
            {
              "kind": "Fulfillment",
              "agentId": "A"
            },
            {
              "kind": "Fulfillment",
              "agentId": "B"
            }
          ]
        },
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
          "score": 0,
          "reasons": [
            {
              "kind": "Fulfillment",
              "agentId": "A"
            },
            {
              "kind": "Fulfillment",
              "agentId": "B"
            }
          ]
        },
        {
          "allocation": [
            {
              "agentId": "A",
              "amount": 6
            },
            {
              "agentId": "B",
              "amount": 0
            }
          ],
          "score": 0,
          "reasons": [
            {
              "kind": "Fulfillment",
              "agentId": "A"
            },
            {
              "kind": "Fulfillment",
              "agentId": "B"
            }
          ]
        }
      ]
    }
  }
}
```
