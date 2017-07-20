<template>
  <md-layout md-gutter class="relationship-container">

    <md-layout v-if="relationshipStatus('loading')" md-row md-align="center" class="create-relationship-container">
      <md-spinner md-indeterminate></md-spinner>
    </md-layout>

    <md-layout v-if="relationshipStatus('none')" md-row md-align="center" class="create-relationship-container">
      <md-layout md-column md-flex md-flex-medium="50" md-flex-large="40" md-flex-xlarge="20">
        <h1 class="md-display-2">Create Relationship!</h1>
        <md-layout>
          <md-input-container>
            <label>First Person's Name</label>
            <md-input v-model="newRelationship.p1name"></md-input>
          </md-input-container>
        </md-layout>
        <md-layout>
          <md-input-container>
            <label>Second Person's Name</label>
            <md-input v-model="newRelationship.p2name"></md-input>
          </md-input-container>
        </md-layout>
        <md-layout>
          <md-input-container>
            <label>Relationship Start Date</label>
            <md-input v-model="newRelationship.startDate"></md-input>
          </md-input-container>
        </md-layout>
        <md-layout>
          <md-input-container>
            <label>Optional: Married Date</label>
            <md-input v-model="newRelationship.marriedDate"></md-input>
          </md-input-container>
        </md-layout>
        <md-layout md-align="center">
          <md-button v-on:click="createRelationship()" class="md-raised md-primary">Create Relationship Page</md-button>
        </md-layout>
      </md-layout>
    </md-layout>

    <md-layout v-if="relationshipStatus('valid')" md-column md-vertical-align="center" class="valid-relationship-container">
      <h1 class="md-display-2">{{ relationship.person1_name }} &amp; {{ relationship.person2_name }}</h1>
      <div v-if="relationship.relationship_started" md-column md-vertical-align="center">
        <div>You've been together for {{ dynamicTimes.secondsSinceStartDate }} seconds</div>
        <div>or {{ dynamicTimes.minutesSinceStartDate }} minutes</div>
        <div>or {{ dynamicTimes.daysSinceStartDate }} days</div>
        <div>or {{ dynamicTimes.weeksSinceStartDate }} weeks</div>
        <div>or {{ dynamicTimes.monthsSinceStartDate }} months</div>
        <div>or {{ dynamicTimes.yearsSinceStartDate }} years</div>
      </div>
    </md-layout>

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
      newRelationship: {},
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
    relationshipStatus(which) {
      if (this.loading)
        return which == 'loading'

      if (this.relationship_id && this.relationship)
        return which == 'valid'

      return which == 'none'
    },

    async createRelationship() {
      try {
        await Relationships.create(this.relationship_id, this.newRelationship)
        // TODO add snackbar for success
      } catch(err) {
        // TODO add snackbar for error
      }
    },

    updateRelationshipTime() {
      if (this.relationship.relationship_started) {
        this.dynamicTimes.secondsSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'seconds')
        this.dynamicTimes.minutesSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'minutes')
        this.dynamicTimes.daysSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'days')
        this.dynamicTimes.weeksSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'weeks')
        this.dynamicTimes.monthsSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'months')
        this.dynamicTimes.yearsSinceStartDate = moment.utc().diff(moment.utc(this.relationship.relationship_started), 'years')
      }

      if (this.relationship.relationship_married)
        this.dynamicTimes.secondsSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'seconds')
        this.dynamicTimes.minutesSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'minutes')
        this.dynamicTimes.daysSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'days')
        this.dynamicTimes.weeksSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'weeks')
        this.dynamicTimes.monthsSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'months')
        this.dynamicTimes.yearsSinceMarriedDate = moment.utc().diff(moment.utc(this.relationship.relationship_married), 'years')
    }
  },

  async created() {
    const data = await Relationships.get(this.relationship_id)
    this.relationship = data.relationship

    if (this.relationship) {
      this.updateRelationshipTime()
      setInterval(() => this.updateRelationshipTime(), 500)
    }

    this.loading = false
  }
}
</script>
