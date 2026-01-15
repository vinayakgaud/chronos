# Copyright (c) 2026 Kuro. All Rights Reserved.
# Chronos Engine - it is a Deterministic Decision Engine

- A software system that ensures identical inputs always produce identical outputs, following fixed rules or models without randomness

1) A Strategy Engine
2) A real time analytics core
3) And a simulation lab for sharp thinking

### This engine ingests events (actions, signals, metrics), runs them through a deterministic evaluation engine, and produces ranked decision in real time

## Architecture

1) GraphQL - Public Contract Layer

Responsibilities: 
- Query current system state
- Mutate by submitting events
- Subscribe to live decision

custom build for complex parts:
- Custom GraphQL execution cost analysis
- Query complexity scoring (Math, not config)
- Manual resolver orchestration (no ORM crutches)

2) gRPC - Internal Compute Fabric

Inside the engine
- No JSON
- No guessing
- No forgiveness

Each service is narrow & sharp
- Event Ingestor
- Rule Evaluator
- Scoring Engine
- Optimizer
- State Coordinator

We'll design:
1. Protobuf schemas by hand
2. Streaming RPCs
3. Backpressure
4. Timeouts as first class citizens

3) Math Core

We'll implement below from scratch
- Weighed scoring systems
- Constraint Satisfaction
- Priority Queues
- Sligin window statistics
- Graph traversal (for dependencies)
- Deterministic replay (same inputs -> same outputs)

4) Determinism as a Design Rule

Every decision must be
- Reproducible
- Explainable
- Debuggable

- Event sourcing(minimal, explicit)
- Immutable inputs
- Versioned rules
- Pure functons where possible

How We Build (important)

We don’t start by coding.
We start by pinning invariants.

Step 1 — Define the rules of reality:

- What is an event?

- What is state?

- What can never happen?

Step 2 — Design the math on paper:

- Scoring equations

- Constraints

- Failure modes

Step 3 — Only then, code.

- Every module answers one question:

“What must be true for this to work?”

Starting invariant: 

“Given the same ordered event stream and rule version, the engine must always produce the same ranked output.”

then we'll design event models

--------------------------------------------------------

Think of it like this:

- Simulation asks: “What could happen?”

- Prediction asks: “What will likely happen?”

- Decision engine asks: “Given constraints, goals, and inputs — what should be done right now?”

Chronos sits squarely in the third camp.

It can use simulation.
It can feed prediction models later.
But at its core, it decides.

Same inputs. Same rules. Same output.
No vibes. No randomness unless explicitly injected.

That constraint alone separates toys from machines.

Why this matters

Prediction systems hide behind probability.
Simulations hide behind visuals.
Decision engines have nowhere to hide.

They must:

- justify outputs

- handle trade-offs

- fail predictably

- be auditable

This is why they’re used in:

- schedulers

- pricing engines

- strategy games

- traffic systems

- risk engines

- sports tactics

We’re building the spine, not the skin.

## Step 0: The Three Primitives

Every serious system reduces to three nouns:

1. Event
Something that happened. Immutable. Historical.
Example: “Player ran”, “Order placed”, “Signal received”.

2. State
A derived snapshot of reality at a moment in time.
State is never truth. Events are.

3. Decision
An output chosen by rules + math, based on state.

If these three are vague, everything else collapses.

“Given an ordered stream of Events, the engine derives State and produces Decisions deterministically.”

## Step 1: Choose a Toy Domain (not a real one)

Not football. Not finance. Too loaded.

We start with something deliberately abstract:

Resource Allocation Game

- There are agents

- There are limited resources

- There are goals

- There are constraints

- Decisions must rank actions

This domain is mathematically rich but emotionally cheap.

## Step 2: Define Events (in plain English)

No GraphQL yet. No gRPC yet.

Examples:

- [ResourceAdded]

- [AgentJoined]

- [AgentRequestedResource]

- [TimeTicked]

Each event answers:

- What happened?

- When?

- With what parameters?

No “update”. No “modify”.
Only facts.

## Step 3: Define State as a Function

State is not stored truth.

State = fold(events)

That’s the first math idea you’ll internalize:

- folding

- reduction

- accumulation

Once this clicks, GraphQL will feel obvious later.

## Step 4: Define Decisions as Math, not Logic

A decision is not:

- [if A then B else C]


A decision is:

- [score(action) = Σ(weights × signals) − penalties]


Even simple scoring forces:

- clarity

- comparability

- debuggability

This is where thinking sharpens.

We will formally define:

- the Event schema

- the State shape

- the Decision output

