import { YuktLifecycle, Lifecycle } from "../lifecycle/lifecycle";

// 🔹 Define Plugin Interface
export interface Plugin {
  name: string;
  execute(input: unknown): unknown;
}

export class Runtime {
  private plugins: Map<string, Plugin> = new Map();

  // 🔹 Register plugin safely
  register(name: string, plugin: Plugin): void {
    if (!plugin || typeof plugin.execute !== "function") {
      throw new Error(`Invalid plugin: ${name}`);
    }

    this.plugins.set(name, plugin);
  }

  // 🔹 Run task with lifecycle
  run(task: string, input: unknown, lifecycle?: Lifecycle): unknown {
    const lc = new YuktLifecycle(lifecycle);

    try {
      lc.init();

      lc.process();

      const plugin = this.plugins.get(task);
      if (!plugin) {
        throw new Error(`Plugin not found: ${task}`);
      }

      lc.execute();

      const result = plugin.execute(input);

      lc.enhance();

      lc.render();

      return result;
    } catch (err) {
      lc.error(err);
      throw err;
    }
  }

  // 🔹 Safe plugin listing
  getPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }
}