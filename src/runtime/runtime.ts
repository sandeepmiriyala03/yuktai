export interface Plugin {
  name: string;
  execute(input: any): any | Promise<any>;
}

export class Runtime {
  private plugins: Map<string, Plugin> = new Map();

  register(name: string, plugin: Plugin): void {
    if (!plugin || typeof plugin.execute !== "function") {
      throw new Error(`Invalid plugin: ${name}`);
    }
    this.plugins.set(name, plugin);
  }

  /**
   * 🔹 Direct Plugin Access
   * This is what YuktAI.use(name) calls.
   */
  use(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * 🔹 Run task
   */
  async run(task: string, input: unknown): Promise<unknown> {
    try {
      const plugin = this.use(task); // Use the internal helper

      if (!plugin) {
        throw new Error(`Plugin not found: ${task}`);
      }

      return await plugin.execute(input);
    } catch (err) {
      console.error(`[YuktAI Runtime Error in ${task}]:`, err);
      throw err;
    }
  }

  getPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }
}