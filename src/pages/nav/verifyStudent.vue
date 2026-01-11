<template>
  <q-page class="q-pa-md">
    <!-- Stats -->
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
        </template>
      </q-table>
    </q-card>

    <!-- Dialog -->
    <q-dialog v-model="dialogOpen">
      <q-card class="student-info-dialog" style="min-width: 300px; max-width: 800px">
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Student Information</div>
          <q-card-section>
            <div class="text-subtitle1 q-mb-sm">
              Name: {{ dialogStudent.lastName }}, {{ dialogStudent.firstName }}
            </div>
            <div class="text-subtitle1 q-mb-sm">
              Student Number: {{ dialogStudent.studentNumber }}
            </div>
            <div class="text-subtitle1 q-mb-sm">
              Year & Section: {{ dialogStudent.year }} - {{ dialogStudent.section }}
            </div>
            <div class="q-mt-md">
              <q-btn
                v-if="dialogCourses.length"
                label="Check List"
                color="primary"
                outline
                dense
                @click="showGradesDialog = true"
              />
            </div>
          </q-card-section>
        </q-card-section>

        <q-separator spaced />

        <!-- Course To Take -->
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Course To Take</div>

          <!-- Add Course Form -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12">
              <q-select
                v-model="selectedCourseToTake"
                :options="courseOptions"
                option-value="_id"
                :option-label="formatCourse"
                emit-value
                map-options
                label="Select Course"
                outlined
              />
            </div>
            <div class="col-12">
              <q-btn
                color="primary"
                label="Add Course"
                @click="addCourseToTake"
                :disable="!selectedCourseToTake || addCourseLoading"
                :loading="addCourseLoading"
              />
            </div>
          </div>

          <!-- Current List -->
          <div v-if="dialogCourseToTake.length">
            <q-list bordered separator>
              <q-item v-for="(course, index) in dialogCourseToTake" :key="index">
                <q-item-section>
                  <strong>{{ formatCourse(course) }}</strong
                  ><br />
                  Unit: {{ course.unit }} | Semester: {{ course.semester }}
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    icon="delete"
                    color="negative"
                    dense
                    flat
                    @click="removeCourseToTake(course._id)"
                    :loading="removeCourseLoading && removeCourseId === course._id"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else>No course to take found.</div>
        </q-card-section>

        <q-separator spaced />

        <!-- Course To Take Removed -->
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm text-red">Removed Courses</div>

          <div v-if="dialogCourseToTakeRemoved.length">
            <q-list bordered separator>
              <q-item v-for="(course, index) in dialogCourseToTakeRemoved" :key="index">
                <q-item-section>
                  <strong class="text-red">{{ formatCourse(course) }}</strong
                  ><br />
                  Unit: {{ course.unit }} | Semester: {{ course.semester }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else>No removed courses found.</div>
        </q-card-section>

        <q-separator spaced />

        <!-- Schedule List -->
        <!-- Add Schedule Form -->
        <!-- <q-card-section>
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
        </q-card-section> -->
        <!-- <q-card-section>
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
        </q-card-section> -->

        <!-- Actions inside dialog -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Validation"
            :color="hasCourseChanges ? 'red' : 'primary'"
            @click="validateStudent(currentUserId)"
            :loading="verifyLoading"
          />
          <q-btn flat label="Close" color="grey" v-close-popup @click="fetchStudents" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Course Confirmation Dialog -->
    <q-dialog v-model="confirmDeleteCourseDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Confirm Remove Course</div>
          <div class="q-mt-md">
            Are you sure you want to remove <strong>{{ courseToDeleteName }}</strong>? This will auto-reject the student.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="grey" @click="confirmDeleteCourseDialog = false" />
          <q-btn
            flat
            label="Confirm"
            color="negative"
            @click="confirmRemoveCourse"
            :loading="removeCourseLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Check List Dialog -->
    <q-dialog v-model="showGradesDialog" persistent>
      <q-card style="min-width: 900px; max-width: 95vw; max-height: 90vh" class="checklist-dialog">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="checklist" class="q-mr-sm" />
          <div class="text-h6">Check List</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <!-- Year Level Filter -->
          <div class="q-pa-md q-pb-sm">
            <q-btn-toggle
              v-model="selectedYearFilter"
              toggle-color="primary"
              :options="[
                { label: 'All Years', value: 'all' },
                { label: 'First Year', value: 'First' },
                { label: 'Second Year', value: 'Second' },
                { label: 'Third Year', value: 'Third' },
                { label: 'Fourth Year', value: 'Fourth' }
              ]"
              class="full-width"
            />
          </div>

          <!-- Semester Tabs -->
          <q-tabs v-model="selectedGradeTab" class="text-grey q-px-md" active-color="primary" indicator-color="primary" align="justify">
            <q-tab name="first" label="First Semester" />
            <q-tab name="second" label="Second Semester" />
            <q-tab name="summer" label="Summer" />
            <q-tab name="all" label="All" />
          </q-tabs>

          <!-- Checklist Table -->
          <div v-if="allCoursesList?.length" class="checklist-table-container">
            <q-tab-panels v-model="selectedGradeTab" animated>
              <!-- First Semester -->
              <q-tab-panel name="first" class="q-pa-none">
                <div class="checklist-semester-header">{{ getYearHeader() }} - First Semester</div>
                <q-table
                  flat
                  dense
                  :rows="firstSemesterCourses"
                  :columns="checklistColumns"
                  :row-key="(row) => `${row.courseId?._id || row.courseId}-${row.sem || row.courseId?.semester}-${row.year || row.courseId?.year}`"
                  :loading="!allCoursesList.length"
                  class="checklist-table"
                  :rows-per-page-options="[0]"
                >
                  <template v-slot:body-cell-finalRating="props">
                    <q-td :props="props" class="text-center">
                      <span :class="getGradeTextColor(props.value)">
                        {{ props.value || '-' }}
                      </span>
                    </q-td>
                  </template>
                </q-table>
                <div class="checklist-subtotal">
                  <div class="subtotal-row">
                    <span class="subtotal-label">Subtotal</span>
                    <span class="subtotal-value">{{ getSubtotalUnits(firstSemesterCourses) }}</span>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Second Semester -->
              <q-tab-panel name="second" class="q-pa-none">
                <div class="checklist-semester-header">{{ getYearHeader() }} - Second Semester</div>
                <q-table
                  flat
                  dense
                  :rows="secondSemesterCourses"
                  :columns="checklistColumns"
                  :row-key="(row) => `${row.courseId?._id || row.courseId}-${row.sem || row.courseId?.semester}-${row.year || row.courseId?.year}`"
                  :loading="!allCoursesList.length"
                  class="checklist-table"
                  :rows-per-page-options="[0]"
                >
                  <template v-slot:body-cell-finalRating="props">
                    <q-td :props="props" class="text-center">
                      <span :class="getGradeTextColor(props.value)">
                        {{ props.value || '-' }}
                      </span>
                    </q-td>
                  </template>
                </q-table>
                <div class="checklist-subtotal">
                  <div class="subtotal-row">
                    <span class="subtotal-label">Subtotal</span>
                    <span class="subtotal-value">{{ getSubtotalUnits(secondSemesterCourses) }}</span>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Summer Semester -->
              <q-tab-panel name="summer" class="q-pa-none">
                <div class="checklist-semester-header">Summer Semester</div>
                <q-table
                  flat
                  dense
                  :rows="summerSemesterCourses"
                  :columns="checklistColumns"
                  :row-key="(row) => `${row.courseId?._id || row.courseId}-${row.sem || row.courseId?.semester}-${row.year || row.courseId?.year}`"
                  :loading="!allCoursesList.length"
                  class="checklist-table"
                  :rows-per-page-options="[0]"
                >
                  <template v-slot:body-cell-grade="props">
                    <q-td :props="props" class="text-center">
                      <span :class="getGradeTextColor(props.value)">
                        {{ props.value || '-' }}
                      </span>
                    </q-td>
                  </template>
                </q-table>
                <div class="checklist-subtotal">
                  <div class="subtotal-row">
                    <span class="subtotal-label">Subtotal</span>
                    <span class="subtotal-value">{{ getSubtotalUnits(summerSemesterCourses) }}</span>
                  </div>
                </div>
              </q-tab-panel>

              <!-- All Grades -->
              <q-tab-panel name="all" class="q-pa-none">
                <q-table
                  flat
                  dense
                  :rows="allCoursesFiltered"
                  :columns="checklistColumns"
                  :row-key="(row) => `${row.courseId?._id || row.courseId}-${row.sem || row.courseId?.semester}-${row.year || row.courseId?.year}`"
                  :loading="!allCoursesList.length"
                  class="checklist-table"
                  :rows-per-page-options="[0]"
                >
                  <template v-slot:body-cell-grade="props">
                    <q-td :props="props" class="text-center">
                      <span :class="getGradeTextColor(props.value)">
                        {{ props.value || '-' }}
                      </span>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div v-else class="text-center q-pa-md">
            No grades found.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
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

