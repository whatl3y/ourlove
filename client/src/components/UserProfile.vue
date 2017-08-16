<template lang="pug">
  div.container.margin-top-sm
    div.text-center.create-relationship-container(v-if="loading")
      i.fa.fa-4x.fa-spinner.fa-spin

    div(v-if="!loading")
      h1 {{ user.name || 'User Profile' }}
      div.row
        div.col-sm-12.col-md
          div.d-flex.flex-column.align-items-center.settings-wrapper
            h4 Profile Picture
            b-popover(placement="left",content="Click to update profile picture.",:triggers="['hover']")
              circular-image.clicker.profile-pic(:img="{main_image_name: newProfilePicture || user.profile_picture}",:size="300")
              dropzone#profile-picture-change.hidden-xs-up(ref="profile-picture-change",acceptedFileTypes="image/*",clickable=".profile-pic",url="/api/v1.0/auth/profile_picture_upload",:language="{dictDefaultMessage:'<br>Drag images here to upload them!'}",@vdropzone-success="successfullyUploadedPicture")
            div.d-flex.flex-column.justify-content-center
              form-required-input(v-model="user.name",label="Your Name")
              form-required-input(v-model="user.primary_email",label="Your Primary Email Address")
              div.text-center
                b-button.btn-ourlove-dark(@click="saveSettings") Save Info
        div.col-sm-12.col-md
          b-card
            div.card-text
              h3 Relationships You Manage
              relationship-list(:relationships="relationships")
</template>

<script>
  import RelationshipList from './RelationshipList'
  import AuthFactory from '../factories/Auth'
  import ImageHelpers from '../factories/ImageHelpers'

  export default {
    data() {
      return {
        loading: true,
        isLoggedIn: false,
        user: null,
        relationships: null,
        newProfilePicture: null
      }
    },

    methods: {
      getImageSrc: ImageHelpers.getImageSrc,

      openSnackbar(message, type='success') {
        const functionTypeMap = {
          success:  's',
          error:    'e'
        }
        return this.$root.$refs.toastr[functionTypeMap[type] || 's'](message)
      },

      successfullyUploadedPicture(file, response) {
        this.newProfilePicture = response.profile_picture
      },

      async saveSettings() {
        if (!(this.user.name && this.user.primary_email))
          return this.openSnackbar('Make sure you have entered a name and primary email address at a minimum.', 'error')

        await AuthFactory.updateUser({
          name:           this.user.name,
          primary_email:  this.user.primary_email
        })
        this.openSnackbar('Successfully updated user info!')
      }
    },

    async created() {
      const responses = await Promise.all([
        AuthFactory.getUserLoggedIn(),
        AuthFactory.getAllRelationships()
      ])
      this.user = responses[0]
      this.relationships = responses[1]
      this.loading = false
      if (!this.user)
        return location.href = '/'
    },

    components: {
      'relationship-list': RelationshipList
    }
  }
</script>

<style scoped>
  .profile-pic:hover {
    border: 5px solid;
  }

  .settings-wrapper > div {
    margin-bottom: 10px;
  }
</style>