----------------------------------------
`It’s a pattern distilled from how complex systems survive contact with reality.`

Event (why it exists)

An event is just:

- "Something that happened, and we agree it happened."

We use events because:

- humans misremember

- state lies

- logs tell the truth (when done right)

This idea shows up everywhere:

- accounting ledgers

- physics measurements

- chess move history

- court transcripts

---------------------------------------

State (why it exists)

Now the next human problem:

- “I don’t want to reread the entire history every time I think.”

So we compress history into a summary.

That summary is State.

State is:

- a convenience

- a snapshot

- always derived

- always disposable

We didn’t choose state first.
State is forced into existence by human limits.

---------------------------------------

Decision (why it exists)

Now the real question appears:

“Given what has happened so far… what should I do next?”

That question is older than software.

A decision is simply:

- an evaluation of options

- based on current understanding

- under constraints

No decision system escapes this structure.

So again: not invention — extraction.

-----------------------------------------

Any real decision involves trade-offs.

Trade-offs mean:

- you can’t maximize everything

- improving one thing hurts another

- you must compare unlike things

Comparison requires a common unit.

That unit is a score.

Scoring is not math worship.
It’s the least-wrong way to compare apples and oranges.

------------------------------------------

Signals — explained like a human

A signal is just:

- “Something that influences the decision.”

Nothing mystical.

Let’s decode the examples you saw.

------------------------------------------- 

Fairness deviation

Plain English:

- “How unequal has the system become?”

Not fairness as morality.
Fairness as imbalance.

If one agent keeps winning while others starve, the system destabilizes.

Fairness deviation measures:

- how far we are from “acceptable imbalance”

It’s a stabilizer, not a virtue signal.

------------------------------------------- 

Urgency

Plain English:

- “How bad is it if we don’t act now?”

High urgency means delay causes damage.

Examples:

- a starving agent

- a deadline approaching

- a resource expiring

Urgency pushes decisions forward in time.

--------------------------------------------- 

Resource scarcity

Plain English:

- “How rare is this thing right now?”

Abundant resources → cheap decisions
Scarce resources → expensive decisions

Scarcity increases the cost of mistakes.

This signal prevents reckless allocation.

-------------------------------------------- 

Agent reliability

Plain English:

- “Can I trust this agent to use what I give it?”

History matters.

If an agent:

- wastes resources

- fails often

- violates constraints

Then giving it more is risky.

Reliability pulls decisions toward competence.

---------------------------------------------- 

Penalties — explained without ceremony

Penalties are just anti-signals.

They answer:

- “What should actively count against this option?”

--------------------------------------------- 

Over-allocation

Plain English:

“Am I giving more than can be handled?”

Giving a truckload of food to someone with no fridge is dumb.

Penalty applies when:

- allocation exceeds capacity

- buffers overflow

- limits are breached

---------------------------------------------- 

Starvation risk

Plain English:

- “Does this choice risk someone getting nothing for too long?”

Even efficient systems fail if parts are starved.

This penalty:

- prevents greedy optimization

- keeps the system alive long-term

---------------------------------------------- 

Constraint violations

Plain English:

- “Does this break a rule we promised not to break?”

Rules can be:

- physical

- legal

- ethical

- system-imposed

Constraints are non-negotiable.

Violation doesn’t reduce score.
It often invalidates the option entirely.

---------------------------------------------- 



## Step 1 - Freeze the universe ( Formal Definitions)

1. Event - the only source of truth

An event is a historical fact 

It cannot be changed, deleted or "fixed later"

Formal Shape (Conceptual)

Event {
    id //unique, monotonically ordered
    type //what kind of event this is 
    timestamp // when it happend ( logical time > wall time)
    payload // event specific data

}

~ `if something is not an Event, it never happened.`

Our initial event types (minimal, sufficient)

- AgentJoined
- ResourceAdded
- ResourceRequested
- TimeAdvanced

2. State - a derived illusion

State is computed, never believed

State exists only as the result of folding events

- Stateₙ = reduce(Stateₙ₋₁, Eventₙ)

State contains only what can be derived
State{
  agents: Map<agentId, AgentState>
  resources: map<ResourceId, ResourceState>
  time: LogicalClock
}

AgentState{
    id
    capacity // how much resource it can handle
    allocated // current allocation 
    requests // pending demands
}

- `if you can't point to the event that caused a state value, it doesn't belong`

3. Decision - the engine's only output

A decision is not an action.

It is a ranked recommendation

Decision{
    decisionId
    basedOnEventId
    rankings: [
      {
          agentId,
          action,
          score
      }
    ]
}

