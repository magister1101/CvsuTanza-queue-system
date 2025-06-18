<template>
  <q-page style="height: 90vh">
    <div class="main-container q-pt-md">
      <div class="content-container q-px-md q-px-sm-xl">
        <q-card-section class="row justify-around q-col-gutter-md" style="color: #3d3c3b">
          <q-card
            class="info-box q-py-md ellipsis"
            style="
              background-color: #fefffe;
              border: 2px solid #cbcdc7;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="text-h5 text-weight-medium">DEPARTMENT</div>
            <div v-if="queueInfo" class="text-h5 text-weight-bold text-uppercase">
              {{ queueInfo.role }}
            </div>
            <div style="height: 50px"></div>
          </q-card>
          <q-card
            class="info-box q-py-md ellipsis"
            style="
              background-color: #fefffe;
              border: 2px solid #cbcdc7;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="text-h5 text-weight-medium">WINDOW</div>
            <div v-if="queueInfo" class="text-h5 text-weight-bold">{{ queueInfo.window }}</div>
            <div align="right" class="q-mr-md">
              <q-btn
                label="set"
                style="background-color: #fffeb8"
                @click="inputWindowDialog = true"
              />
            </div>
          </q-card>
          <!-- input dialog -->
          <q-dialog v-model="inputWindowDialog" persistent>
            <q-card style="width: 500px">
              <q-form @submit.prevent="setWindow">
                <q-card-section style="background-color: #132a13; color: #ffffff">
                  <div class="text-h6">Set new Window</div>
                </q-card-section>
                <q-card-section>
                  <div>
                    <q-input v-model="inputWindow" type="number" outlined />
                  </div>
                </q-card-section>
                <q-card-section align="right">
                  <q-btn label="Cancel" v-close-popup flat style="color: red" />
                  <q-btn
                    label="Submit"
                    type="submit"
                    flat
                    style="color: green"
                    :loading="loadingWindow"
                  />
                </q-card-section>
              </q-form>
            </q-card>
          </q-dialog>
          <q-card
            class="info-box q-py-md ellipsis"
            style="
              background-color: #fefffe;
              border: 2px solid #cbcdc7;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="text-h5 text-weight-medium">CURRENT QUEUE</div>
            <div v-if="currentQueue" class="text-h5 text-weight-bold">
              {{ currentQueue.queueNumber }}
            </div>
            <div class="q-mr-md">
              <q-btn
                label="CALL"
                style="background-color: #b7faff; margin-left: 8px"
                @click="speakCurrentQueue"
                icon="record_voice_over"
              />
              <q-btn
                label="STOP"
                style="background-color: #fe7e7f; margin-left: 8px"
                @click="stopSpeech"
                icon="stop"
              />
              <q-btn
                label="LIST"
                style="background-color: #fffeb8; margin-left: 8px"
                @click="queueListPage"
              />

              <q-btn
                label="RESET"
                style="background-color: #fe7e7f; margin-left: 8px"
                @click="resetDialog = true"
              />
            </div>
          </q-card>
        </q-card-section>
        <!-- buttons -->
        <q-card-section class="row justify-around q-col-gutter-md">
          <div
            class="action-button-container ellipsis"
            style="display: flex; flex-direction: column; align-items: center; gap: 12px"
          >
            <q-btn
              @click="queueDetailsDialog = true"
              class="action-button"
              style="background-color: #aafeab"
            >
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="wysiwyg" size="80px" />
                <div class="text-h4 text-weight-medium">VIEW</div>
              </div>
            </q-btn>

            <div style="display: flex; justify-content: center; gap: 8px">
              <q-btn label="Clock in" style="background-color: #aafeab" @click="clockIn()" />
              <q-btn label="View" style="background-color: #aafeab" @click="showDialog = true" />
              <q-btn label="Clock out" style="background-color: #aafeab" @click="clockOut()" />
            </div>
          </div>
          <div
            class="action-button-container ellipsis"
            style="display: flex; flex-direction: column; align-items: center; gap: 12px"
          >
            <q-btn
              @click="transferredQueue(currentQueue._id)"
              :loading="loading"
              class="action-button"
              style="background-color: #aafeab; width: 200px"
            >
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="sync_alt" size="80px" />
                <div class="text-h4 text-weight-medium">TRANSFER</div>
              </div>
            </q-btn>

            <div style="display: flex; justify-content: center; gap: 8px">
              <q-btn
                label="Registrar"
                style="background-color: #aafeab"
                @click="updateQueue(currentQueue._id, 'registrar')"
              />
              <q-btn
                label="Admission"
                style="background-color: #aafeab"
                @click="updateQueue(currentQueue._id, 'admission')"
              />
              <q-btn
                label="Cashier"
                style="background-color: #aafeab"
                @click="updateQueue(currentQueue._id, 'cashier')"
              />
            </div>
          </div>

          <div class="action-button-container ellipsis">
            <q-btn
              @click="doneQueue(currentQueue._id)"
              :loading="loading"
              class="action-button"
              style="background-color: #aafeab"
            >
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="check" size="80px" />
                <div class="text-h4 text-weight-medium">DONE</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn
              @click="cancelQueue(currentQueue._id)"
              :loading="loading"
              class="action-button"
              style="background-color: #aafeab"
            >
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="close" size="80px" />
                <div class="text-h4 text-weight-medium">CANCEL</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn
              :loading="loading"
              @click="refreshQueue"
              class="action-button"
              style="background-color: #aafeab"
            >
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="refresh" size="80px" />
                <div class="text-h4 text-weight-medium">REFRESH</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn
              :loading="loading"
              @click="resetUserQueue"
              class="action-button"
              style="background-color: #aafeab"
            >
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="restart_alt" size="80px" />
                <div class="text-h4 text-weight-medium">RESET</div>
              </div>
            </q-btn>
          </div>
        </q-card-section>
        <q-card-section
          class="row justify-around q-py-md q-mt-md"
          style="background-color: #fafedd; border: 2px solid #cbcdc7; height: auto"
        >
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              # WAITING IN QUEUE
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                width: 100%;
                text-align: center;
                align-content: center;
              "
              class="text-h3 q-py-md text-weight-bold"
            >
              <div>{{ waitingQueue }}</div>
            </div>
          </div>
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              # TRANSFERRED QUEUE
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                width: 100%;
                text-align: center;
                align-content: center;
              "
              class="text-h3 q-py-md text-weight-bold"
            >
              <div v-if="queueInfo">{{ queueInfo.transferredQueue }}</div>
            </div>
          </div>
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              # SUCCESSFUL QUEUE
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                width: 100%;
                text-align: center;
                align-content: center;
              "
              class="text-h3 q-py-md text-weight-bold"
            >
              <div v-if="queueInfo">{{ queueInfo.successfulQueue }}</div>
            </div>
          </div>
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              # MISSED QUEUE
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                width: 100%;
                text-align: center;
                align-content: center;
              "
              class="text-h3 q-py-md text-weight-bold"
            >
              <div v-if="queueInfo">{{ queueInfo.missedQueue }}</div>
            </div>
          </div>
        </q-card-section>

        <q-dialog v-model="queueDetailsDialog">
          <q-card class="dialog-card">
            <q-card-section v-if="currentQueue">
              <div class="dialog-header">Queue Details</div>
              <div class="dialog-content">
                <q-card-section class="student-details">
                  <div class="section-title">Student Details:</div>
                  <div class="text-subtitle1">Username: {{ currentQueue.student.username }}</div>
                  <div class="text-subtitle1">Student Number: {{ currentQueue.studentNumber }}</div>
                  <div class="text-subtitle1">First Name: {{ currentQueue.student.firstName }}</div>
                  <div class="text-subtitle1">
                    Middle Name: {{ currentQueue.student.middleName }}
                  </div>
                  <div class="text-subtitle1">Last Name: {{ currentQueue.student.lastName }}</div>
                  <div class="text-subtitle1">Email: {{ currentQueue.student.email }}</div>
                  <div class="text-subtitle1">Regular: {{ currentQueue.student.isRegular }}</div>
                  <div class="text-subtitle1">Year: {{ currentQueue.student.year }}</div>
                  <div class="text-subtitle1">Section: {{ currentQueue.student.section }}</div>
                </q-card-section>
                <q-card-section
                  class="courses-section"
                  v-for="course in currentQueue.courseToTake"
                  :key="course"
                >
                  <div class="section-title">Courses to Take:</div>
                  <div class="course-item">
                    <div>{{ course.course }} ({{ course.code }}) - {{ course.unit }} Units</div>
                  </div>
                </q-card-section>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 850px; max-height: 80vh">
        <q-card-section class="text-h6"> Transaction History </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none scroll" style="max-height: 60vh">
          <q-table
            flat
            dense
            :rows="transactions"
            :columns="columns"
            row-key="_id"
            :pagination="{ rowsPerPage: 10 }"
          >
            <!-- Clock In -->
            <template v-slot:body-cell-clockIn="props">
              <q-td :props="props">
                {{ formatDateTime(props.row.clockIn) }}
              </q-td>
            </template>

            <!-- Clock Out -->
            <template v-slot:body-cell-clockOut="props">
              <q-td :props="props">
                {{ props.row.clockOut ? formatDateTime(props.row.clockOut) : '---' }}
              </q-td>
            </template>

            <!-- Duration -->
            <template v-slot:body-cell-duration="props">
              <q-td :props="props">
                {{ formatDuration(props.row.clockIn, props.row.clockOut) }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="resetDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-medium">
            ARE YOU SURE YOU WANT TO RESET THE ENTIRE QUEUE?
          </div>
        </q-card-section>
        <q-separator class="q-my-sm" />

        <q-card-actions align="right">
          <q-btn label="Back" flat color="primary" @click="cashierDialog = false" />
          <q-btn
            label="RESET"
            color="primary"
            unelevated
            @click="resetQueues"
            :loading="resetQueuesLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const ws = ref(null)
const queues = ref([])
const loading = ref(false)
const loadingWindow = ref(false)
const resetQueuesLoading = ref(false)

const inputWindow = ref('')
const inputWindowDialog = ref(false)
const clockInLoading = ref(false)
const clockOutLoading = ref(false)
const queueInfo = ref(null)
const waitingQueue = ref(null)
const currentQueue = ref(null)
const showDialog = ref(false)
const transactions = ref([])
const router = useRouter()
const userId = ref(null)
const queueDetailsDialog = ref(false)

const resetDialog = ref(false)

const synth = window.speechSynthesis
const columns = [
  {
    name: 'user',
    label: 'User',
    field: (row) => `${row.userId.lastName}`,
    sortable: true,
    align: 'left',
  },
  {
    name: 'role',
    label: 'Role',
    field: (row) => row.userId.role,
    sortable: true,
    align: 'left',
  },
  {
    name: 'clockIn',
    label: 'Clock In',
    field: 'clockIn',
    sortable: true,
    align: 'left',
  },
  {
    name: 'clockOut',
    label: 'Clock Out',
    field: 'clockOut',
    sortable: true,
    align: 'left',
  },
  {
    name: 'duration',
    label: 'Duration',
    field: () => '', // handled by slot
    sortable: false,
    align: 'left',
  },
]

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString()
}
const formatDuration = (clockIn, clockOut) => {
  if (!clockIn || !clockOut) return '---'
  const ms = new Date(clockOut) - new Date(clockIn)
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

const fetchTransactions = async () => {
  try {
    const res = await axios.get(
      `${process.env.api_host}/users/getTransactionLogs?userId=${userId.value}`,
    ) // Adjust this to your route
    transactions.value = res.data
  } catch (err) {
    console.error('Failed to fetch transactions:', err)
  }
}

async function queueListPage() {
  router.push('/new/queueList')
}

async function log(action) {
  console.log(userId.value, action)
}

async function clockIn() {
  clockInLoading.value = true
  try {
    console.log(userId.value, 'clock in')
    const response = await axios.post(`${process.env.api_host}/users/clockIn`, {
      userId: userId.value,
    })

    Notify.create({
      type: 'positive',
      message: 'Clocked in successfully',
    })
    fetchTransactions()
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    clockInLoading.value = false
  }
}

async function clockOut() {
  clockOutLoading.value = true
  try {
    console.log(userId.value, 'clock out')
    const response = await axios.post(`${process.env.api_host}/users/clockOut`, {
      userId: userId.value,
    })
    Notify.create({
      type: 'positive',
      message: 'Clocked out successfully',
    })
    fetchTransactions()
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    clockOutLoading.value = false
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
    userId.value = response.data._id
    queueInfo.value = response.data
    getCurrentQueue(response.data.role)
  } catch (err) {
    console.error(err)
  }
}

async function getCurrentQueue(role) {
  if (!role) return

  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${process.env.api_host}/queues/current/${role}`, {
      headers: {
        Authorization: token,
      },
    })
    currentQueue.value = response.data.currentQueue[0]
    waitingQueue.value = response.data.currentQueue.length
  } catch (err) {
    console.error(err)
  }
}

async function transferredQueue(queueId) {
  loading.value = true
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.put(`${process.env.api_host}/queues/next/${queueId}`, null, {
      headers: {
        Authorization: token,
      },
    })
    getCurrentQueue(queueInfo.value.role)
    userInfo()
    Notify.create({
      type: 'positive',
      message: 'Queue has been transferred successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    loading.value = false
  }
}

async function updateQueue(queueId, destination) {
  loading.value = true
  const token = localStorage.getItem('authToken')
  console.log(destination)
  try {
    const response = await axios.post(
      `${process.env.api_host}/queues/updateQueue/${queueId}`,
      {
        destination: destination,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )
    getCurrentQueue(queueInfo.value.role)
    userInfo()
    Notify.create({
      type: 'positive',
      message: 'Queue has been transferred successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    loading.value = false
    refreshQueue()
  }
}

async function doneQueue(queueId) {
  loading.value = true
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.post(`${process.env.api_host}/queues/done/${queueId}`, null, {
      headers: {
        Authorization: token,
      },
    })
    getCurrentQueue(queueInfo.value.role)
    userInfo()
    Notify.create({
      type: 'positive',
      message: 'Queue has been marked as done successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    loading.value = false
    refreshQueue()
  }
}

async function resetUserQueue() {
  loading.value = true
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${process.env.api_host}/users/resetQueue`, {
      headers: {
        Authorization: token,
      },
    })
    getCurrentQueue(queueInfo.value.role)
    userInfo()
    Notify.create({
      type: 'positive',
      message: 'Reset queue successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    loading.value = false
    refreshQueue()
  }
}

async function resetQueues() {
  resetQueuesLoading.value = true
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${process.env.api_host}/queues/resetQueues`, {
      headers: {
        Authorization: token,
      },
    })
    refreshQueue()
    Notify.create({
      type: 'positive',
      message: 'Reset queue successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    resetQueuesLoading.value = false
    resetDialog.value = false
  }
}

async function refreshQueue() {
  loading.value = true
  try {
    getCurrentQueue(queueInfo.value.role)
    userInfo()
    Notify.create({
      type: 'positive',
      message: 'Refreshed successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    loading.value = false
  }
}

async function cancelQueue(queueId) {
  loading.value = true
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.post(`${process.env.api_host}/queues/cancel/${queueId}`, null, {
      headers: {
        Authorization: token,
      },
    })
    getCurrentQueue(currentQueue.value.role)
    userInfo()
    Notify.create({
      type: 'posotive',
      message: 'Queue has been cancelled successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    loading.value = false
    refreshQueue()
  }
}

async function setWindow() {
  loadingWindow.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/update/${userId.value}`,
      {
        window: inputWindow.value,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    )
    userInfo()
    Notify.create({
      type: 'positive',
      message: 'Window has been set successfully',
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something went wrong',
    })
  } finally {
    loadingWindow.value = false
    inputWindowDialog.value = false
  }
}

