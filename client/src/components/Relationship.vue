<template lang="pug">
  div.col.valid-relationship-container.margin-top-sm
    div.row(v-if="isRelationshipAdmin")
      div.col
        strong.clicker(v-show="editMode",@click="updateEditMode") Relationship Edit Mode
      div.col-2.text-right
        a.gray(href="javascript:void(0)",@click="updateEditMode")
          i.fa.fa-gear
    div.row.sm-gutters(v-if="!editMode")
      div.col-lg-4.d-flex.flex-column.align-items-center
        div(v-if="!primaryImage")
          div
            i You don't have any pictures yet!
            span(v-if="isRelationshipAdmin") Add some by &nbsp;
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
        count-up-min.margin-top-xlg(:timestamp="relationship.relationship_married",title="They got married")
      hr.col-12.margin-top-lg
      div.col-12(v-if="nonPrimaryImages.length >= 20")
        div.d-flex.flex-row.flex-wrap.justify-content-center
          circular-image(v-for="image in nonPrimaryImages",:key="image.id",:img="image",:size="100")
      div.col-12(v-if="formattedRelationshipMilestones.length > 0")
        h1 Events &amp; Milestones
        timeline(:events="formattedRelationshipMilestones")
    div(v-if="editMode")
      b-tabs(card,ref="edit-tabs",v-model="editTabIndex")
        b-tab(title="Main Info")
          div.row
            div.col-md-6.offset-md-3
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
        b-tab(title="Relationship Pictures")
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
                  div.text-center
                    - //b-button.margin-right-sm(size="sm",@click="updatePicture(image)") Update
                    b-button(size="sm",variant="danger",@click="deletePicture(image.id)") Delete
        b-tab(title="Events &amp; Milestones")
          milestone-editor(:id="id",:milestones="relationshipMilestones",:images="relationshipImages",@successUpdate="milestoneAddedOrUpdated",@successDelete="milestoneDeleted")
        b-tab(title="Reminders")
        - //b-tab(title="Diary")
</template>

<script>
  import moment from 'moment'
  import CircularImage from './CircularImage'
  import CountUpHorizontal from './CountUpHorizontal'
  import CountUpMinimal from './CountUpMinimal'
  import MilestoneEditor from './MilestoneEditor'
  import PictureUploader from './PictureUploader'
  import AuthFactory from '../factories/Auth'
  import RelationshipsFactory from '../factories/Relationships'
  import ImageHelpers from '../factories/ImageHelpers'
  import TimeHelpers from '../factories/TimeHelpers'

  export { Relationship as default }

  const Relationship = {
    name: 'relationship',
    props: ['id', 'relationship'],
    data() {
      return {
        isRelationshipAdmin:      false,
        editMode:                 false,
        editTabIndex:             0,
        relationshipImages:       [],
        primaryImage:             null,
        nonPrimaryImages:         [],
        formattedRelationshipMilestones: [],
        relationshipMilestones:   []
      }
    },

    methods: {
      openSnackbar(message, type='success') {
        const functionTypeMap = {
          success:  's',
          error:    'e'
        }
        return this.$root.$refs.toastr[functionTypeMap[type] || 's'](message)
      },

      getImageSrc: ImageHelpers.getImageSrc,

      updateEditMode() {
        this.editMode = !this.editMode
      },

      successfullyAddedPicture(file, response) {
        if (response instanceof Array)
          this.relationshipImages = this.relationshipImages.concat(response)
        else
          this.relationshipImages.push(response)
        this.openSnackbar('Successfully added picture!')
        this.setAllImages()
      },

      getEstablishedOutput(timestamp) {
        return moment.utc(timestamp).format('MMMM YYYY')
      },

      getFormattedDate: TimeHelpers.getFormattedDate,

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

      async updatePicture(image, clear=false) {
        try {
          if (clear || image.image_taken) {
            const response = await RelationshipsFactory.updatePictureTakenDate(image.id, image.image_taken)
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
        this.relationshipMilestones.push(milestone)
        this.setMilestones()
        this.openSnackbar('Successfully updated milestone!')
      },

      milestoneDeleted(milestoneId) {
        this.relationshipMilestones = this.relationshipMilestones.filter(m => m.id != milestoneId)
        this.setMilestones()
        this.openSnackbar('Successfully deleted milestone!')
      }
    },

    async created() {
      const responses = await Promise.all([
        AuthFactory.isRelationshipAdmin(this.id),
        RelationshipsFactory.getImages(this.id),
        RelationshipsFactory.getMilestones(this.id)
      ])

      this.isRelationshipAdmin    = responses[0]
      this.relationshipImages     = responses[1]
      this.relationshipMilestones = responses[2]
      this.setAllImages()
      this.setMilestones()
    },

    components: {
      'circular-image': CircularImage,
      'count-up-min': CountUpMinimal,
      'count-up-hor': CountUpHorizontal,
      'milestone-editor': MilestoneEditor,
      'picture-uploader': PictureUploader
    }
  }
</script>