No side effects, not execution, no mutation 

Decision advice. Systems act

4. The Scoring Functions (where thinking begins)

Every ranking comes from one function:

- score = Σ(weightᵢ × signalᵢ) − Σ(penaltyⱼ)

Example signals:

- urgency
- fairness deviation
- resource scarcity
- agent reliability

Penalties:
- Over-allocation
- starvation risk
- constraint violations

If you can't explain a score in words, it's wrong. 

5. One Sacred Invariant 

- `Given the same ordered events and the same scoring rules, the Decision output must be identical`

no randomness, no clock drift, no hidden state

This is what makes the system testable, replayable, and sane.

------------------------------------------ 

## Scenario:

Two agents are alive at the same time.
A fixed amount of energy exists.
Both agents ask for energy at the same moment.
The system must decide how to distribute the energy now, knowing future requests may exist.

Decomposing the scenario (so it sticks)

Every scenario has four parts:

1. Actors
Who is involved?
→ Agents A and B

2. Resources / constraints
What is limited?
→ 10 energy units

3. Tension
What can’t be optimized simultaneously?
→ Satisfy everyone vs avoid waste vs avoid starvation

4. Decision point
What must be chosen now?
→ How much energy each agent gets this tick

If any of these are missing, it’s not a real scenario.

----------------------------------------- 

Why scenarios come before state & scores

Because:

- State is extracted from the scenario
- Signals are extracted from the tension
- Scores are extracted from the trade-offs

We didn’t invent “urgency” or “fairness.”
They only appear if the story demands them.

In our scenario:

- starvation risk exists → signal appears
- limited energy exists → scarcity appears
- capacities exist → overflow penalty appears

Change the story, the signals change.

------------------------------------------ 

## Step 2 - One tiny world, one decision

No abstractions. No generality. One story.

The world (small enough to fit in your head)

- There are 2 agents: A and B

- There is 1 resource: energy units

- Total available energy: 10 units

- Time moves in discrete ticks

Agents are simple creatures:

- They need energy to stay alive

- Too much energy is wasted

- Too little for too long is fatal

No heroics. Just pressure.

### Step 2.1 - What actually happened (Events)

We don't invent state. We record facts
Event stream, in order:

1. AgentJoined(A, capacity=7)
2. AgentJoined(B, capacity=5)
3. ResourceAdded(energy=10)
4. AgentRequestedResource(A, amount = 6)
5. AgentRequestedResource(B, amount = 4)
6. TimeAdvanced(tick = 1)

No assumptions, no implied logic 

### Step 2.2 - Derive State( slowly, explicitly)

we now compute state by folding events.

After events 1-2
- Agents exist
- No energy yet

After event 3
- Energy pool = 10

After events 4-5
- A wants 6 
- b wants 4 

After event 6 

- Time = 1 
- A has received nothing yet
- B has received nothing yet

So state becomes: 
1. Available energy: 10 
2. Request: 
  1. A -> 6 (capacity = 7)
  2. B -> 4 (capacity = 5)

### Step 2.3 - The decision we must make 

The system must answer one question: 
-`How should the 10 energy units be allocated right now?`

Possible actions:

- Give A some amount
- Give B some amount 
- Split in many ways 

We don't act yet, we rank options.

### Step 2.4 - Identify real trade-offs(this is the key)

What tensions exist here?

1. If we satisfy A fully (6), B can still be satisfied (4)
→ no scarcity yet

2. But:

  - A has higher capacity

  - B has lower capacity

  - Over-giving either is waste

3. If future ticks exist, starving one early is dangerous

So the trade-offs are:

- efficiency vs safety

- full satisfaction vs balanced allocation

Only now do signals earn their existence.

### Step 2.5 - Define signales (earned, not decorative)
We define only what we need.

1) Signal 1: Fulfillment ratio 

- `How much of the request can we satisfy?`

For an allocation x:

- fulfillment = allocated / requested 

This rewards usefulness

2) Signal 2: Capacity overflow penalty

- `Did we give more than can be handled`

- penalty = max(0, allocated − capacity)

Waste is punished.

3) Signal 3: Starvation risk

- `Did someone get nothing while asking?`

Binary for now:

- 0 if allocated > 0
- high penalty if allocated = 0

Crude, but honest

### Step 2.6 - Score candidate allocations (manually)

1) Option 1 - Fully satisfy both
- A -> 6 
- B -> 4 

Fulfillment:
- A: 1.0
- B: 1.0

Penalties:
- None 

Starvation:
- None 

Clean. High score

