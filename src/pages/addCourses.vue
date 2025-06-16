<template>
  <q-page style="height: 90vh">
    <div class="main-container">
      <div class="content-container q-px-md q-px-sm-xl">
        <q-card-section class="q-pt-md">
          <div class="text-h6 text-weight-medium" style="color: #282726">
            Admin/<span style="color: #b1b2b4">Courses</span>
          </div>
        </q-card-section>
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
        <!-- add Program -->

        <!-- table -->
        <div class="q-mt-lg">
          <q-table
            style="border-radius: 14px; background-color: #fdffdf"
            title="Program Information"
            :rows="rows"
            :columns="columns"
            row-key="id"
            separator="cell"
            :filter="filter"
            :rows-per-page-options="[0, 5, 10, 15, 20]"
            class="responsive-table"
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td v-for="col in columns" :key="col.name" :props="props">
                  <template v-if="col.name === '#'">
                    {{ props.rowIndex + 1 }}
                  </template>
                  <template v-else-if="col.name === 'action'">
                    <div class="row q-gutter-x-sm" v-if="isAdmin">
                      <q-btn
                        flat
                        dense
                        size="sm"
                        icon="edit"
                        color="primary"
                        @click="openEditDialog(props.row)"
                      >
                        <q-tooltip>Edit</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        dense
                        size="sm"
                        :loading="loading"
                        icon="delete"
                        color="negative"
                        @click="openDeleteDialog(props.row.action)"
                      >
                        <q-tooltip>Delete</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                  <template v-else>
                    <span :title="props.row[col.name]">
                      {{
                        props.row[col.name]?.length > 50
                          ? props.row[col.name].slice(0, 50) + '...'
                          : props.row[col.name]
                      }}
                    </span>
                  </template>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top-left>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
        <!-- edit course -->
        <div>
          <q-dialog v-model="editProgramPopUp" persistent>
            <q-card style="width: 800px; max-width: 95vw">
              <q-form @submit.prevent="editProgram(editForm.action)">
                <div class="q-pa-md">
                  <q-card-section class="text-h6 text-weight-medium" style="color: #282726">
                    Edit Program
                  </q-card-section>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <div class="text-subtitle2 q-mb-sm">Course Name</div>
                        <div class="input-field">
                          <q-input v-model="editForm.courseName" type="text" borderless />
                        </div>
                      </div>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Program</div>
                        <div class="input-field">
                          <q-select
                            v-model="editForm.courseTitle"
                            type="text"
                            borderless
                            :options="programOptions"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Course Code</div>
                        <div class="input-field">
                          <q-input v-model="editForm.courseCode" type="text" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Total Units</div>
                        <div class="input-field">
                          <q-input v-model="editForm.numUnits" type="number" borderless />
                        </div>
                      </div>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <div class="text-subtitle2 q-mb-sm">Course Description</div>
                        <div class="input-field">
                          <q-input v-model="editForm.description" type="textarea" borderless />
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn
                      flat
                      label="Cancel"
                      @click="editProgramPopUp = false"
                      color="red-8"
                      class="q-px-md"
                    />
                    <q-btn
                      :loading="loading"
                      type="submit"
                      flat
                      label="Save"
                      class="q-px-md"
                      style="background-color: #306b30; color: #ffffff; width: 100px"
                    />
                  </q-card-actions>
                </div>
              </q-form>
            </q-card>
          </q-dialog>
        </div>
        <!-- delete confirmation -->
        <div>
          <q-dialog v-model="deleteConfirmation" persistent>
            <q-card>
              <q-form @submit.prevent="deleteProgram(selectedCourseId)">
                <q-card-section>
                  <q-card-title>
                    <q-icon name="warning" color="negative" />
                    <div class="text-h6">Delete Program?</div>
                  </q-card-title>
                  <q-card-main>
                    <div class="text-subtitle1">Are you sure you want to delete this Course?</div>
                  </q-card-main>
                  <q-card-actions align="right">
                    <q-btn
                      flat
                      label="Cancel"
                      @click="deleteConfirmation = false"
                      color="red-8"
                      class="q-px-md"
                    />
                    <q-btn
                      :loading="loading"
                      flat
                      label="Delete"
                      color="negative"
                      type="submit"
                      class="q-px-md"
                    />
                  </q-card-actions>
                </q-card-section>
              </q-form>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue'
import { is, Notify } from 'quasar'
import axios from 'axios'
import { useRouter } from 'vue-router'

