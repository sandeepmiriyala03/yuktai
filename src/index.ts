
import { Runtime } from "./runtime/runtime";
import { aiPlugin } from "./plugins/ai";
import { voicePlugin } from "./plugins/voice";
import { ocrSmartPlugin } from "./plugins/ocr";

const runtime = new Runtime();

// Register plugins
runtime.register(aiPlugin.name, aiPlugin);
runtime.register(voicePlugin.name, voicePlugin);
runtime.register(ocrSmartPlugin.name, ocrSmartPlugin);

export default {
  run: (task: string, input: any) => runtime.run(task, input)
};