<template lang="pug">
  div.text-center
    i.fa.fa-4x.fa-spinner.fa-spin
</template>

<script>
export default {
  name: 'reload-page',
  mounted() {
    window.location.reload()
  }
}
</script>
