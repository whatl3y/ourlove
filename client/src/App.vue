<template lang="pug">
  div#app
    top-nav
    router-view
    vue-toastr(ref="toastr")
</template>

<script>
import TopNav from './components/TopNav.vue'

export default {
  name: 'ourloveio',
  components: {
    TopNav
  },
  mounted() {
    this.$root.$refs = Object.assign(this.$root.$refs, {toastr: this.$refs.toastr})
    this.$refs.toastr.defaultPosition = "toast-bottom-right"
  }
}
</script>
