import moment from 'moment'

export default {
  getFormattedDate(timestamp, format="MMMM Do, YYYY") {
    return moment.utc(timestamp).format(format)
  },

  getTimeDifferenceObj(dateStart, dateEnd=moment().toDate(), calculateNegativeDiff=false) {
    if (typeof dateStart === 'undefined') return false

    dateStart = moment(dateStart).toDate()
    dateEnd   = moment(dateEnd).toDate()
    let ret   = {
      days:     0,
      hours:    0,
      minutes:  0,
      seconds:  0
    }

    const dateDiff  = dateEnd.getTime() - dateStart.getTime()
    const msDiff = (calculateNegativeDiff) ? Math.abs(dateDiff) : dateDiff
    const duration = moment.duration(msDiff, 'milliseconds')

    return {
      years:    duration.years(),
      months:   duration.months(),
      weeks:    duration.weeks(),
      days:     duration.days(),
      hours:    duration.hours(),
      minutes:  duration.minutes(),
      seconds:  duration.seconds()
    }
  }
}
