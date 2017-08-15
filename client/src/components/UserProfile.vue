<template lang="pug">
  div.container.margin-top-sm
    h1 User Profile
</template>

<script>
  import StringHelpers from '../factories/StringHelpers'

  export default {
    data() {
      return {
        loading: true,
        isLoggedIn: false
      }
    },

    methods: {
      openSnackbar(message, type='success') {
        const functionTypeMap = {
          success:  's',
          error:    'e'
        }
        return this.$root.$refs.toastr[functionTypeMap[type] || 's'](message)
      }
    }
  }
</script>
