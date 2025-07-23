<template>
  <q-page class="monitor-page">
    <div>
      <div class="main-container">
        <!-- box 1 -->
        <q-card-section class="left-section">
          <div class="header-container">
            <div clickable style="cursor: pointer" @click="backBtn">
              <q-img
                src="https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617283/assets/queing/ja3s742lgdzsca55fu1w.png"
                class="logo-img"
              />
            </div>
            <div class="title-container">
              <div class="university-title">CAVITE STATE UNIVERSITY</div>
              <div class="campus-title-wrapper">
                <div class="campus-title">TANZA CAMPUS</div>
              </div>
            </div>
          </div>
          <div class="banner-container">
            <q-img
              class="banner-img"
              src="https://res.cloudinary.com/drv1z32zg/image/upload/v1747746555/Screenshot_20250428_204509_Facebook_fazdlr.jpg"
            />
          </div>
        </q-card-section>

        <!-- box 2 -->
        <q-card-section class="right-section">
          <div class="datetime-container">
            <div class="datetime-wrapper">
              <div class="time-display">{{ currentTime }}</div>
              <div>
                <div class="date-display">{{ currentDate }}</div>
              </div>
            </div>
          </div>
          <q-card-section class="queue-section">
            <div class="queue-item">
              <div class="queue-number">{{ currentRegistrar }}</div>
              <div class="counter-container">
                <div class="counter-label">COUNTER</div>
                <div class="counter-number">01</div>
              </div>
            </div>
            <div class="queue-item">
              <div class="queue-number">{{ currentAdmission }}</div>
              <div class="counter-container">
                <div class="counter-label">COUNTER</div>
                <div class="counter-number">02</div>
              </div>
            </div>
            <div class="queue-item">
              <div class="queue-number">{{ currentCashier }}</div>
              <div class="counter-container">
                <div class="counter-label">COUNTER</div>
                <div class="counter-number">03</div>
              </div>
            </div>
          </q-card-section>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const currentQueue = ref({})
const router = useRouter()

const currentRegistrar = ref('')
const currentAdmission = ref('')
const currentCashier = ref('')

const currentTime = ref('')
const currentDate = ref('')

async function backBtn() {
  router.replace(`/`)
}

async function getCurrentQueue() {
  const token = localStorage.getItem('authToken')
  try {
    const registrarQueue = await axios.get(`${process.env.api_host}/queues/current/registrar`, {
      headers: {
        Authorization: token,
      },
    })
    if (registrarQueue.data.currentQueue.length > 0) {
      currentRegistrar.value = registrarQueue.data.currentQueue[0].queueNumber
    } else {
      currentRegistrar.value = 'None'
    }
    const admissionQueue = await axios.get(`${process.env.api_host}/queues/current/admission`, {
      headers: {
        Authorization: token,
      },
    })
    if (admissionQueue.data.currentQueue.length > 0) {
      currentAdmission.value = admissionQueue.data.currentQueue[0].queueNumber
    } else {
      currentAdmission.value = 'None'
    }
    const cashierQueue = await axios.get(`${process.env.api_host}/queues/current/cashier`, {
      headers: {
        Authorization: token,
      },
    })
    if (cashierQueue.data.currentQueue.length > 0) {
      currentCashier.value = cashierQueue.data.currentQueue[0].queueNumber
    } else {
      currentCashier.value = 'None'
    }
    console.log(currentQueue.value)
  } catch (err) {
    console.error(err)
  }
}

function updateDateTime() {
  const now = new Date()

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const days = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT']
  const dayName = days[now.getDay()]

  currentTime.value = `${formattedHours}:${formattedMinutes} ${ampm} | ${dayName}`

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const date = now.getDate().toString().padStart(2, '0')
  const month = months[now.getMonth()]
  const year = now.getFullYear()

  currentDate.value = `${date} ${month} ${year}`
}

onMounted(() => {
  getCurrentQueue()
  updateDateTime()
  setInterval(updateDateTime, 1000)

  const interval = setInterval(getCurrentQueue, 10000)
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})
</script>

<style lang="sass" scoped>
.monitor-page
  min-height: 100vh

  overflow-x: hidden

.main-container
  width: 100%
  min-height: 100vh
  border: 3px solid #606060
  display: flex
  flex-wrap: wrap

.left-section, .right-section
  box-sizing: border-box
  padding: 2rem

.left-section
  flex: 1 1 60%
  padding-left: 3rem !important

.right-section
  flex: 1 1 40%
  background-color: #f2f7d5

.header-container
  display: flex
  align-items: center
  flex-wrap: wrap
  margin-left: 3rem

.logo-img
  width: 120px
  max-width: 25vw

.title-container
  flex: 1

.university-title
  color: #30532f
  font-size: 3vw
  font-weight: 600
  margin-left: 2rem

.campus-title-wrapper
  display: flex
  justify-content: flex-end

.campus-title
  color: #6a268d
  font-size: 1.5rem
  font-weight: 500
  margin-right: 2rem

.banner-container
  border: 10px solid #31582c
  width: 100%
  max-width: 100%
  margin-top: 1rem

.banner-img
  width: 100%
  height: auto
  max-height: 60vh
  object-fit: cover

.datetime-container
  display: flex
  justify-content: center
  text-align: center

.datetime-wrapper
  width: 100%

.time-display
  color: red
  font-size: 3vw
  font-weight: 600

.date-display
  color: #272923
  font-size: 1.8vw
  font-weight: 500

.queue-section
  display: flex
  flex-direction: column
  gap: 1rem
  margin-top: 1rem

.queue-item
  display: flex
  min-height: 140px
  border: 5px solid #d9dad9
  flex-wrap: wrap

.queue-number
  background-color: #31582c
  flex: 1 1 60%
  color: white
  font-size: 2vw
  font-weight: 700
  display: flex
  justify-content: center
  align-items: center
  padding: 1rem

.counter-container
  flex: 1 1 40%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

.counter-label
  font-size: 1.5vw
  color: #481a6b
  font-weight: 500

.counter-number
  font-size: 4vw
  color: #31582c
  font-weight: 700

@media (max-width: 1024px)
  .main-container
    flex-direction: column

  .left-section, .right-section
    flex: 1 1 100%
    padding: 1rem !important

  .banner-img
    max-height: 300px

  .time-display
    font-size: 2rem

  .date-display
    font-size: 1.2rem

  .queue-number, .counter-number
    font-size: 1.5rem

  .counter-label
    font-size: 1.1rem

@media (max-width: 768px)
  .university-title
    font-size: 1.8rem
    margin-left: 1rem

  .campus-title
    font-size: 1.1rem
    margin-right: 1rem

  .logo-img
    width: 80px

  .banner-img
    max-height: 250px

  .queue-item
    min-height: 100px

@media (max-width: 480px)
  .university-title
    font-size: 1.5rem

  .campus-title
    font-size: 1rem

  .queue-number, .counter-number
    font-size: 1.2rem

  .counter-label
    font-size: 0.9rem

  .time-display
    font-size: 1.3rem

  .date-display
    font-size: 1rem

@media (max-width: 360px)
  .university-title
    font-size: 1.2rem

  .campus-title
    font-size: 0.8rem

  .logo-img
    width: 60px

  .queue-item
    min-height: 80px

  .queue-number, .counter-number
    font-size: 1rem

  .counter-label
    font-size: 0.8rem

  .time-display
    font-size: 1rem

  .date-display
    font-size: 0.9rem
</style>
