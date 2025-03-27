<template>
  <q-page style="height: 90vh">
    <div class="main-container">
      <div class="content-container q-px-md q-px-sm-xl">
        <q-card-section class="q-pt-md">
          <div class="text-h4 text-weight-medium" style="color: #282726">Hi, {{ firstName }}</div>
        </q-card-section>
        <div class="stats-container">
          <div class="stat-card">
            <q-card-section>
              <div class="text-h4 text-weight-bold">{{ totalStudents }}</div>
              <div class="text-h6">Enrolled Students</div>
            </q-card-section>
          </div>
          <div class="stat-card">
            <q-card-section>
              <div class="text-h4 text-weight-bold">{{ totalCourses }}</div>
              <div class="text-h6">Total Courses</div>
            </q-card-section>
          </div>
          <div class="stat-card">
            <q-card-section>
              <div class="text-h4 text-weight-bold">{{ totalPrograms }}</div>
              <div class="text-h6">Total Programs</div>
            </q-card-section>
          </div>
          <div class="stat-card">
            <q-card-section>
              <div class="text-h4 text-weight-bold">{{ totalQueue }}</div>
              <div class="text-h6">Total Queue</div>
            </q-card-section>
          </div>
        </div>
        <!-- table -->
        <div class="q-mt-lg">
          <q-table
            style="border-radius: 14px; background-color: #fdffdf"
            title="Recent Students"
            :rows="rows"
            :columns="columns"
            row-key="studentId"
            separator="cell"
            :rows-per-page-options="[0, 15, 20, 25, 30]"
            class="responsive-table"
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td v-for="col in columns" :key="col.name" :props="props">
                  <template v-if="col.name === '#'">
                    {{ props.rowIndex + 1 }}
                  </template>
                  <template v-else>
                    {{ props.row[col.name] }}
                  </template>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top-left>
              <q-btn label="Signup Link" @click="copySignUp" no-caps>
                <q-tooltip> Registration Link for student </q-tooltip>
              </q-btn>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const userRole = ref()
const firstName = ref('')
const totalStudents = ref(0)
const totalPrograms = ref(0)
const totalCourses = ref(0)
const totalQueue = ref(0)
const columns = ref([
  {
    name: '#',
    required: true,
    label: '#',
    align: 'center',
    field: (row, index) => index + 1,
    sortable: true,
  },
  {
    name: 'studentId',
    required: true,
    label: 'Student Number',
    align: 'left',
    field: (row) => row.studentId,
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Student Name',
    field: 'name',
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
  },
  {
    name: 'username',
    align: 'left',
    label: 'Username',
    field: 'username',
  },
  {
    name: 'program',
    align: 'left',
    label: 'Program',
    field: 'program',
    sortable: true,
  },
  {
    name: 'year',
    align: 'left',
    label: 'Year',
    field: 'year',
    sortable: true,
  },
  {
    name: 'section',
    align: 'left',
    label: 'Section',
    field: 'section',
    sortable: true,
  },
  {
    name: 'courses',
    align: 'left',
    label: 'Course Taken',
    field: 'courses',
  },
  {
    name: 'status',
    align: 'left',
    label: 'Status',
    field: 'status',
    sortable: true,
  },
])
const rows = ref([])
const clearLocalStorage = () => {
  localStorage.clear()
}
async function getUsers() {
  try {
    const response = await axios.get(`${process.env.api_host}/users?role=student&&isArchived=false`)
    rows.value = response.data.map((student) => ({
      studentId: student.studentNumber,
      name: `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`.trim(),
      username: student.username,
      email: student.email,
      program: student.course,
      year: student.year,
      section: student.section,
      courses: student.courses?.map((course) => course.code).join(', '),
      status: student.isRegular ? 'Regular' : 'Irregular',
    }))
    totalStudents.value = response.data.length
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

async function userInfo() {
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })
    firstName.value = response.data.firstName
    userRole.value = response.data.role
    if (userRole.value === 'student') {
      Notify.create({
        type: 'warning',
        message: 'You are not authorized to access this page',
      })
      router.replace('/')
      clearLocalStorage()
    }
    return
  } catch (err) {
    console.error(err)
  }
}
async function getPrograms() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(
      `${process.env.api_host}/courses/getProgram?isArchived=false`,
      {
        headers: {
          Authorization: token,
        },
      },
    )
    totalPrograms.value = response.data.length
  } catch (err) {
    console.error(err)
  }
}
async function getCourses() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${process.env.api_host}/courses?isArchived=false`, {
      headers: {
        Authorization: token,
      },
    })
    totalCourses.value = response.data.length
  } catch (err) {
    console.error('Error fetching programs:', err)
  }
}

async function getQeueue() {
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${process.env.api_host}/queues?query=Waiting`, {
      headers: {
        Authorization: token,
      },
    })
    totalQueue.value = response.data.length
  } catch (err) {
    console.error(err)
  }
}

async function copySignUp() {
  const registrationLink = `https://queuing-nu.vercel.app/#/studentRegister`
  try {
    await navigator.clipboard.writeText(registrationLink)
    Notify.create({
      type: 'positive',
      message: 'Registration link copied to clipboard!',
      position: 'top',
    })
  } catch (err) {
    console.error('Failed to copy:', err)
    Notify.create({
      type: 'negative',
      message: 'Failed to copy link',
      position: 'top',
    })
  }
}

onMounted(() => {
  getUsers()
  userInfo()
  getPrograms()
  getCourses()
  getQeueue()
})
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100%

.stats-container
  display: flex
  flex-wrap: wrap
  gap: 20px
  margin-top: 20px
  justify-content: space-between

.stat-card
  color: #30582d
  background-color: #fdffdf
  border-radius: 14px
  flex: 1
  min-width: 250px
  max-width: calc(25% - 15px)

@media (max-width: 1200px)
  .stat-card
    max-width: calc(50% - 10px)

@media (max-width: 600px)
  .stat-card
    max-width: 100%

.responsive-table
  :deep(.q-table__container)
    overflow-x: auto

  :deep(.q-table)
    min-width: 600px

@media (max-width: 600px)
  .q-table__grid-content
    flex: 1 1 100%
</style>