const speakCurrentQueue = () => {
  if (synth.speaking) {
    console.warn('Speech already in progress...')
    return
  }
  if (currentQueue.value && currentQueue.value.queueNumber) {
    const textToSpeak = `${queueInfo.value.role} Window, ${queueInfo.value.window}. Now serving number ${currentQueue.value.queueNumber}`
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.8
    synth.speak(utterance)
  }
}

const stopSpeech = () => {
  if (synth.speaking) {
    synth.cancel()
  }
}

onMounted(async () => {
  await userInfo()
  await fetchTransactions()

  const interval = setInterval(() => {
    if (queueInfo.value?.role) {
      getCurrentQueue(queueInfo.value.role)
    }
  }, 5000)

  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100%

.info-box
  width: 400px
  height: 150px
  border-radius: 14px
.action-button
  height: 150px
  width: 200px

.list-container
  width: 300px


.dialog-card
  width: 70vw
  max-width: 800px

.dialog-header
  background-color: #2e592d
  color: white
  text-align: center
  font-size: 1.5em
  padding: 16px

.dialog-content
  display: flex
  gap: 16px

.student-details, .courses-section
  flex: 1
  padding: 16px
  border-right: 1px solid black

.section-title
  font-size: 1.2em
  font-weight: bold
  margin-bottom: 8px

.details, .course-item
  margin-bottom: 8px
@media (max-width: 1440px)
  .info-box
    width: 300px
    height: 130px
  .action-button
    width: 180px
    height: 130px
  .list-container
    width: 250px

@media (max-width: 1024px)
  .info-box
    width: 250px
    height: 120px
  .action-button
    width: 150px
    height: 120px
  .list-container
    width: 200px

@media (max-width: 768px)
  .info-box
    width: 200px
    height: 100px
  .action-button
    width: 130px
    height: 100px
    .q-icon
      font-size: 50px !important
    .text-h4
      font-size: 1.2rem
  .list-container
    width: 180px

@media (max-width: 599px)
  .info-box
    width: 100%
    height: 100px
    margin-bottom: 8px
  .action-button
    width: 100%
    height: 100px
    margin-bottom: 8px
  .list-container
    width: 100%
    margin-bottom: 16px
  .q-card-section
    padding: 8px !important
</style>
