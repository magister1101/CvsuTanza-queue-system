<template>
  <q-page style="height: 90vh">
    <div class="main-container">
      <div class="content-container q-px-md q-px-sm-xl">
        <q-card-section class="q-pt-md">
          <div class="text-h6 text-weight-medium" style="color: #282726">
            Admin/<span style="color: #b1b2b4">Users</span>
          </div>

          <q-card-section class="q-px-none">
            <q-card-section style="background-color: #30582d" class=" ">
              <div style="color: #ffffff" class="text-h6 text-weight-medium">User List</div>
            </q-card-section>
            <div class="q-mt-lg">
              <q-table
                :loading="tableLoading"
                style="border-radius: 14px; background-color: #fdffdf"
                title="Recent Students"
                :rows="rows"
                :columns="columns"
                row-key="id"
                separator="cell"
                :filter="filter"
              >
                <template v-slot:loading>
                  <q-inner-loading showing color="primary">
                    <q-spinner-dots size="50px" />
                  </q-inner-loading>
                </template>
                <template #body="props">
                  <q-tr :props="props">
                    <q-td>{{ props.row.username }}</q-td>
                    <q-td>{{ props.row.role }}</q-td>
                    <q-td>{{ props.row.name }}</q-td>
                    <q-td>{{ props.row.email }}</q-td>

                    <q-td>
                      <div class="row q-gutter-x-sm" v-if="isAdmin">
                        <q-btn-dropdown flat dropdown-icon="more_vert">
                          <q-list>
                            <div>
                              <q-btn
                                label="Edit"
                                no-caps
                                flat
                                style="width: 100%"
                                color="primary"
                                @click="openEditDialog(props.row)"
                              />
                            </div>
                            <div>
                              <q-btn
                                label="Delete"
                                no-caps
                                flat
                                style="width: 100%; color: red"
                                @click="deleteUserDialog(props.row.id)"
                              />
                            </div>
                            <div>
                              <!-- <q-btn
                                :loading="loading"
                                label="Send Email"
                                no-caps
                                flat
                                style="width: 100%; color: green"
                              /> -->
                            </div>
                          </q-list>
                        </q-btn-dropdown>
                      </div>
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
                <template v-slot:top-right v-if="isAdmin">
                  <q-card-section class="button-section">
                    <q-btn
                      label="Add User"
                      no-caps
                      flat
                      class="action-button"
                      @click="createAccountDialog = true"
                    />
                  </q-card-section>
                </template>
              </q-table>
            </div>
          </q-card-section>
        </q-card-section>
        <!-- delete user dialog -->
        <q-dialog v-model="deleteUserDialogPopup" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6 text-weight-medium q-py-md">Delete User</div>
              <div class="text-subtitle1 q-pb-md">Are you sure you want to delete this user?</div>
              <div align="right">
                <q-btn flat v-close-popup label="Cancel" color="primary" />
                <q-btn
                  flat
                  v-close-popup
                  label="Delete"
                  style="color: red"
                  @click="deleteUser"
                  :loading="deleteLoading"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <!-- create user dialog -->
        <q-dialog v-model="createAccountDialog" persistent>
          <q-card style="width: 1000px; max-width: 1200px">
            <q-card-section style="width: 100%" class="flex flex-center">
              <div
                class="q-px-md"
                style="
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  max-width: 1200px;
                  background-color: #fbfedf;
                  border-radius: 14px;
                "
              >
                <q-form @submit.prevent="createAccount">
                  <q-card-section>
                    <div class="text-center text-h5 text-weight-medium">CREATE NEW ACCOUNT</div>
                  </q-card-section>
                  <q-card-section>
                    <div class="row justify-center q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <q-card-section>
                          First Name
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="firstName" borderless />
                          </div>
                        </q-card-section>
                      </div>
                      <div class="col-12 col-sm-4">
                        <q-card-section>
                          Middle Name
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="middleName" borderless label="optional" />
                          </div>
                        </q-card-section>
                      </div>
                      <div class="col-12 col-sm-4">
                        <q-card-section>
                          Last Name
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="lastName" borderless />
                          </div>
                        </q-card-section>
                      </div>
                    </div>
                    <div class="row justify-center q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Username
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="userName" borderless />
                          </div>
                        </q-card-section>
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Email
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="email" v-model="email" borderless />
                          </div>
                        </q-card-section>
                      </div>
                    </div>
                    <div class="row justify-center q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Password
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="password" v-model="password" borderless />
                          </div>
                        </q-card-section>
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Confirm Password
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="password" v-model="confirmPassword" borderless />
                          </div>
                        </q-card-section>
                      </div>
                    </div>
                    <div class="row justify-center q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Role
                          <div
                            style="
                              border: 1px solid red;
                              width: 100%;
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-select v-model="role" :options="roleOptions.option" borderless />
                          </div>

                          Year
                          <div
                            style="
                              border: 2px solid #9fa092;
                              width: 100%;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-select v-model="year" :options="yearOptions" borderless />
                          </div>
                        </q-card-section>
                      </div>
                    </div>
                    <!-- btn -->
                    <q-card-section class="flex flex-center">
                      <div>
                        <q-btn
                          label="Done"
                          type="submit"
                          flat
                          :loading="loading"
                          style="background-color: #132b10; color: #ffffff"
                        />
                        <q-btn
                          class="q-ml-sm"
                          @click="cancelCreate"
                          label="cancel"
                          flat
                          style="color: red"
                        />
                      </div>
                    </q-card-section>
                  </q-card-section>
                </q-form>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <q-dialog v-model="editDialog" persistent>
          <q-card style="width: 1000px; max-width: 1200px">
            <q-card-section style="width: 100%" class="flex flex-center">
              <div
                class="q-px-md"
                style="
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  max-width: 1200px;
                  background-color: #fbfedf;
                  border-radius: 14px;
                "
              >
                <q-form @submit.prevent="updateUser">
                  <q-card-section>
                    <div class="text-center text-h5 text-weight-medium">EDIT USER</div>
                  </q-card-section>
                  <q-card-section>
                    <div class="row justify-center q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <q-card-section>
                          First Name
                          <div
                            style="
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="firstName" borderless />
                          </div>
                        </q-card-section>
                      </div>
                      <div class="col-12 col-sm-4">
                        <q-card-section>
                          Middle Name
                          <div
                            style="
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="middleName" borderless />
                          </div>
                        </q-card-section>
                      </div>
                      <div class="col-12 col-sm-4">
                        <q-card-section>
                          Last Name
                          <div
                            style="
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="lastName" borderless />
                          </div>
                        </q-card-section>
                      </div>
                    </div>
                    <div class="row justify-center q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Username
                          <div
                            style="
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="text" v-model="userName" borderless />
                          </div>
                        </q-card-section>
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Email
                          <div
                            style="
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-input type="email" v-model="email" borderless />
                          </div>
                        </q-card-section>
                      </div>
                    </div>
                    <div class="row justify-center q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-card-section>
                          Role
                          <div
                            style="
                              border: 2px solid #9fa092;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-select v-model="role" :options="roleOptions.option" borderless />
                          </div>
                          Year
                          <div
                            style="
                              border: 2px solid #9fa092;
                              width: 100%;
                              background-color: #fefeff;
                              border-radius: 14px;
                            "
                          >
                            <q-select v-model="year" :options="yearOptions" borderless />
                          </div>
                        </q-card-section>
                      </div>
                    </div>
                    <q-card-section class="flex flex-center">
                      <div>
                        <q-btn
                          label="Update"
                          type="submit"
                          flat
                          :loading="loading"
                          style="background-color: #132b10; color: #ffffff"
                        />
                        <q-btn
                          class="q-ml-sm"
                          @click="cancelCreate"
                          label="Cancel"
                          flat
                          style="color: red"
                        />
                      </div>
                    </q-card-section>
                  </q-card-section>
                </q-form>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'

