export default {
  getImageSrc(image, prefix='main') {
    const externalSource = image.src || image.source || image.url
    if (externalSource)
      return externalSource

    const fileName = image[`${prefix}_image_name`] || image.main_image_name || image.medium_image_name || image.small_image_name
    return `/file/s3/${fileName}`
  }
}
