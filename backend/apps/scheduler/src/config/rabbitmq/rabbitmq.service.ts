import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib/callback_api";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connectToRabbitMQ();
  }

  async onModuleDestroy() {
    await this.disconnectFromRabbitMQ();
  }

  // Establish connection to RabbitMQ
  async connectToRabbitMQ() {
    return new Promise<void>((resolve, reject) => {
      amqp.connect("amqp://rabbitmq", (err, connection) => {
        if (err) {
          console.error("Failed to connect to RabbitMQ:", err);
          reject(err);
        } else {
          this.connection = connection;

          connection.createChannel((err, channel) => {
            if (err) {
              console.error("Failed to create RabbitMQ channel:", err);
              reject(err);
            } else {
              this.channel = channel;
              this.channel.assertExchange("bh.devices.consolidate", "topic", {
                durable: true,
              });
              console.log("Connected to RabbitMQ and channel created.");
              resolve();
            }
          });
        }
      });
    });
  }

  // Close connection and channel
  async disconnectFromRabbitMQ() {
    if (this.channel) {
      await this.channel.close();
      console.log("RabbitMQ channel closed.");
    }
    if (this.connection) {
      await this.connection.close();
      console.log("RabbitMQ connection closed.");
    }
  }

  // Publish a message to RabbitMQ with a routing key
  public publishMessage(exchange: string, routingKey: string, message: string) {
    if (!this.channel) {
      console.error("RabbitMQ channel is not available.");
      return;
    }

    this.channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(
      `Message published to exchange '${exchange}' with routing key '${routingKey}'`
    );
  }
}
