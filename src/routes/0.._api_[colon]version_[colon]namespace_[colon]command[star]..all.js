import moment from 'moment'
import bunyan from 'bunyan'
import PostgresClient from '../libs/PostgresClient'
import Auth from '../libs/Auth'
import Aws from '../libs/Aws'
import ImageHelpers from '../libs/ImageHelpers'
import Relationships from '../libs/Relationships'
import config from '../config'

const s3 = Aws().S3
const postgres = new PostgresClient()
const log = bunyan.createLogger(config.logger.options)

export default async function Api(req, res) {
  try {
    const auth      = new Auth({postgres: postgres, session: req.session})

    const body      = req.body
    const version   = req.params.version
    const namespace = req.params.namespace
    const command   = req.params.command
    const info      = req.params[0]

    switch(namespace) {
      case 'relationships':
        const relationship  = new Relationships({postgres: postgres, path: info})
        const record        = await relationship.getByPath()

        switch(command) {
          case 'get':
            return res.json({relationship: record})

          case 'create':
            if (record)
              return res.json({error: 'Unfortunately this relationship path has already been created.'}).status(400)

            const newRecord         = Object.assign(body.relationship, {user_id: auth.getLoggedInUsersId()})
            const newRelationshipId = await relationship.create(newRecord)
            return res.json({id: newRelationshipId})

          case 'file_upload':
            if (!auth.isLoggedIn())
              return res.status(400).json({error: 'You must be logged in to upload files so we know who owns them!'})
            if (!record)
              return res.status(400).json({error: 'You need to log in and create this relationship before uploading pictures.'})

            const userId = auth.getLoggedInUsersId()
            let fileInfo, fileName, filePath, fileType
            if (body.file) {
              fileInfo = body.file
              fileName = fileInfo.name
              filePath = fileInfo.path
              fileType = fileInfo.type
            }

            const imageHelpers      = new ImageHelpers()
            const finalLwipImage    = await imageHelpers.rotateImagePerExifOrientation('fs', filePath)
            const newImageBuffer    = await imageHelpers.toBuffer(finalLwipImage, ImageHelpers.getImageTypeFromFile(fileName))
            const mainS3FileName    = await s3.writeFile({filename: fileName, data: newImageBuffer})
            const smallerS3FileName = await imageHelpers.uploadSmallImageFromSource({jpg: true, filename: fileName, data: newImageBuffer})

            await postgres.query(`
              insert into relationships_images (relationships_id, main_image_name, small_image_name)
              values ($1, $2, $3)
            `, [record.id, mainS3FileName.filename, smallerS3FileName.filename])

            return res.sendStatus(200)

        }
        break

      case 'auth':
        switch(command) {
          case 'logged_in':
            return res.json(auth.isLoggedIn())

          case 'set_return_to':
            req.session.returnTo = info
            req.session.save()
            return res.sendStatus(200)

          case 'integrations':
            if (!auth.isLoggedIn())
              return res.json({logged_in: false})

            const integrations  = await auth.getIntegrationsFromUserId()
            const types         = integrations.map(i => i.type)
            const displayName   = (() => {
              if (integrations instanceof Array) {
                const fb = integrations.filter(int => int.type === 'facebook')[0]
                const ig = integrations.filter(int => int.type === 'instagram')[0]
                const pi = integrations.filter(int => int.type === 'pinterest')[0]
                if (fb) return fb.first_name
                if (ig) return ig.first_name
                if (pi) return pi.first_name
              }
              return null
            })()
            return res.json({logged_in: true, display_name: displayName, integrations: types})
        }
        break
    }

    res.sendStatus(404)

  } catch(err) {
    log.error(`Error`, err)
    res.status(500).json({error: err})
  }
}
