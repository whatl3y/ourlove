<template>
  <md-layout md-column md-vertical-align="center" md-align="center" class="main">
    <h1 class="md-display-2">This is our.love!</h1>
    <div>{{ msg }}</div>
  </md-layout>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'This is the main homepage'
    }
  }
}
</script>