// loading
const loading = ref(false)
const router = useRouter()
const editProgramPopUp = ref(false)
// course input
const deleteConfirmation = ref(false)
const selectedCourseId = ref(null)
const courseTitle = ref('')
const courseCode = ref('')
const addProgramPopUp = ref(false)
// table
const filter = ref('')
const columns = ref([
  {
    name: '#',
    required: true,
    label: '#',
    align: 'center',
    field: 'index',
    sortable: true,
  },
  {
    name: 'courseCode',
    required: true,
    label: 'Course Code',
    align: 'left',
    field: 'courseCode',
    sortable: true,
  },
  {
    name: 'courseName',
    align: 'left',
    label: 'Course Name',
    field: 'courseName',
    sortable: true,
  },
  {
    name: 'courseTitle',
    align: 'left',
    label: 'Program',
    field: 'courseTitle',
    sortable: true,
  },
  {
    name: 'numUnits',
    align: 'left',
    label: 'Total Number of Units',
    field: 'numUnits',
    sortable: true,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Description',
    field: 'description',
    sortable: true,
  },
  {
    name: 'prerequisite',
    align: 'left',
    label: 'Prerequisite',
    field: 'prerequisite',
    sortable: true,
  },
  {
    name: 'action',
    align: 'center',
    label: 'Action',
    field: 'action',
  },
])
const rows = ref([])
const programOptions = ref({})
const editForm = ref({
  courseTitle: null,
  courseCode: '',
  numUnits: '',
  description: '',
})
const roleValidation = ref('')
const isAdmin = ref('')
const notAdmin = ref('')

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
    programOptions.value = response.data.map((program) => program.name)
  } catch (err) {
    console.error(err)
  }
}

async function getCourses() {
  try {
    const token = localStorage.getItem('authToken')

    const userResponse = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })

    if (
      userResponse.data.role === 'admin' ||
      userResponse.data.role === 'admission' ||
      userResponse.data.role === 'cashier' ||
      userResponse.data.role === 'registrar'
    ) {
      const response = await axios.get(`${process.env.api_host}/courses?isArchived=false`, {
        headers: {
          Authorization: token,
        },
      })
      rows.value = response.data.map((course, index) => ({
        index: index + 1,
        courseCode: course.code,
        courseTitle: course.course,
        courseName: course.name,
        description: course.description,
        prerequisite: course.prerequisite.length
          ? course.prerequisite.map((prereq) => prereq.code).join(', ')
          : '',
        numUnits: course.unit || 0,
        action: course._id,
      }))
    } else {
      const response = await axios.get(
        `${process.env.api_host}/courses?program=${userResponse.data.role}&isArchived=false`,
        {
          headers: {
            Authorization: token,
          },
        },
      )
      rows.value = response.data.map((course, index) => ({
        index: index + 1,
        courseCode: course.code,
        courseTitle: course.course,
        courseName: course.name,
        description: course.description,
        prerequisite: course.prerequisite.length
          ? course.prerequisite.map((prereq) => prereq.code).join(', ')
          : '',
        numUnits: course.unit || 0,
        action: course._id,
      }))
    }
  } catch (err) {
    console.error('Error fetching programs:', err)
  }
}

function openEditDialog(course) {
  editForm.value = {
    courseTitle: course.courseTitle,
    courseName: course.courseName,
    courseCode: course.courseCode,
    numUnits: course.numUnits,
    description: course.description,
    action: course.action,
  }
  editProgramPopUp.value = true
}

async function editProgram(course_id) {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/courses/updateCourse/${course_id}`,
      {
        code: editForm.value.courseCode,
        course: editForm.value.courseTitle,
        name: editForm.value.courseName,
        description: editForm.value.description,
        unit: editForm.value.numUnits,
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
      message: 'course edited',
    })
    editProgramPopUp.value = false
  } catch (err) {
    console.error(err)
  } finally {
    getCourses()
    loading.value = false
  }
}

function openDeleteDialog(courseId) {
  selectedCourseId.value = courseId
  deleteConfirmation.value = true
}

async function deleteProgram(course_id) {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    await axios.post(
      `${process.env.api_host}/courses/updateCourse/${course_id}`,
      { isArchived: true },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    )
    Notify.create({
      type: 'positive',
      message: 'Course deleted',
    })
    getCourses()
    deleteConfirmation.value = false
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something Went Wrong',
    })
  } finally {
    loading.value = false
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
    roleValidation.value = response.data.role
    if (roleValidation.value === 'admin') {
      return (isAdmin.value = true)
    } else {
      return (notAdmin.value = true)
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error fetching user information',
    })
  }
}

onMounted(() => {
  getCourses()
  getPrograms()
  userInfo()
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
