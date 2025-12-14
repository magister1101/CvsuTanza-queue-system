<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-auto">
        <q-btn label="Create Schedule" color="primary" @click="openCreateDialog" />
      </div>
      <div class="col-auto">
        <q-btn label="Import Schedules" color="primary" icon="upload" @click="openImportDialog" />
      </div>
    </div>

    <!-- Search Bar -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="searchQuery"
          placeholder="Search schedules..."
          filled
          clearable
          @clear="searchQuery = ''"
          @keyup.enter="filterSchedules"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn flat round dense icon="filter_list" @click="showFilters = !showFilters">
              <q-tooltip>Advanced Filters</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>

      <!-- Advanced Filters (collapsible) -->
      <div v-if="showFilters" class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filterCourse"
              :options="filterCourseOptions"
              label="Filter by Course"
              filled
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filterSection"
              :options="filterSectionOptions"
              label="Filter by Section"
              filled
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filterDay"
              :options="filterDayOptions"
              label="Filter by Day"
              filled
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-btn
              color="primary"
              label="Apply Filters"
              @click="filterSchedules"
              class="full-height"
            />
            <q-btn flat color="negative" label="Clear All" @click="clearFilters" class="q-mt-xs" />
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="max-width: 800px; width: 800px">
        <q-card-section>
          <div class="text-h6">{{ editingSchedule ? 'Edit Schedule' : 'Create Schedule' }}</div>
        </q-card-section>

        <q-form @submit.prevent="editingSchedule ? updateSchedule() : createSchedule()">
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
              :disable="editingSchedule"
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
                  <q-input v-model="entry.room" label="Room" filled />
                </div>
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
                  <q-select
                    v-model="entry.startTime"
                    :options="timeOptions"
                    label="Start Time"
                    filled
                    :disable="entry.day === 'TBA'"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col">
                  <q-select
                    v-model="entry.endTime"
                    :options="timeOptions"
                    label="End Time"
                    filled
                    :disable="entry.day === 'TBA'"
                    emit-value
                    map-options
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
            <q-btn
              type="submit"
              :label="editingSchedule ? 'Update' : 'Create'"
              color="primary"
              :loading="submitting"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteDialog" persistent>
      <q-card style="max-width: 800px; width: 800px">
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
        </q-card-section>

        <q-form @submit.prevent="deleteSchedule()">
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey" @click="confirmDeleteDialog = false" />
            <q-btn type="submit" label="Delete" color="primary" :loading="submitting" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Import Schedules Dialog -->
    <q-dialog v-model="importDialog" persistent>
      <q-card style="min-width: 420px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Import Schedules</div>
          <div class="text-caption text-grey-7 q-mt-xs">
            Upload an Excel file (.xlsx or .xls) with columns:
            <br />
            <code>CourseCode, Section, Day, StartTime, EndTime, Room</code>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-file
            v-model="importFile"
            accept=".xlsx,.xls"
            filled
            bottom-slots
            label="Choose Excel File"
          >
            <template v-slot:append>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              Times should be HH:mm (e.g. 08:00). Use "TBA" for unknowns.
            </template>
          </q-file>

          <div class="q-mt-md">
            <q-btn
              color="primary"
              :loading="importLoading"
              :disable="!importFile"
              label="Upload"
              class="full-width"
              @click="uploadScheduleExcel"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Close" color="negative" @click="closeImportDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Schedule Table -->
    <q-table
      title="Schedule List"
      :rows="filteredSchedules"
      :columns="columns"
      row-key="_id"
      :pagination="{ rowsPerPage: 10 }"
      flat
      :loading="tableLoading"
      bordered
    >
      <template v-slot:top-right>
        <q-input
          v-model="searchQuery"
          placeholder="Search..."
          dense
          filled
          clearable
          class="q-mr-sm"
          style="width: 200px"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn dense flat icon="edit" color="primary" @click="openEditDialog(props.row)" />
          <q-btn dense flat icon="delete" color="negative" @click="openDeleteDialog(props.row)" />
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span v-if="searchQuery || filterCourse || filterSection || filterDay">
            No schedules match your search criteria
          </span>
          <span v-else> No schedules available </span>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar, Notify } from 'quasar'
