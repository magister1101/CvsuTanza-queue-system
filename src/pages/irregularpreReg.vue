<template>
  <q-page class="q-pa-md">
    <!-- Back button -->
    <q-card-section>
      <q-btn flat @click="redirect('/regOrIrreg')">
        <q-icon name="arrow_back_ios" />
      </q-btn>
    </q-card-section>

    <!-- Selected Schedules Section -->
    <q-card class="q-mt-md" v-if="selectedScheduleDetails.length > 0">
      <q-card-section>
        <div class="text-h6">Selected Schedules</div>
      </q-card-section>
      <q-card-section>
        <q-btn
          label="Enroll"
          color="primary"
          @click="enroll"
          :disable="selectedScheduleDetails.length === 0"
          :loading="enrollLoading"
        />
      </q-card-section>
      <q-card-section>
        <q-list bordered separator>
          <q-item v-for="(item, index) in selectedScheduleDetails" :key="index">
            <q-item-section>
              <div class="text-subtitle1">{{ item.courseTitle }} ({{ item.code }})</div>
              <div class="text-caption text-grey">
                Program: {{ item.program }} | Year: {{ item.year }} | Semester: {{ item.semester }}
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
            @click="onScheduleSelected(sched.course, sched._id)"
          >
            <q-item-section>
              <div class="text-subtitle1">{{ sched.courseName }} ({{ sched.courseCode }})</div>
              <div class="text-caption text-grey">
                Program: {{ sched.program }} | Year: {{ sched.year }} | Semester:
                {{ sched.semester }}
              </div>
              <div class="q-mt-xs">
                <q-badge
                  :color="
                    (selectedSchedules[sched.course] || []).includes(sched._id)
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

const router = useRouter()

const rows = ref([])
const userData = ref({})
const tableLoading = ref(true)
const enrollLoading = ref(false)

// courseId -> [scheduleId, scheduleId...]
const selectedSchedules = ref({})
const scheduleOptions = ref({})
const searchQuery = ref('')

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
    const res = await Axios.get(`${process.env.api_host}/courses?`)
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
        dayTime: `Section ${sched.section} - ${scheduleText}`,
      })
    }

    rows.value = allCourses
    scheduleOptions.value = scheduleMap
  } catch (err) {
    console.error('Error fetching courses or schedules:', err)
  } finally {
    tableLoading.value = false
  }
}

function onScheduleSelected(courseId, scheduleId) {
  if (!selectedSchedules.value[courseId]) {
    selectedSchedules.value[courseId] = []
  }
  const index = selectedSchedules.value[courseId].indexOf(scheduleId)
  if (index === -1) {
    selectedSchedules.value[courseId].push(scheduleId) // add
  } else {
    selectedSchedules.value[courseId].splice(index, 1) // remove
  }
}

async function enroll() {
  try {
    enrollLoading.value = true

    // Flatten courseToTake and scheduleIds
    const courseToTakeIds = Object.keys(selectedSchedules.value)
    const scheduleIds = Object.values(selectedSchedules.value).flat()

    await Axios.post(`${process.env.api_host}/users/update/${userData.value._id}`, {
      courseToTake: courseToTakeIds,
      courseToTakeRemoved: [],
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

// Flatten schedules into a list
const flatFilteredSchedules = computed(() => {
  let all = []
  for (const [courseId, scheds] of Object.entries(scheduleOptions.value)) {
    const course = rows.value.find((c) => c._id === courseId)
    if (course) {
      scheds.forEach((s) => {
        all.push({
          ...s,
          course: courseId,
          courseName: course.name,
          courseCode: course.code,
          program: course.course,
          year: course.year,
          semester: course.semester,
        })
      })
    }
  }

  if (!searchQuery.value) return all

  const query = searchQuery.value.toLowerCase()
  return all.filter(
    (s) =>
      s.courseName.toLowerCase().includes(query) ||
      s.courseCode.toLowerCase().includes(query) ||
      s.program.toLowerCase().includes(query),
  )
})

// Selected schedule details
const selectedScheduleDetails = computed(() => {
  let details = []
  for (const [courseId, scheduleIds] of Object.entries(selectedSchedules.value)) {
    const course = rows.value.find((c) => c._id === courseId)
    scheduleIds.forEach((scheduleId) => {
      const schedule = (scheduleOptions.value[courseId] || []).find((s) => s._id === scheduleId)
      details.push({
        courseTitle: course?.name || '',
        code: course?.code || '',
        program: course?.course || '',
        year: course?.year || '',
        semester: course?.semester || '',
        scheduleText: schedule?.dayTime || '',
      })
    })
  }
  return details
})

onMounted(async () => {
  await getUser()
  await fetchCourses()
})
</script>
