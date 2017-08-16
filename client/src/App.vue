<template lang="pug">
  div#app
    top-nav
    router-view
    div(style="min-height:60px")
    div.d-flex.align-items-center.footer.dark-gradient-reverse(:class="footerClass")
      div.container(style="font-size:10px")
        div.text-right
          a(href="javascript:void(0)",onclick="window.open('/privacy','','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no')") Privacy Policy
    vue-toastr(ref="toastr")
</template>

<script>
import TopNav from './components/TopNav.vue'

export default {
  name: 'ourloveio',

  data() {
    return {
      footerClass: {'fixed-footer': true}
    }
  },

  methods: {
    footerPositionClass() {
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowHeight = window.outerHeight

      if (windowHeight >= docHeight)
        return this.footerClass = {'fixed-footer': true}
      this.footerClass = {'absolute-footer': true}
    }
  },

  mounted() {
    window.addEventListener('scroll', this.footerPositionClass)
    setInterval(this.footerPositionClass, 250)

    this.$root.$refs = Object.assign(this.$root.$refs, {toastr: this.$refs.toastr})
    this.$refs.toastr.defaultPosition = "toast-bottom-right"
  },

  components: {
    TopNav
  }
}
</script>

<style>
  .absolute-footer {
    position: absolute;
  }

  .fixed-footer {
    position: fixed;
  }
</style>