const removeCourseLoading = ref(false)
const removeCourseId = ref(null)
const confirmDeleteCourseDialog = ref(false)
const courseToDeleteName = ref('')
const courseToDeleteId = ref(null)

const selectedCourseToTake = ref(null)
const courseOptions = ref([])
const addCourseLoading = ref(false)

const dialogOpen = ref(false)
const dialogCourseToTake = ref([])
const dialogCourses = ref([])
const dialogScheduleRaw = ref([])
const dialogSchedule = ref([])
const currentUserId = ref(null)

const dialogStudent = ref()

const preRegTotal = ref(0)
const regTotal = ref(0)
const appTotal = ref(0)

const selectedSchedule = ref(null)
const scheduleOptions = ref([])

const removeLoading = ref(false)
const addLoading = ref(false)

// Grades dialog
const showGradesDialog = ref(false)
const selectedGradeTab = ref('all')
const selectedYearFilter = ref('all')
const allCoursesList = ref([]) // Store all courses from first to fourth year

function formatCourse(course) {
  if (!course) return ''

  return `${course.code} – ${course.name} (${course.course})`
}

function removeCourseToTake(courseId) {
  // Find the course to get its name for the confirmation dialog
  const courseToRemove = dialogCourseToTake.value.find((c) => c._id === courseId)
  courseToDeleteName.value = courseToRemove ? formatCourse(courseToRemove) : 'this course'
  courseToDeleteId.value = courseId
  confirmDeleteCourseDialog.value = true
}

