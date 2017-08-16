<template lang="pug">
  div.col.valid-relationship-container
    div.text-center.create-relationship-container(v-if="isInitializing")
      i.fa.fa-4x.fa-spinner.fa-spin

    div(v-if="!isInitializing")
      div.row(v-if="isAdmin")
        div.col
          strong.clicker(v-show="editMode",@click="updateEditMode") Relationship Edit Mode
        div.col-2.text-right
          a.gray(href="javascript:void(0)",@click="updateEditMode")
            i.fa.fa-gear
      div.row.sm-gutters(v-if="!editMode")
        div.col-lg-4.d-flex.flex-column.align-items-center
          div(v-if="!primaryImage && isAdmin")
            div
              i You don't have any pictures yet!
              span(v-if="isAdmin") Add some by &nbsp;
                u
                  a(href="javascript:void(0)",@click="updateEditMode") editing your relationship
                span  and they'll show up here!
          div.d-flex.flex-column.img-thumbnail.border-only.dark-border.force-circle.w-200(v-if="primaryImage")
            img(:class="{ portrait: primaryImage.orientation == 'portrait', landscape: primaryImage.orientation == 'landscape' }",:src="getImageSrc(primaryImage, 'main')")
          div
            h1.text-center
              div.d-inline-block
                div {{ relationship.person1_name }} &amp; {{ relationship.person2_name }}
                div(v-if="relationship.relationship_started",style="font-size:10px") established {{ getEstablishedOutput(relationship.relationship_started) }}
          div.d-flex.flex-row.flex-wrap.justify-content-center(v-if="nonPrimaryImages.length > 0 && nonPrimaryImages.length < 20")
            circular-image(v-for="image in nonPrimaryImages",:key="image.id",:img="image",:size="60")
        hr.hidden-lg-up.col-12
        div.col(v-if="relationship.relationship_started || relationship.relationship_married")
          count-up-hor(:timestamp="relationship.relationship_started",title="Their relationship started")
          - //hr(v-if="relationship.relationship_married")
          count-up-min.margin-top-xlg(v-if="relationship.relationship_started",:timestamp="relationship.relationship_married",title="They got married")
          count-up-hor.margin-top-xlg(v-if="!relationship.relationship_started",:timestamp="relationship.relationship_married",title="They got married")
        hr.col-12.margin-top-lg
        div.col-12(v-if="nonPrimaryImages.length >= 20")
          div.d-flex.flex-row.flex-wrap.justify-content-center
            circular-image(v-for="image in nonPrimaryImages",:key="image.id",:img="image",:size="100")
        div.col-12(v-if="formattedRelationshipMilestones.length > 0")
          h1 Events &amp; Milestones
          zigzag-timeline(:events="formattedRelationshipMilestones")
      div(v-if="editMode")
        b-tabs(small,card,ref="edit-tabs",v-model="editTabIndex")
          b-tab(title="Main Info")
            div.row
              div.col-md-6.offset-md-3
                h2 Your Relationship URL
                b-card.margin-vertical-lg
                  div.card-text
                    div.text-right(style="font-size:9px")
                      a(href="javascript:void(0)",@click="urlChangeMode = !urlChangeMode")
                        i {{ (urlChangeMode) ? "cancel change" : "change" }}
                    div.text-center(v-if="!urlChangeMode") {{ getFullUrl() }}
                    div(v-if="urlChangeMode")
                      form-required-input(v-model="newUrl",label="New Relationshipship Page Path",placeholder="/mynewrelationshippath")
                      div.text-center
                        b-button.btn-ourlove(@click="changeRelationshipPath()") Change Page URL
                hr
                h2 Required Info
                form-required-input(v-model="relationship.person1_name",label="First Person's Name")
                form-required-input(v-model="relationship.person2_name",label="Second Person's Name")
                hr
                h2 Relationship Dates
                datepicker(label="Relationship Start Date",v-model="relationship.relationship_started")
                datepicker(label="Optional: Married Date",v-model="relationship.relationship_married")
                div.text-center.padding-md
                hr
                h2 Participant's Dates
                datepicker(:label="relationship.person1_name + `'s Birthday`",v-model="relationship.person1_birthday")
                datepicker(:label="relationship.person2_name + `'s Birthday`",v-model="relationship.person2_birthday")
                hr
                div.text-center
                  b-button.btn-ourlove-dark(size="lg",v-on:click="updateRelationship()") Update Relationship
          b-tab(title="Pictures")
            picture-uploader(:id="id",@success="successfullyAddedPicture")
            div.row.margin-top-md
              h5.col Current Images
            div.row
              div(v-if="!relationshipImages.length")
                i No images uploaded yet...
              div.col-sm-6.col-md-3.margin-bottom-md(v-if="relationshipImages.length",v-for="(image, index) in relationshipImages")
                div.card
                  div.card-img-top
                    img.img-fluid(:src="getImageSrc(image, 'small')")
                  div.card-block
                    div.card-title
                      div Image {{ index+1 }}
                      div
                        small
                          small Uploaded {{ getFormattedDate(image.created_at) }}
                    div.card-text
                      datepicker(label="Image Taken",placeholder="Select Date...",v-model="image.image_taken",@changedWithKey="updatePicture(image)")
                      b-form-checkbox#primary-image(v-model="image.relationship_primary_image",@change="updatePicture(image, true)") Is Primary Image?
                    div.text-center
                      - //b-button.margin-right-sm(size="sm",@click="updatePicture(image)") Update
                      b-button(size="sm",variant="danger",@click="deletePicture(image.id)") Delete
          b-tab(title="Milestones")
            milestone-editor(:id="id",:milestones="relationshipMilestones",:images="relationshipImages",@successUpdate="milestoneAddedOrUpdated",@successDelete="milestoneDeleted")
          b-tab(title="Reminders")
            reminder-editor(:id="id",:milestones="relationshipMilestones",:reminders="relationshipReminders",@successUpdate="relationshipsAddedOrUpdated",@successDelete="reminderDeleted")
          b-tab(title="Admin")
            relationship-admins(:admins="relationshipAdmins")
