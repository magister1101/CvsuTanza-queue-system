<template>
  <q-page class="q-pa-md">
    <div class="stats-container">
      <div class="stat-card">
        <q-card-section>
          <div class="text-h4 text-weight-bold">{{ preRegTotal }}</div>
          <div class="text-h6">Pre-Registered Students</div>
        </q-card-section>
      </div>
      <div class="stat-card">
        <q-card-section>
          <div class="text-h4 text-weight-bold">{{ regTotal }}</div>
          <div class="text-h6">Registered Students</div>
        </q-card-section>
      </div>
      <div class="stat-card">
        <q-card-section>
          <div class="text-h4 text-weight-bold">{{ appTotal }}</div>
          <div class="text-h6">Approved Students</div>
        </q-card-section>
      </div>
    </div>

    <!-- Table -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Verify Students</div>
      </q-card-section>

      <q-table
        title="Students"
        :rows="rows"
        :columns="columns"
        row-key="_id"
        v-model:selected="selected"
        :pagination="pagination"
        flat
        bordered
        :loading="tableLoading"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn dense flat color="green" label="View" @click="openDialog(props.row)" />
          </q-td>

          <q-td :props="props" class="text-center">
            <q-btn
              dense
              flat
              color="red"
              label="Reject"
              @click="reject(props.row._id)"
              :loading="verifyLoading"
            />
          </q-td>

          <q-td :props="props" class="text-center">
            <q-btn
              dense
              flat
              color="primary"
              label="Verify"
              @click="verify(props.row._id)"
              :loading="verifyLoading"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog -->
    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 300px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Courses To Take</div>
        </q-card-section>

        <q-card-section>
          <div v-if="dialogCourseToTake.length">
            <q-list bordered separator>
              <q-item v-for="(course, index) in dialogCourseToTake" :key="index" class="q-pa-sm">
                <q-item-section>
                  <div class="text-subtitle2">{{ course.name }} ({{ course.code }})</div>
                  <div class="text-body2">
                    <strong>Program:</strong> {{ course.course }}<br />
                    <strong>Semester:</strong> {{ course.semester }}<br />
                    <strong>Units:</strong> {{ course.unit }}<br />
                    <strong>Description:</strong> {{ course.description || 'N/A' }}
                  </div>

                  <div v-if="course.prerequisite?.length" class="q-mt-sm">
                    <strong>Prerequisites:</strong>
                    <ul class="q-pl-md">
                      <li v-for="(pre, i) in course.prerequisite" :key="i" class="text-caption">
                        {{ pre.name }} ({{ pre.code }} - {{ pre.unit }} unit{{
                          pre.unit !== 1 ? 's' : ''
                        }}, {{ pre.semester }} Semester)
                      </li>
                    </ul>
                  </div>
                  <div v-else class="q-mt-sm text-caption">
                    <em>No prerequisites</em>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else>No courseToTake found.</div>
        </q-card-section>

        <!-- Schedule section -->
        <q-separator spaced />
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Schedule</div>
          <div v-if="groupedSchedule.length">
            <q-list bordered separator>
              <q-item v-for="(group, index) in groupedSchedule" :key="index" class="q-pa-sm column">
                <q-item-section>
                  <!-- Header: Course, Section, Code -->
                  <div class="text-subtitle1">
                    <strong>Course:</strong> {{ group.course }}<br />
                    <strong>Section:</strong> {{ group.section }}<br />
                    <strong>Code:</strong>
                    <q-badge
                      color="primary"
                      class="cursor-pointer"
                      @click="copyToClipboard(group.code)"
                    >
                      {{ group.code }}
                    </q-badge>
                  </div>

                  <!-- Schedule list -->
                  <div class="q-ml-lg q-mt-sm">
                    <div v-for="(sched, i) in group.schedules" :key="i">
                      <strong>Day:</strong> {{ sched.day }}<br />
                      <strong>Time:</strong> {{ sched.startTime }} - {{ sched.endTime }}
                      <q-separator spaced />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else>No schedule found.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Axios from 'axios'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const rows = ref([])
const selected = ref([])
const userData = ref({})
const verifyLoading = ref(false)
const tableLoading = ref(true)

const dialogOpen = ref(false)
const dialogCourseToTake = ref([])
const dialogSchedule = ref([])

const preRegTotal = ref(0)
const regTotal = ref(0)
const appTotal = ref(0)

const groupedSchedule = computed(() => {
  const groups = {}

  dialogSchedule.value.forEach((sched) => {
    const key = sched.code // Code is still the key

    if (!groups[key]) {
      groups[key] = {
        code: sched.code,
        section: sched.section,
        course: sched.courseName || sched.course, // fallback if courseName is not set
        schedules: [],
      }
    }

    groups[key].schedules.push({
      day: sched.day,
      startTime: sched.startTime,
      endTime: sched.endTime,
    })
  })

  return Object.values(groups)
})

