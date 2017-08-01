<template lang="pug">
  div.col.valid-relationship-container
    div.row(v-if="isRelationshipAdmin")
      div.col
        i(v-if="editMode",@click="updateEditMode") Edit Mode
      div.col-2.text-right
        a.gray(href="javascript:void(0)",@click="updateEditMode")
          i.fa.fa-gear
    h1.text-center {{ relationship.person1_name }} &amp; {{ relationship.person2_name }}
    div.row(v-if="!editMode")
      div.col
        div main info
      div.col-md-3
        h2
          u Stats
        div(v-if="relationship.relationship_started")
          div.text-center Your relationship started:
          table.table.table-inverse.thin.two-cells
            tbody
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_started_seconds }}
                td Seconds ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_started_minutes }}
                td Minutes ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_started_days }}
                td Days ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_started_weeks }}
                td Weeks ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_started_months }}
                td Months ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_started_years }}
                td Years ago
        div(v-if="relationship.relationship_married")
          div.text-center You got married:
          table.table.table-inverse.thin.two-cells
            tbody
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_married_seconds }}
                td Seconds ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_married_minutes }}
                td Minutes ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_married_days }}
                td Days ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_married_weeks }}
                td Weeks ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_married_months }}
                td Months ago
              tr
                td.text-center
                  strong {{ relationshipDynamicTimes.relationship_married_years }}
                td Years ago
    div(v-if="editMode")
      b-tabs(card,ref="edit-tabs",v-model="editTabIndex")
        b-tab(title="Main Info")
          div.row
            div.col-md-6.offset-md-3
              form-required-input(v-model="relationship.person1_name",label="First Person's Name")
              form-required-input(v-model="relationship.person2_name",label="Second Person's Name")
              datepicker(label="Relationship Start Date",v-model="relationship.relationship_started")
              datepicker(label="Optional: Married Date",v-model="relationship.relationship_married")
              div.text-center.padding-md
                b-button.btn-ourlove-dark(size="lg",v-on:click="updateRelationship()") Update Relationship
        b-tab(title="Relationship Pictures")
          div.text-center(v-if="pictureUploadLoading")
            i.fa.fa-4x.fa-spinner.fa-spin
          div(v-if="!pictureUploadLoading")
            h3 Upload New Images
            dropzone#relationship-pictures(ref="relationship-pictures",acceptedFileTypes="image/*",:clickable="true",:language="{dictDefaultMessage:'<br>Click or drag images here to upload them!'}",:url="'/api/v1.0/relationships/file_upload/' + id",@vdropzone-success="successfullyAddedPicture")
          div.row.margin-top-md
            h5.col Current Images
          div.row
            div(v-if="!relationshipImages.length")
              i No images uploaded yet...
            div.col-sm-6.col-md-3(v-if="relationshipImages.length",v-for="image in relationshipImages")
              img.img-fluid.img-thumbnail.rounded-circle(:src="'/file/s3/' + image.small_image_name")
</template>

<script>
import moment from 'moment'
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
      pictureUploadLoading:     false,
      mainTimingInterval:       null,
      relationshipDynamicTimes: {
        relationship_started_seconds: null,
        relationship_started_minutes: null,
        relationship_started_days:    null,
        relationship_started_weeks:   null,
        relationship_started_months:  null,
        relationship_started_years:   null,
        relationship_married_seconds: null,
        relationship_married_minutes: null,
        relationship_married_days:    null,
        relationship_married_weeks:   null,
        relationship_married_months:  null,
        relationship_married_years:   null
      }
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

    updateEditMode() {
      this.editMode = !this.editMode
    },

    successfullyAddedPicture(file, response) {
      this.$refs['relationship-pictures'].removeAllFiles()
      this.relationshipImages.push(response)
      this.openSnackbar('Successfully added picture!')
      this.pictureUploadLoading = false
    },

    getTimeDifference(relationshipKey, units='days') {
      return moment.utc().diff(moment.utc(this.relationship[relationshipKey]), units)
    },

    updateTimerCountUps() {
      const units = ['seconds', 'minutes', 'days', 'weeks', 'months', 'years']
      const relationshipKeys = ['relationship_started', 'relationship_married']
      relationshipKeys.forEach(key => {
        units.forEach(unit => {
          if (this.relationship[key])
            this.relationshipDynamicTimes[`${key}_${unit}`] = this.getTimeDifference(key, unit)
        })
      })
    },

    async updateRelationship() {
      try {
        const allowedKeys   = ['person1_name', 'person2_name', 'relationship_started', 'relationship_married']
        const dataToUpdate  = Object.keys(this.relationship).filter(key => allowedKeys.includes(key)).reduce((obj, key) => { obj[key] = this.relationship[key]; return obj }, {})
        const response      = await RelationshipsFactory.update(this.id, dataToUpdate)
        this.openSnackbar('Successfully updated relationship info!')

      } catch(err) {
        console.log('error updating relationship', err)
        this.openSnackbar('There was a problem updating your relationship.', 'error')
      }
    }
  },

  async created() {
    this.updateTimerCountUps()
    this.mainTimingInterval = setInterval(() => this.updateTimerCountUps(), 500)

    const responses = await Promise.all([
      AuthFactory.isRelationshipAdmin(this.id),
      RelationshipsFactory.getImages(this.id)
    ])

    this.isRelationshipAdmin  = responses[0]
    this.relationshipImages   = responses[1]
  }
}
</script>

<style scoped>
.table.thin td {
  padding: 2px !important;
}

.table.two-cells td {
  width: 50%;
}
</style>
