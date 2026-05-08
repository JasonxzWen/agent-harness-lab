import { agentLoop } from "./loop";
import { createInitialState } from "./messages";
import { createNeverEndingEchoModel } from "./scripted-model";

const model = createNeverEndingEchoModel();
const finalState = await agentLoop(
  createInitialState("prove loop limit works"),
  model,
  { maxToolTurns: 3 },
);

console.log(JSON.stringify(finalState, null, 2));
