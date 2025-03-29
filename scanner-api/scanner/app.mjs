import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
});

const shards = ["First", "Second", "Third", "Fourth", "Fifth"];

const REDIS_KEY = "stocks-";

export const lambdaHandler = async (event, context) => {
  const keys = shards.map((shard) => `${REDIS_KEY}${shard}`);
  let response = {
    topGainers: [],
    topVolume: [],
  };
  for (const key of keys) {
    try {
      const data = await redis.get(key);
      const { topGainers, topVolume } = JSON.parse(data);

      response.topGainers.push(...topGainers);
      response.topVolume.push(...topVolume);
    } catch (err) {
      response["error"] = err;
    }
  }

  response.topGainers = response.topGainers
    .sort((a, b) => b.change - a.change)
    .slice(0, 5);
  response.topVolume = response.topVolume
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};
