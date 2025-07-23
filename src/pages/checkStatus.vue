<template>
  <q-page>
    <div>
      <div>
        <q-card-section>
          <q-btn flat @click="redirect('/preRegCheck')">
            <q-icon name="arrow_back_ios" />
          </q-btn>
        </q-card-section>

        <q-card-section class="flex flex-center">
          <div class="content-width">
            <q-card-section class="text-center page-header">
              <div class="page-title text-weight-bold text-uppercase">Student Status</div>
            </q-card-section>
            <div v-if="pageLoad" class="flex flex-center q-my-xl">
              <q-spinner-dots color="primary" size="50px" />
            </div>
            <q-card-section class="container-queuing q-pa-sm" v-if="userData">
              <!-- Student and Course Information Container -->
              <q-card-section class="info-container">
                <div class="info-sections">
                  <!-- Student Information Section -->
                  <div class="info-section">
                    <div class="section-header">Student Information</div>
                    <div class="scroll-container">
                      <div class="info-grid student-info">
                        <div class="info-cell" v-if="!userData">
                          <strong>NO INFO TO SHOW</strong>
                        </div>
                        <div class="info-cell">
                          <strong>Username:</strong> {{ userData.username }}
                        </div>
                        <div class="info-cell"><strong>Email:</strong> {{ userData.email }}</div>
                        <div class="info-cell">
                          <strong>First Name:</strong> {{ userData.firstName }}
                        </div>
                        <div class="info-cell">
                          <strong>Middle Name:</strong> {{ userData.middleName }}
                        </div>
                        <div class="info-cell">
                          <strong>Last Name:</strong> {{ userData.lastName }}
                        </div>
                        <div class="info-cell"><strong>Course:</strong> {{ userData.course }}</div>
                        <div class="info-cell"><strong>Year:</strong> {{ userData.year }}</div>
                        <div class="info-cell">
                          <strong>Section:</strong> {{ userData.section }}
                        </div>
                        <div class="info-cell">
                          <strong>Regular:</strong> {{ userData.isRegular ? 'YES' : 'NO' }}
                        </div>
                        <div class="info-cell">
                          <strong>Approved:</strong> {{ userData.isApproved ? 'YES' : 'NO' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Course Information Section -->
                <div class="course-container">
                  <div class="section-header">Courses to Take</div>
                  <div class="course-grid">
                    <div
                      v-for="course in userData.courseToTake"
                      :key="course._id"
                      class="course-cell"
                    >
                      <div><strong>Course Code:</strong> {{ course.code }}</div>
                      <div><strong>Course Name:</strong> {{ course.name }}</div>
                      <div><strong>Course:</strong> {{ course.course }}</div>
                      <div><strong>Course Unit:</strong> {{ course.unit }}</div>
                    </div>
                  </div>
                </div>
                <div class="divBtn">
                  <q-btn
                    label="Done"
                    class="login-btn text-h5 text-weight-medium"
                    no-caps
                    @click="redirect('/')"
                  />
                </div>
              </q-card-section>
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
import axios from 'axios'

const router = useRouter()

const userData = ref(null)
const pageLoad = ref(true)

function redirect(path) {
  router.push(path)
}

async function getUser() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })

    userData.value = response.data
    console.log(response.data)
  } catch (error) {
    console.error(error)
  } finally {
    pageLoad.value = false
  }
}

onMounted(async () => {
  await getUser()
})
</script>

<style lang="sass" scoped>


.container-queuing
  background-color: #fcfedf
  width: 100%
  height: auto

.content-width
  width: 95%
  max-width: 1200px

.page-header
  margin-top: 40px
  color: #333332

.page-title
  font-size: 2rem
  @media (max-width: 600px)
    font-size: 1.5rem

.queue-card
  width: 90%
  max-width: 400px

.queue-number
  font-size: 1.8rem
  font-weight: bold
  color: green

.info-container
  background-color: #fefeff
  border: 3px solid #323e2f
  padding: 20px
  border-radius: 10px
  overflow-x: hidden

.info-section
  width: 100%

.student-info
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: 12px
  padding: 15px

.info-cell
  padding: 10px
  background: #ffffff
  border-radius: 8px
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1)
  word-wrap: break-word

.section-header
  font-size: 1.5em
  background-color: #30572d
  text-transform: uppercase
  color: #ffffff
  padding: 10px
  text-align: center
  border-radius: 8px

.course-container
  margin-top: 20px
  text-align: center

.course-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: 15px
  padding: 20px

.course-cell
  padding: 10px
  background: #fff
  border-radius: 8px
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1)
  border: 2px solid #ccc
  word-wrap: break-word

@media (max-width: 400px)
  .content-width
    width: 100%
  .student-info, .course-grid
    grid-template-columns: 1fr
</style>
