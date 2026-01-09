<template>
  <q-page style="height: 90vh">
    <div class="main-container">
      <div class="content-container q-px-md q-px-sm-xl">
        <!-- Header -->
        <q-card-section class="q-pt-md">
          <div class="text-h6 text-weight-medium" style="color: #282726">
            Admin/<span style="color: #b1b2b4">Courses</span>
          </div>
        </q-card-section>

        <!-- Add Course -->
        <div class="button-container" v-if="isAdmin">
          <q-card-section class="button-section">
            <q-btn
              label="Add Course"
              no-caps
              flat
              class="action-button"
              @click="router.push('/new/addProgramPage')"
            />
          </q-card-section>
        </div>

        <!-- TABLE -->
        <q-table
          class="q-mt-lg responsive-table"
          style="border-radius: 14px; background-color: #fdffdf"
          :rows="rows"
          :columns="columns"
          row-key="action"
          :filter="filter"
          :rows-per-page-options="[0, 5, 10, 15]"
        >
          <template #top-left>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template #body="props">
            <q-tr :props="props">
              <q-td v-for="col in columns" :key="col.name">
                <template v-if="col.name === '#'">
                  {{ props.rowIndex + 1 }}
                </template>

                <template v-else-if="col.name === 'action'">
                  <q-btn
                    flat
                    dense
                    size="sm"
                    icon="edit"
                    color="primary"
                    @click="openEditDialog(props.row)"
                  />
                  <q-btn
                    flat
                    dense
                    size="sm"
                    icon="delete"
                    color="negative"
                    @click="openDeleteDialog(props.row.action)"
                  />
                </template>

                <template v-else>
                  {{ props.row[col.name] }}
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <!-- EDIT COURSE -->
        <q-dialog v-model="editProgramPopUp" persistent>
          <q-card style="width: 900px; max-width: 95vw">
            <q-form @submit.prevent="editProgram(editForm.action)">
              <div class="q-pa-md">
                <q-card-section class="text-h6">Edit Course</q-card-section>

                <q-card-section>
                  <q-input v-model="editForm.courseName" label="Course Name" filled />
                  <q-input
                    v-model="editForm.courseCode"
                    label="Course Code"
                    filled
                    class="q-mt-sm"
                  />

                  <q-select
                    v-model="editForm.courseTitle"
                    :options="programOptions"
                    label="Program"
                    filled
                    class="q-mt-sm"
                  />

                  <div class="row q-col-gutter-md q-mt-sm">
                    <div class="col-6">
                      <q-select
                        v-model="editForm.year"
                        :options="yearOptions"
                        label="Year Level"
                        filled
                      />
                    </div>
                    <div class="col-6">
                      <q-select
                        v-model="editForm.semester"
                        :options="semesterOptions"
                        label="Semester"
                        filled
                      />
                    </div>
                  </div>

                  <q-input
                    v-model="editForm.numUnits"
                    label="Units"
                    type="number"
                    filled
                    class="q-mt-sm"
                  />

                  <q-input
                    v-model="editForm.description"
                    label="Description"
                    type="textarea"
                    filled
                    class="q-mt-sm"
                  />

                  <!-- PREREQUISITES -->
                  <div class="q-mt-lg text-subtitle2">Edit Prerequisites</div>

                  <q-table
                    flat
                    bordered
                    :rows="prerequisiteRows"
                    :columns="prerequisiteColumns"
                    row-key="_id"
                    :filter="prerequisiteFilter"
                  >
                    <template #top-left>
                      <q-input
                        dense
                        borderless
                        debounce="300"
                        v-model="prerequisiteFilter"
                        placeholder="Search prerequisite"
                      />
                    </template>

                    <template #body-cell-select="props">
                      <q-td>
                        <q-checkbox
                          v-model="selectedEditPrerequisites"
                          :val="props.row._id"
                          :disable="props.row._id === editForm.action"
                        />
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="negative" @click="editProgramPopUp = false" />
                  <q-btn flat label="Save" color="primary" type="submit" :loading="loading" />
                </q-card-actions>
              </div>
            </q-form>
          </q-card>
        </q-dialog>

        <!-- DELETE -->
        <q-dialog v-model="deleteConfirmation">
          <q-card>
            <q-card-section class="text-h6">Delete Course?</q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="negative" @click="deleteConfirmation = false" />
              <q-btn
                flat
                label="Delete"
                color="negative"
                @click="deleteProgram(selectedCourseId)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
const loading = ref(false)
const filter = ref('')
const isAdmin = ref(true)

const editProgramPopUp = ref(false)
const deleteConfirmation = ref(false)
const selectedCourseId = ref(null)

