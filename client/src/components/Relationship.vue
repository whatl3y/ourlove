<template>
  <div class="relationship-container">
    <h3>This is a relationship</h3>
    <h5>{{ relationship_id }}</h5>
  </div>
</template>

<script>
export default {
  name: 'relationship',
  props: ['relationship_id'],
  data () {
    return {}
  }
}
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
