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
              <div class="queue-number">{{ currentOsas }}</div>
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
const currentOsas = ref('')
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
    const osasQueue = await axios.get(`${process.env.api_host}/queues/current/osas`, {
      headers: {
        Authorization: token,
      },
    })
    if (osasQueue.data.currentQueue.length > 0) {
      currentOsas.value = osasQueue.data.currentQueue[0].queueNumber
    } else {
      currentOsas.value = 'None'
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
  height: 90vh


.main-container
  width: 100%
  height: 100vh
  border: 3px solid #606060
  display: flex


.left-section
  width: 60%
  height: 100%
  padding-left: 3rem !important


.header-container
  margin-left: 3rem
  display: flex
  align-items: center


.logo-img
  width: 150px


.title-container
  width: 100%


.university-title
  color: #30532f
  font-size: 4em
  font-weight: 500
  margin-left: 3rem


.campus-title-wrapper
  display: flex
  justify-content: flex-end


.campus-title
  color: #6a268d
  font-size: 2rem
  font-weight: 500
  margin-right: 3rem


.banner-container
  border: 10px solid #31582c
  width: 57.3vw
  height: auto
  margin-top: 1rem


.banner-img
  height: 700px


.right-section
  width: 30%
  height: 100%
  background-color: #f2f7d5
  padding-left: 0 !important


.datetime-container
  display: flex
  justify-content: center
  text-align: center


.datetime-wrapper
  width: 100%

.time-display
  color: red
  font-size: 4em
  font-weight: 500


.date-display
  color: #272923
  font-size: 2rem
  font-weight: 500


.queue-section
  padding-left: 0 !important


.queue-item
  display: flex
  height: 240px
  border: 5px solid #d9dad9


.queue-number
  background-color: #31582c
  width: 60%
  color: white
  font-size: 2em
  font-weight: 700
  display: flex
  justify-content: center
  align-items: center

.counter-container
  width: 40%


.counter-label
  font-size: 2em
  justify-self: flex-end
  color: #481a6b
  font-weight: 500


.counter-number
  font-size: 6em
  justify-self: flex-end
  color: #31582c


@media (max-width: 1440px)
  .university-title
    font-size: 2.8em
  .campus-title
    font-size: 1.4rem
  .time-display
    font-size: 2.8em

  .queue-number, .counter-number
    font-size: 1.5em

  .counter-label
    font-size: 1.4em

  .queue-item
    height: 160px

  .banner-img
    height: 450px

  .banner-container
    width: 55vw

@media (max-width: 1024px)
  .main-container
    flex-direction: column

  .left-section, .right-section
    width: 100%
    padding: 1rem !important

  .banner-container
    width: 90vw
    margin: 1rem auto

  .queue-item
    height: 110px

  .queue-number, .counter-number
    font-size: 3em

  .counter-label
    font-size: 1.1em

  .header-container
    margin-left: 1rem

  .university-title
    margin-left: 1.5rem
    font-size: 2.5em

@media (max-width: 768px)
  .university-title
    font-size: 1.8em
    margin-left: 1rem

  .campus-title
    font-size: 1.2rem
    margin-right: 1rem

  .logo-img
    width: 80px

  .header-container
    margin-left: 0.5rem

  .time-display
    font-size: 1.8em

  .date-display
    font-size: 1.3rem

  .banner-img
    height: 350px

  .queue-item
    height: 90px

  .queue-number, .counter-number
    font-size: 2em

  .counter-label
    font-size: 1em

@media (max-width: 480px)
  .university-title
    font-size: 1.2em

  .campus-title
    font-size: 0.9rem

  .banner-img
    height: 250px

  .queue-item
    height: 80px

  .queue-number, .counter-number
    font-size: 1.5em

  .counter-label
    font-size: 0.9em

  .time-display
    font-size: 1.5em

  .date-display
    font-size: 1.1rem

@media (max-width: 360px)
  .university-title
    font-size: 1em

  .campus-title
    font-size: 0.8rem

  .logo-img
    width: 60px

  .queue-item
    height: 70px

  .queue-number, .counter-number
    font-size: 1em

  .counter-label
    font-size: 0.8em

  .time-display
    font-size: 1.3em

  .date-display
    font-size: 1rem
</style>
