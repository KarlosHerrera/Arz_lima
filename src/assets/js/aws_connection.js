// aws.connection.js

const aws = require('aws-sdk');

// ------------Amazon----------------
aws.config.region = 'us-east-2';
aws.config.update({
  accessKeyId: "AKIAXTFEX2BDXFUVGWXG",
  secretAccessKey: "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"
});

const s3 = new aws.S3();

module.exports = s3;
