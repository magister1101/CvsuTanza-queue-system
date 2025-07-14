<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card class="q-pa-lg shadow-2 rounded-borders" style="max-width: 600px; margin: auto">
      <q-card-section>
        <div class="text-h6 text-primary">Send Email to Student</div>
        <div class="text-subtitle2 text-grey-7">Fill out the form below to send a message.</div>
      </q-card-section>

      <q-separator />

      <q-form class="q-gutter-md q-mt-md">
        <q-input type="date" v-model="date" label="Date" outlined dense />

        <q-select
          emit-value
          map-options
          v-model="email"
          :options="filteredEmailOptions"
          label="Student Number"
          option-label="label"
          option-value="value"
          outlined
          dense
          clearable
          use-input
          fill-input
          input-debounce="200"
          @filter="filterFn"
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

const email = ref('')
const message = ref('')
const date = ref('')
const subject = ref('')

const allUsers = ref([])
const filteredEmailOptions = ref([])

const fetchUsers = async () => {
  try {
    const { data } = await axios.get(`${process.env.api_host}/users?role=student`)
    allUsers.value = data
    // Initially show all
    filteredEmailOptions.value = data.map((user) => ({
      label: user.studentNumber,
      value: user._id,
    }))
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

const filterFn = (val, update) => {
  const keyword = val.toLowerCase()

  update(() => {
    const filtered = allUsers.value
      .filter((user) => user.studentNumber.toLowerCase().includes(keyword))
      .map((user) => ({
        label: user.studentNumber,
        value: user._id,
      }))

    filteredEmailOptions.value = filtered
  })
}

const sendEmail = async () => {
  try {
    sendLoading.value = true
    await axios.post(`${process.env.api_host}/users/emailStudent`, {
      id: email.value,
      subject: subject.value,
      message: message.value,
      date: date.value,
    })

    Notify.create({
      message: 'Email sent successfully!',
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
  fetchUsers()
})
</script>
