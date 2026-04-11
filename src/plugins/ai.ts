export const aiPlugin = {
  name: "ai.text",

  async execute(input: string) {
    return `🤖 YuktAI says: ${input}`;
  }
};