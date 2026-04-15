// 🔹 Define Plugin Interface
export interface Plugin {
  name: string;
  execute(input: any): any | Promise<any>;
}

export class Runtime {
  private plugins: Map<string, Plugin> = new Map();

  /**
   * 🔹 Register plugin safely
   * Ensures the plugin exists and has a valid execute function.
   */
  register(name: string, plugin: Plugin): void {
    if (!plugin || typeof plugin.execute !== "function") {
      throw new Error(`Invalid plugin: ${name}`);
    }

    this.plugins.set(name, plugin);
  }

  /**
   * 🔹 Run task
   * Simplified execution without lifecycle event overhead.
   */
  async run(task: string, input: unknown): Promise<unknown> {
    try {
      const plugin = this.plugins.get(task);

      if (!plugin) {
        throw new Error(`Plugin not found: ${task}`);
      }

      // Execute and return result (handles both sync and async plugins)
      return await plugin.execute(input);
      
    } catch (err) {
      console.error(`[YuktAI Runtime Error in ${task}]:`, err);
      throw err;
    }
  }

  /**
   * 🔹 Safe plugin listing
   */
  getPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }
}