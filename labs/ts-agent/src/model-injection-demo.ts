import { agentLoop } from "./loop";
import { createInitialState } from "./messages";
import { createEchoThenDoneModel } from "./scripted-model";

const model = createEchoThenDoneModel();
const finalState = await agentLoop(
  createInitialState("prove model injection works"),
  model,
);

console.log(JSON.stringify(finalState, null, 2));
