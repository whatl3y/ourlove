<template lang="pug">
  div.top-nav-container.dark-gradient
    div.container
      b-navbar(toggleable,type="inverse")
        b-nav-toggle(target="navbarNavDropdown")
        b-link.navbar-brand(to="/")
          img.img-fluid(style="max-height:32px",src="/public/images/favicon_white.png")
          span.margin-left-sm ourlove.io
        b-collapse#navbarNavDropdown(is-nav)
          b-nav.is-nav-bar.ml-auto
            div.d-flex.align-items-center.text-small(v-if="displayName",style="padding-right:4px;margin-right:4px;border-right:1px solid")
              strong Welcome, &nbsp;
              a(href="/profile") {{ displayName }}
            div.d-flex.align-items-center.text-small(v-if="!(hasIntegration('facebook') || hasIntegration('instagram') || hasIntegration('pinterest'))")
              div login >
            b-nav-item(to="/oauth/facebook",v-if="!hasIntegration('facebook')")
              i.fa.fa-2x.fa-facebook-square(aria-hidden="true")
            b-nav-item(to="/oauth/instagram",v-if="!hasIntegration('instagram')")
              i.fa.fa-2x.fa-instagram(aria-hidden="true")
            b-nav-item(to="/oauth/pinterest",v-if="!hasIntegration('pinterest')")
              i.fa.fa-2x.fa-pinterest-square(aria-hidden="true")
            b-nav-item.d-flex.align-items-center.text-small(to="/logout",v-if="isLoggedIn")
              div logout
</template>

<script>
import AuthFactory from '../factories/Auth'

export { TopNav as default }

const TopNav = {
  name: 'TopNav',
  data() {
    return {
      isLoggedIn: false,
      displayName: null,
      integrations: {}
    }
  },

  methods: {
    hasIntegration(type) {
      return !!this.integrations[type]
    }
  },

  async created() {
    const response = await AuthFactory.getIntegrations()
    this.isLoggedIn = response.logged_in
    this.displayName = response.display_name
    if (response.integrations instanceof Array)
      response.integrations.forEach(int => this.integrations[int] = true)
  }
}
</script>

<style lang="scss">
.nav-link {
  padding: 5px !important;
}
</style>
