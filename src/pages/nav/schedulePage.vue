<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-btn label="Create Schedule" color="primary" @click="showDialog = true" />
    </div>

    <!-- Dialog Form -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="max-width: 800px; width: 800px">
        <q-card-section>
          <div class="text-h6">Create Schedule</div>
        </q-card-section>

        <q-form @submit.prevent="createSchedule">
          <q-card-section>
            <!-- Course Selector -->
            <q-select
              v-model="scheduleCourse"
              :options="courseOptions"
              :option-label="(opt) => (opt ? `${opt.name} (${opt.course})` : '')"
              option-value="_id"
              label="Select Course"
              filled
              emit-value
              map-options
              :loading="loadingCourses"
            />

            <q-select
              v-model="scheduleSection"
              :options="sectionOptions"
              label="Select Section"
              filled
              emit-value
              map-options
              :loading="loadingCourses"
            />

            <!-- Repeatable Schedule Entries -->
            <div class="q-mt-md" v-for="(entry, index) in scheduleEntries" :key="index">
              <div class="row q-col-gutter-sm items-center">
                <div class="col">
                  <q-select
                    v-model="entry.day"
                    :options="dayOptions"
                    label="Day"
                    filled
                    emit-value
                    map-options
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="entry.startTime"
                    label="Start Time"
                    type="time"
                    filled
                    :readonly="entry.day === 'TBA'"
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="entry.endTime"
                    label="End Time"
                    type="time"
                    filled
                    :readonly="entry.day === 'TBA'"
                  />
                </div>
                <div class="col-auto">
                  <q-btn round icon="close" color="negative" @click="removeEntry(index)" />
                </div>
              </div>
            </div>

            <div class="q-mt-md">
              <q-btn flat color="primary" icon="add" label="Add Day" @click="addEntry" />
            </div>
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
      :pagination="{ rowsPerPage: 10 }"
      flat
      :loading="tableLoading"
      bordered
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()

// Dialog and states
const showDialog = ref(false)
const loadingCourses = ref(true)
const submitting = ref(false)
const tableLoading = ref(true)

// Form data
const scheduleCourse = ref('')
const scheduleProgram = ref('')
const scheduleSection = ref('')
const scheduleEntries = ref([{ day: '', startTime: '', endTime: '' }])

const dayOptions = ref([
  { label: 'TBA', value: 'TBA' },
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
])
const sectionOptions = ref([
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
])

const courseOptions = ref([])
const schedules = ref([])

const columns = [
  { name: 'code', label: 'Code', field: 'code', align: 'left' },
  {
    name: 'course',
    label: 'Course',
    field: (row) => row.course?.name || row.course,
    align: 'left',
  },
  {
    name: 'program',
    label: 'Program',
    field: (row) => row.program || '',
    align: 'left',
  },
  {
    name: 'schedule',
    label: 'Schedule',
    field: (row) => row.schedule.map((s) => `${s.day} (${s.startTime}-${s.endTime})`).join(', '),
    align: 'left',
  },
]

// Auto-set TBA times
watch(
  scheduleEntries,
  (entries) => {
    entries.forEach((entry) => {
      if (entry.day === 'TBA') {
        entry.startTime = 'TBA'
        entry.endTime = 'TBA'
      } else {
        if (entry.startTime === 'TBA') entry.startTime = ''
        if (entry.endTime === 'TBA') entry.endTime = ''
      }
    })
  },
  { deep: true },
)

// Watch course change to auto-fill program
watch(scheduleCourse, (courseId) => {
  const selected = courseOptions.value.find((c) => c._id === courseId)
  scheduleProgram.value = selected?.program || ''
})

// Functions
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
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to load schedules' })
  } finally {
    tableLoading.value = false
  }
}

const createSchedule = async () => {
  try {
    submitting.value = true

    const payload = {
      course: scheduleCourse.value,
      section: scheduleSection.value,
      code: generateCode(),
      schedule: scheduleEntries.value,
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

function addEntry() {
  scheduleEntries.value.push({ day: '', startTime: '', endTime: '' })
}

function removeEntry(index) {
  scheduleEntries.value.splice(index, 1)
}

function resetForm() {
  scheduleCourse.value = ''
  scheduleProgram.value = ''
  scheduleEntries.value = [{ day: '', startTime: '', endTime: '' }]
}

function generateCode() {
  const courseName =
    courseOptions.value.find((c) => c._id === scheduleCourse.value)?.code || 'UNKNOWN'
  return `${courseName}-${Date.now()}`
}

onMounted(() => {
  getCourses()
  getSchedules()
})
</script>