async function confirmRemoveCourse() {
  if (!courseToDeleteId.value) return

  try {
    removeCourseLoading.value = true
    removeCourseId.value = courseToDeleteId.value

    await Axios.post(`${process.env.api_host}/users/removeCourseToTake`, {
      userId: currentUserId.value,
      courseId: courseToDeleteId.value,
    })

    // 🔹 Find the course BEFORE removing it
    const removedCourse = dialogCourseToTake.value.find((c) => c._id === courseToDeleteId.value)

    // 🔹 Remove from "Course To Take"
    dialogCourseToTake.value = dialogCourseToTake.value.filter((c) => c._id !== courseToDeleteId.value)

    // 🔹 Add to "Removed Courses"
    if (removedCourse) {
      dialogCourseToTakeRemoved.value.push(removedCourse)
    }

    // Mark that admin modified courses (auto-reject)
    adminModifiedCourses.value = true
    // Auto-reject when admin removes course
    await autoRejectOnCourseChange()

    confirmDeleteCourseDialog.value = false
    $q.notify({ type: 'positive', message: 'Course removed successfully. Student auto-rejected due to course changes.' })
  } catch (err) {
    // console.error('Error removing course:', err)
    $q.notify({ type: 'negative', message: 'Failed to remove course' })
  } finally {
    removeCourseLoading.value = false
    removeCourseId.value = null
    courseToDeleteId.value = null
    courseToDeleteName.value = ''
    fetchStudents()
  }
}