const createAccountDialog = ref(false)
const loading = ref(false)
const deleteLoading = ref(false)
const tableLoading = ref(false)
const editDialog = ref(false)
const selectedUser = ref(null)
const deleteUserDialogPopup = ref(false)
// Form data

const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const userName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref(null)
const year = ref(null)

const roleValidation = ref('')
const isAdmin = ref('')
const notAdmin = ref('')

const roleOptions = ref({})
const yearOptions = ['First', 'Second', 'Third', 'Fourth']
const extraOptions = ['registrar', 'admission', 'cashier', 'admin']

const statusOptions = ['Active', 'Inactive']

const filter = ref('')
const rows = ref([])
const columns = ref([
  {
    name: 'username',
    required: true,
    label: 'Username',
    field: 'username',
    align: 'left',
  },
  {
    name: 'role',
    required: true,
    label: 'Role',
    field: 'role',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },

  {
    name: 'email',
    required: true,
    label: 'Email',
    field: 'email',
    align: 'left',
  },

  {
    name: 'action',
    required: true,
    label: 'Action',
    field: 'action',
    align: 'left',
  },
])

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
    roleOptions.value = {
      option: [...response.data.map((program) => program.name), ...extraOptions],
    }
  } catch (err) {
    console.error(err)
  }
}

