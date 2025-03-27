<template>
  <q-page style="height: 90vh">
    <div class="main-container q-pt-md">
      <div class="content-container">
        <q-card-section class="header-section">
          <div class="text-weight-medium text-center">Queue List</div>
        </q-card-section>

        <q-card-section class="q-mt-xl">
          <q-table
            :loading="loading"
            :rows="rows"
            :columns="columns"
            row-key="id"
            separator="cell"
            flat
            bordered
            :filter="filter"
          >
            <template v-slot:top>
              <div class="table-header">
                <q-card-section class="header-title">List of all Queues</q-card-section>
                <div class="search-box">
                  <q-input v-model="filter" dense borderless>
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td>{{ props.row.queueNumber }}</q-td>
                <q-td>{{ props.row.student }}</q-td>
                <q-td>{{ props.row.destination }}</q-td>
                <q-td>{{ props.row.status }}</q-td>
                <q-td>
                  <q-btn label="View Details" class="details-btn" @click="specificQueueDetails(props.row.id)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>

        <q-dialog v-model="queueDetailsDialog">
          <q-card class="dialog-card">
            <q-card-section v-if="queueSummary">
              <div class="dialog-header">Queue Details</div>
              <div class="dialog-content">
                <q-card-section class="student-details">
                  <div class="section-title">Student Details:</div>
                  <div class="details" v-for="(value, key) in studentDetails" :key="key">
                    <span class="label">{{ key }}:</span> {{ value }}
                  </div>
                </q-card-section>

                <q-card-section class="courses-section">
                  <div class="section-title">Courses to Take:</div>
                  <div class="course-item" v-for="course in queueSummary.courseToTake" :key="course.code">
                    <div>{{ course.name }} ({{ course.code }}) - {{ course.unit }} Units</div>
                  </div>
                </q-card-section>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const queueDetailsDialog = ref(false)
const loading = ref(false)
const filter = ref('')
const rows = ref([])
const queueSummary = ref(null)

const columns = [
  { name: 'queueNumber', field: 'queueNumber', label: 'Queue Number', align: 'left' },
  { name: 'student', field: 'student', label: 'Student', align: 'left' },
  { name: 'destination', field: 'destination', label: 'Destination', align: 'left', sortable: true },
  { name: 'status', field: 'status', label: 'Status', align: 'left', sortable: true },
  { name: 'action', field: 'action', label: 'Action', align: 'left' }
]

const studentDetails = computed(() => {
  if (!queueSummary.value) return {}
  return {
    'Queue Number': queueSummary.value.queueNumber,
    'Username': queueSummary.value.student.username,
    'Email': queueSummary.value.student.email,
    'First Name': queueSummary.value.student.firstName,
    'Middle Name': queueSummary.value.student.middleName,
    'Last Name': queueSummary.value.student.lastName,
    'Course': queueSummary.value.student.course,
    'Year': queueSummary.value.student.year,
    'Section': queueSummary.value.student.section,
    'Is Regular': queueSummary.value.student.isRegular,
    'Status': queueSummary.value.status,
    'Destination': queueSummary.value.destination
  }
})

async function specificQueueDetails(queueId) {
  queueDetailsDialog.value = true
  try {
    const response = await axios.get(`${process.env.api_host}/queues?query=${queueId}`)
    queueSummary.value = response.data[0]
  } catch (err) {
    console.error(err)
  }
}

async function getQueueList() {
  loading.value = true
  try {
    const response = await axios.get(`${process.env.api_host}/queues`, {
      headers: { 'Content-Type': 'application/json' }
    })
    rows.value = response.data.map(queue => ({
      id: queue._id,
      queueNumber: queue.queueNumber,
      student: formatStudentName(queue.student),
      destination: queue.destination,
      status: queue.status
    }))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function formatStudentName(student) {
  if (!student) return ''
  return `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim()
}

onMounted(getQueueList)
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100%

.header-section
  background-color: #2e592d
  color: white
  font-size: 2em
  text-align: center
  padding: 16px

.table-header
  display: flex
  width: 100%
  background-color: #2e592d
  color: white
  align-items: center
  padding: 8px

.header-title
  flex: 1
  font-weight: bold

.search-box
  border: 1px solid white
  padding: 4px

.details-btn
  background-color: #ffd95b

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
</style>
