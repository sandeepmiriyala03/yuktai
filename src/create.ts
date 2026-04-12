import { Runtime } from "./runtime/runtime";
import { generateUI } from "./core/generateUI";
import { applyAccessibility } from "./core/a11yEngine";
import { render } from "./core/renderer";
import { Lifecycle, YuktLifecycle } from "./lifecycle/lifecycle";

interface CreateOptions {
  intent: string;
  selector: string;
  lifecycle?: Lifecycle;
}

/**
 * YuktAI App Creator (Main Orchestrator)
 */
export function createApp(runtime: Runtime, options: CreateOptions): void {
  const { intent, selector, lifecycle } = options;

  const lc = new YuktLifecycle(lifecycle);

  try {
    // 🔹 1. Init
    lc.init();

    // 🔹 2. Process (AI / runtime)
    lc.process();
    const aiResult = runtime.run("ai", intent);

    // 🔹 3. Generate UI
    lc.generate();
    const ui = generateUI(String(aiResult));

    // 🔹 4. Accessibility Enhancement
    lc.enhance();
    const enhancedUI = applyAccessibility(ui);

    // 🔹 5. Render
    render(enhancedUI, selector);

    // 🔹 6. Final Render Hook
    lc.render();
  } catch (err) {
    lc.error(err);
    throw err;
  }
}