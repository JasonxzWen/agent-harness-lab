import { agentLoop } from "./loop";
import { createInitialState } from "./messages";

const query = process.argv.slice(2).join(" ") || "hello agent";
const finalState = await agentLoop(createInitialState(query));

console.log(JSON.stringify(finalState.messages, null, 2));
