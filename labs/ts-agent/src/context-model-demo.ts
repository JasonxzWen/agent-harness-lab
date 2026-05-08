import { agentLoop } from "./loop";
import { createInitialState } from "./messages";
import { createContextProbeModel } from "./scripted-model";

const model = createContextProbeModel();
const finalState = await agentLoop(
  createInitialState("prove loop passes context into the model"),
  model,
);

console.log(JSON.stringify(finalState.messages, null, 2));
