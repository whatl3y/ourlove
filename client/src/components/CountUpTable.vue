<template lang="pug">
  div.text-center(v-if="timestamp")
    h3(v-if="title") {{ title }}
    div.gray.lead(style="font-size:12px") {{ getFormattedDate(timestamp) }}
    div.item(v-if="minimal")
      small {{ fullCountdown }}
    table.table.table-inverse.thin(v-if="!minimal")
      tbody.text-center
        tr
          td {{ dynamicTimes.seconds }} seconds ago
        tr
          td {{ dynamicTimes.minutes }} minutes ago
        tr
          td {{ dynamicTimes.days }} days ago
        - //tr
        - //  td.text-right
        - //    strong {{ dynamicTimes.weeks }}
        - //  td weeks ago
        - //tr
        - //  td.text-right
        - //    strong {{ dynamicTimes.months }}
        - //  td months ago
        - //tr
        - //  td.text-right
        - //    strong {{ dynamicTimes.years }}
        - //  td years ago
        tr(v-if="fullCountdown")
          td(colspan="2")
            div(style="margin-left:10px;") or in all,
            div
              small {{ fullCountdown }}
</template>

<script>
  import moment from 'moment'
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    props: ['minimal', 'timestamp', 'title'],
    data() {
      return {
        fullCountdown: null,
        dynamicTimes: {
          seconds: null,
          minutes: null,
          days:    null,
          weeks:   null,
          months:  null,
          years:   null
        }
      }
    },
    methods: {
      getFormattedDate: TimeHelpers.getFormattedDate,

      setFullCountdownDifference() {
        const start = moment.utc().toDate()
        const end = moment.utc(this.timestamp).toDate()
        const diffObj = TimeHelpers.getTimeDifferenceObj(start, end, true)
        this.fullCountdown = `
          ${diffObj.years} year${(diffObj.years == 1) ? '' : 's'},
          ${diffObj.months} month${(diffObj.months == 1) ? '' : 's'},
          ${diffObj.weeks} week${(diffObj.weeks == 1) ? '' : 's'},
          ${diffObj.days} day${(diffObj.days == 1) ? '' : 's'},
          ${diffObj.hours} hour${(diffObj.hours == 1) ? '' : 's'},
          ${diffObj.minutes} minute${(diffObj.minutes == 1) ? '' : 's'},
          and ${diffObj.seconds} second${(diffObj.seconds == 1) ? '' : 's'}
          ago`
      },
      getTimeDifference(units='days') {
        return moment.utc().diff(moment.utc(this.timestamp), units)
      },
      updateTimerCountUps() {
        const units = ['seconds', 'minutes', 'days', 'weeks', 'months', 'years']
        units.forEach(unit => {
          this.dynamicTimes[unit] = this.getTimeDifference(unit)
        })
      }
    },
    created() {
      this.setFullCountdownDifference()
      this.updateTimerCountUps()
      this.mainTimingInterval = setInterval(() => {
        this.setFullCountdownDifference()
        this.updateTimerCountUps()
      }, 500)
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

  .item {
    color: #740037;
  }
</style>
