import { buildContext } from "./context";
import { createInitialState } from "./messages";

const query = process.argv.slice(2).join(" ") || "explain context engineering";
const state = createInitialState(query);
const context = await buildContext(state.messages);

console.log(context.rendered);
