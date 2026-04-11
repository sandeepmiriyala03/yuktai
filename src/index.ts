import { Runtime } from "./runtime/runtime";
import { aiPlugin } from "./plugins/ai";
import { voicePlugin } from "./plugins/voice";

const runtime = new Runtime();

// Register plugins
runtime.register(aiPlugin.name, aiPlugin);
runtime.register(voicePlugin.name, voicePlugin);

export default {
  run: (task: string, input: any) => runtime.run(task, input)
};