function flattenFromRaw(raw) {
  return (raw || []).flatMap((subject) => {
    let courseName = 'Unknown Course'
    if (dialogCourseToTake.value && dialogCourseToTake.value.length) {
      const found = dialogCourseToTake.value.find((c) => {
        if (!c || !subject.course) return false
        const subjCourseId =
          typeof subject.course === 'string'
            ? subject.course
            : subject.course._id || subject.course.id
        return c._id === subjCourseId
      })
      if (found && found.name) courseName = found.name
    }
    if (subject.course && subject.course.name && typeof subject.course === 'object') {
      courseName = subject.course.name
    }
    if (subject.courseName) courseName = subject.courseName

    return (subject.schedule || []).map((s) => ({
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
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
]

const pagination = ref({ rowsPerPage: 10 })

const dialogCourseToTakeRemoved = ref([])
const originalCourseToTake = ref([])
const originalCourseToTakeRemoved = ref([])
const adminModifiedCourses = ref(false)
const initialCourseToTakeIds = ref([])

const hasCourseChanges = computed(() => {
  // Only check for admin modifications during this session, not old removed courses from previous enrollments
  // If student re-enrolled, courseToTakeRemoved might contain old data, so we only check admin modifications
  return adminModifiedCourses.value
})

async function fetchAllCourses() {
  try {
    // Fetch all courses for first to fourth year
    const studentProgram = dialogStudent.value?.course || ''
    
    if (!studentProgram) {
      allCoursesList.value = []
      return
    }
    
    const yearFilters = ['First', 'Second', 'Third', 'Fourth']
    const allCoursesPromises = yearFilters.map(year => 
      Axios.get(`${process.env.api_host}/courses`, {
        params: {
          isArchived: false,
          year: year,
          program: studentProgram
        }
      })
    )
    
    const results = await Promise.all(allCoursesPromises)
    const courses = results.flatMap(res => res.data || [])
    allCoursesList.value = courses
  } catch (err) {
    // console.error('Error fetching all courses:', err)
    allCoursesList.value = []
  }
}

async function openDialog(row) {
  currentUserId.value = row._id
  
  // Fetch fresh student data to ensure we have the latest enrollment status
  try {
    const freshStudentRes = await Axios.get(`${process.env.api_host}/users/${row._id}`)
    const freshStudent = freshStudentRes.data
    
    dialogCourseToTake.value = freshStudent.courseToTake || []
    dialogCourseToTakeRemoved.value = []
    
    // Store initial state when dialog opens
    originalCourseToTake.value = JSON.parse(JSON.stringify(freshStudent.courseToTake || []))
    originalCourseToTakeRemoved.value = []
    
    // Store initial course IDs to detect if student re-enrolled
    initialCourseToTakeIds.value = (freshStudent.courseToTake || []).map(c => c._id || c)
    
    // Reset admin modifications flag - only track changes made during this admin session
    adminModifiedCourses.value = false
    
    // Clear removed courses - we'll only track removals made during this admin session
    // If student re-enrolled, courseToTakeRemoved should be empty from backend
    dialogCourseToTakeRemoved.value = []
    
    dialogCourses.value = freshStudent.courses || []
    dialogScheduleRaw.value = JSON.parse(JSON.stringify(freshStudent.schedule || []))
    dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)
    dialogStudent.value = freshStudent
    
    // Fetch all courses for checklist
    await fetchAllCourses()
    
    // Reset grade filters when opening dialog
    selectedGradeTab.value = 'all'
    selectedYearFilter.value = 'all'
  } catch (err) {
    // console.error('Error fetching fresh student data:', err)
    // Fallback to row data if fetch fails
  dialogCourseToTake.value = row.courseToTake || []
    dialogCourseToTakeRemoved.value = []
  originalCourseToTake.value = JSON.parse(JSON.stringify(row.courseToTake || []))
    originalCourseToTakeRemoved.value = []
  adminModifiedCourses.value = false
  dialogCourses.value = row.courses || []
  dialogScheduleRaw.value = JSON.parse(JSON.stringify(row.schedule || []))
  dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)
  dialogStudent.value = row
  
  // Fetch all courses for checklist
  await fetchAllCourses()
  
  // Reset grade filters when opening dialog
  selectedGradeTab.value = 'all'
  selectedYearFilter.value = 'all'
  }
  
  dialogOpen.value = true
}

async function fetchSchedules() {
  try {
    // console.log(userData.value.role)

    if (userData.value.role === 'admin') {
      const res = await Axios.get(`${process.env.api_host}/courses/GetSchedule`)
      scheduleOptions.value = res.data.map((item) => ({
          _id: item._id,
        label: `${item.course.name} (Section ${item.section}) - ${item.code}`,
          data: item,
        }))
    } else {
      const res = await Axios.get(
        `${process.env.api_host}/courses/GetSchedule?program=${userData.value.role}`,
      )
      scheduleOptions.value = res.data.map((item) => ({
          _id: item._id,
        label: `${item.course.name} (Section ${item.section}) - ${item.code}`,
          data: item,
        }))
    }
  } catch (err) {
    // console.error('Error fetching schedules:', err)
  }
}

async function addSchedule() {
  const selected = scheduleOptions.value.find((opt) => opt._id === selectedSchedule.value)
  if (!selected || !currentUserId.value) return

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

  dialogScheduleRaw.value.push(subject)
  dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)

  addLoading.value = true
  verifyLoading.value = true
  try {
    await Axios.post(`${process.env.api_host}/users/addSchedule`, {
      userId: currentUserId.value,
      scheduleId: selected._id,
    })
    $q.notify({ type: 'positive', message: 'Schedule added successfully' })
    selectedSchedule.value = null
  } catch (err) {
    dialogScheduleRaw.value = dialogScheduleRaw.value.filter(
      (s) => s.code !== subject.code || s.section !== subject.section,
    )
    dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)
    // console.error('Error saving schedule:', err)
    $q.notify({ type: 'negative', message: 'Failed to save schedule' })
  } finally {
    addLoading.value = false
    verifyLoading.value = false
  }
}

async function removeSchedule(index) {
  const groups = groupedSchedule.value
  if (!groups[index]) return
  const codeToRemove = groups[index].code
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
    dialogScheduleRaw.value = previousRaw
    dialogSchedule.value = flattenFromRaw(dialogScheduleRaw.value)
    // console.error('Error removing schedule:', err)
    $q.notify({ type: 'negative', message: 'Failed to remove schedule' })
  } finally {
    removeLoading.value = false
  }
}

