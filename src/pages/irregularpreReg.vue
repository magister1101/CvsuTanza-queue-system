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
      <!-- Single Search Bar -->
      <div class="q-mb-md">
        <q-input
          filled
          v-model="searchQuery"
          label="Search by Program, Course Title, or Code"
          debounce="300"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-card-section>
        <div class="text-h6">Course List</div>
      </q-card-section>

      <q-table
        title="Courses"
        :rows="filteredRows"
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
import { ref, computed, onMounted } from 'vue'
import Axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const rows = ref([])
const userData = ref({})
const tableLoading = ref(true)
const enrollLoading = ref(false)

const selectedSchedules = ref({})
const scheduleOptions = ref({})
const pagination = ref({ rowsPerPage: 10 })

// Single search query
const searchQuery = ref('')

// Table columns
const columns = [
  { name: 'schedule', label: 'Schedule', field: 'schedule', align: 'center' },
  { name: 'name', label: 'Course Title', field: 'name', sortable: true, align: 'left' },
  { name: 'code', label: 'Code', field: 'code', sortable: true, align: 'left' },
  { name: 'unit', label: 'Units', field: 'unit', sortable: true, align: 'left' },
  { name: 'course', label: 'Program', field: 'course', sortable: true, align: 'left' },
  { name: 'year', label: 'Year', field: 'year', sortable: true, align: 'left' },
  { name: 'semester', label: 'Semester', field: 'semester', sortable: true, align: 'left' },
]

// Filtered rows
const filteredRows = computed(() => {
  if (!searchQuery.value) return rows.value
  const query = searchQuery.value.toLowerCase()

  return rows.value.filter(
    (row) =>
      String(row.name || '')
        .toLowerCase()
        .includes(query) ||
      String(row.course || '')
        .toLowerCase()
        .includes(query) ||
      String(row.code || '')
        .toLowerCase()
        .includes(query),
  )
})

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

    const scheduleMap = {}

    for (const sched of allSchedules) {
      const courseId = typeof sched.course === 'string' ? sched.course : sched.course?._id
      if (!scheduleMap[courseId]) {
        scheduleMap[courseId] = []
      }
      const scheduleText = sched.schedule
        .map((s) => `${s.day} (${s.startTime} - ${s.endTime})`)
        .join(', ')
      scheduleMap[courseId].push({
        ...sched,
        dayTime: `Section ${sched.section} - ${scheduleText}`, // now shows section
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

onMounted(async () => {
  await getUser()
  await fetchCourses()
})
</script>
