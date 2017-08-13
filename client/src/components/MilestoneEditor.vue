<template lang="pug">
  div
    div.text-center
      a.margin-bottom-md(href="javascript:void(0)",@click="mutableMilestones.unshift({NEW: true})")
        i.fa.fa-3x.fa-plus-square
    div.d-flex.flex-column(v-if="mutableMilestones.length",v-for="(milestone,index) in mutableMilestones")
      b-card.margin-bottom-sm
        div.row
          div.col-md-6.col-lg-3.d-flex.justify-content-center(v-if="!isInEditMode(milestone.id)")
            div.img-thumbnail.border-only.dark-border.force-circle.w-200
              img(:class="{ portrait: getLandscapeOrPortrait('portrait', milestone.orientation), landscape: getLandscapeOrPortrait('landscape', milestone.orientation) }",:src="'/file/s3/' + milestone.main_image_name")
          div.col
            div.text-right(style="font-size:10px")
              a(href="javascript:void(0)",@click="toggleEditMode(milestone.id)",v-if="!milestone.NEW")
                i {{ (isInEditMode(milestone.id)) ? 'Cancel Edit' : 'Edit' }}
              span(v-if="!milestone.NEW") &nbsp;&nbsp;|&nbsp;&nbsp;
              a(href="javascript:void(0)",@click="deleteMilestone(milestone.id)")
                i Delete
            div(v-if="isInEditMode(milestone.id)")
              h2 {{ (milestone.NEW) ? 'Create' : 'Edit' }} Event/Milestone
              div.row
                div.col-sm-12.col-md-3
                  img.img-fluid.img-thumbnail(:src="'/file/s3/' + ((selectedImageId) ? getImageFilenameFromId(selectedImageId) : milestone.main_image_name)",v-if="selectedImageId || milestone.main_image_name")
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
    b-card(v-if="!mutableMilestones.length")
      div.card-text.text-center No milestones configured yet...
</template>

<script>
  import RelationshipsFactory from '../factories/Relationships'
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    props: ['id', 'images', 'milestones'],
    data() {
      const mutableMilestones = (this.milestones || []).slice(0)
      return {
        selectedImageId: null,
        mutableMilestones
      }
    },
    methods: {
      getFormattedDate: TimeHelpers.getFormattedDate,

      getImageFilenameFromId(imageId) {
        return this.images.filter(img => img.id == imageId)[0].main_image_name
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
        if (mId) {
          const milestone = this.mutableMilestones.filter(m => m.id == mId)[0]
          return !milestone || milestone.isInEditMode
        }
        return true
      },

      toggleEditMode(mId) {
        this.clearImage(this.mutableMilestones.filter(m => m.id == mId)[0])
        this.mutableMilestones = this.mutableMilestones.map(m => {
          if (m.id == mId) m.isInEditMode = !m.isInEditMode
          return m
        })
      },

      async deleteMilestone(milestoneId) {
        try {
          if (!milestoneId) {
            this.mutableMilestones.splice(0, 1)
            return this.$emit('successDelete', null)
          }

          await RelationshipsFactory.deleteMilestone(milestoneId)
          this.mutableMilestones = this.mutableMilestones.map(m => {
            if (m.id == milestoneId) return null
            return m
          }).filter(m => !!m)
          this.$emit('successDelete', milestoneId)

        } catch(err) {
          this.$emit('errorDelete', err)
        }
      },

      async updateMilestone(milestone) {
        try {
          const res = await RelationshipsFactory.createOrUpdateMilestone(milestone, this.id)
          const milestoneWithId = Object.assign(milestone, {id: res.id})

          if (milestone.NEW) {
            this.mutableMilestones.splice(0, 1)
            delete(milestone.NEW)
            this.mutableMilestones.push(milestoneWithId)
          } else {
            this.toggleEditMode(res.id)
          }
          
          this.$emit('successUpdate', milestoneWithId)

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
