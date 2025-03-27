<template>
  <q-page>
    <div>
      <div
        class="background-container"
      >
        <q-card-section class="flex flex-center">
          <div class="content-width">
            <q-card-section class="text-center page-header">
              <div class="page-title text-weight-bold text-uppercase">queue summary</div>
            </q-card-section>
            <q-card-section class="container-queuing q-pa-sm" v-if="queueDetails">
              <!-- queue number -->
              <q-card-section class="flex flex-center">
                <q-card class="queue-card">
                  <q-card-section class="text-center">
                    <div class="text-h5 text-weight-bold">QUEUE NUMBER</div>
                    <div class="queue-number">{{ queueDetails.queueNumber }}</div>
                    <div>Status: {{ queueDetails.status }}</div>
                    <div>Destination: {{ queueDetails.destination }}</div>
                  </q-card-section>
                </q-card>
              </q-card-section>
              <!-- Student and Course Information Container -->
              <q-card-section class="info-container">
                <div class="info-sections">
                  <!-- Student Information Section -->
                  <div class="info-section">
                    <div class="section-header">Student Information</div>
                    <div class="scroll-container">
                      <div class="info-grid student-info">
                        <div class="info-cell"><strong>Username:</strong> {{ queueDetails.student.username }}</div>
                        <div class="info-cell"><strong>Email:</strong> {{ queueDetails.student.email }}</div>
                        <div class="info-cell"><strong>First Name:</strong> {{ queueDetails.student.firstName }}</div>
                        <div class="info-cell"><strong>Middle Name:</strong> {{ queueDetails.student.middleName }}</div>
                        <div class="info-cell"><strong>Last Name:</strong> {{ queueDetails.student.lastName }}</div>
                        <div class="info-cell"><strong>Course:</strong> {{ queueDetails.student.course }}</div>
                        <div class="info-cell"><strong>Year:</strong> {{ queueDetails.student.year }}</div>
                        <div class="info-cell"><strong>Section:</strong> {{ queueDetails.student.section }}</div>
                        <div class="info-cell"><strong>Regular:</strong> {{ queueDetails.student.isRegular }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Course Information Section -->
                <div class="course-container">
                  <div class="section-header">Courses to Take</div>
                  <div class="course-grid">
                    <div v-for="course in queueDetails.courseToTake" :key="course._id" class="course-cell">
                      <div><strong>Course Code:</strong> {{ course.code }}</div>
                      <div><strong>Course Name:</strong> {{ course.name }}</div>
                      <div><strong>Course:</strong> {{ course.course }}</div>
                      <div><strong>Course Unit:</strong> {{ course.unit }}</div>
                      <div><strong>Course Description:</strong> {{ course.description }}</div>
                    </div>
                  </div>
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
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const route = useRoute()
const queueId = route.params.queueId
const queueDetails = ref(null)

async function queueSummary() {
  try {
    const response = await axios.get(`${process.env.api_host}/queues?query=${queueId}`)
    queueDetails.value = response.data[0]
    console.log(queueDetails.value, 'wew')
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  queueSummary()
})
</script>

<style lang="sass" scoped>
.background-container
  background: url('https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617278/assets/queing/q5xrh22iplhm2bndvvru.jpg') no-repeat center center
  background-size: cover
  width: 100%
  min-height: 100vh
  border: 3px solid #606060
  overflow-y: auto

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
