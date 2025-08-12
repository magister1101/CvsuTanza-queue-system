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
        <!-- Add Schedule Form -->
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Add Schedule</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-select
                v-model="selectedSchedule"
                :options="scheduleOptions"
                label="Select Schedule"
                option-label="label"
                option-value="_id"
                dense
                outlined
                emit-value
                map-options
              />
            </div>
            <div class="col-12">
              <q-btn
                color="primary"
                label="Add"
                @click="addSchedule"
                :disable="!selectedSchedule || addLoading"
                :loading="addLoading"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator spaced />

        <!-- Schedule List -->
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Schedule</div>
          <div v-if="groupedSchedule.length">
            <q-list bordered separator>
              <q-item
                v-for="(group, index) in groupedSchedule"
                :key="group.code"
                class="q-pa-sm column"
              >
                <q-item-section>
                  <div class="row items-center justify-between">
                    <div>
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
                    <q-btn
                      icon="delete"
                      color="negative"
                      dense
                      flat
                      @click="removeSchedule(index)"
                      :loading="removeLoading"
                      :disable="removeLoading"
                    />
                  </div>

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
          <q-btn flat label="Close" color="primary" v-close-popup @click="fetchStudents" />
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
// dialogCourseToTake used to find course name for flattened UI
const dialogCourseToTake = ref([])
// Raw schedule array in DB shape (array of subjects with schedule arrays)
const dialogScheduleRaw = ref([])
// Flattened schedule used for UI (one entry per day/time + code/section/courseName)
const dialogSchedule = ref([])
const currentUserId = ref(null)

const preRegTotal = ref(0)
const regTotal = ref(0)
const appTotal = ref(0)

// Schedules from API for adding
const selectedSchedule = ref(null)
const scheduleOptions = ref([])

// loading flags
const removeLoading = ref(false)
const addLoading = ref(false)

//
// Helpers
//
function flattenFromRaw(raw) {
  // raw: [{ course: <id|obj>, code, section, schedule: [{day,startTime,endTime}] , ... }, ...]
  return (raw || []).flatMap((subject) => {
    // resolve courseName:
    let courseName = 'Unknown Course'
    // first try dialogCourseToTake (student's enrolled courses)
    if (dialogCourseToTake.value && dialogCourseToTake.value.length) {
      const found = dialogCourseToTake.value.find((c) => {
        // subject.course might be id string or an object
        if (!c || !subject.course) return false
        const subjCourseId =
          typeof subject.course === 'string'
            ? subject.course
            : subject.course._id || subject.course.id
        return c._id === subjCourseId
      })
      if (found && found.name) courseName = found.name
    }
    // fallback if subject.course itself contains name
    if (subject.course && subject.course.name && typeof subject.course === 'object') {
      courseName = subject.course.name
    }
    // if subject has courseName property (we set it when adding), use it
    if (subject.courseName) courseName = subject.courseName

    return (subject.schedule || []).map((s) => ({
      // copy day/time
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
      // meta
      code: subject.code,
      section: subject.section,
      courseName,
    }))
  })
}

const groupedSchedule = computed(() => {
  const groups = {}
  dialogSchedule.value.forEach((sched) => {
    const key = sched.code
    if (!groups[key]) {
      groups[key] = {
        code: sched.code,
        section: sched.section,
        course: sched.courseName || sched.course,
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
  { name: 'studentNumber', label: 'Student Number', field: 'studentNumber', sortable: true },
  { name: 'lastName', label: 'Last Name', field: 'lastName', sortable: true },
  { name: 'firstName', label: 'First Name', field: 'firstName', sortable: true },
  { name: 'program', label: 'Program', field: 'course', sortable: true },
  {
    name: 'isRegular',
    label: 'Regular',
    field: 'isRegular',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  {
    name: 'isApproved',
    label: 'Approved',
    field: 'isApproved',
    format: (val) => (val ? 'Yes' : 'No'),
  },
  { name: 'actions', label: 'View', field: 'action', align: 'center' },
  { name: 'reject', label: 'Reject', field: 'reject', align: 'center' },
  { name: 'verify', label: 'Verify', field: 'verify', align: 'center' },
]

const pagination = ref({ rowsPerPage: 10 })

function openDialog(row) {
  currentUserId.value = row._id
  dialogCourseToTake.value = row.courseToTake || []
  // store raw schedule as-is (expected DB shape)
  dialogScheduleRaw.value = JSON.parse(JSON.stringify(row.schedule || []))
  // build flattened UI schedule
  dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)
  dialogOpen.value = true
}

async function fetchSchedules() {
  try {
    const res = await Axios.get(
      `${process.env.api_host}/courses/GetSchedule?program=${userData.value.role}`,
    )
    scheduleOptions.value = res.data.map((item) => ({
      _id: item._id,
      label: `${item.course.name} (Section ${item.section}) - ${item.code}`,
      data: item,
    }))
  } catch (err) {
    console.error('Error fetching schedules:', err)
  }
}
async function addSchedule() {
  const selected = scheduleOptions.value.find((opt) => opt._id === selectedSchedule.value)
  if (!selected || !currentUserId.value) return

  // For UI display — keep the subject object in dialogScheduleRaw
  const subject = {
    course: selected.data.course._id || selected.data.course,
    code: selected.data.code,
    section: selected.data.section,
    schedule: (selected.data.schedule || []).map((s) => ({
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    courseName: selected.data.course.name,
  }

  // Optimistic update for UI
  dialogScheduleRaw.value.push(subject)
  dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)

  addLoading.value = true
  try {
    await Axios.post(`${process.env.api_host}/users/addSchedule`, {
      userId: currentUserId.value,
      scheduleId: selected._id,
    })

    $q.notify({ type: 'positive', message: 'Schedule added successfully' })
    selectedSchedule.value = null
  } catch (err) {
    // Rollback optimistic update
    dialogScheduleRaw.value = dialogScheduleRaw.value.filter(
      (s) => s.code !== subject.code || s.section !== subject.section,
    )
    dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)
    console.error('Error saving schedule:', err)
    $q.notify({ type: 'negative', message: 'Failed to save schedule' })
  } finally {
    addLoading.value = false
  }
}

// remove whole subject group (by grouped index)
async function removeSchedule(index) {
  const groups = groupedSchedule.value
  if (!groups[index]) return

  const codeToRemove = groups[index].code
  // optimistic: filter out subjects with that code
  const previousRaw = JSON.parse(JSON.stringify(dialogScheduleRaw.value))
  dialogScheduleRaw.value = dialogScheduleRaw.value.filter((s) => s.code !== codeToRemove)
  dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)

  removeLoading.value = true
  try {
    await Axios.post(`${process.env.api_host}/users/update/${currentUserId.value}`, {
      schedule: dialogScheduleRaw.value,
    })
    $q.notify({ type: 'positive', message: 'Schedule removed successfully' })
  } catch (err) {
    // rollback
    dialogScheduleRaw.value = previousRaw
    dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)
    console.error('Error removing schedule:', err)
    $q.notify({ type: 'negative', message: 'Failed to remove schedule' })
  } finally {
    removeLoading.value = false
  }
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
    await Axios.post(`${process.env.api_host}/users/update/${id}`, { isApproved: true })
    await Axios.post(`${process.env.api_host}/queues/createQueue`, { studentId: id })
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
    await Axios.post(`${process.env.api_host}/queues/rejectEnrollment`, { studentId: id })
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
  await fetchSchedules()
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