async function fetchCourses() {
  try {
    const res = await Axios.get(`${process.env.api_host}/courses`)
    courseOptions.value = res.data
  } catch (err) {
    // console.error('Error fetching courses:', err)
  }
}

async function addCourseToTake() {
  try {
    addCourseLoading.value = true

    await Axios.post(`${process.env.api_host}/users/addCourseToTake`, {
      userId: currentUserId.value,
      courseId: selectedCourseToTake.value,
    })

    const addedCourse = courseOptions.value.find((c) => c._id === selectedCourseToTake.value)
    if (addedCourse) {
      dialogCourseToTake.value.push(addedCourse)
    }

    // Remove from removed courses if it was there
    dialogCourseToTakeRemoved.value = dialogCourseToTakeRemoved.value.filter(
      (c) => c._id !== selectedCourseToTake.value
    )

    // Mark that admin modified courses (auto-reject)
    adminModifiedCourses.value = true
    // Auto-reject when admin adds course
    await autoRejectOnCourseChange()

    selectedCourseToTake.value = null
    $q.notify({ type: 'positive', message: 'Course added successfully. Student auto-rejected due to course changes.' })
  } catch (err) {
    // console.error('Error adding course:', err)
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Failed to add course' })
  } finally {
    addCourseLoading.value = false
    fetchStudents()
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
    // console.error('Error fetching user:', err)
  }
}

async function fetchStudents() {
  try {
    if (userData.value.role === 'admin') {
      const res = await Axios.get(`${process.env.api_host}/users`, {
        params: {
          isArchived: false,
          role: 'student',
          isEnrolled: true,
          isApproved: false,
        },
      })
      rows.value = res.data
    } else {
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
    }
  } catch (err) {
    // console.error('Error fetching students:', err)
  } finally {
    tableLoading.value = false
  }
}

async function getTotalCounts() {
  try {
    const program = userData.value.role
    const year = userData.value.year
    if (userData.value.role === 'admin') {
      const [preRes, regRes, appRes] = await Promise.all([
        Axios.get(`${process.env.api_host}/users`, {
          params: {
            isArchived: false,
            role: 'student',

            isEnrolled: false,
            isApproved: false,
          },
        }),
        Axios.get(`${process.env.api_host}/users`, {
          params: {
            isArchived: false,
            role: 'student',

            isEnrolled: true,
            isApproved: false,
          },
        }),
        Axios.get(`${process.env.api_host}/users`, {
          params: {
            isArchived: false,
            role: 'student',

            isEnrolled: true,
            isApproved: true,
          },
        }),
      ])

      preRegTotal.value = preRes.data.length
      regTotal.value = regRes.data.length
      appTotal.value = appRes.data.length
    } else {
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
    }
  } catch (err) {
    // console.error('Error fetching totals:', err)
  }
}

async function autoRejectOnCourseChange() {
  try {
    await Axios.post(`${process.env.api_host}/users/update/${currentUserId.value}`, {
      isApproved: false,
      isEnrolled: false,
    })
    await Axios.post(`${process.env.api_host}/queues/rejectEnrollment`, { studentId: currentUserId.value })
  } catch (err) {
    // console.error('Error auto-rejecting:', err)
  }
}

async function validateStudent(id) {
  try {
    verifyLoading.value = true

    // Check if courses have been removed (original removed courses or admin modifications)
    if (hasCourseChanges.value) {
      // Reject if courses were removed or admin modified courses
      await Axios.post(`${process.env.api_host}/users/update/${id}`, {
        isApproved: false,
        isEnrolled: false,
      })
      await Axios.post(`${process.env.api_host}/queues/rejectEnrollment`, { studentId: id })
      $q.notify({ 
        type: 'negative', 
        message: 'Student rejected: Courses have been modified or removed' 
      })
    } else {
      // Approve if no courses were removed
      await Axios.post(`${process.env.api_host}/users/update/${id}`, { isApproved: true })
      await Axios.post(`${process.env.api_host}/queues/createQueue`, { studentId: id })
      $q.notify({ type: 'positive', message: 'Student validated and approved successfully' })
    }

    fetchStudents()
    getTotalCounts()
    dialogOpen.value = false
  } catch (err) {
    // console.error('Error validating:', err)
    $q.notify({ type: 'negative', message: 'Validation failed' })
  } finally {
    verifyLoading.value = false
  }
}

