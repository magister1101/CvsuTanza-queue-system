<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card class="q-pa-lg shadow-2 rounded-borders" style="max-width: 600px; margin: auto">
      <q-card-section>
        <div class="text-h6 text-primary">Send Email to Students by Course</div>
        <div class="text-subtitle2 text-grey-7">
          Fill out the form below to send a message to all students of a course.
        </div>
      </q-card-section>

      <q-separator />

      <q-form class="q-gutter-md q-mt-md">
        <q-input type="date" v-model="date" label="Date" outlined dense />

        <q-select
          emit-value
          map-options
          v-model="course"
          :options="courseOptions"
          label="Course"
          option-label="label"
          option-value="value"
          outlined
          dense
          clearable
        />

        <q-input v-model="subject" label="Subject" outlined dense />
        <q-input v-model="message" label="Message" type="textarea" outlined autogrow dense />

        <q-btn
          label="Send Email"
          color="primary"
          @click="sendEmail"
          class="full-width"
          :loading="sendLoading"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const sendLoading = ref(false)

const course = ref('')
const message = ref('')
const date = ref('')
const subject = ref('')

const courseOptions = ref([])

const fetchCourses = async () => {
  try {
    const { data } = await axios.get(`${process.env.api_host}/courses/getProgram?isArchived=false`)
    courseOptions.value = data.map((c) => ({
      label: c.name, // e.g., "BSIT"
      value: c._id, // use _id for backend identification
    }))
  } catch (err) {
    console.error('Failed to fetch courses:', err)
  }
}

const sendEmail = async () => {
  if (!course.value) {
    Notify.create({
      message: 'Please select a course.',
      color: 'warning',
      textColor: 'white',
      timeout: 2000,
    })
    return
  }

  try {
    sendLoading.value = true
    await axios.post(`${process.env.api_host}/users/emailCourseStudents`, {
      courseId: course.value,
      subject: subject.value,
      message: message.value,
      date: date.value,
    })

    Notify.create({
      message: 'Emails sent successfully to all students of the course!',
      color: 'positive',
      textColor: 'white',
      timeout: 2000,
    })
  } catch (err) {
    console.error('Failed to send email:', err)
    Notify.create({
      message: 'Failed to send email. Please try again later.',
      color: 'negative',
      textColor: 'white',
      timeout: 2000,
    })
  } finally {
    sendLoading.value = false
  }
}

onMounted(() => {
  fetchCourses()
})
</script>
