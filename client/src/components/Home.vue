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
    div.container.margin-top-md
      div.text-center Create your relationship page now!
    div.container
      hor-timeline(:events="events")
      zigzag-timeline(:events="events")
</template>

<script>
  import CircularImage from './CircularImage'

  export default {
    name: 'home',
    data () {
      return {
        events: [
          { badgeColor: 'danger', icon: 'fa-close', imageSrc: "lance_face_1501624513397.png", title: 'Event 1', subtitle: 'This is my subtitle....', timestamp: '2017-01-01 12:00:00', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') },
          { badgeColor: 'dark', imageSrc: "lance_face_1501624513397.png", title: 'Event 2', subtitle: 'This is my subtitle....', timestamp: '2012-05-01 12:00:00', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') },
          { imageSrc: "lance_face_1501624513397.png", title: 'Event 3', subtitle: 'This is my subtitle....', timestamp: '2009-05-01 12:00:00', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') },
          { imageSrc: "lance_face_1501624513397.png", title: 'Event 4', subtitle: 'This is my subtitle....', timestamp: '2005-05-01 12:00:00', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') }
        ]
      }
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
