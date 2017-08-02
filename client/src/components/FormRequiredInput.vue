<template lang="pug">
  b-form-fieldset(:label="label",:state="state",:label-cols="3")
    b-form-input(:state="state",v-model="modelValue",:value="value",@input="updateValue")
</template>

<script>
  export default {
    props: ['label', 'value'],
    data() {
      return {
        modelValue: this.value || ''
      }
    },
    computed: {
      state() {
        return (this.modelValue.length) ? 'success' : 'warning'
      },
    },
    methods: {
      updateValue(val) {
        this.$emit('input', val)
      }
    }
  }
</script>
