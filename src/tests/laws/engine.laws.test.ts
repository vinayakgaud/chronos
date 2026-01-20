import {test, expect, describe} from "bun:test";
import {decideFromEvents, decideFromState} from "../../engine/engineFunction.ts";
import { type PrimitiveEvent, type State } from "../../engine/types/primitiveEvents.ts";
import fc from "fast-check";
import {eventsArbitrary} from '../engine.property.test.ts';
import { scoreAllocation } from "../../engine/decisionScoring.ts";
import stateReducer from "../../engine/stateReducer.ts";

describe('Property test for laws of engines',()=>{
  test('Law 1 - Determinism: Given the same sequence of events, the engine should always produce the same outcome.', ()=>{
    fc.assert(
      fc.property(eventsArbitrary, (events: PrimitiveEvent[])=>{
        const resultOne = decideFromEvents(events);
        const resultTwo = decideFromEvents(events);

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
        const result = decideFromEvents(events);
        const availableResource = totalAvailableResource(events);

        result.forEach(allocationResult => {
          const allocatedSum = Object.values(allocationResult.allocation).reduce((val1, val2) => val1 + val2, 0);

          expect(allocatedSum).toBeLessThanOrEqual(availableResource);0
        })
      })
    )
  }),

  test('Law 3 - Capacity Saftey: No allocation should exceed the capacity assigned for the agent. ', ()=>{
    const agentCapacity = (events: PrimitiveEvent[]): Record<string, number> =>{
      const capacity: Record<string, number> = {};
      events.forEach(event =>{
        if(event.type === "AgentJoined"){
          capacity[event.agentId]= event.capacity;
        }
      })
      return capacity;
    }

    fc.assert(
      fc.property(eventsArbitrary, (events: PrimitiveEvent[])=>{
        const result = decideFromEvents(events);
        const capacity = agentCapacity(events);

        result.forEach(allocationResult => {
          for(const [agentId, allocatedAmount] of Object.entries(allocationResult.allocation)){
            expect(allocatedAmount).toBeLessThanOrEqual(capacity[agentId] || 0);
          }
        })
      })
    )
  }),
  //Law 1 - 3 is for engine safety
  //Law 4 is about preference ordering
  /**
    * It doesn’t say:

    “Starvation is invalid”

    It says:

    “Starvation must not be rewarded”

    That’s more subtle — and more dangerous if wrong.
   */
  test('Law 4 - Starvation Monotonicity: For a requesting agent, giving something must never score worse than giving nothing, all else equal. ', ()=>{
    fc.assert(
      fc.property(
        fc.integer({min: 1, max:5}), // capacity
        fc.integer({min: 1, max:5}), // requested
        (capacity: number, requested: number) => {
          const starvingAgent = {A:0}; //=0
          const feededAgent = {A:1}; //>0
          //same state with same agent but different allocation

          const state: State = {
            time: 1,
            available: 5,
            agents: {
              A: {
                capacity,
                requested,
                allocated: 0,
                starvationTicks: 1
              }
            }
          }
          const starveScore = scoreAllocation(state, starvingAgent).score;
          const feedScore = scoreAllocation(state, feededAgent).score;

          //starvation must not score higher
          expect(feedScore).toBeGreaterThanOrEqual(starveScore);
        }
      )
    );
  }),
  //Law 5 is helpful for:
  /**
   * Rehydration Bug, 
   * Partial event streams,
   * Snapshot + replay mismatches,
   * Streaming vs batching inconsistencies,
   * Eventually - consistent madness
   * 
   * ----
   * 
   * Statements: 
   * 1. “History interpretation must be associative”
   * 2. “Time must not leak hidden effects”
   * 3. “Reducer must be order-consistent”
   * 4. “Retries will duplicate effects”
   */
  test('Law 5 - Replay Equivalence: Folding events all at once or in chunks must produce the same final state and decisions. ', ()=>{
    const initialState: State = {
      time: 0,
      available: 0,
      agents: {}
    }

    const reduceAllEvents = (events: PrimitiveEvent[]): State => {
      return events.reduce(stateReducer, initialState);
    }

    const reduceEventsInChunks = (events: PrimitiveEvent[], chunkSplitIndex: number): State => {
      const firstChunkSplit = events.slice(0, chunkSplitIndex);
      const secondChunkSplit = events.slice(chunkSplitIndex);

      const midState = firstChunkSplit.reduce(stateReducer, initialState);
      return secondChunkSplit.reduce(stateReducer, midState);
    }

    fc.assert(
      fc.property(eventsArbitrary, fc.integer({min: 0, max: 20}), (events: PrimitiveEvent[], splitIndex:number)=>{
        const nth = Math.min(splitIndex, events.length);
        //nth is to ensure we don't go out of bounds
        const finalStateAllAtOnce = reduceAllEvents(events);
        const finalStateInChunks = reduceEventsInChunks(events, nth);

        expect(finalStateInChunks).toEqual(finalStateAllAtOnce);
        //states must be the same

        const decisionsAllAtOnce = decideFromEvents(events);
        const decisionsInChunks = decideFromEvents(events);
        
        expect(decisionsInChunks).toEqual(decisionsAllAtOnce);
        //decisions must be the same
      })
    )
  }),
  /**
   * For any event stream E
   * and any split index k
   * decide(E) === decide(E[0..k] + E[k+1..n])
   * + is replay
   * same input history -> same output decision
   * “No matter how I split the event stream,
      the final decision ordering is identical.”
   */
  test("Law 6 - Query Stability: The same history must always produce the same decision.", ()=>{
    fc.assert(
      fc.property(eventsArbitrary,fc.integer({min: 0, max: 50}), (events: PrimitiveEvent[], splitIndex)=>{
        const fullDecide = decideFromEvents(events);
        const initial:State = {time: 0, available: 0, agents: {}};
        const firstChunkSplit = events.slice(0, splitIndex);
        const secondChunkSplit = events.slice(splitIndex);

        const midState = firstChunkSplit.reduce(stateReducer, initial);
        const finalState = secondChunkSplit.reduce(stateReducer, midState)
        
        const decideFromStateResult = decideFromState(finalState);
        expect(decideFromStateResult).toEqual(fullDecide);
      })
    )
  })
})
