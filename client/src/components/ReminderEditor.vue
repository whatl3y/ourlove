<template lang="pug">
  div
    h1 Configure Reminders
    p.
      Want to get reminded a month before the anniversary of your relationship starting,
      or for your marriage anniversary? Or maybe you want to be notified when you
      went on your first Europe trip together 5 years ago.
    p Reminders can be configured to send you e-mails notifying you when you want!
    div.text-center
      a.margin-bottom-md(href="javascript:void(0)",@click="mutableReminders.unshift({NEW: true, reminder_type:'milestone', days_before_milestone_to_remind:30, emails:getInitialEmail()})")
        i.fa.fa-3x.fa-plus-square
    div.d-flex.flex-column(v-if="mutableReminders.length",v-for="(reminder,index) in mutableReminders")
      b-card.margin-bottom-sm
        div.card-text
          div.text-right(style="font-size:10px")
            a(href="javascript:void(0)",@click="toggleEditMode(reminder.id)",v-if="!reminder.NEW")
              i {{ (isInEditMode(reminder.id)) ? 'Cancel Edit' : 'Edit' }}
            span(v-if="!reminder.NEW") &nbsp;&nbsp;|&nbsp;&nbsp;
            a(href="javascript:void(0)",@click="deleteReminder(reminder.id)")
              i Delete
          div(v-if="isInEditMode(reminder.id)")
            div.row
              div.col-sm-12.col-md
                label Reminder Type
                b-form-select(:options="reminderTypes",v-model="reminder.reminder_type")
              div.col-sm-12.col-md(v-show="reminder.reminder_type == 'milestone'")
                label Milestone
                b-form-select(v-if="milestoneSelectOptions.length",:options="milestoneSelectOptions",v-model="reminder.milestone_id")
                div
                  small(v-if="!milestoneSelectOptions.length")
                    i No events/milestones created yet...
              div.col-sm-12.col-md
                label Days before to send reminder
                b-form-input(type="number",v-model="reminder.days_before_milestone_to_remind")
              div.col-sm-12.col-md
                label Emails to send reminder
                b-form-input(v-model="reminder.emails")
            hr
            div.text-center
              b-button(@click="updateReminder(reminder)") Save Reminder
          div.row.d-flex.align-items-center(v-if="!isInEditMode(reminder.id)")
            div.col-sm-6.col-md
              h4 {{ reminderTypes.filter(t => reminder.reminder_type == t.value)[0].text }}
              div(style="font-size:11px")
                div(v-if="reminder.milestone_id") Milestone: {{ milestoneSelectOptions.filter(o => o.value == reminder.milestone_id)[0].text }}
                div(v-if="reminder.reminder_type == 'start_date' && reminder.relationship_started") Relationship Date: {{ getFormattedDate(reminder.relationship_started) }}
                div(v-if="reminder.reminder_type == 'married_date' && reminder.relationship_married") Marriage Date: {{ getFormattedDate(reminder.relationship_married) }}
            div.col-sm-6.col-md
              div
                u Days before to remind
              div
                small {{ reminder.days_before_milestone_to_remind }} days
            div.col-sm-6.col-md
              div
                u Emails
              div
                small {{ reminder.emails || 'No emails added...' }}
    b-card(v-if="!mutableReminders.length")
      div.card-text.text-center No reminders configured yet...
</template>

<script>
  import RelationshipsFactory from '../factories/Relationships'
  import TimeHelpers from '../factories/TimeHelpers'

  export default {
    props: ['id', 'milestones', 'reminders'],
    data() {
      const mutableReminders = this.reminders.slice()
      const reminderTypes = [
        { text: 'Event/Milestone Reminder', value: 'milestone' },
        { text: 'Marriage Anniversary', value: 'married_date' },
        { text: 'Relationship Anniversary', value: 'start_date' }
      ]

      return {
        milestoneSelectOptions: [],
        mutableReminders: mutableReminders,
        reminderTypes: reminderTypes
      }
    },

    methods: {
      getFormattedDate: TimeHelpers.getFormattedDate,

      openSnackbar(message, type='success') {
        const functionTypeMap = {
          success:  's',
          error:    'e'
        }
        return this.$root.$refs.toastr[functionTypeMap[type] || 's'](message)
      },

      getInitialEmail() {
        const loggedInUserData = window.LOCAL_DATA.user || {}
        if (loggedInUserData.facebook)
          return loggedInUserData.facebook.email

        if (loggedInUserData.instagram)
          return loggedInUserData.instagram.email

        return null
      },

      isInEditMode(id) {
        if (id) {
          const reminder = this.mutableReminders.filter(r => r.id == id)[0]
          return !reminder || reminder.isInEditMode
        }
        return true
      },

      toggleEditMode(id) {
        this.mutableReminders = this.mutableReminders.map(m => {
          if (m.id == id) m.isInEditMode = !m.isInEditMode
          return m
        })
      },

      async deleteReminder(reminderId) {
        try {
          if (!reminderId) {
            this.mutableReminders.splice(0, 1)
            return this.$emit('successDelete', null)
          }

          await RelationshipsFactory.deleteReminder(reminderId)
          this.mutableReminders = this.mutableReminders.map(m => {
            if (m.id == reminderId) return null
            return m
          }).filter(m => !!m)
          this.$emit('successDelete', reminderId)

        } catch(err) {
          this.$emit('errorDelete', err)
        }
      },

      async updateReminder(reminder) {
        try {
          const res = await RelationshipsFactory.createOrUpdateReminder(reminder, this.id)
          const reminderWithId = Object.assign(reminder, {id: res.id})

          if (reminder.NEW) {
            this.mutableReminders.splice(0, 1)
            delete(reminder.NEW)
            this.mutableReminders.push(reminderWithId)
          } else {
            this.toggleEditMode(res.id)
          }

          this.$emit('successUpdate', reminderWithId)

        } catch(err) {
          this.$emit('errorUpdate', err)
        }
      }
    },

    created() {
      this.milestoneSelectOptions = this.milestones.map(m => {
        return {
          text:   `${m.title} (${this.getFormattedDate(m.milestone_time) || 'No date provided...'})`,
          value:  m.id
        }
      }).sort((a,b) => {
        if (a.text.toLowerCase() < b.text.toLowerCase())
          return -1
        return 1
      })
    }
  }
</script>