2) Option 2 — Favor A heavily
- A → 7
- B → 3

Problems:
- A exceeds request (waste)
- B not fully satisfied

Penalty:
- A overflow = 1
- Efficiency drops

⚠️ Worse than Option 1.

3) Option 3 — Favor one, starve the other
- A → 10
- B → 0

Penalties:
- Massive overflow
- B starvation

❌ This option should almost be invalid.

### Step 2.7 - Decision output (no action yet)

Engine produces:

1. Allocate A = 6, B = 4 (best)
2. Allcoate A = 7, B = 3 
3. Allocate A = 10, B = 0 (near-zero score)

No mutation.
No side effects.
Just ranked truth.

- What just happened (this matters)

You just:

- derived state from history
- extracted trade-offs from reality
- created signals only when forced
- compared options quantitatively
- avoided premature abstractions

This is the entire engine in embryo.

## Step 3 — A second scenario that breaks the first one

If one scenario teaches you structure,
a second one teaches you limits.

### Scenario 2 — Scarcity + Time (this is where engines grow up)
The story

- Same two agents: A and B

- Same capacities:

  - A capacity = 7

  - B capacity = 5

- Only 6 energy units available (not enough)

- Requests arrive at the same time

- Decision must be made now

- Time will continue

This one change—not enough to go around—changes everything.

### Step 31. - Events (facts only)
1. AgentJoined(A, capacity = 7)
2. AgentJoined(B, capacity = 5)
3. ResourceAdded(energy = 6)
4. AgentRequestedResource(A, amount = 6)
5. AgentRequestedResource(B, amount = 4)
6. TimeAdvanced(tick = 1)

### Step 3.2 - Derived state (no interpretation)
- Energy available: 6 
- Total requested: 10 
- Deficit: 4 
Scarcity is not real, not hypthetical

### Step 3.3 - the unavoidable question
 - `Who should suffer, and how much?`

That sentence is uncomfortable.
That’s how you know it’s a real decision.

### Step 3.4 - Enumerate reasonable options

1. Proportional Split

  - A -> 3.6 
  - B -> 2.4

2. Favor higher demand 
  - A -> 4 
  - B -> 2 

3. Favor lower capacity ( protect the fragile)
  - A -> 2 
  - B -> 4 

4. Starve one 
  - A -> 6, B -> 0
  - B -> 6, A -> 0

### Step 3.5 - What new trade-offs appeared

Compared to scenario 1, something new happened

We now care about:
- who gets hurt first
- how evenly pain is distribute
- future survival

This forces new thinking

### Step 3.6 - Signals that are now unavoidable
We didn't invent these. Scarcity summoned them

1. Proportionality (new)

Plain English:

“Are we sharing pain in proportion to demand?”

This didn’t matter before. Now it does.

2. Minimum survival threshold (new)

Plain English:

“Does this allocation drop someone below a survivable minimum?”

This introduces hard floors, not smooth math.

3. Starvation duration (time enters)

Plain English:

“How long has this agent been underfed?”

This is the moment where time becomes state.

### Step 3.7 — Compare two options (manually)
Option A — Proportional split (3.6 / 2.4)

- No one starves

- Pain is shared

- Both survive another tick

This feels boring — which in systems design is often a compliment.

Option B — Favor A (4 / 2)

- A is mostly fine

- B is close to danger

- Future starvation risk increases

This trades short-term efficiency for long-term instability.

Option C — Starve B (6 / 0)

- Maximum efficiency for A

- B is effectively dead next tick

This option should scream at you.

If it doesn’t, the system is dangerous.

### Step 3.8 - What we learned (this is the payoff)

From just two scenarios, we discovered:

- State must track time since last allocation

- Decisions must consider future risk, not just current fit

- Some constraints are hard, not weighted

- Fairness is not morality — it’s system survival

We didn’t add complexity.
Reality did.

## Step 4 — Distill invariants (what stayed true no matter the story)

We now look at Scenario 1 (abundance) and Scenario 2 (scarcity + time) and ask one ruthless question:

“What did not change, even when pressure increased?”

Those non-negotiables become the engine’s skeleton.

### Invariant 1 — Events are the only truth

Across both scenarios:

- We never argued about what happened

- We only argued about what to do next

So this becomes law:

  The engine never mutates reality directly.
  It only consumes an ordered event stream.

No exceptions.
No “quick fixes”.

### Invariant 2 — State is always derived, never authoritative

In both scenarios:

- State existed only to summarize history

- If state was wrong, replaying events would fix it

So:

- State is a cache, not a source of truth.

