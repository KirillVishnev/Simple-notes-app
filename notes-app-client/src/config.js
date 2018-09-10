export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
      REGION: 'us-east-1',
      BUCKET: 'mynotefiles'
    },
  apiGateway: {
      REGION: 'us-east-1',
      URL: 'https://woj8b2xlxk.execute-api.us-east-1.amazonaws.com/prod'
    },
  cognito: {
      REGION: 'us-east-1',
      USER_POOL_ID: 'us-east-1_mlhZupTru',
      APP_CLIENT_ID: '4pjjvc4i8o1sd8r1igaagnvsi1',
      IDENTITY_POOL_ID: 'us-east-1:176607dc-931c-4ccf-9b52-dc3050aca392'
    }
  };
  