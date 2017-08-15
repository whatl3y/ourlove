<template lang="pug">
  div
    h2 Page Administrators
    div.row.margin-vertical-lg
      div.col-sm-12.col-md-10.offset-md-1
        b-table(striped,hover,:items="admins",:fields="fields")
</template>

<script>
  import RelationshipsFactory from '../factories/Relationships'
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    props: ['admins'],
    data() {
      return {
        fields: {
          name:           { label: "User's Name", sortable: true },
          primary_email:  { label: "Email" }
        }
      }
    },

    methods: {
      getFormattedDate: TimeHelpers.getFormattedDate,

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
