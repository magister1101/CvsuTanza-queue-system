<template>
  <q-page>
    <div>
      <div
        style="
          background: url('https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617278/assets/queing/q5xrh22iplhm2bndvvru.jpg')
            no-repeat center center;
          background-size: cover;
          width: 100%;
          height: 100vh;
          border: 3px solid #606060;
        "
      >
        <!-- <div class="q-ml-xl q-pt-xl" style="float: left; position: absolute; z-index: 100">
          <q-btn icon="arrow_back_ios" size="20px" flat @click="backBtn" />
        </div> -->

        <q-card-section>
          <div class="main-container">
            <q-card-section class="text-center q-pt-xl">
              <div class="text-h4 text-weight-bold text-uppercase">Student Register</div>
            </q-card-section>
            <q-card-section class="container-courseInfo">
              <q-form @submit.prevent="registerStudent">
                <q-card-section class="form-container">
                  <div style="width: 100%">
                    <q-card-section style="width: 100%">
                      First Name:
                      <div style="width: 100%">
                        <q-input type="text" outlined v-model="firstName" />
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Middle Name:
                      <div style="width: 100%">
                        <q-input type="text" outlined v-model="middleName" label="Optional" />
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Last Name:
                      <div style="width: 100%">
                        <q-input type="text" outlined v-model="lastName" />
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Section:
                      <div style="width: 100%">
                        <q-select
                          type="text"
                          outlined
                          v-model="section"
                          :options="sectionOption.options"
                        />
                      </div>
                    </q-card-section>

                    <q-card-section style="width: 100%">
                      Program:
                      <div style="width: 100%">
                        <q-select
                          type="text"
                          outlined
                          v-model="course"
                          :options="courseOption.option"
                        />
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Year:
                      <div style="width: 100%">
                        <q-select
                          type="text"
                          outlined
                          v-model="year"
                          :options="yearOption.options"
                        />
                      </div>
                    </q-card-section>
                  </div>
                  <!-- sdsd -->
                  <div style="width: 100%">
                    <q-card-section style="width: 100%">
                      Student Number:
                      <div style="width: 100%">
                        <q-input type="text" outlined v-model="studentNumber" />
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      User Name:
                      <div style="width: 100%">
                        <q-input type="text" outlined v-model="username" />
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Password:
                      <div style="width: 100%">
                        <q-input :type="isPwd ? 'password' : 'text'" outlined v-model="password">
                          <template v-slot:append>
                            <q-icon
                              :name="isPwd ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="isPwd = !isPwd"
                            />
                          </template>
                        </q-input>
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Confirm Password:
                      <div style="width: 100%">
                        <q-input
                          :type="isPwd ? 'password' : 'text'"
                          outlined
                          v-model="confirmPassword"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="isPwd ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="isPwd = !isPwd"
                            />
                          </template>
                        </q-input>
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Email:
                      <div style="width: 100%">
                        <q-input type="email" outlined v-model="email" />
                      </div>
                    </q-card-section>
                    <q-card-section style="width: 100%">
                      Status:
                      <div style="width: 100%">
                        <q-select type="text" outlined v-model="status" :options="statusOptions" />
                      </div>
                    </q-card-section>
                  </div>
                </q-card-section>
                <q-card-section class="flex flex-center">
                  <q-btn
                    type="submit"
                    label="Signup"
                    :loading="loading"
                    no-caps
                    flat
                    style="background-color: #30572d; color: #ffffff"
                  />
                </q-card-section>
                <!-- button -->
              </q-form>
            </q-card-section>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
// import
const router = useRouter()
const loading = ref(false)
// student info
const firstName = ref('')
const middleName = ref(``)
const lastName = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const section = ref('')
const studentNumber = ref('')
const year = ref('')
const yearOption = ref({
  options: ['First', 'Second', 'Third', 'Fourth'],
})

const course = ref('')
const courseOption = ref({})
const sectionOption = ref({
  options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
})
const statusOptions = ref(['Regular', 'Irregular'])
const status = ref('Regular')

async function registerStudent() {
  loading.value = true
  try {
    // Validate that all required fields are filled in
    if (
      !firstName.value ||
      !lastName.value ||
      !username.value ||
      !password.value ||
      !confirmPassword.value ||
      !studentNumber.value ||
      !email.value ||
      !course.value ||
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
    // Check if the password and confirm password fields match
    if (password.value !== confirmPassword.value) {
      Notify.create({
        type: 'negative',
        message: 'Passwords do not match',
      })
      loading.value = false
      return
    }
    // Ensure the password meets the minimum length requirement
    if (password.value.length < 6) {
      Notify.create({
        type: 'negative',
        message: 'Password must be at least 6 characters long',
      })
      loading.value = false
      return
    }
    // Determine if the student status is 'Regular'
    const isRegular = status.value === 'Regular'
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('authToken')
    // Send a POST request to create a new student user
    const response = await axios.post(
      `${process.env.api_host}/users/create`,
      {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        studentNumber: studentNumber.value,
        role: 'student',
        username: username.value,
        password: password.value,
        email: email.value,
        course: course.value,
        year: year.value,
        section: section.value,
        isRegular: isRegular,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    console.log(response.data.saveUser._id, 'wes')
    // Notify the user of successful registration
    Notify.create({
      type: 'positive',
      message: 'Register Successfully',
    })
    router.replace(`/registerCourse/` + response.data.saveUser._id)
  } catch (err) {
    // Log any errors that occur during the registration process
    console.error(err)
    // Notify the user that something went wrong
    Notify.create({
      type: 'negative',
      message: 'Something Went Wrong',
    })
  } finally {
    // Ensure the loading state is reset, regardless of outcome
    loading.value = false
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
    courseOption.value = {
      option: response.data.map((program) => program.name),
    }
  } catch (err) {
    console.error(err)
  }
}

// async function backBtn() {
//   router.replace(`/`)
// }

onMounted(() => {
  getPrograms()
})
</script>

<style lang="sass" scoped>
.container-courseInfo
  background-color: #fcfedf
  width: 100%
  height: auto
  padding: 20px

.main-container
  width: 90%
  max-width: 1200px
  margin: 0 auto

.form-container
  display: flex
  gap: 20px
  max-height: 70vh
  overflow-y: auto

@media (max-width: 700px)
  .form-container
    display: flex
    flex-direction: column
    gap: 0
    max-height: 65vh
    overflow-y: auto
    padding-right: 10px

  .container-courseInfo
    padding: 10px
</style>
