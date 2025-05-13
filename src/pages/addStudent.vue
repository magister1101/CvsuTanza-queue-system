<template>
  <q-page style="height: 90vh">
    <div class="main-container">
      <div class="content-container q-px-md q-px-sm-xl">
        <q-card-section class="q-pt-md">
          <div class="text-h6 text-weight-medium" style="color: #282726">
            Admin/<span style="color: #b1b2b4">Student</span>
          </div>
        </q-card-section>
        <!-- buttons add student/export -->
        <div class="button-container">
          <q-card-section class="button-section" v-if="isAdmin">
            <q-btn
              label="Add Student"
              no-caps
              @click="addStudentPopUp = true"
              flat
              class="action-button"
            />
          </q-card-section>

          <q-card-section class="button-section" v-if="isAdmin">
            <q-btn
              :label="'Import CSV'"
              no-caps
              @click="importStudentDialog = true"
              flat
              class="action-button"
            />
          </q-card-section>

          <q-card-section class="button-section">
            <q-btn label="Export CSV" no-caps @click="exportTable" flat class="action-button" />
          </q-card-section>

          <q-card-section class="button-section">
            <q-btn
              :label="'Current Semester: ' + semester"
              no-caps
              @click="changeSemster"
              flat
              class="action-button"
            />
          </q-card-section>
        </div>

        <!-- add student -->
        <div>
          <q-dialog v-model="addStudentPopUp" persistent>
            <q-card style="width: 800px; max-width: 95vw">
              <q-form @submit.prevent="addStudent">
                <div class="q-pa-md">
                  <q-card-section class="text-h6 text-weight-medium" style="color: #282726">
                    Add Student
                  </q-card-section>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">First Name</div>
                        <div class="input-field">
                          <q-input v-model="firstName" type="text" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Middle Name</div>
                        <div class="input-field">
                          <q-input v-model="middleName" type="text" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Last Name</div>
                        <div class="input-field">
                          <q-input v-model="lastName" type="text" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Username</div>
                        <div class="input-field">
                          <q-input v-model="username" type="text" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Password</div>
                        <div class="input-field">
                          <q-input v-model="password" type="password" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Confirm Password</div>
                        <div class="input-field">
                          <q-input v-model="confirmPassword" type="password" borderless />
                        </div>
                      </div>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Student ID</div>
                        <div class="input-field">
                          <q-input v-model="studentId" type="number" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Email</div>
                        <div class="input-field">
                          <q-input v-model="email" type="email" borderless />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Program</div>
                        <div class="input-field">
                          <q-select
                            v-model="program"
                            type="text"
                            borderless
                            :options="programOption.option"
                            option-value="value"
                            option-label="label"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Year</div>
                        <div class="input-field">
                          <q-select
                            v-model="year"
                            type="text"
                            borderless
                            :options="yearOption.options"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Section</div>
                        <div class="input-field">
                          <q-select
                            v-model="section"
                            type="text"
                            borderless
                            :options="sectionOption.options"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Status</div>
                        <div class="input-field">
                          <q-select
                            v-model="status"
                            type="text"
                            borderless
                            :options="statusOption"
                          />
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
                      class="q-px-md"
                      style="background-color: #306b30; color: #ffffff; width: 100px"
                    />
                  </q-card-actions>
                </div>
              </q-form>
            </q-card>
          </q-dialog>
        </div>
        <!-- import dialog -->
        <div>
          <q-dialog v-model="importStudentDialog" persistent>
            <q-card class="q-pa-md" style="min-width: 350px; max-width: 40vw; width: 100%">
              <q-card-section>
                <div class="text-h6">Import Students</div>
                <div class="text-subtitle2 text-grey">Upload an Excel file (.xlsx or .xls)</div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <q-file
                  v-model="file"
                  @change="handleFileChange"
                  accept=".xlsx,.xls"
                  label="Choose Excel File"
                  filled
                  dense
                  bottom-slots
                  :clearable="!!file"
                  style="width: 100%"
                >
                  <template v-slot:append>
                    <q-icon name="upload" />
                  </template>
                </q-file>

                <div class="q-mt-md">
                  <q-btn
                    label="Upload"
                    color="primary"
                    :disable="!file || loadingImport"
                    @click="uploadFile"
                    class="full-width"
                  />
                </div>

                <div v-if="loadingImport" class="q-mt-md text-center">
                  <q-spinner-dots color="primary" size="md" />
                  <div class="text-caption q-mt-xs">Uploading...</div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat label="Close" @click="cancelImport" color="negative" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <!-- table -->
        <div class="q-mt-lg">
          <q-table
            :loading="tableLoading"
            style="border-radius: 12px; background-color: #fdffdf"
            title="Recent Students"
            :rows="rows"
            :columns="columns"
            row-key="id"
            separator="cell"
            :filter="filter"
            :rows-per-page-options="[0, 5, 10, 15, 20]"
            class="responsive-table"
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary">
                <q-spinner-dots size="50px" />
              </q-inner-loading>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  v-for="col in columns"
                  :key="col.name"
                  :props="props"
                  :style="{ maxWidth: '200px', whiteSpace: 'normal', wordWrap: 'break-word' }"
                >
                  <template v-if="col.name === '#'">
                    {{ props.rowIndex + 1 }}
                  </template>

                  <template v-else-if="col.name === 'action'">
                    <div class="row q-gutter-x-sm">
                      <q-btn-dropdown flat dropdown-icon="more_vert">
                        <q-list>
                          <div>
                            <q-btn
                              v-if="isAdmin"
                              @click="openEditDialog(props.row)"
                              label="Edit"
                              no-caps
                              flat
                              style="width: 100%"
                            />
                          </div>
                          <div>
                            <q-btn
                              v-if="!props.row.isRegular"
                              @click="enrollCourse(props.row._id)"
                              style="width: 100%"
                              :loading="loading"
                              label="Enroll Courses"
                              no-caps
                              flat
                            />
                          </div>
                          <div>
                            <q-btn
                              @click="openDeleteDialog(props.row._id)"
                              style="width: 100%"
                              label="Delete"
                              no-caps
                              flat
                            />
                          </div>
                          <div>
                            <q-btn
                              @click="resetPassword(props.row._id)"
                              style="width: 100%"
                              :loading="loading"
                              label="Reset Password"
                              no-caps
                              flat
                            />
                          </div>
                          <div>
                            <q-btn
                              :loading="loading"
                              @click="sendEmail(props.row._id)"
                              label="Send Email"
                              style="width: 100%; color: green"
                              no-caps
                              flat
                              color="green"
                            />
                          </div>
                          <div>
                            <q-btn
                              :loading="loading"
                              @click="rejectEmail(props.row._id)"
                              label="Reject Email"
                              style="width: 100%; color: red"
                              no-caps
                              flat
                            />
                          </div>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </template>

                  <template v-else-if="col.name === 'courses'">
                    <!-- Display course codes as a comma-separated string -->
                    {{ props.row.courses?.map((course) => course.courseId?.code).join(', ') }}
                  </template>

                  <template v-else>
                    {{
                      typeof col.field === 'function' ? col.field(props.row) : props.row[col.name]
                    }}
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
      </div>
    </div>
    <!-- delete popup -->
    <template>
      <q-dialog v-model="deletePopUp">
        <q-card style="min-width: 300px">
          <q-card-section class="text-h6">Confirm Delete</q-card-section>
          <q-card-section>Are you sure you want to delete this student?</q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="red-8" v-close-popup />
            <q-btn
              flat
              label="Delete"
              :loading="loading"
              style="background-color: #306b30; color: #ffffff"
              @click="confirmDelete(selectedStudentId.value)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
    <!-- Edit dialog -->
    <q-dialog v-model="editStudentInfo" persistent>
      <q-card style="width: 800px; max-width: 95vw">
        <q-form @submit.prevent="editStudent(selectedStudentId)">
          <div class="q-pa-md">
            <q-card-section class="text-h6 text-weight-medium" style="color: #282726">
              Edit Student Info
            </q-card-section>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">First Name</div>
                  <div class="input-field">
                    <q-input v-model="editForm.firstName" type="text" borderless />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Middle Name</div>
                  <div class="input-field">
                    <q-input v-model="editForm.middleName" type="text" borderless />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Last Name</div>
                  <div class="input-field">
                    <q-input v-model="editForm.lastName" type="text" borderless />
                  </div>
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Student ID</div>
                  <div class="input-field">
                    <q-input v-model="editForm.studentId" type="number" borderless />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Email</div>
                  <div class="input-field">
                    <q-input v-model="editForm.email" type="email" borderless />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Program</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.program"
                      type="text"
                      borderless
                      :options="programOption.option"
                      option-value="value"
                      option-label="label"
                    />
                  </div>
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Year</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.year"
                      type="text"
                      borderless
                      :options="editYearOption.options"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Section</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.section"
                      type="text"
                      borderless
                      :options="editSectionOption.options"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Status</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.status"
                      type="text"
                      borderless
                      :options="editStatusOption"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup color="red-8" class="q-px-md" />
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
  </q-page>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue'
