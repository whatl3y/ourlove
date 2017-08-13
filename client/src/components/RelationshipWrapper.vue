<template lang="pug">
  div.container.relationship-container
    div.text-center.create-relationship-container(v-if="relationshipStatus('loading')")
      i.fa.fa-4x.fa-spinner.fa-spin

    div.col.create-relationship-container(v-if="relationshipStatus('none')")
      div.text-center(v-if="!isLoggedIn")
        h1 {{ relationship_id }}
        h4 is available!
        div Login today by clicking on one of the providers below to create your page now!
        div.margin-vertical-xlg
          a(href="/oauth/facebook")
            i.fa.fa-5x.fa-facebook-square(aria-hidden="true")
          a(href="/oauth/instagram")
            i.fa.fa-5x.fa-instagram.margin-left-md(aria-hidden="true")
          a(href="/oauth/pinterest")
            i.fa.fa-5x.fa-pinterest-square.margin-left-md(aria-hidden="true")
      div(v-if="isLoggedIn")
        div.text-center
          h1 {{ relationship_id }}
          h4 Create Relationship
        div.col.col-md-6.offset-md-3
          form-required-input(v-model="newRelationship.p1name",label="First Person's Name")
          form-required-input(v-model="newRelationship.p2name",label="Second Person's Name")
          datepicker(label="Relationship Start Date",v-model="newRelationship.startDate")
          datepicker(label="Optional: Married Date",v-model="newRelationship.marriedDate")
          div.text-center.padding-md
            b-button.btn-ourlove-dark(size="lg",@click="createRelationship()") Create Relationship Page

    relationship(:id="relationship_id",:relationship="relationship",v-if="relationshipStatus('valid')")
</template>

<script>
  import moment from 'moment'
  import AuthFactory from '../factories/Auth'
  import RelationshipsFactory from '../factories/Relationships'
  import Relationship from './Relationship'
  import StringHelpers from '../factories/StringHelpers'

  export { RelationshipWrapper as default }

  const RelationshipWrapper = {
    name: 'relationship_wrapper',
    props: ['relationship_id'],
    data() {
      return {
        loading: true,
        isLoggedIn: false,
        newRelationship: {},
        startDate: null,
        marriedDate: null,
        relationship: null
      }
    },

    methods: {
      openSnackbar(message, type='success') {
        const functionTypeMap = {
          success:  's',
          error:    'e'
        }
        return this.$root.$refs.toastr[functionTypeMap[type] || 's'](message)
      },

      dateChanged() {
        return console.log('args', this.newRelationship, arguments)
        this.newRelationship = Object.assign({}, this.newRelationship, {
          startDate: (this.startDate) ? moment(this.startDate).format('YYYY-MM-DD') : null,
          marriedDate: (this.marriedDate) ? moment(this.marriedDate).format('YYYY-MM-DD') : null
        })
      },

      relationshipStatus(which) {
        if (this.loading)
          return which == 'loading'

        if (this.relationship_id && this.relationship)
          return which == 'valid'

        return which == 'none'
      },

      async createRelationship() {
        try {
          if (!(this.newRelationship.p1name && this.newRelationship.p2name))
            return this.openSnackbar(`Make sure to enter at least both people's names to create the relationship!`, 'error')

          const response = await RelationshipsFactory.create(this.relationship_id, this.newRelationship)
          await this.getRelationship()
          this.openSnackbar('Successfully created relationship!')

        } catch(err) {
          this.openSnackbar('There was a problem creating your relationship.', 'error')
          console.log('error creating', err)
        }
      },

      async getRelationship(relaId=this.relationship_id) {
        this.loading      = true
        const data        = await RelationshipsFactory.get(relaId)
        this.relationship = data.relationship
        this.loading      = false
      }
    },

    async created() {
      const [ name1, name2 ] = this.relationship_id.split('and')
      if (name2) {
        this.newRelationship.p1name = StringHelpers.titleCase(name1)
        this.newRelationship.p2name = StringHelpers.titleCase(name2.replace(/\d/g, ''))
      }

      const responses = await Promise.all([
        AuthFactory.isLoggedIn(),
        AuthFactory.setReturnTo(this.relationship_id),
        this.getRelationship()
      ])
      this.isLoggedIn = responses[0]
    },

    components: {
      Relationship
    }
  }
</script>
