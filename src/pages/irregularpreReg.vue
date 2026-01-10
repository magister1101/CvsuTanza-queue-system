<template>
  <q-page class="q-pa-md">
    <!-- Back button -->
    <q-card-section>
      <q-btn flat @click="redirect('/regOrIrreg')">
        <q-icon name="arrow_back_ios" />
      </q-btn>
    </q-card-section>

    <!-- Prerequisites Warning -->
    <q-card class="q-mt-md" v-if="prerequisitesMessage && prerequisitesRow.length > 0" style="border: 3px solid #ff9800; background-color: #fff3e0">
      <q-card-section>
        <div class="text-h6 text-orange">Prerequisites Warning</div>
      </q-card-section>
      <q-card-section>
        <q-table
          style="box-shadow: none"
          :rows="prerequisitesRow"
          :columns="prerequisitesColumn"
          row-key="id"
          :rows-per-page-options="[0]"
          separator="cell"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td>{{ props.row.course }}</q-td>
              <q-td>{{ props.row.prerequisites }}</q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="q-mt-md text-negative text-weight-bold">
          {{ prerequisitesMessage.message || 'Some prerequisites are missing or failed. Please complete prerequisites before enrolling.' }}
        </div>
      </q-card-section>
    </q-card>

    <!-- Already Taken Courses Warning -->
    <q-card class="q-mt-md" v-if="alreadyTakenCourses.length > 0" style="border: 3px solid #f44336; background-color: #ffebee">
      <q-card-section>
        <div class="text-h6 text-negative">Already Passed Courses</div>
      </q-card-section>
      <q-card-section>
        <q-list bordered>
          <q-item v-for="(course, index) in alreadyTakenCourses" :key="index">
            <q-item-section>
              <q-item-label>{{ course.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="q-mt-md text-negative text-weight-bold">
          These courses have already been passed and cannot be retaken. Please remove them from your selection.
        </div>
      </q-card-section>
    </q-card>

    <!-- Selected Schedules Section -->
    <q-card class="q-mt-md" v-if="selectedScheduleDetails.length > 0">
      <q-card-section>
        <div class="text-h6">Selected Schedules</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">Total Units: {{ totalUnits }} / 24</div>
      </q-card-section>

      <q-card-section>
        <q-btn
          label="Enroll"
          color="primary"
          @click="checkPrerequisitesAndEnroll"
          :disable="selectedScheduleDetails.length === 0 || totalUnits > 24 || hasPrerequisiteIssues"
          :loading="enrollLoading"
        />
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item v-for="(item, index) in selectedScheduleDetails" :key="index">
            <q-item-section>
              <div class="text-subtitle1">{{ item.courseTitle }} ({{ item.code }})</div>
              <div class="text-caption text-grey">
                Program: {{ item.program }} | Year: {{ item.year }} | Semester:
                {{ item.semester }}
              </div>
              <div class="q-mt-xs">
                <q-badge color="primary">
                  {{ item.scheduleText }}
                </q-badge>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Schedule List -->
    <q-card class="q-mt-md">
      <q-card-section>
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
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Schedule List</div>
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item
            v-for="sched in flatFilteredSchedules"
            :key="sched._id"
            clickable
            @click="onScheduleSelected(sched.courseId, sched._id)"
          >
            <q-item-section>
              <div class="text-subtitle1">{{ sched.code }}</div>
              <div class="text-subtitle1">{{ sched.courseName }} ({{ sched.courseCode }})</div>
              <div class="text-caption text-grey">
                Program: {{ sched.program }} | Year: {{ sched.year }} | Semester:
                {{ sched.semester }} | Unit: {{ sched.unit }}
              </div>
              <div class="q-mt-xs">
                <q-badge
                  :color="
                    (selectedSchedules[sched.courseId] || []).includes(sched._id)
                      ? 'primary'
                      : 'grey-6'
                  "
                >
                  Section {{ sched.section }} -
                  {{
                    sched.schedule.map((s) => `${s.day} (${s.startTime} - ${s.endTime})`).join(', ')
                  }}
                </q-badge>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Axios from 'axios'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()

// data
const rows = ref([]) // courses (normalized)
const rowsById = ref({}) // { [courseId:string]: course }
const userData = ref({})
const tableLoading = ref(true)
const enrollLoading = ref(false)

// courseId(string) -> [scheduleId, scheduleId...]
const selectedSchedules = ref({})
// courseId(string) -> schedule[]
const scheduleOptions = ref({})
const searchQuery = ref('')

// Prerequisites checking
const prerequisitesMessage = ref(null)
const prerequisitesRow = ref([])
const prerequisitesColumn = ref([
  { name: 'course', label: 'Selected Course', align: 'left', field: 'course' },
  { name: 'prerequisites', label: 'Missing Prerequisites', align: 'left', field: 'prerequisites' },
])
const alreadyTakenCourses = ref([])

// --- helpers ---
const toId = (v) => {
  if (!v) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object' && v._id) return String(v._id)
  return String(v)
}

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
    // console.error('Error fetching user:', err)
  }
}

