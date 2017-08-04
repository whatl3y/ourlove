<template lang="pug">
  div.col.valid-relationship-container
    div.row(v-if="isRelationshipAdmin")
      div.col
        i(v-if="editMode",@click="updateEditMode") Edit Mode
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
        div.d-flex.flex-row.flex-wrap.justify-content-center(v-if="nonPrimaryImages.length")
          div.img-thumbnail.border-only.dark-border.force-circle.w-60.margin-sm(v-for="img in nonPrimaryImages")
            img(:class="{ portrait: img.orientation == 'portrait', landscape: img.orientation == 'landscape' }",:src="getImageSrc(img, 'small')")
      hr.hidden-lg-up.col-12
      div.col(v-if="relationship.relationship_started || relationship.relationship_married")
        count-up-hor(:timestamp="relationship.relationship_started",title="Their relationship started")
        hr(v-if="relationship.relationship_married")
        count-up(minimal,:timestamp="relationship.relationship_married",title="They got married")
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
        b-tab(title="Milestones")
        b-tab(title="Reminders")
        - //b-tab(title="Diary")
</template>

<script>
  import moment from 'moment'
  import CountUpHorizontal from './CountUpHorizontal'
  import CountUpTable from './CountUpTable'
  import PictureUploader from './PictureUploader'
  import AuthFactory from '../factories/Auth'
  import RelationshipsFactory from '../factories/Relationships'

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
        nonPrimaryImages:         []
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

      getImageSrc(image, prefix='main') {
        const fileName = image[`${prefix}_image_name`] || image.main_image_name || image.medium_image_name || image.small_image_name
        return `/file/s3/${fileName}`
      },

      updateEditMode() {
        this.editMode = !this.editMode
      },

      successfullyAddedPicture(file, response) {
        this.relationshipImages.push(response)
        this.openSnackbar('Successfully added picture!')
        this.setAllImages()
      },

      getEstablishedOutput(timestamp) {
        return moment.utc(timestamp).format('MMMM YYYY')
      },

      getFormattedDate(timestamp, format="MMMM Do, YYYY") {
        return moment.utc(timestamp).format(format)
      },

      setAllImages() {
        const primaryImages   = this.relationshipImages.filter(img => img.relationship_primary_image)
        this.primaryImage     = (primaryImages.length > 0) ? primaryImages[0] : this.relationshipImages[0]
        if (this.primaryImage)
          this.nonPrimaryImages = this.relationshipImages.filter(img => img.id !== this.primaryImage.id)
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
      }
    },

    async created() {
      const responses = await Promise.all([
        AuthFactory.isRelationshipAdmin(this.id),
        RelationshipsFactory.getImages(this.id)
      ])

      this.isRelationshipAdmin  = responses[0]
      this.relationshipImages   = responses[1]
      this.setAllImages()
    },

    components: {
      'count-up': CountUpTable,
      'count-up-hor': CountUpHorizontal,
      'picture-uploader': PictureUploader
    }
  }
</script>
