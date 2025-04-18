<template>
  <q-page class="main-container">
    <div>
      <q-card style="width: 800px; max-width: 95vw">
        <q-form @submit.prevent="addCourse">
          <div class="q-pa-md content-container">
            <q-card-section class="text-h6 text-weight-medium" style="color: #282726">
              Add Course
            </q-card-section>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-subtitle2 q-mb-sm">Course Name</div>
                  <div class="input-field">
                    <q-input v-model="courseTitle" type="text" borderless />
                  </div>
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Program</div>
                  <div class="input-field">
                    <q-select
                      v-model="courseProgram"
                      type="text"
                      borderless
                      :options="optionPrograms.option"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Course Code</div>
                  <div class="input-field">
                    <q-input v-model="courseCode" type="text" borderless />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Total Units</div>
                  <div class="input-field">
                    <q-input v-model="totalUnits" type="number" borderless />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Year(Level)</div>
                  <div class="input-field">
                    <q-select v-model="year" type="text" borderless :options="yearOption" />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Semester</div>
                  <div class="input-field">
                    <q-select v-model="semester" type="text" borderless :options="semesterOption" />
                  </div>
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-subtitle2 q-mb-sm">Course Description</div>
                  <div class="input-field">
                    <q-input
                      v-model="courseDescription"
                      type="textarea"
                      borderless
                      label="optional"
                    />
                  </div>
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-subtitle2 q-mb-sm">Select Prerequisites</div>
                  <div class="responsive-table">
                    <q-table
                      :filter="filter"
                      :rows="prerequisiteRows"
                      :columns="prerequisiteColumns"
                      row-key="action"
                    >
                      <template v-slot:body-cell-select="props">
                        <q-td :props="props">
                          <q-checkbox v-model="selectedPrerequisites" :val="props.row.action" />
                        </q-td>
                      </template>
                      <template v-slot:top-left>
                        <q-input
                          borderless
                          dense
                          debounce="300"
                          v-model="filter"
                          placeholder="Search"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </template>
                    </q-table>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Close" @click="cancelAdd" color="red-8" class="q-px-md" />
              <q-btn
                :loading="loading"
                type="submit"
                flat
                label="Add"
                class="q-px-md action-button"
                style="width: 100px"
              />
            </q-card-actions>
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const courseCode = ref('')
const courseDescription = ref('')
const courseProgram = ref('')

const router = useRouter()
const optionPrograms = ref({})

const courseTitle = ref('')
const coursePrerequisite = ref([])
const totalUnits = ref(0)
const year = ref('')
const semester = ref('')
const yearOption = ['First', 'Second', 'Third', 'Fourth']
const semesterOption = ['First', 'Second', 'Summer']

const loading = ref(false)
const selectedPrerequisites = ref([])
const filter = ref('')

const prerequisiteRows = ref([])
const prerequisiteColumns = [
  {
    name: 'select',
    label: 'Select',
    align: 'left',
    field: 'select',
  },
  {
    name: 'courseName',
    label: 'Course Name',
    field: 'courseName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'courseCode',
    label: 'Course Code',
    field: 'courseCode',
    align: 'left',
    sortable: true,
  },
]

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
    optionPrograms.value = {
      option: response.data.map((program) => program.name),
    }
  } catch (err) {
    console.error(err)
  }
}

async function fetchPrerequisites() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${process.env.api_host}/courses?isArchived=false`, {
      headers: {
        Authorization: token,
      },
    })
    prerequisiteRows.value = response.data.map((course, index) => ({
      id: course._id,
      index: index + 1,
      courseCode: course.code,
      courseName: course.name,
      action: course._id,
    }))
  } catch (err) {
    console.error('Error fetching programs:', err)
  }
}
async function addCourse() {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    await axios.post(
      `${process.env.api_host}/courses/createCourse`,
      {
        code: courseCode.value,
        course: courseProgram.value,
        name: courseTitle.value,
        description: courseDescription.value,
        prerequisite: selectedPrerequisites.value,
        unit: totalUnits.value,
        year: year.value,
        semester: semester.value,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    )

    Notify.create({
      type: 'positive',
      message: 'Course added successfully!',
    })
    router.push('/new/addCourses')
    courseTitle.value = ''
    courseCode.value = ''
    courseProgram.value = ''
    courseDescription.value = ''
    selectedPrerequisites.value = []
    totalUnits.value = ''
    year.value = ''
    semester.value = ''
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something Went Wrong!',
    })
  } finally {
    loading.value = false
  }
}

async function cancelAdd() {
  courseTitle.value = ''
  courseCode.value = ''
  courseProgram.value = ''
  courseDescription.value = ''
  selectedPrerequisites.value = []
  totalUnits.value = ''
  year.value = ''
  semester.value = ''
  router.push('/new/addCourses')
}

onMounted(() => {
  fetchPrerequisites()
  getPrograms()
})
</script>

<style lang="sass" scoped>
.main-container
  min-height: 100%
  display: flex
  justify-content: center
  align-items: start
  padding-top: 20px
  background-color: #fdfede

.input-field
  background-color: #ffffff
  border-radius: 8px
  padding: 4px 12px
  border: 1px solid #e0e0e0

.action-button
  background-color: #2d5429
  color: #ffffff
  border-radius: 10px
  width: 100%
  height: 100%

.responsive-table
  :deep(.q-table__container)
    overflow-x: auto

  :deep(.q-table)
    min-width: 600px

@media (max-width: 600px)
  .content-container
    padding: 8px !important

  .input-field
    width: 100%

  .text-h6
    font-size: 1.1rem

  .q-dialog__inner > div
    max-height: 90vh
</style>
