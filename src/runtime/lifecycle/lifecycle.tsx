export type Callback = () => void;

export interface Lifecycle {
  onInit?: Callback;
  onProcess?: Callback;
  onGenerate?: Callback;
  onEnhance?: Callback;
  onRender?: Callback;

  // 🔥 Execution + Error hooks
  onExecute?: Callback;
  onError?: (err: unknown) => void;
}

/**
 * YuktAI Lifecycle Runner
 */
export class YuktLifecycle {
  private lifecycle?: Lifecycle;

  constructor(lifecycle?: Lifecycle) {
    this.lifecycle = lifecycle;
  }

  // 🔹 Safe executor (prevents crash inside hooks)
  private safeRun(fn?: Callback) {
    try {
      fn?.();
    } catch (err) {
      console.error("Lifecycle hook error:", err);
    }
  }

  init() {
    this.safeRun(this.lifecycle?.onInit);
  }

  process() {
    this.safeRun(this.lifecycle?.onProcess);
  }

  generate() {
    this.safeRun(this.lifecycle?.onGenerate);
  }

  execute() {
    this.safeRun(this.lifecycle?.onExecute);
  }

  enhance() {
    this.safeRun(this.lifecycle?.onEnhance);
  }

  render() {
    this.safeRun(this.lifecycle?.onRender);
  }

  error(err: unknown) {
    try {
      this.lifecycle?.onError?.(err);
    } catch (e) {
      console.error("Lifecycle onError failed:", e);
    }
  }
}