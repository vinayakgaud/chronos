import {test, expect, describe} from "bun:test";
import decide from "../../engineFunction.ts";
import { type PrimitiveEvent } from "../../types/primitiveEvents.ts";
import fc from "fast-check";
import {eventsArbitrary} from '../engine.property.test.ts';

//property test for Law 1 - Determinism
describe('Property test for laws of engines',()=>{
  test('Law 1 - Determinism: Given the same sequence of events, the engine should always produce the same outcome.', ()=>{
    fc.assert(
      fc.property(eventsArbitrary, (events: PrimitiveEvent[])=>{
        const resultOne = decide(events);
        const resultTwo = decide(events);

        expect(resultOne).toStrictEqual(resultTwo);
      })
    )
  }), 
  test('Law 2 - Conservation: In any valid decision, the total allocated resource must never exceed what exists.', ()=>{
    const totalAvailableResource = (events: PrimitiveEvent[]): number =>{
      return events.reduce((sum: number, event)=>{
        return event.type === "ResourceAdded" ? sum + event.amount : sum
      }, 0)
    }

    fc.assert(
      fc.property(eventsArbitrary, (events: PrimitiveEvent[])=>{
        const result = decide(events);
        const availableResource = totalAvailableResource(events);

        result.forEach(allocationResult => {
          const allocatedSum = Object.values(allocationResult.allocation).reduce((val1, val2) => val1 + val2, 0);

          expect(allocatedSum).toBeLessThanOrEqual(availableResource);0
        })
      })
    )
  })
})
