<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-btn label="Create Schedule" color="primary" @click="showDialog = true" />
    </div>

    <!-- Dialog Form -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section>
          <div class="text-h6">Create Schedule</div>
        </q-card-section>

        <q-form @submit.prevent="createSchedule">
          <q-card-section>
            <!-- Course Selector -->
            <q-select
              v-model="scheduleCourse"
              :options="courseOptions"
              option-label="name"
              option-value="_id"
              label="Select Course"
              filled
              emit-value
              map-options
              :loading="loadingCourses"
            />

            <!-- Day Selector -->
            <q-select
              v-model="scheduleDay"
              :options="dayOptions"
              option-label="label"
              option-value="value"
              label="Day"
              filled
              class="q-mt-md"
              emit-value
              map-options
            />

            <!-- Time Inputs -->
            <q-input
              v-model="scheduleStartTime"
              label="Start Time"
              filled
              class="q-mt-md"
              type="time"
            />
            <q-input
              v-model="scheduleEndTime"
              label="End Time"
              filled
              class="q-mt-md"
              type="time"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey" @click="showDialog = false" />
            <q-btn type="submit" label="Create" color="primary" :loading="submitting" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Schedule Table -->
    <q-table
      title="Schedule List"
      :rows="schedules"
      :columns="columns"
      row-key="_id"
      flat
      bordered
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()

// Dialog toggle
const showDialog = ref(false)

// Loading states
const loadingCourses = ref(true)
const submitting = ref(false)

// Form data
const scheduleCourse = ref('')
const scheduleDay = ref('')
const scheduleStartTime = ref('')
const scheduleEndTime = ref('')

// Day options
const dayOptions = ref([
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
])

// Courses
const courseOptions = ref([])

// Schedules
const schedules = ref([])

const columns = [
  { name: 'code', label: 'Code', field: 'code', align: 'left' },
  { name: 'course', label: 'Course', field: (row) => row.course.name, align: 'left' },
  { name: 'day', label: 'Day', field: 'day', align: 'left' },
  { name: 'startTime', label: 'Start Time', field: 'startTime', align: 'left' },
  { name: 'endTime', label: 'End Time', field: 'endTime', align: 'left' },
]

const getCourses = async () => {
  try {
    const res = await axios.get(`${process.env.api_host}/courses`)
    courseOptions.value = res.data
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to load courses' })
  } finally {
    loadingCourses.value = false
  }
}

const getSchedules = async () => {
  try {
    const res = await axios.get(`${process.env.api_host}/courses/getSchedule`)
    schedules.value = res.data
    console.log(schedules.value)
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to load schedules' })
  }
}

const createSchedule = async () => {
  try {
    submitting.value = true

    const payload = {
      course: scheduleCourse.value,
      day: scheduleDay.value,
      startTime: scheduleStartTime.value,
      endTime: scheduleEndTime.value,
      code: generateCode(),
    }

    await axios.post(`${process.env.api_host}/courses/createSchedule`, payload)

    $q.notify({ type: 'positive', message: 'Schedule created successfully' })
    showDialog.value = false
    resetForm()
    getSchedules()
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to create schedule' })
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  scheduleCourse.value = ''
  scheduleDay.value = ''
  scheduleStartTime.value = ''
  scheduleEndTime.value = ''
}

function generateCode() {
  const courseName =
    courseOptions.value.find((c) => c._id === scheduleCourse.value)?.name || 'UNKNOWN'
  return `${courseName}-${scheduleDay.value}-${scheduleStartTime.value.replace(':', '')}`
}

onMounted(() => {
  getCourses()
  getSchedules()
})
</script>
