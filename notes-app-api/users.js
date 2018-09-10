import uuid from "uuid";
import AWS from "aws-sdk";
import { success, failure } from "./libs/response-lib";

//var  cred = new AWS.SharedIniFileCredentials({profile : 'personal-account'});
//AWS.config.credentials = cred;

AWS.config.update({ region : "us-east-1"});

export  function main(event, context, callback){
  
    const params = {
        UserPoolId: 'us-east-1_mlhZupTru',
        AttributesToGet: [
            'nickname',
            'email'
        ]
    };
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
    cognitoidentityserviceprovider.listUsers(params, function(err, data){
          if(err) callback(null, failure({status: false, mes: err }));
          else{
            var users =data.Users.filter(user => user.Username !== event.requestContext.authorizer.claims.nickname); 
            callback(null, success(users));
          }
    });

}