This single idea prevents entire classes of bugs.

### Invariant 3 — Decisions are evaluations, not actions

Notice something subtle:

- The engine never gave energy

- It only ranked allocations

Why this matters:

  The engine thinks.
  Something else acts.

This separation lets you:

- test decisions without side effects

- simulate futures

- audit past choices

Engines that act directly become impossible to reason about.

### Invariant 4 — Scarcity forces comparison

Abundance was easy.
Scarcity forced us to compare unlike things:

- efficiency vs survival

- fairness vs throughput

- now vs later

Therefore:

  Every decision reduces to comparing options under constraints.

Which implies:

- options must be enumerable

- constraints must be explicit

- comparisons must be explainable

If you can’t explain why option A beat option B, the engine is lying.

### Invariant 5 — Time is part of state, not an external excuse

In Scenario 2:

- starvation only mattered because time passed

- history of neglect changed the decision

So:

  Time is a first-class input to decisions.

Not wall-clock time.
Logical time. Ticks. Steps. Sequence.

This keeps determinism intact.

### Invariant 6 — Some rules are hard, not weighted

We saw this clearly:

- starvation below survival threshold

- constraint violations

These were not “low score”.
They were “no”.

So:

  The engine must support hard constraints that invalidate options outright.

This prevents the most dangerous failure mode:
smooth math justifying catastrophic decisions.

## Step 4.1 — Freeze the minimum engine contract

Now we write the smallest possible contract the engine must satisfy.

No tech. No syntax. Just meaning.

Input

  - Ordered list of Events

  - Current logical time

Output

- A Decision:

  - list of candidate actions

  - each with:

    - validity (yes/no)

    - score (only if valid)

    - explanation (derived, not hand-written)

That’s it.

If a feature doesn’t serve this contract, it doesn’t exist.

## Step 4.2 — What we intentionally do not decide yet

We still refuse to lock:

- exact scoring formulas

- exact state shape

- exact domains

- exact protocols

Why?

Because those emerge from more scenarios, not cleverness.

### Step 5 — The Core Engine Loop
This is the irreducible minimum.
If this is wrong, everything built on top will be decorative nonsense.

What this loop must do

- Accept an ordered list of events

- Derive state deterministically

- Produce a ranked decision

- Explain why it ranked things that way

That’s it.

## Step 6 — Explanations as a First-Class Output

A decision that can’t explain itself is a rumor.

What changes

- Every scored option carries structured reasons

- Reasons are derived, not hand-written

- You can read why option A beat option B

### Property based test cases , not the example tests

Why not example tests?

Example tests answer:

- “Does this work for this input?”

Property tests answer:

- “What must always be true, no matter the input?”

Decision engines fail in the second category, not the first.

You already ran examples.
Now we attack the laws.

### What we test next ( the non-negotiables )

1) Law 1 - Determinism

Same events -> same decision, every time.

If this breaks, the engine is lying.

2) Law 2 - Conservation

Total allocated <= total available

if this breaks, you are creating resources from thin air.

3) Law 3 - Capacity safety

No valid decision allocates more than an agent's capacity

If this breaks, state is being ignored.

4) Law 4 - Starvation monotonicity

Giving nothing to a requesting agent must never score higher than giving something, all else equal.

If this breaks, the engined prefers cruelty.

5) law 5 - Replayability

Reducing events in chunks vs all at once must yield the same state.

If this breaks, time ordering is corrupt.


### What you just learned about GraphQL (important)

Without realizing it, you learned:

- Schema ≠ Code

- GraphQL is pull-based (client chooses shape)

- Resolvers are field-level execution

- GraphQL is not tied to databases

GraphQL is ideal for decision engines

This is real GraphQL usage.

### Hard Constraints for Real Systems

- We will teach the engine to reject impossible allocations outright, instead of merely scoring them badly.

- “This option is not just bad — it is impossible.”
This prevents dangerous decisions from sneaking through.

### Soft rule vs Hard constraint (important distinction)
Soft rule (what you already have)

- starvation penalty
- fairness penalty
- priority weighting

These affect ranking.

Hard constraint (what we add now)

- allocation > available
- allocation > capacity
- allocation to non-existent agent

These affect existence.

An option that violates a hard constraint should:

- never be scored

- never be ranked

- never be returned as valid

### Architectural Decision (Critical)
We will enforce constrains in one place only
- Inside the engine, before scoring

```
Events
↓
State
↓
Generate candidate allocations
↓
FILTER by hard constraints   ← NEW
↓
Score remaining allocations
↓
Rank decisions
```

