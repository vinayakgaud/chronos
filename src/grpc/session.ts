import type { State, PrimitiveEvent } from "../engine/types/primitiveEvents";
import stateReducer from "../engine/stateReducer";
import { decideFromState } from "../engine/engineFunction";
import type { ScoredDecision } from "../engine/types/reasons";

export class Session {
  private state: State;
  private lastSequence: number = -1;
  private version: number = 0;

  constructor(
    private readonly seed: number,
    private readonly topK: number
  ){
    this.state = {time: 0, available: 0, agents: {}}
  }

  applyEvent(sequence: number, event: PrimitiveEvent): ScoredDecision[] | null {
    if(sequence <= this.lastSequence){
      return null; //duplicate or replayed event -> ignored
    }

    this.lastSequence = sequence;
    this.version++;

    this.state = stateReducer(this.state, event);

    return decideFromState(this.state, {
      seed: this.seed,
      topK: this.topK
    });
  }

  getVersion(){
    return this.version;
  }
}
