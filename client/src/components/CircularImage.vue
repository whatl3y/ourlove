<template lang="pug">
  div.img-thumbnail.border-only.dark-border.force-circle.margin-sm(:class="widthClass")
    b-popover(:triggers="['hover']")
      span(slot="content")
        div
          img.img-fluid(style="max-width:200px",:src="getImageSrc(img, 'main')")
        div.text-center
          div(v-if="img.image_taken") {{ getFormattedDate(img.image_taken) }}
      img(:class="{ portrait: img.orientation != 'landscape', landscape: img.orientation == 'landscape' }",:src="getImageSrc(img, 'small')")
</template>

<script>
export default {
  props: ['img', 'size'],
  data() {
    const widthClass = (this.size == 100) ? `width-${this.size}` : (`w-${this.size}` || 'w-80')
    return {
      widthClass: {[widthClass] : true}
    }
  },
  methods: {
    getImageSrc(image, prefix='main') {
      const fileName = image[`${prefix}_image_name`] || image.main_image_name || image.medium_image_name || image.small_image_name
      return `/file/s3/${fileName}`
    }
  }
}
</script>