/* OPTIONS */
const yearOptions = ['First', 'Second', 'Third', 'Fourth']
const semesterOptions = ['First', 'Second', 'Summer']

/* FORMAT */
const formatCourse = (c) => `${c.code} – ${c.name} (${c.course})`

/* TABLE */
const columns = [
  { name: '#', label: '#', align: 'center', field: () => '' },
  { name: 'courseCode', label: 'Course Code', field: (row) => row.courseCode },
  { name: 'courseName', label: 'Course Name', field: (row) => row.courseName },
  { name: 'courseTitle', label: 'Program', field: (row) => row.courseTitle },
  { name: 'year', label: 'Year', field: (row) => row.year },
  { name: 'semester', label: 'Semester', field: (row) => row.semester },
  { name: 'numUnits', label: 'Units', field: (row) => row.numUnits },
  { name: 'prerequisite', label: 'Prerequisite', field: (row) => row.prerequisite },
  { name: 'action', label: 'Action', align: 'center', field: () => '' },
]

const rows = ref([])

/* EDIT FORM */
const editForm = ref({
  courseTitle: '',
  courseName: '',
  courseCode: '',
  numUnits: '',
  description: '',
  year: '',
  semester: '',
  action: null,
})

/* PROGRAMS */
const programOptions = ref([])

/* PREREQUISITES */
const prerequisiteRows = ref([])
const selectedEditPrerequisites = ref([])
const prerequisiteFilter = ref('')
const prerequisiteColumns = [
  { name: 'select', label: 'Select' },
  {
    name: 'course',
    label: 'Course',
    field: (row) => formatCourse(row),
    sortable: true,
  },
]

async function getCourses() {
  const token = localStorage.getItem('authToken')
  const { data } = await axios.get(`${process.env.api_host}/courses?isArchived=false`, {
    headers: { Authorization: token },
  })

  rows.value = data.map((c) => ({
    courseCode: c.code,
    courseName: c.name,
    courseTitle: c.course,
    year: c.year,
    semester: c.semester,
    numUnits: c.unit,
    prerequisite: c.prerequisite.map((p) => p.code).join(', '),
    action: c._id,
  }))
}

async function getPrograms() {
  const token = localStorage.getItem('authToken')
  const { data } = await axios.get(`${process.env.api_host}/courses/getProgram?isArchived=false`, {
    headers: { Authorization: token },
  })
  programOptions.value = data.map((p) => p.name)
}

async function getPrerequisites() {
  const token = localStorage.getItem('authToken')
  const { data } = await axios.get(`${process.env.api_host}/courses?isArchived=false`, {
    headers: { Authorization: token },
  })
  prerequisiteRows.value = data
}

function openEditDialog(course) {
  editForm.value = { ...course }
  selectedEditPrerequisites.value = []
  editProgramPopUp.value = true
}

async function editProgram(id) {
  const token = localStorage.getItem('authToken')
  loading.value = true

  await axios.post(
    `${process.env.api_host}/courses/updateCourse/${id}`,
    {
      code: editForm.value.courseCode,
      course: editForm.value.courseTitle,
      name: editForm.value.courseName,
      description: editForm.value.description,
      unit: editForm.value.numUnits,
      year: editForm.value.year,
      semester: editForm.value.semester,
      prerequisite: selectedEditPrerequisites.value,
    },
    { headers: { Authorization: token } },
  )

  Notify.create({ type: 'positive', message: 'Course updated' })
  editProgramPopUp.value = false
  loading.value = false
  getCourses()
}

function openDeleteDialog(id) {
  selectedCourseId.value = id
  deleteConfirmation.value = true
}

async function deleteProgram(id) {
  const token = localStorage.getItem('authToken')
  await axios.post(
    `${process.env.api_host}/courses/updateCourse/${id}`,
    { isArchived: true },
    { headers: { Authorization: token } },
  )
  Notify.create({ type: 'positive', message: 'Course deleted' })
  deleteConfirmation.value = false
  getCourses()
}

onMounted(() => {
  getCourses()
  getPrograms()
  getPrerequisites()
})
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100%
.button-container
  width: auto
  display: flex
  flex-wrap: wrap
  gap: 10px
.button-section
  width: 180px
  height: 80px
  padding: 8px
  @media (max-width: 600px)
    width: 100%
    height: 60px
    padding: 4px
.action-button
  background-color: #2d5429
  color: #ffffff
  border-radius: 10px
  width: 100%
  height: 100%
.input-field
  background-color: #fdfede
  border-radius: 8px
  padding: 4px 12px

@media (max-width: 600px)
  .input-field
    width: 100%
</style>
