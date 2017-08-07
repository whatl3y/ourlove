<template lang="pug">
  div
    div.text-center
      a.margin-bottom-md(href="javascript:void(0)",@click="milestones.push({})")
        i.fa.fa-3x.fa-plus-square
    div.d-flex.flex-column(v-if="milestones.length",v-for="(milestone,index) in milestones")
      b-card.margin-bottom-sm
        div.row
          div.col-md-6.col-lg-3.d-flex.justify-content-center(v-if="!isInEditMode(milestone.id)")
            div.img-thumbnail.border-only.dark-border.force-circle.w-200
              img(:class="{ portrait: getLandscapeOrPortrait('portrait', milestone.orientation), landscape: getLandscapeOrPortrait('landscape', milestone.orientation) }",:src="'/file/s3/' + milestone.main_image_name")
          div.col
            div.text-right(style="font-size:10px")
              a(href="javascript:void(0)",@click="toggleEditMode(milestone.id)")
                i {{ (isInEditMode(milestone.id)) ? 'Cancel Edit' : 'Edit' }}
              span &nbsp;&nbsp;|&nbsp;&nbsp;
              a(href="javascript:void(0)",@click="deleteMilestone(milestone.id)")
                i Delete
            div(v-if="isInEditMode(milestone.id)")
              h2 Edit Milestone
              div.row
                div.col-sm-12.col-md-3
                  img.img-fluid.img-thumbnail(:src="'/file/s3/' + milestone.main_image_name",v-if="milestone.main_image_name")
                  div.text-center
                    b-button.margin-top-md(v-b-modal="'imageModal' + index") Change Image
                    b-modal(:id="'imageModal' + index",title="Select Image",@ok="imageSelected($event, milestone)",@shown="clearImage(milestone)")
                      div.d-flex.flex-wrap.justify-content-center.align-items-center
                        div.possible-images.padding-sm(style="border-radius:4px",v-for="image in images",:class="{ selected: selectedImageId == image.id }")
                          a(href="javascript:void(0)",@click="clickAndSelectImage(image.id)")
                            img.img-fluid.img-thumbnail(style="max-width:80px",:src="'/file/s3/' + image.small_image_name")
                            div.text-center(style="color:#ffffff",v-show="selectedImageId == image.id")
                              i.fa.fa-check-circle-o
                div.col
                  div
                    label Milestone Title
                    b-form-input(v-model="milestone.title")
                  div
                    label Milestone Subtitle
                    b-form-input(v-model="milestone.subtitle")
                  div
                    datepicker(label="Milestone Date",v-model="milestone.milestone_time")
                  div
                    label Milestone Description
                    b-form-input(:textarea="true",:rows="8",v-model="milestone.description")
                div.col-12.text-center.margin-top-md
                  b-button.btn-ourlove(@click="updateMilestone(milestone)") Update Milestone
            table.table.milestone-info(v-if="!isInEditMode(milestone.id)")
              tr(v-if="milestone.title")
                td.label Title:
                td {{ milestone.title }}
              tr(v-if="milestone.subtitle")
                td.label Subtitle:
                td {{ milestone.subtitle }}
              tr(v-if="milestone.milestone_time")
                td.label Milestone Date:
                td {{ getFormattedDate(milestone.milestone_time) }}
              tr(v-if="milestone.description")
                td.label Description:
                td {{ milestone.description }}
    div(v-if="!milestones.length")
      i No milestones yet...
    div.row
      div.col
      div.col
      div.col
</template>

<script>
  import moment from 'moment'
  import RelationshipsFactory from '../factories/Relationships'

  export default {
    props: ['id', 'images', 'milestones'],
    data() {
      let editModeMap = {}
      this.milestones.forEach(m => editModeMap[m.id] = false)
      return {
        editModeMap,
        selectedImageId: null
      }
    },
    methods: {
      getFormattedDate(timestamp, format="MMMM Do, YYYY") {
        return moment.utc(timestamp).format(format)
      },
      getLandscapeOrPortrait(typeToConfirm, orientation='portrait') {
        return typeToConfirm == orientation
      },
      clearImage(milestone) {
        this.selectedImageId = milestone.image_id
      },
      clickAndSelectImage(id) {
        this.selectedImageId = id
      },
      imageSelected(event, milestone) {
        milestone.image_id = this.selectedImageId
        milestone.main_image_name = this.images.filter(i => i.id == this.selectedImageId)[0].main_image_name
      },
      isInEditMode(mId) {
        return !!this.editModeMap[mId] || typeof this.editModeMap[mId] === 'undefined'
      },
      toggleEditMode(mId) {
        return this.editModeMap[mId] = !this.editModeMap[mId]
      },
      async deleteMilestone(milestoneId) {
        try {
          await RelationshipsFactory.deleteMilestone(milestoneId)
          this.$emit('successDelete', milestoneId)

        } catch(err) {
          this.$emit('errorDelete', err)
        }
      },
      async updateMilestone(milestone) {
        try {
          await RelationshipsFactory.createOrUpdateMilestone(milestone, this.id)
          this.$emit('successUpdate', milestone)

        } catch(err) {
          this.$emit('errorUpdate', err)
        }
      }
    }
  }
</script>

<style scoped>
  .possible-images.selected {
    background: #21b729;
  }

  table.milestone-info td {
    border: none;
  }

  td.label {
    font-weight: bold;
    width: 150px;
  }
</style>
