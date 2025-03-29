import { MongoClient, ServerApiVersion } from "mongodb";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const DB_NAME = "stocks";
const SECRET = "mongodb/connect";
const client = new SecretsManagerClient({
  region: "us-east-1",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: SECRET,
      VersionStage: "AWSCURRENT",
    })
  );
} catch (error) {
  throw error;
}

const uri = JSON.parse(response.SecretString).STOCKS_DB_CONNECTION_STR;
let db = null;

const dbConnect = async () => {
  if (db) {
    return db;
  }
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    db = client.db(DB_NAME);
    return db;
  } catch (err) {
    return err;
  }
};
export default dbConnect;
