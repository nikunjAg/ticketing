import nats, { Stan, StanOptions } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) throw new Error('Cannot access nats client before connecting.');
    return this._client;
  }

  async connect(clusterId: string, clientId: string, options: StanOptions) {
    this._client = nats.connect(clusterId, clientId, options);

    this._client.on('close', () => {
      console.log('Shutting down NATS!');
    });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log("Connected to NATS");
        resolve(null);
      });
      this.client.on('error', reject);
    });
  }

};

export const natsWrapper = new NatsWrapper();