import { Notify, exportFile, is } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

// loading
const loading = ref(false)

//router
const route = useRoute()
const router = useRouter()

//value
const semester = ref('')
const semesterData = ref([])

// popup
const addStudentPopUp = ref(false)
const importStudentDialog = ref(false)
const editStudentInfo = ref(false)
const deletePopUp = ref(false)
// Form fields
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const studentId = ref('')
const email = ref('')
const program = ref('')
const programOption = ref({})
const year = ref('')
const yearOption = ref({
  options: ['First', 'Second', 'Third', 'Fourth'],
})
const section = ref('')
const sectionOption = ref({
  options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
})
const statusOption = ref(['Regular', 'Irregular'])
const status = ref('Regular')
// Edit form
const editForm = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  studentId: '',
  email: '',
  program: '',
  year: '',
  section: '',
  status: '',
})
//file
const file = ref(null)
const loadingImport = ref(false)

const roleValidation = ref('')
const isAdmin = ref('true')
const editYearOption = ref({
  options: ['First', 'Second', 'Third', 'Fourth'],
})
const editSectionOption = ref({
  options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
})
const editStatusOption = ref(['Regular', 'Irregular'])

const tableLoading = ref(false)

const selectedStudentId = ref(null)

async function cancelAdd() {
  ;(firstName.value = ''),
    (middleName.value = ''),
    (lastName.value = ''),
    (studentId.value = ''),
    (email.value = ''),
    (program.value = ''),
    (year.value = ''),
    (section.value = ''),
    (status.value = '')
  addStudentPopUp.value = false
}

