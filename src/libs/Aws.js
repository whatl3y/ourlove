import fs from 'fs'
import url from 'url'
import * as AWS from 'aws-sdk'
import config from '../config'

export default function Aws(options={}) {
  const accessKeyId = options.accessKeyId || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = options.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
  const region = options.region || process.env.AWS_REGION || 'us-east-1'

  return {
    S3: {
      _s3: new AWS.S3({accessKeyId:accessKeyId, secretAccessKey:secretAccessKey}),
      defaultbucket: options.bucket || config.aws.s3.bucket,

      getFile(options, callback) {
        const filename = options.filename
        const bucket = options.bucket || this.defaultbucket
        const extraOptions = options.options || {}
        const params = mergeObject({Bucket: bucket, Key: filename},extraOptions)
        // Note the raw buffer data in the file is returned in callback(err,data) {}
        // as data.Body
        this._s3.getObject(params, callback)
      },

      getFileUrl(options, callback) {
        const filename = options.filename
        const bucket = options.bucket || this.defaultbucket
        const params = {Bucket: bucket, Key: filename}
        this._s3.getSignedUrl('getObject',params,callback)
      },

      writeFile(options, callback) {
        const bucket = options.bucket || this.defaultbucket
        const data = options.data
        const filename = (!options.exact_filename) ? getNewFileName(options.filename) : options.filename
        const params = {Bucket: bucket, Key: filename, Body: data}
        this._s3.putObject(params, (err, returnedData) => callback(err, {filename:filename, data:returnedData}))
      },

      createBucket(bucketName, callback) {
        this._s3.createBucket({Bucket: bucketName}, callback)
      }
    }
  }
}
