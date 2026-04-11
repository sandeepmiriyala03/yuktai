import { Runtime } from "./runtime/runtime";
import { aiPlugin } from "./plugins/ai";

const runtime = new Runtime();

// Register plugins
runtime.register(aiPlugin.name, aiPlugin);

// Export API
export default {
  run: (task: string, input: any) => runtime.run(task, input)
};