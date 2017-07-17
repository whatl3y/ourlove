<template>
  <md-layout md-column md-vertical-align="center" class="relationship-container">
    <h3 class="md-display-3">This is a relationship</h3>
    <div class="md-display-1">{{ relationship_id }}</div>
    <div>{{ time }}</div>
  </md-layout>
</template>

<script>
import moment from 'moment'

export { Relationship as default }

const Relationship = {
  name: 'relationship',
  props: ['relationship_id'],
  data() {
    return {
      time: moment.utc().format()
    }
  },
  methods: {
    updateTime() {
      return this.time = moment.utc().format()
    }
  },
  created() {
    setInterval(() => this.updateTime(), 500)
  }
}
</script>
