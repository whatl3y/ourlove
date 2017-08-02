<template lang="pug">
  div.main.col.text-center
    h1.display-d This is ourlove.io!
    div Create your relationships now!
    div.container
      timeline(:events="events")
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      events: [
        { imageSrc: "lance_face_1501624513397.png", title: 'Event 1', subtitle: 'This is my subtitle....', timestamp: '2017-01-01 12:00:00', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') },
        { imageSrc: "lance_face_1501624513397.png", title: 'Event 2', subtitle: 'This is my subtitle....', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') },
        { imageSrc: "lance_face_1501624513397.png", title: 'Event 3', timestamp: '2017-01-02 12:00:00', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') },
        { imageSrc: "lance_face_1501624513397.png", title: 'Event 4', subtitle: 'This is my subtitle....', timestamp: '2017-01-03 12:00:00', body: new Array(Math.ceil(Math.random() * 10)).fill('in the body bro....').join('|') }
      ]
    }
  }
}
</script>
