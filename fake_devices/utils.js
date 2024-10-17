const options = {
  username: "guest",
  password: "guest",
};
const brokerUrl = "mqtt://rabbitmq:1883";
const topic = "bh/devices";

function shouldSendMessage(lossRate = 0.05) {
  return Math.random() >= lossRate;
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

function randomInterval() {
  const base = Math.random();
  const skewed = Math.pow(base, 3); // Cubes the number to increase randomness
  return Math.floor(skewed * 900) + 100; // Scale it to 100ms to 1000ms
}

module.exports = {
  shouldSendMessage,
  getCurrentTimestamp,
  randomInterval,
  brokerUrl,
  options,
  topic,
};
