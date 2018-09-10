import * as dynamoDbLib from "./libs/dynamodb-lib";
import * as EmailSender from "./libs/email-notification-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "notes",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      noteId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET header = :header, content = :content, sharedusers = :sharedusers, attachment = :attachment",
    ExpressionAttributeValues: {
      ":header": data.header ? data.header : null,
      ":content": data.content ? data.content : null,
      ":sharedusers": data.sharedusers ? data.sharedusers : null,
      ":attachment": data.attachment ? data.attachment : null,
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    for(var i=0; i<data.newsharedusers.length; i++){
      await EmailSender.sendWelcomeToNoteEmail(event.requestContext.authorizer.claims.nickname,
                                               data.sharedusers[i].value,
                                               data.header);
    }   
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false, mes: e }));
  }
}