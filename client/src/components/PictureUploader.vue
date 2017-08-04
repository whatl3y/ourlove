<template lang="pug">
  b-card.dark.thick-2x
    div.row
      div.col-3.col-xs-6
        b-list-group
          b-list-group-item.clicker(:class="{ active: isActiveTab('upload') }")
            a(href="javascript:void(0)",@click="setActiveTab('upload')") Upload Images
          b-list-group-item.clicker(:class="{ active: isActiveTab('facebook') }")
            a(href="javascript:void(0)",@click="setActiveTab('facebook')") Facebook Images
          b-list-group-item.clicker(:class="{ active: isActiveTab('instagram') }")
            a(href="javascript:void(0)",@click="setActiveTab('instagram')") Instagram Images
      div.col
        div(v-if="isActiveTab('upload')")
          div.text-center(v-if="pictureUploadLoading")
            i.fa.fa-4x.fa-spinner.fa-spin
          div(v-if="!pictureUploadLoading")
            h3 Upload New Images
            dropzone#relationship-pictures(ref="relationship-pictures",acceptedFileTypes="image/*",:clickable="true",:language="{dictDefaultMessage:'<br>Click or drag images here to upload them!'}",:url="'/api/v1.0/relationships/file_upload/' + id",@vdropzone-success="successfullyAddedPicture")
        div(v-if="isActiveTab('facebook')")
          div(v-if="hasIntegration('facebook')") FACEBOOK
          div(v-if="!hasIntegration('facebook')")
            i You haven't integrated with Facebook yet. &nbsp;
            a(href="/oauth/facebook")
              i Click here
            span &nbsp;to be able to pull down your facebook images.
        div(v-if="isActiveTab('instagram')")
          div(v-if="hasIntegration('instagram')") INSTAGRAM
          div(v-if="!hasIntegration('instagram')")
            i You haven't integrated with Instagram yet. &nbsp;
            a(href="/oauth/instagram")
              u Click here
            span &nbsp;to be able to pull down your instagram images.
</template>

<script>
  import AuthFactory from '../factories/Auth'
  import IntegrationsFactory from '../factories/Integrations'

  export default {
    props: ['id'],
    data() {
      return {
        activeTab: 'upload',
        integrations: [],
        pictureUploadLoading: false
      }
    },

    methods: {
      hasIntegration(type) {
        return this.integrations.filter(i => i == type).length > 0
      },

      isActiveTab(type) {
        return this.activeTab == type
      },

      async setActiveTab(type) {
        this.activeTab = type

        const integrationTypes = ['facebook', 'instagram', 'pinterest']
        if (integrationTypes.indexOf(this.activeTab) > -1) {
          const response = await IntegrationsFactory.getImages(this.activeTab)
          console.log('res', response)
        }
      },

      successfullyAddedPicture(file, response) {
        this.$refs['relationship-pictures'].removeAllFiles()
        this.$emit('success', file, response)
        this.pictureUploadLoading = false
      }
    },

    async created() {
      const info = await AuthFactory.getIntegrations()
      this.integrations = info.integrations
    }
  }
</script>