// CVSU Grading System Helper Functions
// CVSU Grading Scale: 1.0-1.5=Perfect, 1.6-2.5=Good, 2.6-3.0=Pass, 3.1-5.0=Failed
const getGradeColor = (grade) => {
  const numGrade = parseFloat(grade)
  if (isNaN(numGrade)) return 'grey'
  
  if (numGrade >= 1.0 && numGrade <= 1.5) return 'green'      
  if (numGrade >= 1.6 && numGrade <= 2.5) return 'blue'     
  if (numGrade >= 2.6 && numGrade <= 3.0) return 'orange'     
  if (numGrade >= 3.1 && numGrade <= 5.0) return 'red'        
  
  return 'grey'
}

const getGradeDescription = (grade) => {
  const numGrade = parseFloat(grade)
  if (isNaN(numGrade)) return 'Invalid'
  
  if (numGrade >= 1.0 && numGrade <= 1.5) return 'Perfect'
  if (numGrade >= 1.6 && numGrade <= 2.5) return 'Good'
  if (numGrade >= 2.6 && numGrade <= 3.0) return 'Pass'
  if (numGrade >= 3.1 && numGrade <= 5.0) return 'Failed'
  
  return 'Invalid'
}

// Grade columns definition
const gradeColumns = [
  {
    name: 'code',
    label: 'Course Code',
    field: (row) => row.courseId?.code || '',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Course Name',
    field: (row) => row.courseId?.name || '',
    sortable: true,
  },
  {
    name: 'sem',
    label: 'Semester',
    field: (row) => {
      // Prioritize courseId.semester as it contains the correct semester information
      if (row.courseId?.semester) return row.courseId.semester
      // Fallback to sem field if courseId.semester is not available
      if (row.sem) return row.sem
      return '-'
    },
    sortable: true,
    align: 'center'
  },
  {
    name: 'year',
    label: 'Year',
    field: (row) => {
      // Prioritize year field from course entry, fallback to courseId.year
      if (row.year) return row.year
      if (row.courseId?.year) return row.courseId.year
      return '-'
    },
    sortable: true,
    align: 'center'
  },
  { 
    name: 'grade', 
    label: 'Grade', 
    field: 'grade', 
    sortable: true,
    align: 'center'
  },
  {
    name: 'description',
    label: 'Status',
    field: (row) => getGradeDescription(row.grade),
    sortable: true,
    align: 'center'
  },
]

// Checklist columns definition (transcript format)
const checklistColumns = [
  {
    name: 'courseCodeTitle',
    label: 'COURSE C COURSE TITLE',
    field: (row) => {
      // Handle both merged structure (courseId is object) and original structure
      const courseId = row.courseId
      let code = ''
      let name = ''
      
      if (courseId && typeof courseId === 'object') {
        code = courseId.code || ''
        name = courseId.name || ''
      } else {
        code = row.courseId?.code || ''
        name = row.courseId?.name || ''
      }
      
      return code ? `${code} ${name}` : name || '-'
    },
    align: 'left',
    style: 'min-width: 300px'
  },
  {
    name: 'unit',
    label: 'UNIT',
    field: (row) => {
      const courseId = row.courseId
      if (courseId && typeof courseId === 'object') {
        return courseId.unit || '-'
      }
      return row.courseId?.unit || '-'
    },
    align: 'center',
    style: 'width: 80px'
  },
  {
    name: 'prerequisite',
    label: 'PRE-REQU',
    field: (row) => {
      const courseId = row.courseId
      if (courseId && typeof courseId === 'object' && courseId.prerequisite) {
        if (Array.isArray(courseId.prerequisite) && courseId.prerequisite.length > 0) {
          return courseId.prerequisite.map(p => p.code || p.name || p).join(', ')
        }
      }
      return '-'
    },
    align: 'left',
    style: 'min-width: 150px'
  },
  {
    name: 'Grade',
    label: 'Grade',
    field: (row) => row.grade || '-',
    align: 'center',
    style: 'width: 100px'
  },
]

// Helper function to get grade text color class
const getGradeTextColor = (grade) => {
  const numGrade = parseFloat(grade)
  if (isNaN(numGrade)) return ''
  
  if (numGrade >= 1.0 && numGrade <= 1.5) return 'grade-perfect'
  if (numGrade >= 1.6 && numGrade <= 2.5) return 'grade-good'
  if (numGrade >= 2.6 && numGrade <= 3.0) return 'grade-pass'
  if (numGrade >= 3.1 && numGrade <= 5.0) return 'grade-failed'
  
  return ''
}

