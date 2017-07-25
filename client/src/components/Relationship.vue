<template>
  <md-layout md-align="center" class="main-wrapper relationship-container">

    <md-layout v-if="relationshipStatus('loading')" md-row md-align="center" class="create-relationship-container">
      <md-spinner md-indeterminate></md-spinner>
    </md-layout>

    <md-layout v-if="relationshipStatus('none')" md-column md-flex-medium="75" md-flex-large="50" class="text-center create-relationship-container">
      <div class="md-display-2">Create Relationship!</div>
      <md-layout>
        <md-layout md-column>
          <md-input-container>
            <label>First Person's Name</label>
            <md-input v-model="newRelationship.p1name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Second Person's Name</label>
            <md-input v-model="newRelationship.p2name"></md-input>
          </md-input-container>
          <md-input-container>
            <label>Relationship Start Date</label>
            <md-input v-model="newRelationship.startDate"></md-input>
            <datepicker style="width:100%" v-model="startDate" v-on:closed="dateChanged"></datepicker>
          </md-input-container>
          <md-input-container>
            <label>Optional: Married Date</label>
            <md-input v-model="newRelationship.marriedDate"></md-input>
            <datepicker style="width:100%" v-model="marriedDate" v-on:closed="dateChanged"></datepicker>
          </md-input-container>
          <md-layout md-align="center">
            <md-button v-on:click="createRelationship()" class="md-raised md-primary">Create Relationship Page</md-button>
          </md-layout>
        </md-layout>
      </md-layout>
    </md-layout>

    <md-layout v-if="relationshipStatus('valid')" md-column md-vertical-align="center" class="valid-relationship-container">
      <div class="md-display-2">{{ relationship.person1_name }} &amp; {{ relationship.person2_name }}</div>
      <div v-if="relationship.relationship_started" md-column md-vertical-align="center">
        <div>You've been together for {{ dynamicTimes.secondsSinceStartDate }} seconds</div>
        <div>or {{ dynamicTimes.minutesSinceStartDate }} minutes</div>
        <div>or {{ dynamicTimes.daysSinceStartDate }} days</div>
        <div>or {{ dynamicTimes.weeksSinceStartDate }} weeks</div>
        <div>or {{ dynamicTimes.monthsSinceStartDate }} months</div>
        <div>or {{ dynamicTimes.yearsSinceStartDate }} years</div>
      </div>
      <md-layout md-column md-flex>
        <dropzone id="relationship-pictures" :url="'/api/v1.0/relationships/file_upload/' + relationship_id" v-on:vdropzone-success="showSuccess">
          <!-- Optional parameters if any! -->
          <input type="hidden" name="token" value="">
        </dropzone>
      </md-layout>
    </md-layout>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="4000">
      <span>{{ toastMessage }}</span>
    </md-snackbar>
  </md-layout>
</template>

<script>
import moment from 'moment'
import Relationships from '../factories/Relationships'

export { Relationship as default }

const Relationship = {
  name: 'relationship',
  props: ['relationship_id'],
  data() {
    return {
      loading: true,
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
      this.toastMessage = message
      this.$refs.snackbar.open()
    },

    dateChanged() {
      this.newRelationship = Object.assign({}, this.newRelationship, {
        startDate: (this.startDate) ? moment(this.startDate).format('YYYY-MM-DD') : null,
        marriedDate: (this.marriedDate) ? moment(this.marriedDate).format('YYYY-MM-DD') : null
      })
    },

    showSuccess(file) {
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
        const response = await Relationships.create(this.relationship_id, this.newRelationship)
        await this.getRelationship(response.id)
        this.openSnackbar('Successfully created relationship!')
      } catch(err) {
        this.openSnackbar(`There was a problem creating your relationship.`, 'error')
        console.log('error creating', err)
      }
    },

    async getRelationship(relaId=this.relationship_id) {
      this.loading = true
      const data = await Relationships.get(relaId)
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
    await this.getRelationship()
  }
}
</script>
