import redis from "redis";
import { promisify } from "util";

class Redis {
  private _client?: redis.RedisClient;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access Redis client before connecting");
    }

    return this._client;
  }

  connect(url: string) {
    this._client = redis.createClient({ host: url });
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to Redis ");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }

  async read(key: string) {
    const get = promisify(this.client.get).bind(this.client);
    return await get(key);
  }

  async write(key: string, value: string) {
    const set = promisify(this.client.setex).bind(this.client);
    return await set(key, 1800, value);
  }
}

export const redisClient = new Redis();