// Helper function to calculate subtotal units
const getSubtotalUnits = (courses) => {
  if (!courses || !Array.isArray(courses)) return 0
  return courses.reduce((sum, course) => {
    const units = course.courseId?.unit || 0
    return sum + (Number(units) || 0)
  }, 0)
}

// Helper function to get year header text
const getYearHeader = () => {
  if (selectedYearFilter.value === 'all') {
    // Try to get year from first course if available
    const firstCourse = mergedCoursesForChecklist.value?.[0] || dialogCourses.value?.[0]
    if (firstCourse) {
      const year = getCourseYear(firstCourse)
      return year ? `${year.toUpperCase()} YEAR` : 'ALL YEARS'
    }
    return 'ALL YEARS'
  }
  return `${selectedYearFilter.value.toUpperCase()} YEAR`
}

// Helper function to normalize semester value
const normalizeSemester = (sem) => {
  if (!sem) return ''
  const semStr = String(sem).trim()
  const semLower = semStr.toLowerCase()
  
  // Check for various formats - be more flexible
  if (semLower.includes('first') || semLower === '1' || semLower === 'first semester' || semLower === '1st') {
    return 'first'
  }
  if (semLower.includes('second') || semLower === '2' || semLower === 'second semester' || semLower === '2nd') {
    return 'second'
  }
  if (semLower.includes('summer') || semLower === '3' || semLower === 'summer semester' || semLower === '3rd') {
    return 'summer'
  }
  
  // Return original if no match (for display purposes)
  return semStr
}

// Helper function to get semester from course (prioritizes courseId.semester as it's more accurate)
const getCourseSemester = (course) => {
  // For merged courses (checklist), courseId is the full course object
  if (course.courseId && typeof course.courseId === 'object' && course.courseId.semester) {
    return normalizeSemester(course.courseId.semester)
  }
  // Prioritize courseId.semester as it contains the correct semester information
  // The course.sem field may be incorrect (e.g., all showing '1st')
  if (course.courseId?.semester) {
    return normalizeSemester(course.courseId.semester)
  }
  // Fallback to sem field if courseId.semester is not available
  if (course.sem) {
    return normalizeSemester(course.sem)
  }
  return ''
}

// Helper function to normalize year value
const normalizeYear = (year) => {
  if (!year) return ''
  const yearStr = String(year).trim()
  const yearLower = yearStr.toLowerCase()
  
  // Check for various formats
  if (yearLower.includes('first') || yearLower === '1' || yearLower === '1st' || yearLower === 'first year') {
    return 'First'
  }
  if (yearLower.includes('second') || yearLower === '2' || yearLower === '2nd' || yearLower === 'second year') {
    return 'Second'
  }
  if (yearLower.includes('third') || yearLower === '3' || yearLower === '3rd' || yearLower === 'third year') {
    return 'Third'
  }
  if (yearLower.includes('fourth') || yearLower === '4' || yearLower === '4th' || yearLower === 'fourth year') {
    return 'Fourth'
  }
  
  // Return capitalized first letter if it's a single word (e.g., "first" -> "First")
  if (yearStr.length > 0) {
    return yearStr.charAt(0).toUpperCase() + yearStr.slice(1).toLowerCase()
  }
  
  return yearStr
}

// Helper function to get year level from course (prioritizes courseId.year as it's more accurate)
const getCourseYear = (course) => {
  // For merged courses (checklist), courseId is the full course object
  if (course.courseId && typeof course.courseId === 'object' && course.courseId.year) {
    return normalizeYear(course.courseId.year)
  }
  // Prioritize courseId.year as it contains the correct year level information
  if (course.courseId?.year) {
    return normalizeYear(course.courseId.year)
  }
  // Fallback to year field if courseId.year is not available
  if (course.year) {
    return normalizeYear(course.year)
  }
  return ''
}

// Helper function to merge all courses with student's taken courses (to show grades)
const mergedCoursesForChecklist = computed(() => {
  if (!allCoursesList.value || !Array.isArray(allCoursesList.value)) return []
  
  // Create a map of student's courses by courseId for quick lookup
  const studentCoursesMap = new Map()
  if (dialogCourses.value && Array.isArray(dialogCourses.value)) {
    dialogCourses.value.forEach(course => {
      const courseId = course.courseId?._id || course.courseId
      if (courseId) {
        studentCoursesMap.set(String(courseId), course)
      }
    })
  }
  
  // Merge all courses with student's grades
  return allCoursesList.value.map(course => {
    const courseId = course._id || course
    const studentCourse = studentCoursesMap.get(String(courseId))
    
    if (studentCourse) {
      // Student has taken this course - include grade
      return {
        courseId: course,
        grade: studentCourse.grade,
        sem: studentCourse.sem,
        year: studentCourse.year
      }
    } else {
      // Student hasn't taken this course - no grade
      return {
        courseId: course,
        grade: null,
        sem: course.semester,
        year: course.year
      }
    }
  })
})

