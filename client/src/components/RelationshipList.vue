<template lang="pug">
  ul.list-unstyled
    li(v-for="(rela,index) in relationships")
      a(:href="rela.path")
        div.d-flex.align-items-center
          span {{ index+1 }}.
          circular-image(style="display:inline-block",:img="rela",:size="40")
          div
            div  {{ rela.person1_name }} &amp; {{ rela.person2_name }}
            div.gray(style="font-size:0.7em",v-if="rela.relationship_started || rela.relationship_married") Relationship started: {{ getFormattedDate(rela.relationship_started || rela.relationship_married) }}
          div.ml-auto.gray(style="font-size:0.7em") Created: {{ getTimeFromNow(rela.created_at) }}
</template>

<script>
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    props: ['relationships'],
    methods: TimeHelpers
  }
</script>
