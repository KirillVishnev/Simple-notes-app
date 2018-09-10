import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const params = {
    TableName: "notes",
    ProjectionExpression: "userId, noteId, header, createdAt",
    FilterExpression: "userId=:userId", 
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.claims.nickname
    }
  };

  try {
    const result = await dynamoDbLib.call("scan", params);
    callback(null, success(result.Items));
  } catch (e) {
    callback(null, failure({ status: false, err: e }));
  }
}