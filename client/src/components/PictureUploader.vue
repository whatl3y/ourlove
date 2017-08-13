<template lang="pug">
  b-card.dark.thick-2x
    div.row
      div.col-sm-12.col-md-3
        b-list-group
          b-list-group-item.clicker(:class="{ active: isActiveTab('upload') }")
            a(href="javascript:void(0)",@click="setActiveTab('upload')") Upload Images
          b-list-group-item.clicker(:class="{ active: isActiveTab('facebook') }")
            a(href="javascript:void(0)",@click="setActiveTab('facebook')") Facebook Images
          b-list-group-item.clicker(:class="{ active: isActiveTab('instagram') }")
            a(href="javascript:void(0)",@click="setActiveTab('instagram')") Instagram Images
      div.col
        div(v-if="isActiveTab('upload')")
          div.text-center(v-if="pictureLoading")
            i.fa.fa-4x.fa-spinner.fa-spin
          div(v-if="!pictureLoading")
            h3 Upload New Images
            dropzone#relationship-pictures(ref="relationship-pictures",acceptedFileTypes="image/*",:clickable="true",:language="{dictDefaultMessage:'<br>Click or drag images here to upload them!'}",:url="'/api/v1.0/relationships/file_upload/' + id",@vdropzone-success="successfullyAddedPicture")
        div.text-center.loading-container(v-if="pictureLoading")
          i.fa.fa-4x.fa-spinner.fa-spin
        div.col(v-if="!pictureLoading")
          div(v-if="isActiveTab('facebook')")
            div(v-if="hasIntegration('facebook')")
              h3 Use Facebook Images
              div.text-center
                b-button(@click="getIntegrationImages") Get More Images
                b-button.btn-ourlove.margin-left-sm(v-if="selectedIntImages.length > 0",@click="saveSelectedImages") Save Selected Images
              div.d-flex.flex-row.flex-wrap.justify-content-center(v-if="integrationsImageFetchMap.facebook.images.length > 0")
                  b-card.card-sm-padding.image.margin-sm.clicker(v-for="(img, index) in integrationsImageFetchMap.facebook.images",:key="img.id",:class="{ selected: isIntegrationImageAdded(img, 'facebook') }",@click.native="addIntegrationImage(img, 'facebook')")
                    div.row
                      h5.col {{ index+1 }}
                      h5.col.text-right
                        i.fa(:class="{ 'fa-minus-circle': isIntegrationImageAdded(img, 'facebook'), 'fa-plus-circle': !isIntegrationImageAdded(img, 'facebook') }")
                    circular-image(:img="img.images[0]",:orientation="(getLandscapeOrPortrait(img.images[0].width, img.images[0].height, 'landscape')) ? 'landscape' : 'portrait'",:size="60")
                    div.text-center(style="font-size:8px;") {{ getFormattedDate(img.created_time) }}
            div(v-if="!hasIntegration('facebook')")
              i You haven't integrated with Facebook yet. &nbsp;
              a(href="/oauth/facebook")
                i Click here
              span &nbsp;to be able to pull down your facebook images.
          div(v-if="isActiveTab('instagram')")
            div(v-if="hasIntegration('instagram')")
              h3 Use Instagram Images
              div.text-center
                b-button(@click="getIntegrationImages") Get More Images
                b-button.btn-ourlove.margin-left-sm(v-if="selectedIntImages.length > 0",@click="saveSelectedImages") Save Selected Images
              div.d-flex.flex-row.flex-wrap.justify-content-center(v-if="integrationsImageFetchMap.instagram.images.length > 0")
                  b-card.card-sm-padding.image.margin-sm.clicker(v-for="(img, index) in integrationsImageFetchMap.instagram.images",:key="img.id",:class="{ selected: isIntegrationImageAdded(img, 'instagram') }",@click.native="addIntegrationImage(img, 'instagram')")
                    div.row
                      h5.col {{ index+1 }}
                      h5.col.text-right
                        i.fa(:class="{ 'fa-minus-circle': isIntegrationImageAdded(img, 'instagram'), 'fa-plus-circle': !isIntegrationImageAdded(img, 'instagram') }")
                    circular-image(:img="img.images.standard_resolution",:orientation="(getLandscapeOrPortrait(img.images.standard_resolution.width, img.images.standard_resolution.height, 'landscape')) ? 'landscape' : 'portrait'",:size="60")
                    - //div.img-thumbnail.border-only.dark-border.force-circle.w-60.margin-sm
                    - //  img(:class="{ portrait: getLandscapeOrPortrait(img.images.standard_resolution.width, img.images.standard_resolution.height, 'portrait'), landscape: getLandscapeOrPortrait(img.images.standard_resolution.width, img.images.standard_resolution.height, 'landscape') }",:src="img.images.standard_resolution.url")
                    div.text-center(style="font-size:8px;") {{ getFormattedDate(img.created_time, true) }}
            div(v-if="!hasIntegration('instagram')")
              i You haven't integrated with Instagram yet. &nbsp;
              a(href="/oauth/instagram")
                u Click here
              span &nbsp;to be able to pull down your instagram images.
