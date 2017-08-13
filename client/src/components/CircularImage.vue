<template lang="pug">
  div.img-thumbnail.border-only.dark-border.force-circle.margin-sm(:class="widthClass")
    b-popover(:triggers="['hover']")
      span(slot="content")
        div
          img.img-fluid(style="max-width:200px",:src="getImageSrc(img, 'main')")
        div.text-center
          div(v-if="img.image_taken") {{ getFormattedDate(img.image_taken) }}
      img(:class="getOrientationClass(img)",:src="getImageSrc(img, 'small')")
</template>

<script>
  import ImageHelpers from '../factories/ImageHelpers'
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    props: ['img', 'orientation', 'size'],
    data() {
      const widthClass = (this.size == 100) ? `width-${this.size}` : (`w-${this.size}` || 'w-80')
      return {
        widthClass: {[widthClass]: true}
      }
    },
    methods: {
      getFormattedDate: TimeHelpers.getFormattedDate,
      getImageSrc: ImageHelpers.getImageSrc,
      getOrientationClass(img) {
        if (this.orientation)
          return {[this.orientation]: true}
        if (img.orientation)
          return {[img.orientation]: true}
        return {portrait: true}
      }
    }
  }
</script>
