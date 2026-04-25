import YuktAI from "../dist/index.js";

const result = await YuktAI.run("ai.text", "Hello YuktAI ");
console.log(result);

const voiceResult = await YuktAI.run("voice.speak", "Hello, this is a test of the voice plugin.");
console.log(voiceResult);