async function cancelImport() {
  file.value = ''
  importStudentDialog.value = false
}

async function addStudent() {
  loading.value = true
  try {
    if (
      !firstName.value ||
      !lastName.value ||
      !username.value ||
      !password.value ||
      !confirmPassword.value ||
      !email.value ||
      !program.value ||
      !year.value ||
      !section.value ||
      !status.value
    ) {
      Notify.create({
        type: 'negative',
        message: 'Please fill in all required fields',
      })
      loading.value = false
      return
    }

    if (password.value !== confirmPassword.value) {
      Notify.create({
        type: 'negative',
        message: 'Passwords do not match',
      })
      loading.value = false
      return
    }
    if (password.value.length < 6) {
      Notify.create({
        type: 'negative',
        message: 'Password must be at least 6 characters long',
      })
      loading.value = false
      return
    }
    const isRegular = status.value === 'Regular'
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/create`,
      {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        role: 'student',
        username: username.value,
        password: password.value,
        email: email.value,
        course: program.value,
        year: year.value,
        section: section.value,
        isRegular: isRegular,
        studentNumber: studentId.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    console.log(response.data)
    getAllStudents()
    Notify.create({
      type: 'positive',
      message: 'Register Successfully',
    })
    ;(firstName.value = ''),
      (middleName.value = ''),
      (lastName.value = ''),
      (studentId.value = ''),
      (email.value = ''),
      (program.value = ''),
      (year.value = ''),
      (section.value = ''),
      (status.value = ''),
      (username.value = ''),
      (password.value = ''),
      (confirmPassword.value = '')
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something Went Wrong',
    })
  } finally {
    loading.value = false
    addStudentPopUp.value = false
  }
}

const handleFileChange = (event) => {
  // Capture the selected file
  file.value = event.target.files[0]
}

const uploadFile = async () => {
  if (!file.value) return

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    loadingImport.value = true

    const response = await axios.post(
      `${process.env.api_host}/users/excel/insertStudents`, // Replace with your backend URL
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    Notify.create({
      type: 'positive',
      message: 'File uploaded successfully',
    })
    getAllStudents()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to upload file',
    })
  } finally {
    importStudentDialog.value = false
    loadingImport.value = false
    file.value = null
  }
}

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
    name: 'studentNumber',
    required: true,
    label: 'Student Number',
    align: 'left',
    field: (row) => row.studentNumber,
    sortable: true,
  },
  {
    name: 'fullName',
    align: 'left',
    label: 'Student Name',
    field: (row) => `${row.firstName} ${row.middleName} ${row.lastName}`,
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: true,
  },
  {
    name: 'username',
    align: 'left',
    label: 'Username',
    field: 'username',
  },
  {
    name: 'course',
    align: 'left',
    label: 'Program',
    field: 'course',
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
    name: 'status',
    align: 'left',
    label: 'Status',
    field: (row) => (row.isRegular ? 'Regular' : 'Irregular'),
    sortable: true,
  },
  {
    name: 'courses',
    align: 'left',
    label: 'Course Taken',
    field: (row) =>
      Array.isArray(row.courses)
        ? row.courses
            .map((course) =>
              course.courseId && typeof course.courseId === 'object'
                ? course.courseId.code || 'N/A' // Accessing the courseId and getting the code
                : 'N/A',
            )
            .join(', ')
        : 'None',
    sortable: false,
  },
  {
    name: 'action',
    align: 'left',
    label: 'Action',
    field: 'action',
  },
])

const rows = ref([])

async function getSemester() {
  try {
    const response = await axios.get(`${process.env.api_host}/courses/getSemester`)
    console.log(response.data[0].semester)
    semester.value = response.data[0].semester
    semesterData.value = response.data
  } catch (err) {
    console.error(err)
  }
}

async function changeSemster() {
  try {
    const id = semesterData.value[0]._id

    const response = await axios.post(`${process.env.api_host}/courses/changeSemester/${id}`)
    getSemester()
  } catch (err) {
    console.error(err)
  }
}

async function getAllStudents() {
  tableLoading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const userResponse = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })

    if (
      userResponse.data.role === 'admin' ||
      userResponse.data.role === 'osas' ||
      userResponse.data.role === 'cashier' ||
      userResponse.data.role === 'registrar'
    ) {
      const response = await axios.get(
        `${process.env.api_host}/users?role=student&isArchived=false`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      )
      if (response.data && Array.isArray(response.data)) {
        rows.value = response.data
      } else {
        console.error('Invalid response format:', response)
        rows.value = []
        Notify.create({
          type: 'negative',
          message: 'Invalid data format received from server',
        })
      }
    } else {
      const response = await axios.get(
        `${process.env.api_host}/users?role=student&program=${userResponse.data.role}&year=${userResponse.data.year}&isArchived=false`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      )
      if (response.data && Array.isArray(response.data)) {
        rows.value = response.data
      } else {
        console.error('Invalid response format:', response)
        rows.value = []
        Notify.create({
          type: 'negative',
          message: 'Invalid data format received from server',
        })
      }
    }
  } catch (err) {
    console.error(err)
    rows.value = []
    Notify.create({
      type: 'negative',
      message: 'Failed to fetch students data',
    })
  } finally {
    tableLoading.value = false
  }
}

function openEditDialog(student) {
  editForm.value = {
    firstName: student.firstName || '',
    middleName: student.middleName || '',
    lastName: student.lastName || '',
    studentId: student.studentNumber || student.username || '',
    email: student.email || '',
    program: student.course,
    year: student.year || '',
    section: student.section || '',
    status: student.isRegular ? 'Regular' : 'Irregular',
    _id: student._id,
  }
  editStudentInfo.value = true
}

async function editStudent() {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/update/${editForm.value._id}`,
      {
        firstName: editForm.value.firstName,
        middleName: editForm.value.middleName,
        lastName: editForm.value.lastName,
        studentNumber: editForm.value.studentId,
        email: editForm.value.email,
        course: editForm.value.program,
        year: editForm.value.year,
        section: editForm.value.section,
        isRegular: editForm.value.status === 'Regular',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )

    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Student information updated successfully',
      })
      getAllStudents()
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to update student information',
    })
  } finally {
    loading.value = false
    editStudentInfo.value = false
  }
}