async function fetchCourses() {
  try {
    // 1) fetch all courses
    const res = await Axios.get(`${process.env.api_host}/courses?`)
    const allCourses = res.data || []

    // normalize course ids to string
    const normalizedCourses = allCourses.map((c) => ({
      ...c,
      _id: toId(c._id),
      // unit fallback if your API sometimes uses "units"
      unit: c.unit ?? c.units ?? 0,
    }))
    rows.value = normalizedCourses

    // build O(1) lookup
    const idx = {}
    for (const c of normalizedCourses) idx[c._id] = c
    rowsById.value = idx

    // 2) fetch schedules
    const scheduleRes = await Axios.get(`${process.env.api_host}/courses/getSchedule`)
    const allSchedules = scheduleRes.data || []

    const scheduleMap = {}

    for (const raw of allSchedules) {
      const courseId = toId(raw.course)
      if (!courseId) continue

      if (!scheduleMap[courseId]) scheduleMap[courseId] = []

      const scheduleText = (raw.schedule || [])
        .map((s) => `${s.day} (${s.startTime} - ${s.endTime})`)
        .join(', ')

      scheduleMap[courseId].push({
        ...raw,
        _id: toId(raw._id),
        course: raw.course, // keep original
        courseId, // normalized id for UI/logic
        dayTime: `Section ${raw.section} - ${scheduleText}`,
      })
    }

    scheduleOptions.value = scheduleMap
  } catch (err) {
    // console.error('Error fetching courses or schedules:', err)
  } finally {
    tableLoading.value = false
  }
}

function onScheduleSelected(courseIdRaw, scheduleIdRaw) {
  const courseId = toId(courseIdRaw)
  const scheduleId = toId(scheduleIdRaw)

  if (!selectedSchedules.value[courseId]) {
    selectedSchedules.value[courseId] = []
  }

  const alreadySelected = selectedSchedules.value[courseId]?.length > 0
  const course = rowsById.value[courseId]
  const courseUnits = course?.unit ?? course?.units ?? 0

  // If the course isn't yet counted and adding it would exceed 24, block
  if (!alreadySelected && totalUnits.value + courseUnits > 24) {
    Notify.create({ type: 'negative', message: 'You cannot enroll in more than 24 units.' })
    return
  }

  const index = selectedSchedules.value[courseId].indexOf(scheduleId)
  if (index === -1) {
    selectedSchedules.value[courseId].push(scheduleId) // add
  } else {
    selectedSchedules.value[courseId].splice(index, 1) // remove
  }

  // if a course has no schedules left selected, clean it up (optional)
  if (selectedSchedules.value[courseId].length === 0) {
    delete selectedSchedules.value[courseId]
  }

  // Clear prerequisite messages when selection changes
  prerequisitesMessage.value = null
  prerequisitesRow.value = []
  alreadyTakenCourses.value = []
}

