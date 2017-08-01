<template lang="pug">
  div.form-group
    label(v-if="label",for="dp") {{ label }}
    datepicker(name="dp",placeholder="Click here to select date...",format="MMMM dd, yyyy",:bootstrap-styling="true",v-model="date",:value="value",@closed="dateChanged")
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  props: ['valueKey', 'label', 'value'],
  data() {
    return {
      date: null
    }
  },
  methods: {
    dateChanged() {
      this.$emit('input', this.date)
      this.$emit('changedWithKey', this.date, this.valueKey)
    }
  },
  mounted() {
    if (this.value)
      this.date = moment.utc(this.value).toDate()
  },
  components: {
    datepicker: Datepicker
  }
}
</script>
