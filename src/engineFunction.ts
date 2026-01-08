const decide = (events: PrimitiveEvent[]) => {
  //Initial State
  const initial: State = {time: 0, available: 0, agents: {}};
  const state = events.reduce(stateReducer, initial);

  const candidates: Allocation[] = [
    {
      A : 3,
      B : 3
    },
    {
      A : 4,
      B : 2
    },
    {
      A : 6,
      B : 0
    }
  ];

  return candidates.map(c => scoreAllocation(state, c)).filter(r=>r.valid).sort((a,b)=> b.score - a.score)
}