import axios from 'axios'

const $q = useQuasar()

// Dialog and states
const showDialog = ref(false)
const confirmDeleteDialog = ref(false)
const loadingCourses = ref(true)
const submitting = ref(false)
const tableLoading = ref(true)
const importDialog = ref(false)
const importFile = ref(null)
const importLoading = ref(false)
const editingSchedule = ref(null)
const scheduleToDelete = ref(null)

// Search and Filter states
const searchQuery = ref('')
const showFilters = ref(false)
const filterCourse = ref(null)
const filterSection = ref(null)
const filterDay = ref(null)

// Form data
const scheduleCourse = ref('')
const scheduleProgram = ref('')
const scheduleSection = ref('')
const scheduleEntries = ref([{ day: '', startTime: '', endTime: '', room: '' }])

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

// Computed properties for filter options
const filterCourseOptions = computed(() => {
  const courses = [...new Set(schedules.value.map((s) => s.course?.code).filter(Boolean))]
  return courses.map((code) => ({
    label: code,
    value: code,
  }))
})

const filterSectionOptions = computed(() => {
  const sections = [...new Set(schedules.value.map((s) => s.section).filter(Boolean))]
  return sections
    .map((section) => ({
      label: section,
      value: section,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

const filterDayOptions = computed(() => {
  const days = []
  schedules.value.forEach((schedule) => {
    schedule.schedule?.forEach((s) => {
      if (s.day && !days.includes(s.day)) {
        days.push(s.day)
      }
    })
  })
  return days
    .map((day) => ({
      label: day,
      value: day,
    }))
    .sort(
      (a, b) =>
        dayOptions.value.findIndex((d) => d.value === a.value) -
        dayOptions.value.findIndex((d) => d.value === b.value),
    )
})

// Computed property for filtered schedules
const filteredSchedules = computed(() => {
  if (!searchQuery.value && !filterCourse.value && !filterSection.value && !filterDay.value) {
    return schedules.value
  }

  return schedules.value.filter((schedule) => {
    // Search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch =
        schedule.code?.toLowerCase().includes(query) ||
        schedule.course?.code?.toLowerCase().includes(query) ||
        schedule.course?.name?.toLowerCase().includes(query) ||
        schedule.section?.toLowerCase().includes(query) ||
        schedule.schedule?.some(
          (s) => s.room?.toLowerCase().includes(query) || s.day?.toLowerCase().includes(query),
        )
      if (!matchesSearch) return false
    }

    // Course filter
    if (filterCourse.value && schedule.course?.code !== filterCourse.value) {
      return false
    }

    // Section filter
    if (filterSection.value && schedule.section !== filterSection.value) {
      return false
    }

    // Day filter
    if (filterDay.value) {
      const hasDay = schedule.schedule?.some((s) => s.day === filterDay.value)
      if (!hasDay) return false
    }

    return true
  })
})

const columns = [
  { name: 'code', label: 'Schedule Code', field: 'code', align: 'left' },
  {
    name: 'section',
    label: 'Section',
    field: (row) => `${row.course?.program || ''} ${row.course?.year || ''}${row.section || ''}`,
    align: 'left',
  },
  {
    name: 'courseCode',
    label: 'Course Code',
    field: (row) => row.course?.code || '',
    align: 'left',
  },
  {
    name: 'courseTitle',
    label: 'Course Title',
    field: (row) => row.course?.name || '',
    align: 'left',
  },
  {
    name: 'units',
    label: 'Units',
    field: (row) => row.course?.unit || '',
    align: 'left',
  },
  {
    name: 'day',
    label: 'Day',
    field: (row) => row.schedule.map((s) => s.day).join(', '),
    align: 'left',
  },
  {
    name: 'time',
    label: 'Time',
    field: (row) => row.schedule.map((s) => `${s.startTime}-${s.endTime}`).join(', '),
    align: 'left',
  },
  {
    name: 'room',
    label: 'Room',
    field: (row) => row.schedule.map((s) => s.room || 'N/A').join(', '),
    align: 'left',
  },
  { name: 'actions', label: 'Actions', align: 'center' },
]

// 30-min interval times
const timeOptions = ref(
  Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = String(Math.floor(i / 2)).padStart(2, '0')
    const minutes = i % 2 === 0 ? '00' : '30'
    const value = `${hours}:${minutes}`
    return { label: value, value }
  }),
)

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
    // const res = await axios.get(`${process.env.api_host}/courses`)
    // courseOptions.value = res.data
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to load courses' })
  } finally {
    loadingCourses.value = false
  }
}