</template>

<script>
  import moment from 'moment'
  import CircularImage from './CircularImage'
  import AuthFactory from '../factories/Auth'
  import IntegrationsFactory from '../factories/Integrations'

  export default {
    props: ['id'],
    data() {
      return {
        activeTab: 'upload',
        integrations: [],
        integrationsImageFetchMap: {},
        pictureLoading: false,
        selectedIntImages: []
      }
    },

    methods: {
      getFormattedDate(timestamp, isUnixTimestamp=false, format="MMMM Do, YYYY") {
        if (isUnixTimestamp)
          return moment.utc(parseInt(timestamp * 1000)).format(format)
        return moment.utc(timestamp).format(format)
      },

      async getIntegrationImages(whichDirection='next') {
        this.pictureLoading = true

        const pagingToken = (this.integrationsImageFetchMap[this.activeTab]) ? this.integrationsImageFetchMap[this.activeTab].paging : null
        const response = await IntegrationsFactory.getImages(this.activeTab, pagingToken)
        this.setInternalIntegrationImageFetchState(response, this.activeTab)

        this.pictureLoading = false
      },

      getLandscapeOrPortrait(width, height, typeToConfirm) {
        return (width > height) ? typeToConfirm == 'landscape' : typeToConfirm == 'portrait'
      },

      hasIntegration(type) {
        return this.integrations.filter(i => i == type).length > 0
      },

      isActiveTab(type) {
        return this.activeTab == type
      },

      async setActiveTab(type) {
        this.activeTab = type

        const integrationTypes = ['facebook', 'instagram', 'pinterest']
        if (integrationTypes.indexOf(this.activeTab) > -1 && this.hasIntegration(this.activeTab))
          await this.getIntegrationImages()
      },

      addIntegrationImage(image, type) {
        const existsAlready = this.isIntegrationImageAdded(image, type)
        if (existsAlready)
          this.selectedIntImages.splice(this.selectedIntImages.indexOf(image), 1)
        else
          this.selectedIntImages.push(Object.assign(image, {type: type}))
      },

      isIntegrationImageAdded(image, type) {
        return this.selectedIntImages.filter(i => i.type == type && i.id == image.id).length > 0
      },

      async saveSelectedImages() {
        try {
          this.pictureLoading = true
          const response = await IntegrationsFactory.uploadPictures(this.id, this.selectedIntImages)
          this.$emit('success', null, response)
          this.selectedIntImages = []
          this.pictureLoading = false

        } catch (err) {
          console.log('error uploading integration images', err)
        }
      },

      setInternalIntegrationImageFetchState(responseData, type) {
        this.integrationsImageFetchMap[type] = this.integrationsImageFetchMap[type] || {}

        let uniqueImageIdMap = {}
        const uniqueImages = responseData.images.data.filter(img => {
          if (uniqueImageIdMap[img.id]) return false
          uniqueImageIdMap[img.id] = true
          return true
        })

        switch (type) {
          case 'facebook':
            this.integrationsImageFetchMap[type].images = uniqueImages
            this.integrationsImageFetchMap[type].paging = responseData.paging
            break
          case 'instagram':
            this.integrationsImageFetchMap[type].images = uniqueImages
            this.integrationsImageFetchMap[type].paging = responseData.paging
            break
        }
      },

      successfullyAddedPicture(file, response) {
        this.$refs['relationship-pictures'].removeAllFiles()
        this.$emit('success', file, response)
        this.pictureLoading = false
      }
    },

    async created() {
      const info = await AuthFactory.getIntegrations()
      this.integrations = info.integrations
    },

    components: {
      'circular-image': CircularImage
    }
  }
</script>

<style scoped>
  .card.clicker:not(.selected):hover {
    background: #f5f5f5;
  }

  .card.clicker.selected {
    background: #21b729;
    color: #ffffff;
  }
</style>
