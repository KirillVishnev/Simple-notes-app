import uuid from "uuid";
import { success, failure } from "./libs/response-lib";

//var  cred = new AWS.SharedIniFileCredentials({profile : 'personal-account'});
//AWS.config.credentials = cred;


export async function main(event, context, callback){
    
    if(!event || !event.request){
        const err= new Error("Unexpected request");
        console.log(err);
        return callback(err);
    }
    const triggerSource=event.triggerSource;
    if(triggerSource == 'PreAuthentication_Authentication'){
        var username;
        if(event.request.userAttributes){
            username = event.request.userAttributes.Username;
        }

        if(!username){
            console.log("not username");
            return callback(new Error("not username"));
        }

           
    try{
       var result=  await triggerSource.preAuthenticationClient(username);
       console.log("no errors", result);
       return callback(null,event);
    }catch(e){
       console.log("error", e);
       return callback(e, null);
    }
}else{
    return callback(null, event);
}
}