async function checkPrerequisitesAndEnroll() {
  try {
    enrollLoading.value = true

    // Clear previous prerequisite messages
    prerequisitesMessage.value = null
    prerequisitesRow.value = []
    alreadyTakenCourses.value = []

    const courseToTakeIds = Object.keys(selectedSchedules.value) // normalized IDs
    
    if (courseToTakeIds.length === 0) {
      Notify.create({ type: 'warning', message: 'Please select at least one course to enroll' })
      return
    }

    // Check prerequisites first
    const token = localStorage.getItem('authToken')
    const response = await Axios.post(
      `${process.env.api_host}/queues/checkPrerequisites`,
      {
        studentId: userData.value._id,
        selectedCourses: courseToTakeIds,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )

    if (response.data.missing) {
      // Handle missing prerequisites
      if (response.data.missingPrerequisites) {
        prerequisitesRow.value = Object.entries(response.data.missingPrerequisites).map(
          ([course, prerequisites]) => ({
            id: course,
            course: course,
            prerequisites: prerequisites.map((prereq) => prereq.name).join(', '),
          }),
        )
      }
      
      // Handle already taken courses
      if (response.data.alreadyTakenCourses) {
        alreadyTakenCourses.value = response.data.alreadyTakenCourses
      }

      prerequisitesMessage.value = response.data
      Notify.create({ type: 'negative', message: response.data.message || 'Prerequisites check failed' })
      return
    }

    // All prerequisites met, proceed with enrollment
    const scheduleIds = Object.values(selectedSchedules.value).flat()

    await Axios.post(`${process.env.api_host}/users/update/${userData.value._id}`, {
      courseToTake: courseToTakeIds,
      courseToTakeRemoved: [],
      schedule: scheduleIds,
      isEnrolled: true,
      isApproved: false,
    })
    
    Notify.create({ type: 'positive', message: 'Enrollment successful!' })
    redirect('/thankYou')
  } catch (err) {
    // console.error('Error during enrollment:', err)
    Notify.create({ type: 'negative', message: err.response?.data?.message || 'Failed to enroll courses' })
  } finally {
    enrollLoading.value = false
  }
}

// Flatten schedules into a list for display/search
const flatFilteredSchedules = computed(() => {
  const all = []
  for (const [courseId, scheds] of Object.entries(scheduleOptions.value)) {
    const course = rowsById.value[courseId]
    if (!course) continue
    scheds.forEach((s) => {
      all.push({
        ...s,
        courseId, // normalized id used by template
        courseName: course.name,
        courseCode: course.code,
        program: course.course,
        year: course.year,
        semester: course.semester,
        unit: course.unit,
      })
    })
  }

  if (!searchQuery.value) return all

  const q = searchQuery.value.toLowerCase()
  return all.filter(
    (s) =>
      (s.courseName || '').toLowerCase().includes(q) ||
      (s.courseCode || '').toLowerCase().includes(q) ||
      (s.program || '').toLowerCase().includes(q) ||
      (s.code || '').toLowerCase().includes(q),
  )
})

// Selected schedule details
const selectedScheduleDetails = computed(() => {
  const details = []
  for (const [courseId, scheduleIds] of Object.entries(selectedSchedules.value)) {
    const course = rowsById.value[courseId]
    const schedList = scheduleOptions.value[courseId] || []
    for (const scheduleId of scheduleIds) {
      const schedule = schedList.find((s) => toId(s._id) === toId(scheduleId))
      details.push({
        courseTitle: course?.name || '',
        code: course?.code || '',
        program: course?.course || '',
        year: course?.year || '',
        semester: course?.semester || '',
        scheduleText: schedule?.dayTime || '',
      })
    }
  }
  return details
})

// Total selected units (count each course once if it has any selected schedule)
const totalUnits = computed(() => {
  let sum = 0
  for (const [courseId, scheduleIds] of Object.entries(selectedSchedules.value)) {
    if (scheduleIds.length > 0) {
      const course = rowsById.value[courseId]
      const u = course?.unit ?? course?.units ?? 0
      sum += Number(u) || 0
    }
  }
  return sum
})

// Check if there are any prerequisite issues
const hasPrerequisiteIssues = computed(() => {
  return (prerequisitesRow.value && prerequisitesRow.value.length > 0) || alreadyTakenCourses.value.length > 0
})

onMounted(async () => {
  await getUser()
  await fetchCourses()
})
</script>
