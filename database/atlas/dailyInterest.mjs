import dbConnect from "./db.mjs";

const COLLECTION_NAME = "dailyInterest";

export const lambdaHandler = async (event, context) => {
  try {
    const db = await dbConnect();

    const gainer = JSON.parse(event.body);
    const collectionExists = await db
      .listCollections({ name: COLLECTION_NAME })
      .toArray();
    if (collectionExists.length === 0) {
      await db.createCollection(COLLECTION_NAME);
    }

    const collection = db.collection("dailyInterest");

    const result = await collection.insertOne(gainer);

    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };

    return response;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
