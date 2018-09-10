import AWS from "aws-sdk"

AWS.config.update({ region : "us-east-1"});

export function sendWelcomeToNoteEmail(from,  email, header){
    const sender = "Sender Name <kvishnev@themsteam.com>"
    const subject = "New Shared Note!";
    const body = `User ${from} shared for you ${header} note`;
    const charset = "UTF-8";

    var ses = new AWS.SES();

    var params = {
        Source: sender,
        Destination: {
            ToAddresses: [
                email
            ],
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: charset
            },
            Body: {
                Text: {
                    Data: body,
                    Charset: charset
                }
            }
        },
    };

     return ses.sendEmail(params).promise();
}
