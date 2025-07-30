<template>
  <q-page class="q-pa-md">
    <!-- Back button -->
    <q-card-section>
      <q-btn flat @click="redirect('/regOrIrreg')">
        <q-icon name="arrow_back_ios" />
      </q-btn>
    </q-card-section>

    <!-- Course Table -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Course List</div>
      </q-card-section>

      <q-table
        title="Courses"
        :rows="rows"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:body-cell-schedule="props">
          <q-td>
            <q-select
              filled
              dense
              emit-value
              map-options
              v-model="selectedSchedules[props.row._id]"
              :options="scheduleOptions[props.row._id] || []"
              option-label="dayTime"
              option-value="_id"
              @update:model-value="(val) => onScheduleSelected(props.row, val)"
              placeholder="Select schedule"
            />
          </q-td>
        </template>

        <template v-slot:top-right>
          <q-btn
            label="Enroll"
            color="primary"
            @click="enroll"
            :disable="Object.keys(selectedSchedules).length === 0"
            :loading="enrollLoading"
          />
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const rows = ref([])
const userData = ref({})
const tableLoading = ref(true)
const enrollLoading = ref(false)

const selectedSchedules = ref({}) // { courseId: scheduleId }
const scheduleOptions = ref({}) // { courseId: [schedules] }

const pagination = ref({ rowsPerPage: 10 })

// Table columns with added schedule column
const columns = [
  { name: 'name', label: 'Course Title', field: 'name', sortable: true },
  { name: 'code', label: 'Code', field: 'code', sortable: true },
  { name: 'unit', label: 'Units', field: 'unit', sortable: true },
  { name: 'course', label: 'Program', field: 'course', sortable: true },
  { name: 'year', label: 'Year', field: 'year', sortable: true },
  { name: 'semester', label: 'Semester', field: 'semester', sortable: true },
  { name: 'schedule', label: 'Schedule', field: 'schedule' },
]

function redirect(path) {
  router.push(path)
}

async function getUser() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await Axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: { Authorization: token },
    })
    userData.value = response.data
  } catch (err) {
    console.error('Error fetching user:', err)
  }
}

async function fetchCourses() {
  try {
    const res = await Axios.get(`${process.env.api_host}/courses?program=${userData.value.course}`)
    const allCourses = res.data

    const scheduleRes = await Axios.get(`${process.env.api_host}/courses/getSchedule`)
    const allSchedules = scheduleRes.data

    const scheduleMap = {} // courseId -> schedules[]

    for (const sched of allSchedules) {
      const courseId = typeof sched.course === 'string' ? sched.course : sched.course?._id
      if (!scheduleMap[courseId]) {
        scheduleMap[courseId] = []
      }

      // Convert multiple schedule entries to a readable string
      const scheduleText = sched.schedule
        .map((s) => `${s.day} (${s.startTime} - ${s.endTime})`)
        .join(', ')

      scheduleMap[courseId].push({
        ...sched,
        dayTime: scheduleText,
      })
    }

    const filteredCourses = allCourses.filter((course) => {
      const courseId = course._id
      if (scheduleMap[courseId] && scheduleMap[courseId].length > 0) {
        scheduleOptions.value[courseId] = scheduleMap[courseId]
        return true
      }
      return false
    })

    rows.value = filteredCourses
  } catch (err) {
    console.error('Error fetching courses or schedules:', err)
  } finally {
    tableLoading.value = false
  }
}


// When a schedule is selected
function onScheduleSelected(course, scheduleId) {
  selectedSchedules.value[course._id] = scheduleId
}

async function enroll() {
  try {
    enrollLoading.value = true

    const courseToTakeIds = Object.keys(selectedSchedules.value)
    const scheduleIds = Object.values(selectedSchedules.value)

    await Axios.post(`${process.env.api_host}/users/update/${userData.value._id}`, {
      courseToTake: courseToTakeIds,
      schedule: scheduleIds,
      isEnrolled: true,
      isApproved: false,
    })

    redirect('/thankYou')
  } catch (err) {
    console.error('Error during enrollment:', err)
  } finally {
    enrollLoading.value = false
  }
}

// Run on page load
onMounted(async () => {
  await getUser()
  await fetchCourses()
})
</script>
