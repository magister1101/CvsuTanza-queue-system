<template>
  <q-page class="q-pa-md">
    <q-card-section>
      <q-btn flat @click="redirect('/regOrIrreg')">
        <q-icon name="arrow_back_ios" />
      </q-btn>
    </q-card-section>
    <q-card>
      <q-card-section>
        <div class="text-h6">Course List</div>
      </q-card-section>

      <q-table
        title="Courses"
        :rows="rows"
        :columns="columns"
        row-key="_id"
        selection="multiple"
        v-model:selected="selected"
        :pagination="pagination"
        flat
        bordered
        :loading="tableLoading"
      >
        <template v-slot:top-right>
          <q-btn
            label="Enroll"
            color="primary"
            @click="enroll"
            :disable="selected.length === 0"
            :loading="enrollLoading"
          />
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const rows = ref([])
const selected = ref([])

const userData = ref({})
const enrollLoading = ref(false)

const tableLoading = ref(true)

function redirect(path) {
  router.push(path)
}

const columns = [
  { name: 'name', label: 'Course Title', field: 'name', sortable: true },
  { name: 'code', label: 'Code', field: 'code', sortable: true },
  { name: 'unit', label: 'Units', field: 'unit', sortable: true },
  { name: 'course', label: 'Program', field: 'course', sortable: true },
  { name: 'year', label: 'Year', field: 'year', sortable: true },
  { name: 'semester', label: 'Semester', field: 'semester', sortable: true },
]

const pagination = ref({
  rowsPerPage: 10,
})

async function getUser() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await Axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })

    userData.value = response.data
  } catch (err) {
    console.error('Error fetching user:', err)
  }
}

async function fetchCourses() {
  try {
    const res = await Axios.get(`${process.env.api_host}/courses?program=${userData.value.course}`) // Adjust API endpoint
    rows.value = res.data
  } catch (err) {
    console.error('Error fetching courses:', err)
  } finally {
    tableLoading.value = false
  }
}

async function enroll() {
  try {
    const ids = selected.value.map((item) => item._id)

    enrollLoading.value = true
    const response = await Axios.post(
      `${process.env.api_host}/users/update/${userData.value._id}`,
      {
        courseToTake: selected.value,
        isEnrolled: true,
        isApproved: false,
      },
    )

    redirect('/thankYou')
  } catch (error) {
    console.error('Error enrolling:', error)
  } finally {
    enrollLoading.value = false
  }
}

onMounted(async () => {
  await getUser()
  await fetchCourses()
})
</script>