async function cancelCreate() {
  ;(firstName.value = ''),
    (middleName.value = ''),
    (lastName.value = ''),
    (userName.value = ''),
    (email.value = ''),
    (password.value = ''),
    (confirmPassword.value = '')
  role.value = null
  year.value = null
  createAccountDialog.value = false
  editDialog.value = false
}

async function createAccount() {
  loading.value = true
  const token = localStorage.getItem('authToken')
  try {
    if (
      !firstName.value ||
      !lastName.value ||
      !userName.value ||
      !email.value ||
      !password.value ||
      !confirmPassword.value ||
      !role.value
    ) {
      Notify.create({
        type: 'warning',
        message: 'Fill all the required fields',
      })
      return
    }
    if (password.value !== confirmPassword.value) {
      Notify.create({
        type: 'negative',
        message: 'Passwords do not match',
      })
      return
    }
    const response = await axios.post(
      `${process.env.api_host}/users/create`,
      {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        username: userName.value,
        email: email.value,
        password: password.value,
        role: role.value,
        isEmailSent: true,
        year: year.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    getusers()
    Notify.create({
      type: 'positive',
      message: 'Account Created Successfully',
    })
    firstName.value = ''
    middleName.value = ''
    lastName.value = ''
    userName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    role.value = null
    year.value = null
    createAccountDialog.value = false
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error creating account',
    })
  } finally {
    loading.value = false
  }
}

async function getusers() {
  tableLoading.value = true
  try {
    const response = await axios.get(`${process.env.api_host}/users?isArchived=false`)

    rows.value = response.data
      .filter((user) => user.role !== 'student')
      .map((user) => ({
        id: user._id,
        username: user.username,
        role: user.role,
        name: `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim(),
        email: user.email,
        fullData: user,
      }))
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error fetching users',
    })
  } finally {
    tableLoading.value = false
  }
}

function openEditDialog(user) {
  selectedUser.value = user.fullData
  firstName.value = user.fullData.firstName
  middleName.value = user.fullData.middleName || ''
  lastName.value = user.fullData.lastName
  userName.value = user.fullData.username
  email.value = user.fullData.email
  role.value = user.fullData.role
  editDialog.value = true
  year.value = user.fullData.year
}

async function deleteUserDialog(studentId) {
  selectedUser.value = studentId
  deleteUserDialogPopup.value = true
}

async function deleteUser() {
  deleteLoading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/update/${selectedUser.value}`,
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
    Notify.create({
      type: 'positive',
      message: 'User deleted successfully',
    })
    getusers()
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error deleting user',
    })
  } finally {
    deleteUserDialogPopup.value = false
    deleteLoading.value = false
  }
}

async function updateUser() {
  loading.value = true
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.post(
      `${process.env.api_host}/users/update/${selectedUser.value._id}`,
      {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        username: userName.value,
        email: email.value,
        role: role.value,
        year: year.value
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
      message: 'User Updated Successfully',
    })
    editDialog.value = false
    getusers()
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error updating user',
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
  userInfo()
  getusers()
  getPrograms()
})
</script>

<style lang="sass" scoped>

.main-container
  background-color: #dadada
  min-height: 100%

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
</style>
