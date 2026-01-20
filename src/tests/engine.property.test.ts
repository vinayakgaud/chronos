import fc from "fast-check";
import {decideFromEvents} from "../engine/engineFunction";
import { type PrimitiveEvent } from "../engine/types/primitiveEvents";
import { test } from "bun:test";

//arbitrary for generating events
export const eventsArbitrary = fc.array(
  fc.oneof(
    fc.record({
      type: fc.constant("AgentJoined"),
      agentId: fc.string({minLength: 1, maxLength: 1}),
      capacity: fc.integer({min:1,max:10})
    }),
    fc.record({
      type: fc.constant("ResourceAdded"),
      amount: fc.integer({ min: 0, max: 20 }),
    }),
    fc.record({
      type: fc.constant("AgentRequested"),
      agentId: fc.string({ minLength: 1, maxLength: 1 }),
      amount: fc.integer({ min: 0, max: 10 }),
    }),
    fc.record({
      type: fc.constant("TimeAdvanced"),
      tick: fc.integer({ min: 0, max: 100 }),
    })
  ), { minLength: 1, maxLength: 20 }
)

//base property check
test('Basic engine check', ()=>{
  fc.assert(
    fc.property(eventsArbitrary, (events: PrimitiveEvent[])=>{
      const a = decideFromEvents(events);
      const b = decideFromEvents(events);

      //deep equality check
      return JSON.stringify(a) === JSON.stringify(b);
    })
  )
})


