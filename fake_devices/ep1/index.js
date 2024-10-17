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

let energyInWh = 1000000; // Starting energy in Wh, starting at 1 million so messages with unit=6 show as relevant

client.on("connect", () => {
  console.log("EP1 connected to MQTT broker");

  setInterval(() => {
    if (shouldSendMessage()) {
      const unit = Math.floor(Math.random() * 3) * 3; // Random unit between 0 (Wh), 3 (kWh), 6 (MWh)

      // Convert the total energy in Wh to the selected unit
      const energyInUnit = Math.floor(energyInWh / Math.pow(10, unit));

      const message = {
        device: "3237388888a0001",
        energy: energyInUnit,
        unit: unit,
        tag: "Op1",
        ts: getCurrentTimestamp(),
      };

      client.publish(topic, JSON.stringify(message));
      console.log("EP1 sent:", message);

      // Increment energy in Wh by a random value between 1000 and 10000 Wh to ensure significant increase
      energyInWh += Math.floor(Math.random() * 10000) + 1000;
    } else {
      console.log("EP1 message lost (simulated)");
    }
  }, randomInterval()); // Send 1 to 10 messages per second
});