function openDeleteDialog(studentId) {
  selectedStudentId.value = studentId
  deletePopUp.value = true
}

async function confirmDelete() {
  if (!selectedStudentId.value) return
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/update/${selectedStudentId.value}`,
      {
        isArchived: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Student deleted successfully',
      })
      await getAllStudents()
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to delete student',
    })
  } finally {
    loading.value = false
    deletePopUp.value = false
    selectedStudentId.value = null
  }
}

async function resetPassword(studentId) {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/update/${studentId}`,
      {
        password: 'cvsuTanza101',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )

    Notify.create({
      type: 'positive',
      message: 'Password reset successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went Wrong',
    })
  } finally {
    loading.value = false
  }
}

async function enrollCourse(studentId) {
  loading.value = true
  try {
    const userResponse = await axios.get(`${process.env.api_host}/users?query=${studentId}`)

    if (userResponse.data[0].isRegular) {
      const enroll = await axios.post(`${process.env.api_host}/users/enrollRegular/${studentId}`, {
        semester: semester.value,
      })
      Notify.create({
        type: 'positive',
        message: 'Student successfully enrolled in the ' + semester.value + ' semester',
      })
      sendEmail(studentId)
      return
    } else {
      router.push(`/queueCourse/` + `${studentId}`)
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to enroll course',
    })
  } finally {
    loading.value = false
  }
}

