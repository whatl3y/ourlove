<template lang="pug">
  div.container.relationship-container
    div.text-center.create-relationship-container(v-if="relationshipStatus('loading')")
      i.fa.fa-4x.fa-spinner.fa-spin

    - // --------------------------------------
    - // OPEN PAGE, I.E. NOT POPULATED YET
    div.col.create-relationship-container(v-if="relationshipStatus('none')")
      div.text-center(v-if="!isLoggedIn")
        h1.display-1 {{ relationship_id }}
        h3.display-3 is available!
        div Login today by clicking on one of the providers below to create your page now!
        div.margin-vertical-xlg
          a(href="/oauth/facebook")
            i.fa.fa-5x.fa-facebook-square(aria-hidden="true")
          a(href="/oauth/instagram")
            i.fa.fa-5x.fa-instagram.margin-left-md(aria-hidden="true")
          a(href="/oauth/pinterest")
            i.fa.fa-5x.fa-pinterest-square.margin-left-md(aria-hidden="true")
      div(v-if="isLoggedIn")
        div.text-center
          h1.display-1 {{ relationship_id }}
          h3 Create Relationship
        div.col.col-md-6.offset-md-3
          label First Person's Name
          b-form-input(v-model="newRelationship.p1name")
          label Second Person's Name
          b-form-input(v-model="newRelationship.p2name")
          label Relationship Start Date
          datepicker(format="MMMM dd, yyyy",:bootstrap-styling="true",v-model="startDate",v-on:closed="dateChanged")
          label Optional: Married Date
          datepicker(format="MMMM dd, yyyy",:bootstrap-styling="true",v-model="marriedDate",v-on:closed="dateChanged")
          div.text-center.padding-md
            b-button.btn-ourlove-dark(size="lg",v-on:click="createRelationship()") Create Relationship Page
    - // --------------------------------------

    - // --------------------------------------
    - // ALREADY POPULATED PAGE
    div.col.text-center.valid-relationship-container(v-if="relationshipStatus('valid')")
      h1 {{ relationship.person1_name }} &amp; {{ relationship.person2_name }}
      div(v-if="relationship.relationship_started")
        div You've been together for {{ dynamicTimes.secondsSinceStartDate }} seconds
        div or {{ dynamicTimes.minutesSinceStartDate }} minutes
        div or {{ dynamicTimes.daysSinceStartDate }} days
        div or {{ dynamicTimes.weeksSinceStartDate }} weeks
        div or {{ dynamicTimes.monthsSinceStartDate }} months
        div or {{ dynamicTimes.yearsSinceStartDate }} years
      div.col.col-md-6.offset-md-3
        dropzone#relationship-pictures(:url="'/api/v1.0/relationships/file_upload/' + relationship_id",v-on:vdropzone-success="showSuccessAddedPicture")
</template>

<script>
import moment from 'moment'
import AuthFactory from '../factories/Auth'
import RelationshipsFactory from '../factories/Relationships'

export { Relationship as default }

const Relationship = {
  name: 'relationship',
  props: ['relationship_id'],
  data() {
    return {
      loading: true,
      isLoggedIn: false,
      toastMessage: null,
      mainTimingInterval: null,
      newRelationship: {},
      startDate: null,
      marriedDate: null,
      relationship: null,
      dynamicTimes: {
        secondsSinceStartDate: null,
        minutesSinceStartDate: null,
        daysSinceStartDate: null,
        weeksSinceStartDate: null,
        monthsSinceStartDate: null,
        yearsSinceStartDate: null,
        secondsSinceMarriedDate: null,
        minutesSinceMarriedDate: null,
        daysSinceMarriedDate: null
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

    dateChanged() {
      this.newRelationship = Object.assign({}, this.newRelationship, {
        startDate: (this.startDate) ? moment(this.startDate).format('YYYY-MM-DD') : null,
        marriedDate: (this.marriedDate) ? moment(this.marriedDate).format('YYYY-MM-DD') : null
      })
    },

    showSuccessAddedPicture(file) {
      this.openSnackbar('Successfully added picture!')
    },

    relationshipStatus(which) {
      if (this.loading)
        return which == 'loading'

      if (this.relationship_id && this.relationship)
        return which == 'valid'

      return which == 'none'
    },

    async createRelationship() {
      try {
        const response = await RelationshipsFactory.create(this.relationship_id, this.newRelationship)
        await this.getRelationship(response.id)
        this.openSnackbar('Successfully created relationship!')
      } catch(err) {
        this.openSnackbar('There was a problem creating your relationship.', 'error')
        console.log('error creating', err)
      }
    },

    async getRelationship(relaId=this.relationship_id) {
      this.loading = true
      const data = await RelationshipsFactory.get(relaId)
      this.relationship = data.relationship

      if (this.relationship && !this.mainTimingInterval) {
        this.updateRelationshipTime()
        this.mainTimingInterval = setInterval(() => this.updateRelationshipTime(), 500)
      }

      this.loading = false
    },

    updateRelationshipTime() {
      if (this.relationship.relationship_started) {
        this.dynamicTimes.secondsSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'seconds')
        this.dynamicTimes.minutesSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'minutes')
        this.dynamicTimes.daysSinceStartDate    = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'days')
        this.dynamicTimes.weeksSinceStartDate   = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'weeks')
        this.dynamicTimes.monthsSinceStartDate  = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'months')
        this.dynamicTimes.yearsSinceStartDate   = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'years')
      }

      if (this.relationship.relationship_married)
        this.dynamicTimes.secondsSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'seconds')
        this.dynamicTimes.minutesSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'minutes')
        this.dynamicTimes.daysSinceMarriedDate    = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'days')
        this.dynamicTimes.weeksSinceMarriedDate   = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'weeks')
        this.dynamicTimes.monthsSinceMarriedDate  = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'months')
        this.dynamicTimes.yearsSinceMarriedDate   = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'years')
    }
  },

  async created() {
    const responses = await Promise.all([
      AuthFactory.isLoggedIn(),
      AuthFactory.setReturnTo(this.relationship_id),
      this.getRelationship()
    ])
    this.isLoggedIn = responses[0]
  }
}
</script>