const columns = [
  {
    name: 'studentNumber',
    label: 'Student Number',
    field: 'studentNumber',
    sortable: true,
    align: 'left',
  },
  { name: 'lastName', label: 'Last Name', field: 'lastName', sortable: true, align: 'left' },
  { name: 'firstName', label: 'First Name', field: 'firstName', sortable: true, align: 'left' },
  {
    name: 'program',
    label: 'Program',
    field: 'course',
    sortable: true,
    align: 'left',
    style: 'max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
  },
  {
    name: 'isRegular',
    label: 'Regular',
    field: 'isRegular',
    sortable: true,
    align: 'left',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    name: 'isApproved',
    label: 'Approved',
    field: 'isApproved',
    sortable: true,
    align: 'left',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  { name: 'actions', label: 'View', field: 'action', align: 'center' },
  { name: 'reject', label: 'Reject', field: 'reject', align: 'center' },
  { name: 'verify', label: 'Verify', field: 'verify', align: 'center' },
]

const pagination = ref({ rowsPerPage: 10 })

function openDialog(row) {
  dialogCourseToTake.value = row.courseToTake || []

  dialogSchedule.value = (row.schedule || []).flatMap((subject) => {
    // Find course name from dialogCourseToTake
    const courseInfo = dialogCourseToTake.value.find((c) => c._id === subject.course)

    return (subject.schedule || []).map((sched) => ({
      ...sched,
      code: subject.code,
      section: subject.section,
      courseName: courseInfo ? courseInfo.name : 'Unknown Course',
    }))
  })

  dialogOpen.value = true
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  $q.notify({ message: 'Code copied to clipboard!', color: 'green-4', icon: 'check' })
}

async function getUser() {
  try {
    const token = localStorage.getItem('authToken')
    const res = await Axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: { Authorization: token },
    })
    userData.value = res.data
  } catch (err) {
    console.error('Error fetching user:', err)
  }
}

async function fetchStudents() {
  try {
    const res = await Axios.get(`${process.env.api_host}/users`, {
      params: {
        isArchived: false,
        role: 'student',
        isEnrolled: true,
        isApproved: false,
        program: userData.value.role,
        year: userData.value.year,
      },
    })
    rows.value = res.data
  } catch (err) {
    console.error('Error fetching students:', err)
  } finally {
    tableLoading.value = false
  }
}

async function getTotalCounts() {
  try {
    const program = userData.value.role
    const year = userData.value.year

    const [preRes, regRes, appRes] = await Promise.all([
      Axios.get(`${process.env.api_host}/users`, {
        params: {
          isArchived: false,
          role: 'student',
          program,
          year,
          isEnrolled: false,
          isApproved: false,
        },
      }),
      Axios.get(`${process.env.api_host}/users`, {
        params: {
          isArchived: false,
          role: 'student',
          program,
          year,
          isEnrolled: true,
          isApproved: false,
        },
      }),
      Axios.get(`${process.env.api_host}/users`, {
        params: {
          isArchived: false,
          role: 'student',
          program,
          year,
          isEnrolled: true,
          isApproved: true,
        },
      }),
    ])

    preRegTotal.value = preRes.data.length
    regTotal.value = regRes.data.length
    appTotal.value = appRes.data.length
  } catch (err) {
    console.error('Error fetching totals:', err)
  }
}

async function verify(id) {
  try {
    verifyLoading.value = true

    await Axios.post(`${process.env.api_host}/users/update/${id}`, {
      isApproved: true,
    })

    await Axios.post(`${process.env.api_host}/queues/createQueue`, {
      studentId: id,
    })

    $q.notify({ type: 'positive', message: 'Student verified successfully' })
    fetchStudents()
    getTotalCounts()
  } catch (err) {
    console.error('Error verifying:', err)
    $q.notify({ type: 'negative', message: 'Verification failed' })
  } finally {
    verifyLoading.value = false
  }
}

async function reject(id) {
  try {
    verifyLoading.value = true

    await Axios.post(`${process.env.api_host}/users/update/${id}`, {
      isApproved: false,
      isEnrolled: false,
    })

    await Axios.post(`${process.env.api_host}/queues/rejectEnrollment`, {
      studentId: id,
    })

    $q.notify({ type: 'positive', message: 'Student rejected successfully' })
    fetchStudents()
    getTotalCounts()
  } catch (err) {
    console.error('Error rejecting:', err)
    $q.notify({ type: 'negative', message: 'Rejection failed' })
  } finally {
    verifyLoading.value = false
  }
}

onMounted(async () => {
  await getUser()
  await getTotalCounts()
  await fetchStudents()
})
</script>

<style lang="sass" scoped>
.stats-container
  display: flex
  flex-wrap: wrap
  gap: 20px
  margin-top: 20px
  justify-content: space-between

.stat-card
  color: #30582d
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
</style>
