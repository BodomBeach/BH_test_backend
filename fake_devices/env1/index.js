const mqtt = require("mqtt");
const {
  shouldSendMessage,
  getCurrentTimestamp,
  randomInterval,
  brokerUrl,
  options,
  topic,
} = require("../utils");

const client = mqtt.connect(brokerUrl, options);

let filling_level = 0;

client.on("connect", () => {
  console.log("Env1 connected to MQTT broker");

  setInterval(() => {
    if (shouldSendMessage()) {
      filling_level += Math.floor(Math.random() * 10) + 1; // Increment filling level
      if (filling_level > 100) filling_level = 100;

      // Occasionally simulate container emptying
      if (Math.random() < 0.2) {
        filling_level = 0;
        console.log("Env1: container emptied");
      }

      const message = {
        id: "999b32a5342a31b5",
        d: { filling_level: filling_level },
        ts: getCurrentTimestamp(),
        tag: "Op1",
      };

      client.publish(topic, JSON.stringify(message));
      console.log("Env1 sent:", message);
    } else {
      console.log("Env1 message lost (simulated)");
    }
  }, 5000); // Send 1 message every 5 seconds
});