// Helper function to filter courses by year level
const filterByYear = (courses) => {
  if (selectedYearFilter.value === 'all') return courses
  return courses.filter(course => {
    const year = getCourseYear(course)
    return year === selectedYearFilter.value
  })
}

// Computed properties for filtering courses by semester and year
const firstSemesterCourses = computed(() => {
  if (!mergedCoursesForChecklist.value || !Array.isArray(mergedCoursesForChecklist.value)) return []
  const filtered = mergedCoursesForChecklist.value.filter(course => {
    if (!course || !course.courseId) return false
    const sem = getCourseSemester(course)
    return sem === 'first'
  })
  return filterByYear(filtered)
})

const secondSemesterCourses = computed(() => {
  if (!mergedCoursesForChecklist.value || !Array.isArray(mergedCoursesForChecklist.value)) return []
  const filtered = mergedCoursesForChecklist.value.filter(course => {
    if (!course || !course.courseId) return false
    const sem = getCourseSemester(course)
    return sem === 'second'
  })
  return filterByYear(filtered)
})

const summerSemesterCourses = computed(() => {
  if (!mergedCoursesForChecklist.value || !Array.isArray(mergedCoursesForChecklist.value)) return []
  const filtered = mergedCoursesForChecklist.value.filter(course => {
    if (!course || !course.courseId) return false
    const sem = getCourseSemester(course)
    return sem === 'summer'
  })
  return filterByYear(filtered)
})

// Computed property for all courses filtered by year
const allCoursesFiltered = computed(() => {
  if (!mergedCoursesForChecklist.value || !Array.isArray(mergedCoursesForChecklist.value)) return []
  return filterByYear(mergedCoursesForChecklist.value)
})

onMounted(async () => {
  await getUser()
  await getTotalCounts()
  await fetchStudents()
  await fetchSchedules()
  await fetchCourses()
})
</script>

<style lang="sass" scoped>

.text-red
  color: #a30000

.student-info-dialog
  width: 1000px

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

.scroll-section
  max-height: 200px
  overflow-y: auto

// Checklist Dialog Styles
.checklist-dialog
  .checklist-table-container
    background-color: #f5f5f5
    border: 1px solid #d0d0d0

  .checklist-semester-header
    background-color: #e0e0e0
    padding: 8px 16px
    font-weight: bold
    font-size: 14px
    text-transform: uppercase
    border-bottom: 2px solid #b0b0b0

  .checklist-table
    background-color: #f5f5f5
    
    :deep(.q-table__top)
      display: none
    
    :deep(.q-table__container)
      background-color: #f5f5f5
    
    :deep(.q-table thead tr th)
      background-color: #e8e8e8
      color: #000
      font-weight: bold
      font-size: 12px
      text-transform: uppercase
      border: 1px solid #d0d0d0
      padding: 8px 4px
    
    :deep(.q-table tbody tr td)
      background-color: #ffffff
      border: 1px solid #d0d0d0
      padding: 6px 4px
      font-size: 12px
    
    :deep(.q-table tbody tr:nth-child(even) td)
      background-color: #fafafa
    
    :deep(.q-table tbody tr:hover td)
      background-color: #f0f0f0

  .checklist-subtotal
    background-color: #e8e8e8
    padding: 8px 16px
    border-top: 2px solid #b0b0b0
    border-bottom: 1px solid #d0d0d0
    
    .subtotal-row
      display: flex
      justify-content: space-between
      align-items: center
      font-weight: bold
      font-size: 13px
      
      .subtotal-label
        text-transform: uppercase
      
      .subtotal-value
        min-width: 80px
        text-align: center

  // Grade color classes
  .grade-perfect
    color: #2e7d32
    font-weight: bold

  .grade-good
    color: #1976d2
    font-weight: bold

  .grade-pass
    color: #f57c00
    font-weight: bold

  .grade-failed
    color: #d32f2f
    font-weight: bold


@media (max-width: 1200px)
  .stat-card
    max-width: calc(50% - 10px)

@media (max-width: 600px)
  .stat-card
    max-width: 100%
</style>
