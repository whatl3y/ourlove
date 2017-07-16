<template>
  <div class="main">
    <h3>{{ msg }}</h3>
  </div>
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

// fetch('/api/test')
//   .then(function(response) {
//     response.text().then(console.log)
//   }).catch(function(ex) {
//     console.log('parsing failed', ex)
//   })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