async function sendEmail(studentId) {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/sendEmail/${studentId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Email sent successfully',
      })
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to send email',
    })
  } finally {
    loading.value = false
  }
}

async function rejectEmail(studentId) {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/rejectEmail/${studentId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Email sent successfully',
      })
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to send email',
    })
  } finally {
    loading.value = false
  }
}

async function fetchPrograms() {
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

    programOption.value = {
      option: response.data.map((program) => program.name),
    }
  } catch (err) {
    console.error('Error fetching programs:', err)
    Notify.create({
      type: 'negative',
      message: 'Failed to fetch programs',
    })
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
    if (
      roleValidation.value === 'registrar' ||
      roleValidation.value === 'osas' ||
      roleValidation.value === 'cashier'
    ) {
      return (isAdmin.value = false)
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error fetching user information',
    })
  }
}

// export button
function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted = formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}
function exportTable() {
  // Add row numbers to the data before export
  const contentRows = rows.value.map((row, index) => ({
    '#': index + 1, // Add the row number
    ...row,
  }))

  const content = [columns.value.map((col) => wrapCsvValue(col.label))]
    .concat(
      contentRows.map((row) =>
        columns.value
          .map((col) =>
            wrapCsvValue(
              col.name === '#'
                ? row['#'] // Handle the numbering column
                : typeof col.field === 'function'
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row,
            ),
          )
          .join(','),
      ),
    )
    .join('\r\n')

  const status = exportFile('Students-info.csv', content, 'text/csv')

  if (status !== true) {
    Notify.create({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
    })
  }
}

onMounted(() => {
  userInfo()
  getAllStudents()
  fetchPrograms()
  getSemester()
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

.responsive-table
  :deep(.q-table__container)
    overflow-x: auto

  :deep(.q-table)
    min-width: 600px

  @media (max-width: 600px)
    :deep(.q-table__top)
      flex-direction: column
      align-items: stretch
      padding: 8px

    :deep(.q-table__top-left)
      margin-bottom: 8px

    :deep(.q-table__top-right)
      margin-top: 8px

    :deep(.q-table__middle)
      max-width: 100vw
      overflow-x: auto

    :deep(.q-td)
      white-space: nowrap
      padding: 8px

@media (max-width: 600px)
  .content-container
    padding: 8px !important

  .q-table__grid-content
    flex: 1 1 100%

  .text-h6
    font-size: 1.1rem

.input-field
  background-color: #fdfede
  border-radius: 8px
  padding: 4px 12px

@media (max-width: 600px)
  .input-field
    width: 100%

  .q-dialog__inner > div
    max-height: 90vh
</style>
