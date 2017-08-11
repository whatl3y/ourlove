import moment from 'moment'
import bunyan from 'bunyan'
import PostgresClient from '../libs/PostgresClient'
import Auth from '../libs/Auth'
import Aws from '../libs/Aws'
import FacebookGraphApi from '../libs/FacebookGraphApi'
import InstagramApi from '../libs/InstagramApi'
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
      case 'auth':
        switch(command) {
          case 'logged_in':
            return res.json(auth.isLoggedIn())

          case 'relationship_admin':
            const isAdmin = await auth.isUserAdminOfRelationship(info)
            return res.json(isAdmin)

          case 'set_return_to':
            req.session.returnTo = info
            req.session.save()
            return res.sendStatus(200)

          case 'integrations':
            if (!auth.isLoggedIn())
              return res.json({logged_in: false})

            const integrations  = await auth.getIntegrationsFromUserId()
            const types         = (integrations || []).map(i => i.type)
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

      case 'integrations':
        switch(command) {
          case 'get_images':
            const provider = info.slice(1)

            switch (provider) {
              case 'facebook':
                if (req.session.user.facebook.access_token) {
                  const fb = new FacebookGraphApi(req.session.user.facebook.access_token)

                  const taggedPaging    = (body.pageInfo && body.pageInfo.tagged_paging) ? body.pageInfo.tagged_paging : null
                  const uploadedPaging  = (body.pageInfo && body.pageInfo.uploaded_paging) ? body.pageInfo.uploaded_paging : null

                  let promises = []
                  promises.push(fb.photos('me', 'tagged', taggedPaging))
                  promises.push(fb.photos('me', 'uploaded', uploadedPaging))

                  const results = await Promise.all(promises)
                  const photos = {data: results.map(r => r.body).reduce((acc, val) => acc.concat(val.data), [])}
                  const paging = {tagged_paging: results[0].paging, uploaded_paging: results[1].paging}
                  return res.json({images: photos, paging: paging})
                }
                return res.send(401).json({error: `You haven't authenticated with Facebook yet.`})
              case 'instagram':
                if (req.session.user.instagram.access_token) {
                  const ig = new InstagramApi(req.session.user.instagram.access_token)
                  // await ig.userMedia('self', paging)
                  const response = await ig.userMedia()
                  return res.json({images: response.body, paging: response.paging})
                }
                return res.send(401).json({error: `You haven't authenticated with Instagram yet.`})
              case 'pinterest':
                return res.sendStatus(404)
            }
        }
        break

      case 'relationships':
        const relationship  = new Relationships({postgres: postgres, path: info})
        const record        = await relationship.getByPath()

        switch(command) {
          case 'get':
            return res.json({relationship: record})

          case 'get_images':
            const images = await relationship.getImages()
            return res.json(images)

          case 'get_milestones':
            const milestones = await relationship.getMilestones()
            return res.json(milestones)

          case 'create':
            if (record)
              return res.json({error: 'Unfortunately this relationship path has already been created.'}).status(400)

            const newRecord         = Object.assign(body.relationship, {user_id: auth.getLoggedInUsersId()})
            const newRelationshipId = await relationship.create(newRecord)
            return res.json({id: newRelationshipId})

          case 'update':
            const existingRelationshipId = await relationship.update(body.relationship)
            return res.json({id: existingRelationshipId})

          case 'update_picture':
            await relationship.updatePicture({image_taken: body.image_taken}, body.id)
            return res.sendStatus(200)

          case 'delete_picture':
            // The 'info' piece of the URL will come across as '/<ID>', so
            // need to strip off the initial backslash
            await relationship.deletePicture(parseInt(info.slice(1)))
            return res.sendStatus(200)

          case 'update_milestone':
            const newMilestone  = body.milestone
            let milestoneId     = newMilestone.id

            milestoneId = await relationship.updateMilestone(newMilestone, milestoneId, record.id)
            return res.json({id: milestoneId})

          case 'delete_milestone':
            // The 'info' piece of the URL will come across as '/<ID>', so
            // need to strip off the initial backslash
            await relationship.deleteMilestone(parseInt(info.slice(1)))
            return res.sendStatus(200)

          case 'file_upload':
            if (!auth.isLoggedIn())
              return res.status(400).json({error: 'You must be logged in to upload files so we know who owns them!'})
            if (!record)
              return res.status(400).json({error: 'You need to log in and create this relationship before uploading pictures.'})

            const imageHelpers = new ImageHelpers()

            const convertImageUrl = obj => {
              const type = obj.type
              switch (type) {
                case 'facebook':
                  return obj.images[0].source
                case 'instagram':
                  return obj.images['standard_resolution'].url
              }
            }

            const uploadFiles = async (imageType, imageTypeUid, imageUrlorFilePath, imageTakenTime=null, fileName=null) => {
              const imageFileTypes    = ['.gif', '.jpg', '.jpeg', '.png']
              // const fileNameFromUrl   = imageUrlorFilePath.split('/').filter(piece => imageFileTypes.filter(ext => piece.indexOf(ext) > -1).length > 0)[0] + '.jpg'
              fileName                = fileName  || `uploaded_picture_${imageType}.jpg`
              const {lwipImg, exif}   = (imageType === 'upload')
                                        ? await imageHelpers.rotateImagePerExifOrientation('fs', imageUrlorFilePath) //filePath)
                                        : await imageHelpers.rotateImagePerExifOrientation('url', imageUrlorFilePath) //imageUrl)

              const newImageBuffer    = await imageHelpers.toBuffer(lwipImg, 'jpg')    //ImageHelpers.getImageTypeFromFile(fileName))
              const [w, h]            = await imageHelpers.dimensions(lwipImg)
              const orientation       = (w / h > 1) ? 'landscape' : 'portrait'
              const dateImgModified   = imageTakenTime || ((exif && exif.image && exif.image.ModifyDate) ? moment.utc(exif.image.ModifyDate, 'YYYY:MM:DD HH:mm:ss').toDate() : null)

              const [mainS3FileName, smallerS3FileName, tinyS3FileName] = await Promise.all([
                s3.writeFile({filename: fileName, data: newImageBuffer}),
                imageHelpers.uploadSmallImageFromSource({jpg: true, filename: fileName, data: newImageBuffer, size: 400}),
                imageHelpers.uploadSmallImageFromSource({jpg: true, filename: fileName, data: newImageBuffer, size: 150}),
              ])

              const { rows } = await postgres.query(`
                insert into relationships_images (relationships_id, image_type, image_type_uid, main_image_name, small_image_name, tiny_image_name, orientation, image_taken)
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning id
              `, [record.id, imageType, imageTypeUid, mainS3FileName.filename, smallerS3FileName.filename, tinyS3FileName.filename, orientation, dateImgModified])
              const newPictureId = rows[0].id

              return {
                id:                 newPictureId,
                main_image_name:    mainS3FileName.filename,
                small_image_name:   smallerS3FileName.filename,
                tiny_image_name:    tinyS3FileName.filename,
                orientation:        orientation,
                image_taken:        dateImgModified,
                created_at:         new Date()
              }
            }

            const userId = auth.getLoggedInUsersId()
            let pictures, fileInfo, fileName, filePath, fileType, imageType, imageTypeUid, imageUrl
            if (body.file) {
              fileInfo  = body.file
              fileName  = fileInfo.name
              filePath  = fileInfo.path
              fileType  = fileInfo.type
              imageType = 'upload'
              pictures = await uploadFiles(imageType, null, filePath, null, fileName)

            } else {
              pictures = await Promise.all(
                body.images.map(async img => {
                  const url = convertImageUrl(img)
                  const createdTime = (img.type == 'instagram') ? moment.utc(parseInt(img.created_time) * 1000).toDate() : moment.utc(img.created_time).toDate()
                  return await uploadFiles(img.type, img.id, url, createdTime)
                })
              )
            }

            return res.json(pictures)

        }
        break
    }

    res.sendStatus(404)

  } catch(err) {
    log.error(`Error`, err)
    res.status(500).json({error: err})
  }
}
