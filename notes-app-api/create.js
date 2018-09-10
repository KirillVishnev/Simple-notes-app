import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

//var  cred = new AWS.SharedIniFileCredentials({profile : 'personal-account'});
//AWS.config.credentials = cred;


export async function main(event, context, callback){
    const data=JSON.parse(event.body);

    const params = {
        TableName : "notes",
        Item : {
            userId : data.userId,
            noteId : uuid.v1(),
            header: data.header,
            content : data.content,
            attachment : data.attachment,
            sharedusers: [],
            createdAt : Date.now(),
        }
    };
    
    try{
        await dynamoDbLib.call("put", params);
        console.log(event);
        var st=event.requestContext.authorizer.claims.nickname
        console.log(st);
        callback(null, success(params.Item));
    }catch(e){
        callback(null, failure({status : false, mes: e}))
    }
}
