export const voicePlugin = {
  name: "voice.text",

  async execute(input: string) {
    // Here input = converted speech text

    if (!input || input.trim() === "") {
      return "🎤 No speech detected";
    }

    return `🎤 You said: ${input}`;
  }
};