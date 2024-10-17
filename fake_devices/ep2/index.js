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

let energy = 1000000;

client.on("connect", () => {
  console.log("EP2 connected to MQTT broker");

  setInterval(() => {
    if (shouldSendMessage()) {
      const message = {
        from: "3237399999a00002",
        content: { energy: energy },
        timestamp: getCurrentTimestamp(),
        tag: "Op1",
      };

      // Introduce occasional bug where energy drops (10% chance)
      if (Math.random() < 0.1) {
        energy -= Math.floor(Math.random() * 1000);
        console.log("EP2 bug introduced: energy dropped to", energy);
      } else {
        energy += Math.floor(Math.random() * 10000) + 1000; // Increment energy
      }

      client.publish(topic, JSON.stringify(message));
      console.log(message);
    } else {
      console.log("EP2 message lost (simulated)");
    }
  }, randomInterval()); // Send 1 to 10 messages per second
});
