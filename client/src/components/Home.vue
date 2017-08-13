<template lang="pug">
  div.main
    div.main_landing.d-flex.flex-column.justify-content-center.align-items-start
      div.row
        div.col.display-4.hidden-md-down
          div.row
            div.col.d-flex.flex-column.justify-content-center.align-items-start
              div.text-left
                div LOVE
                div IS
                div BEAUTIFUL
        h1.col.hidden-lg-up.d-flex.flex-column.justify-content-end
          div LOVE
          div IS
          div BEAUTIFUL
    div.btn-ourlove-dark.padding-vertical-xlg
      div.container.text-center
        div.display-4 Create Memories
        h2 that last forever
        div.d-flex.margin-vertical-lg.justify-content-center
          div.col
            i.fa.fa-4x.fa-heart-o
          div.col
            i.fa.fa-4x.fa-heart
          div.col
            i.fa.fa-4x.fa-heartbeat
          div.col
            i.fa.fa-4x.fa-heart-o
    div.gray-bg
      div.container.padding-md
        h1
          u Get Started Now!
        div.row
          div.col-sm-12.col-md-6.margin-bottom-lg
            b-card.d-flex.flex-column.justify-content-center(title="Create Relationship Page")
              div What are your and your sig other, mom, dad, pet, or sibling's names?
              form-required-input(label="First Person's Name",v-model="newPage.p1Name")
              form-required-input(label="Second Person's Name",v-model="newPage.p2Name")
              div.text-center
                b-button.btn-ourlove-dark(href="javascript:void(0)",@click="goToPotentiallyNewPage()") Go to New Page
          div.col-sm-12.col-md-6(v-if="recentRelationships.length > 0")
            h3 Recently Created Relationships
            ul.list-unstyled
              li(v-for="(rela,index) in recentRelationships")
                a(:href="rela.path")
                  div.d-flex.align-items-center
                    span {{ index+1 }}.
                    circular-image(style="display:inline-block",:img="rela",:size="40")
                    div
                      div  {{ rela.person1_name }} &amp; {{ rela.person2_name }}
                      div.gray(style="font-size:0.7em") Relationship started: {{ getFormattedDate(rela.relationship_started) }}
                    div.ml-auto.gray(style="font-size:0.7em") Created: {{ getTimeFromNow(rela.created_at) }}
</template>

<script>
  import CircularImage from './CircularImage'
  import RelationshipsFactory from '../factories/Relationships'
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    name: 'home',
    data () {
      return {
        newPage: {
          p1Name: '',
          p2Name: ''
        },
        recentRelationships: [],
        recentAnniversaries: []
      }
    },
    methods: {
      getFormattedDate:           TimeHelpers.getFormattedDate,
      getTimeFromNow:             TimeHelpers.getTimeFromNow,

      openSnackbar(message, type='success') {
        const functionTypeMap = {
          success:  's',
          error:    'e'
        }
        return this.$root.$refs.toastr[functionTypeMap[type] || 's'](message)
      },

      async goToPotentiallyNewPage() {
        if (this.newPage.p1Name && this.newPage.p2Name) {
          const newPage = await RelationshipsFactory.checkForOpenPage(this.newPage.p1Name, this.newPage.p2Name)
          return location.pathname = newPage
        }

        this.openSnackbar(`Please add you and one other person's name to go to create a new page.`, 'error')
      }
    },
    async mounted() {
      this.recentRelationships = (await RelationshipsFactory.getList()).relationships
    },
    components: {
      'circular-image': CircularImage
    }
  }
</script>

<style scoped>
  .main_landing {
    background-image:url("/public/images/marketing/cover.jpg");
    /*background-attachment: absolute;*/
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    font-family: esphimere_bold;
    padding: 0px 60px;
    color: #ffffff;
  }

  @media(max-width: 767px) {
    .main_landing {
      min-height: 300px;
    }
  }

  @media(min-width: 768px) {
    .main_landing {
      min-height: 600px;
    }
  }

  @media(min-width: 1800px) {
    .main_landing {
      min-height: 900px;
    }
  }
</style>
