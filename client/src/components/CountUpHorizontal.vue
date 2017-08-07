<template lang="pug">
  div.text-center(v-if="timestamp")
    h3(v-if="title") {{ title }}
    div.gray.lead(style="font-size:11px") {{ getFormattedDate(timestamp) }}
    div.time-item-wrapper.d-flex.flex-row.flex-wrap.justify-content-center
      div.unit-item.flex.text-center
        h3 {{ fullCountdownObj.years }}
        div years
      div.unit-item.flex.text-center
        h3 {{ fullCountdownObj.months }}
        div months
      div.unit-item.flex.text-center.d-flex.flex-column.align-items-center
        h3 {{ fullCountdownObj.weeks }}
        div weeks
      div.unit-item.flex.text-center.d-flex.flex-column.align-items-center
        h3 {{ fullCountdownObj.days }}
        div days
      div.unit-item.flex.text-center.d-flex.flex-column.align-items-center
        h3 {{ fullCountdownObj.minutes }}
        div minutes
      div.unit-item.flex.text-center.d-flex.flex-column.align-items-center
        h3 {{ fullCountdownObj.seconds }}
        div seconds
    h1 ago
</template>

<script>
  import moment from 'moment'
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    props: ['timestamp', 'title'],
    data() {
      return {
        fullCountdown:    null,
        fullCountdownObj: {},
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
        this.fullCountdownObj = TimeHelpers.getTimeDifferenceObj(start, end, true)
        this.fullCountdown = `
          ${this.fullCountdownObj.years} year${(this.fullCountdownObj.years == 1) ? '' : 's'},
          ${this.fullCountdownObj.months} month${(this.fullCountdownObj.months == 1) ? '' : 's'},
          ${this.fullCountdownObj.weeks} week${(this.fullCountdownObj.weeks == 1) ? '' : 's'},
          ${this.fullCountdownObj.days} day${(this.fullCountdownObj.days == 1) ? '' : 's'},
          ${this.fullCountdownObj.hours} hour${(this.fullCountdownObj.hours == 1) ? '' : 's'},
          ${this.fullCountdownObj.minutes} minute${(this.fullCountdownObj.minutes == 1) ? '' : 's'},
          and ${this.fullCountdownObj.seconds} second${(this.fullCountdownObj.seconds == 1) ? '' : 's'}
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
  .time-item-wrapper > .unit-item {
    border-radius: 50%;
    border: 3px solid #740037;
    background: #b72168;
    color: #ffffff;
    padding: 20px;
    margin: 10px;
    height: 100px;
    width: 100px;
  }
</style>
