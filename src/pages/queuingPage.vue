<template>
  <q-page>
    <div>
      <div
        style="
          background: url('https://res.cloudinary.com/drv1z32zg/image/upload/v1747746555/Screenshot_20250428_204509_Facebook_fazdlr.jpg')
            no-repeat center center;
          background-size: cover;
          width: 100%;
          min-height: 100vh;
          border: 3px solid #606060;
        "
      >
        <!-- Main Content -->
        <q-card-section class="flex flex-center">
          <div class="content-width">
            <q-card-section class="text-center q-mt-md" style="color: #333332">
              <div class="text-h4 text-weight-bold text-uppercase">queuing</div>
            </q-card-section>
            <q-card-section class="container-queuing" v-if="queueData">
              <q-card-section class="flex flex-center column">
                <div style="color: #333332" class="qrContainer">
                  <q-card-section class="q-py-none">
                    <div class="queue-title text-uppercase text-center q-py-md text-weight-medium">
                      queuing number
                    </div>
                  </q-card-section>
                  <q-card-section class="q-py-none">
                    <div
                      class="queue-number text-uppercase text-center text-weight-bold"
                      style="color: green"
                    >
                      {{ queueData.queueNumber }}
                    </div>
                  </q-card-section>
                  <q-card-section class="q-py-none">
                    <div class="certificate-text text-center q-py-md text-weight-medium">
                      Estimated Time:
                      <div style="color: green">{{ queueData.estimatedTime }} Mins</div>
                      <br />
                      <!-- Release of Certificate <br />
                      of Registration -->
                    </div>
                  </q-card-section>
                  <q-card-section class="q-py-none flex flex-center">
                    <div class="qr-wrapper">
                      <qrcode :value="qrValue" v-if="queueData" :size="qrSize" />
                    </div>
                  </q-card-section>
                  <q-card-section class="q-py-none">
                    <div class="scan-text text-center q-py-md text-weight-medium">
                      Scan the QR Code to monitor the queue flow
                    </div>
                  </q-card-section>
                </div>
                <div class="print-btn q-mt-lg">
                  <q-btn style="width: 100%; height: 100%" flat label="Print" @click="printQr" />
                </div>
                <div class="done-btn q-mt-lg">
                  <q-btn
                    style="width: 100%; height: 100%"
                    flat
                    label="Done"
                    @click="handleLogout"
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
import Qrcode from 'qrcode.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
// router
const route = useRoute()
const router = useRouter()
const queueId = route.params.queueId

const queueData = ref(null)

const qrValue = ref(`https://queuing-nu.vercel.app/#/queueSummary/${queueId}`)

// Add responsive QR code size
const qrSize = ref(150)

async function getQueue() {
  try {
    const response = await axios.get(`${process.env.api_host}/queues?query=${queueId}`)
    queueData.value = response.data[0]
  } catch (err) {
    console.error(err)
  }
}

const clearLocalStorage = () => {
  localStorage.clear()
}
const handleLogout = async () => {
  try {
    clearLocalStorage()

    Notify.create({ type: 'positive', message: 'Queuing number has been released' })
    await new Promise((resolve) => setTimeout(resolve, 500))

    router.replace('/')
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error during logout' })
    console.error(error)
  } finally {
    // await isLogin();
  }
}

async function printQr() {
  const queueNumber = queueData.value.queueNumber
  const qrCanvas = document.querySelector('.qr-wrapper canvas')

  if (!queueNumber || !qrCanvas) {
    console.error('Queue number or QR code not found')
    return
  }

  const qrImage = qrCanvas.toDataURL()

  // Get current date and time
  const now = new Date()
  const formattedDate = now.toLocaleDateString()
  const formattedTime = now.toLocaleTimeString()

  // Create a hidden iframe for printing
  const printFrame = document.createElement('iframe')
  printFrame.style.display = 'none'
  document.body.appendChild(printFrame)

  const printContent = `
    <html>
      <head>
        <title>Queue Ticket</title>
        <style>
          @page {
            margin: 0;
            size: 58mm auto;  /* Width: 58mm, Height: auto */
          }
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            width: 58mm;
            padding: 5px;
            margin: 0;
          }
          .queue-number {
            font-size: 18px;
            font-weight: bold;
            color: green;
            margin: 5px 0;
          }
          .certificate-text {
            font-size: 12px;
            margin: 5px 0;
          }
          .date-time {
            font-size: 11px;
            margin: 5px 0;
          }
          .qr-code {
            width: 120px;
            height: 120px;
            margin: 5px auto;
          }
          .scan-text {
            font-size: 10px;
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="queue-number">${queueNumber}</div>
        <div class="certificate-text">
          Release of Certificate<br>
          of Registration
        </div>
        <div class="date-time">
          Date: ${formattedDate}<br>
          Time: ${formattedTime}
        </div>
        <div class="qr-code">
          <img src="${qrImage}" alt="QR Code" style="width: 100%; height: 100%;">
        </div>
        <div class="scan-text">
          Scan the QR Code to monitor<br>the queue flow
        </div>
      </body>
    </html>
  `

  const frameDoc = printFrame.contentWindow.document
  frameDoc.open()
  frameDoc.write(printContent)
  frameDoc.close()

  // Wait for images to load before printing
  printFrame.onload = function () {
    printFrame.contentWindow.print()
    // Remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(printFrame)
    }, 1000)
  }
}

onMounted(() => {
  getQueue()
  const updateQrSize = () => {
    qrSize.value = window.innerWidth < 600 ? 120 : 150
  }

  updateQrSize()
  window.addEventListener('resize', updateQrSize)
})
</script>

<style lang="sass" scoped>
.content-width
  width: 90%
  max-width: 1200px
  margin: 0 auto

.container-queuing
  background-color: #fcfedf
  width: 100%
  min-height: 600px
  padding: 1rem
  display: flex
  align-items: center
  justify-content: center

.qrContainer
  border: 1px solid black
  background-color: #FFFFFF
  width: min(350px, 90%)
  min-height: 450px
  padding: 1rem
  display: flex
  flex-direction: column
  justify-content: space-between

.queue-title
  font-size: clamp(1.2rem, 3vw, 1.5rem)

.queue-number
  font-size: clamp(1.2rem, 3vw, 1.5rem)

.certificate-text
  font-size: clamp(1rem, 2.5vw, 1.25rem)

.scan-text
  font-size: clamp(0.875rem, 2vw, 1rem)

.qr-wrapper
  display: flex
  justify-content: center
  align-items: center
  width: 100%

.done-btn
  width: 120px
  background-color: #31562d
  color: #ffffff
  height: 50px
  border-radius: 5px
  @media (max-width: 600px)
    width: 100px
    height: 40px
.print-btn
  width: 120px
  background-color: #F2C037
  color: #ffffff
  height: 50px
  border-radius: 5px
  @media (max-width: 600px)
    width: 100px
    height: 40px

@media (max-width: 600px)
  .container-queuing
    padding: 0.5rem

  .qrContainer
    padding: 0.5rem
    min-height: 400px
</style>
