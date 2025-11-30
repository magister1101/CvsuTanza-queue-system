<template>
  <q-page class="q-pa-md">
    <q-card-section>
      <q-btn flat @click="redirect('/regOrIrreg')">
        <q-icon name="arrow_back_ios" />
      </q-btn>
    </q-card-section>

    <q-card-section class="info-container">
      <q-card-section class="text-center">
        <div class="text-h4 text-weight-bold text-uppercase">COURSE TO TAKE</div>
      </q-card-section>
      <div v-if="pageLoad" class="flex flex-center q-my-xl">
        <q-spinner-dots color="primary" size="50px" />
      </div>
      <div class="course-container">
        <div class="course-grid">
          <div v-for="course in courses" :key="course._id" class="course-cell">
            <div><strong>Course Code:</strong> {{ course.code }}</div>
            <div><strong>Course Name:</strong> {{ course.name }}</div>
            <div><strong>Course:</strong> {{ course.course }}</div>
            <div><strong>Semester:</strong> {{ course.semester }}</div>
            <div><strong>Course Unit:</strong> {{ course.unit }}</div>
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="done-btn q-mt-lg" v-if="!pageLoad">
          <q-btn
            class="primary"
            style="width: 100%; height: 100%"
            label="ENROLL"
            @click="enroll"
            :loading="enrollLoading"
          />
        </div>
      </div>
    </q-card-section>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Axios from 'axios'

const router = useRouter()
const courses = ref({})

const userData = ref({})

const enrollLoading = ref(false)
const pageLoad = ref(true)

function redirect(path) {
  router.push(path)
}

async function getUser() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await Axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })

    userData.value = response.data
    getCourses(userData.value)
  } catch (error) {
    console.error(error)
  }
}

async function getCourses(user) {
  try {
    const semester = await Axios.get(`${process.env.api_host}/courses/getSemester`)
    const response = await Axios.get(
      `${process.env.api_host}/courses?program=${user.course}&year=${user.year}&semester=${semester.data[0].semester}`,
    )
    courses.value = response.data
  } catch (error) {
    console.log(error)
  } finally {
    pageLoad.value = false
  }
}
async function enroll() {
  try {
    enrollLoading.value = true
    const semesterRes = await Axios.get(`${process.env.api_host}/courses/getSemester`)

    await Axios.post(`${process.env.api_host}/users/enroll/${userData.value._id}`, {
      courseToTake: courses.value,
      courseToTakeRemoved: [],
      semester: semesterRes.data[0].semester,
    })
    redirect('/thankYou')
  } catch (error) {
    console.error(error)
  } finally {
    enrollLoading.value = false
  }
}

onMounted(() => {
  getUser()
})
</script>
<style lang="sass" scoped>
.info-container
  background-color: #fefeff
  border: 3px solid #323e2f
  padding: 20px
  border-radius: 10px
  overflow-x: hidden

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

.done-btn
  width: 120px
  background-color: #31562d
  color: #ffffff
  height: 50px
  border-radius: 5px
  @media (max-width: 600px)
    width: 100px
    height: 40px
</style>
