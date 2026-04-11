export class Runtime {
  private plugins = new Map<string, any>();

  register(name: string, plugin: any) {
    this.plugins.set(name, plugin);
  }

  async run(task: string, input: any) {
    const plugin = this.plugins.get(task);

    if (!plugin) {
      throw new Error(`Plugin not found: ${task}`);
    }

    return plugin.execute(input);
  }
}