const getSchedules = async () => {
  try {
    const res = await axios.get(`${process.env.api_host}/courses/getSchedule?isArchived=false`)
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
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to create schedule' })
  } finally {
    submitting.value = false
  }
}

const updateSchedule = async () => {
  try {
    submitting.value = true

    const payload = {
      section: scheduleSection.value,
      schedule: scheduleEntries.value,
    }

    await axios.put(
      `${process.env.api_host}/courses/schedule/${editingSchedule.value._id}`,
      payload,
    )

    $q.notify({ type: 'positive', message: 'Schedule updated successfully' })
    showDialog.value = false
    resetForm()
    getSchedules()
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to update schedule' })
  } finally {
    submitting.value = false
  }
}

const deleteSchedule = async () => {
  try {
    const payload = {
      isArchived: true,
    }
    await axios.put(
      `${process.env.api_host}/courses/schedule/${scheduleToDelete.value._id}`,
      payload,
    )
    $q.notify({ type: 'positive', message: 'Schedule deleted successfully' })
    confirmDeleteDialog.value = false
    getSchedules()
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to delete schedule' })
  }
}

// Search and Filter functions
function filterSchedules() {
  // This is handled by the computed property, but we can add any additional logic here
  console.log('Filtering schedules...')
}

function clearFilters() {
  searchQuery.value = ''
  filterCourse.value = null
  filterSection.value = null
  filterDay.value = null
  showFilters.value = false
}

// Import dialog actions
function openImportDialog() {
  importDialog.value = true
}
function closeImportDialog() {
  importDialog.value = false
  importFile.value = null
}

async function uploadScheduleExcel() {
  if (!importFile.value) {
    Notify.create({ type: 'warning', message: 'Please select a file first' })
    return
  }

  const formData = new FormData()
  formData.append('file', importFile.value)

  try {
    importLoading.value = true

    const response = await axios.post(
      `${process.env.api_host}/courses/excel/importSchedules`, // Replace with your backend URL
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    Notify.create({ type: 'positive', message: 'Schedules imported successfully' })
    closeImportDialog()
    tableLoading.value = true
    await getSchedules()
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.response?.data?.error || 'Failed to import schedules'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    importLoading.value = false
  }
}

// Helpers
function addEntry() {
  scheduleEntries.value.push({ day: '', startTime: '', endTime: '', room: '' })
}
function removeEntry(index) {
  scheduleEntries.value.splice(index, 1)
}
function resetForm() {
  editingSchedule.value = null
  scheduleCourse.value = ''
  scheduleProgram.value = ''
  scheduleSection.value = ''
  scheduleEntries.value = [{ day: '', startTime: '', endTime: '', room: '' }]
}
function generateCode() {
  const courseName =
    courseOptions.value.find((c) => c._id === scheduleCourse.value)?.code || 'UNKNOWN'
  return `${courseName}-${Date.now()}`
}
function openCreateDialog() {
  resetForm()
  showDialog.value = true
}
function openEditDialog(schedule) {
  editingSchedule.value = schedule
  scheduleCourse.value = schedule.course?._id || schedule.course
  scheduleSection.value = schedule.section
  scheduleEntries.value = JSON.parse(JSON.stringify(schedule.schedule))
  showDialog.value = true
}
function openDeleteDialog(schedule) {
  scheduleToDelete.value = schedule
  confirmDeleteDialog.value = true
}

onMounted(() => {
  getCourses()
  getSchedules()
})
</script>