</template>

<script>
  import moment from 'moment'
  import CountUpHorizontal from './CountUpHorizontal'
  import CountUpMinimal from './CountUpMinimal'
  import MilestoneEditor from './MilestoneEditor'
  import PictureUploader from './PictureUploader'
  import ReminderEditor from './ReminderEditor'
  import RelationshipAdmins from './RelationshipAdmins'
  import AuthFactory from '../factories/Auth'
  import RelationshipsFactory from '../factories/Relationships'
  import ImageHelpers from '../factories/ImageHelpers'
  import TimeHelpers from '../factories/TimeHelpers'

  export { Relationship as default }

  const Relationship = {
    name: 'relationship',
    props: ['id', 'initEdit', 'isAdmin', 'relationship'],
    data() {
      return {
        isInitializing:           true,
        editMode:                 false,
        urlChangeMode:            false,
        newUrl:                   null,
        editTabIndex:             0,
        relationshipImages:       [],
        primaryImage:             null,
        nonPrimaryImages:         [],
        formattedRelationshipMilestones: [],
        relationshipMilestones:   [],
        relationshipAdmins:       []
      }
    },

    methods: {
      getFormattedDate: TimeHelpers.getFormattedDate,
      getImageSrc: ImageHelpers.getImageSrc,

      openSnackbar(message, type='success') {
        const functionTypeMap = {
          success:  's',
          error:    'e'
        }
        return this.$root.$refs.toastr[functionTypeMap[type] || 's'](message)
      },

      updateEditMode() {
        this.editMode = !this.editMode
      },

      async changeRelationshipPath() {
        if (!this.newUrl)
          return this.openSnackbar('Enter a new path to try and change it.', 'error')

        if (this.newUrl.indexOf('/') === 0)
          this.newUrl = this.newUrl.replace(/(\/+)(.+)/, '$2')
        const response = await RelationshipsFactory.changePagePath(this.id, this.newUrl)
        if (response.error)
          return this.openSnackbar(response.error, 'error')

        this.openSnackbar('Successfully changed path! Redirecting you to the new path now...')
        location.href = `${location.protocol}//${location.host}/${this.newUrl}/edit`
      },

      successfullyAddedPicture(file, response) {
        if (response instanceof Array) {
          response = response.map(img => {
            img.relationship_primary_image = null
            return img
          })
          this.relationshipImages = this.relationshipImages.concat(response)
        } else {
          response.relationship_primary_image = null
          this.relationshipImages.push(response)
        }
        this.openSnackbar('Successfully added picture!')
        this.setAllImages()
      },

      getEstablishedOutput(timestamp) {
        return moment.utc(timestamp).format('MMMM YYYY')
      },

      getFullUrl() {
        return `${location.protocol}//${location.host}/${this.id}`
      },

      setAllImages() {
        const primaryImages   = this.relationshipImages.filter(img => img.relationship_primary_image)
        this.primaryImage     = (primaryImages.length > 0) ? primaryImages[0] : this.relationshipImages[0]
        if (this.primaryImage)
          this.nonPrimaryImages = this.relationshipImages.filter(img => img.id !== this.primaryImage.id)
        else
          this.primaryImage = {src: '/public/images/favicon.png'}
      },

      setMilestones() {
        this.formattedRelationshipMilestones = this.relationshipMilestones.map(milestone => {
          return {
            title:        milestone.title,
            subtitle:     milestone.subtitle,
            timestamp:    milestone.milestone_time,
            body:         milestone.description,
            imageSrc:     milestone.main_image_name,
            orientation:  milestone.orientation
          }
        })
      },

      async updateRelationship() {
        try {
          const allowedKeys   = ['person1_name', 'person2_name', 'person1_birthday', 'person2_birthday', 'relationship_started', 'relationship_married']
          const dataToUpdate  = Object.keys(this.relationship).filter(key => allowedKeys.includes(key)).reduce((obj, key) => { obj[key] = this.relationship[key]; return obj }, {})
          const response      = await RelationshipsFactory.update(this.id, dataToUpdate)
          this.openSnackbar('Successfully updated relationship info!')

        } catch(err) {
          console.log('error updating relationship', err)
          this.openSnackbar('There was a problem updating your relationship.', 'error')
        }
      },

      async updatePicture(image, primaryChange=false) {
        try {
          if (image.image_taken || primaryChange) {
            const response = await RelationshipsFactory.updatePicture(image.id, {
              image_taken:                image.image_taken,
              relationship_primary_image: image.relationship_primary_image
            })

            if (primaryChange && image.relationship_primary_image) {
              this.relationshipImages = this.relationshipImages.map(i => {
                if (i.id != image.id)
                  i.relationship_primary_image = null
                return i
              })
            }

            this.openSnackbar('Successfully updated picture!')
          }

        } catch (err) {
          console.log('error updating picture', err)
          this.openSnackbar(`Error updating picture, but we're looking into it.`, 'error')
        }
      },

      async deletePicture(pictureId) {
        try {
          const response          = await RelationshipsFactory.deletePicture(pictureId)
          this.relationshipImages = this.relationshipImages.filter(i => i.id !== pictureId)
          this.setAllImages()
          this.openSnackbar('Successfully deleted picture!')

        } catch(err) {
          console.log('error deleteing picture', err)
          this.openSnackbar(`There was a problem while deleting your picture. We're aware and are looking at it.`, 'error')
        }
      },

      milestoneAddedOrUpdated(milestone) {
        if (milestone.NEW) {
          this.relationshipMilestones.splice(0, 1)
          delete(milestone.NEW)
        }
        this.relationshipMilestones.push(milestone)
        this.setMilestones()
        this.openSnackbar('Successfully updated milestone!')
      },

      milestoneDeleted(milestoneId) {
        this.relationshipMilestones = this.relationshipMilestones.filter(m => m.id != milestoneId)
        this.setMilestones()
        this.openSnackbar('Successfully deleted milestone!')
      },

      relationshipsAddedOrUpdated(reminder) {
        this.openSnackbar('Successfully updated reminder.')
      },

      reminderDeleted(reminder) {
        this.openSnackbar('Successfully deleted reminder.')
      }
    },

    async created() {
      const responses = await Promise.all([
        RelationshipsFactory.getImages(this.id),
        RelationshipsFactory.getMilestones(this.id),
        RelationshipsFactory.getReminders(this.id),
        RelationshipsFactory.getAdminUsers(this.id)
      ])

      this.relationshipImages     = responses[0]
      this.relationshipMilestones = responses[1]
      this.relationshipReminders  = responses[2]
      this.relationshipAdmins     = responses[3]
      this.setAllImages()
      this.setMilestones()

      this.isInitializing = false

      if (this.initEdit)
        this.updateEditMode()
    },

    components: {
      'count-up-min': CountUpMinimal,
      'count-up-hor': CountUpHorizontal,
      'milestone-editor': MilestoneEditor,
      'picture-uploader': PictureUploader,
      'reminder-editor': ReminderEditor,
      'relationship-admins': RelationshipAdmins
    }
  }
</script>
