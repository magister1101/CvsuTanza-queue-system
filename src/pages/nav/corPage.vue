<template>
  <q-page class="q-pa-md">
    <!-- Back Button -->
    <!-- <q-btn flat @click="redirect('/')" icon="arrow_back_ios" /> -->

    <!-- Search Student -->
    <q-card class="q-mt-md q-pa-md">
      <q-card-section>
        <div class="text-h6">Search Student</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="searchId"
          label="Enter Student ID"
          filled
          clearable
          debounce="300"
          @keyup.enter="getStudent"
        >
          <template v-slot:append>
            <q-btn flat icon="search" @click="getStudent" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <!-- COR Content -->
    <div
      v-if="student && student.studentNumber"
      id="cor-content"
      class="q-mt-md q-pa-lg bg-white text-black"
    >
      <!-- Header -->
      <div class="text-center">
        <div class="text-h6">CAVITE STATE UNIVERSITY</div>
        <div>Tanza Campus</div>
        <div class="text-subtitle2 q-mt-sm">Certificate of Registration</div>
      </div>

      <!-- Student Info -->
      <div class="q-mt-lg row q-col-gutter-md">
        <div class="col-6">
          <div><b>Student No:</b> {{ student.studentNumber }}</div>
          <div><b>Name:</b> {{ fullName }}</div>
          <div><b>Course:</b> {{ student.course }}</div>
          <div><b>Year & Section:</b> {{ student.year }} - {{ student.section }}</div>
        </div>
        <div class="col-6">
          <div><b>Email:</b> {{ student.email }}</div>
          <div><b>Semester:</b> {{ semester }} Semester 2025-2026</div>
          <div><b>Status:</b> Regular</div>
        </div>
      </div>

      <!-- Enrolled Subjects -->
      <div class="q-mt-lg">
        <div class="text-h6">Current Enrolled Subjects</div>
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th class="text-left">Code</th>
              <th class="text-left">Subject Title</th>
              <th class="text-center">Units</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in student.courseToTake" :key="c._id">
              <td>{{ c.code }}</td>
              <td>{{ c.name }}</td>
              <td class="text-center">{{ c.unit ?? 3 }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <!-- Completed/Recorded Courses -->
      <div class="q-mt-lg">
        <div class="text-h6">Course History</div>
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th class="text-left">Code</th>
              <th class="text-left">Subject Title</th>
              <th class="text-center">Units</th>
              <th class="text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in student.courses" :key="c._id">
              <td>{{ c.courseId.code }}</td>
              <td>{{ c.courseId.name }}</td>
              <td class="text-center">3</td>
              <td class="text-center">{{ c.grade ?? '-' }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <!-- Certification -->
      <div class="q-mt-xl text-right">
        <div>Certified Correct:</div>
        <div class="q-mt-lg"><b>Registrar</b></div>
      </div>
    </div>

    <!-- Export Button -->
    <div v-if="student && student.studentNumber" class="q-mt-md text-center">
      <q-btn color="primary" label="Export COR as PDF" @click="exportPDF" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Axios from 'axios'
import { useRouter } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const router = useRouter()

const semester = ref('')

const searchId = ref('')
const student = ref({
  studentNumber: '',
  firstName: '',
  middleName: '',
  lastName: '',
  course: '',
  year: '',
  section: '',
  email: '',
  courses: [],
  courseToTake: [],
})

const fullName = computed(() => {
  if (!student.value) return ''
  return `${student.value.firstName} ${student.value.middleName} ${student.value.lastName}`
})

function redirect(path) {
  router.push(path)
}

// Fetch student by ID input
async function getStudent() {
  if (!searchId.value) {
    alert('Please enter a Student ID')
    return
  }
  try {
    const res = await Axios.get(`${process.env.api_host}/users?query=${searchId.value}`)
    console.log('Student API response:', res.data)

    // If API returns an array, grab the first item
    student.value = Array.isArray(res.data) ? res.data[0] : res.data
  } catch (err) {
    console.error('Error fetching student:', err)
    alert('Student not found')
  }
}

// Export COR as PDF
async function exportPDF() {
  const corContent = document.getElementById('cor-content')
  if (!corContent) return

  const canvas = await html2canvas(corContent, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Get image dimensions
  const imgProps = pdf.getImageProperties(imgData)
  const imgWidth = imgProps.width
  const imgHeight = imgProps.height

  // Calculate aspect ratio fit
  const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
  const pdfWidth = imgWidth * ratio
  const pdfHeight = imgHeight * ratio

  // Center the image on the page
  const x = (pageWidth - pdfWidth) / 2
  const y = (pageHeight - pdfHeight) / 2

  pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight)
  pdf.save(`${student.value.studentNumber}_COR.pdf`)
}

async function getSemester() {
  try {
    const sem = await Axios.get(`${process.env.api_host}/courses/getSemester`)
    semester.value = sem.data[0].semester
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  getSemester()
})
</script>

<style scoped>
#cor-content {
  font-family: 'Times New Roman', serif;
  border: 1px solid #000;
  padding: 20px;
}
@media print {
  .q-btn {
    display: none;
  }
}
</style>
