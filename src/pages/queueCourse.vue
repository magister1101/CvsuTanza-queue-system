<template>
  <q-page>
    <div class="full-height">
      <div
        class="bg-container"
        style="
          background: url('https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617278/assets/queing/q5xrh22iplhm2bndvvru.jpg')
            no-repeat center center;
          background-size: cover;
          border: 3px solid #606060;
        "
      >
        <q-card-section class="flex flex-center q-pa-md">
          <div class="content-wrapper">
            <q-card-section class="text-center q-pt-lg">
              <div class="text-h4 text-weight-bold text-uppercase">Course to Take</div>
            </q-card-section>
            <q-card-section class="container-courseInfo">
              <q-form @submit.prevent="checkCourse">
                <!-- table -->
                <q-table
                  class="courseTable"
                  :rows="rows"
                  :loading="tableLoading"
                  :columns="columns"
                  :filter="filter"
                  separator="cell"
                  row-key="_id"
                  selection="multiple"
                  v-model:selected="selected"
                >
                  <template #header="props">
                    <q-tr :props="props">
                      <q-th auto-width>
                        <q-checkbox v-model="selectAll" @update:model-value="onSelectAllClick" />
                      </q-th>
                      <q-th v-for="col in props.cols" :key="col.name">
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:top-left>
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                  <template #body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-checkbox v-model="props.selected" />
                      </q-td>
                      <q-td>{{ props.row.code }}</q-td>
                      <q-td>{{ props.row.name }}</q-td>
                      <q-td>{{ props.row.unit }}</q-td>
                      <q-td>{{ props.row.course }}</q-td>
                      <q-td>{{ props.row.prerequisites }}</q-td>
                      <q-td>
                        <q-tooltip v-if="props.row.description.length > 50">
                          {{ props.row.description }}
                        </q-tooltip>
                        {{
                          props.row.description.length > 50
                            ? props.row.description.substring(0, 50) + '...'
                            : props.row.description
                        }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <div style="display: flex; width: 100%" class="q-mt-md">
                  <q-space />
                  <div class="q-ml-md">
                    <!-- change @click to submit later -->
                    <q-btn
                      :loading="loading"
                      type="submit"
                      icon="arrow_forward"
                      size="19px"
                      style="
                        width: 70px;
                        height: 70px;
                        color: #ffffff;
                        background-color: #31562d;
                        border-radius: 50%;
                      "
                    />
                  </div>
                </div>
              </q-form>
              <q-card-section>
                <div>Take Note, Select Course To Take.</div>
              </q-card-section>
              <q-card-section
                style="border: 3px solid #606060; background-color: #ffffff"
                v-if="prerequisitesMessage"
              >
                <div>
                  <q-table
                    style="box-shadow: none"
                    :rows="prerequisitesRow"
                    :columns="prerequisitesColumn"
                    row-key="id"
                    :rows-per-page-options="[0]"
                    separator="cell"
                  >
                    <template #body="props">
                      <q-tr :props="props">
                        <q-td>{{ props.row.course }}</q-td>
                        <q-td>{{ props.row.prerequisites }}</q-td>
                      </q-tr>
                    </template>
                  </q-table>
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
/* eslint-disable no-unused-vars */
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'
// router
const route = useRoute()
const router = useRouter()
const tableLoading = ref(false)
const studentId = route.params.studentId
// input
const userId = route.params.userId
const loading = ref(false)
const selected = ref([])
const selectAll = ref(false)
const selectedCourseIds = ref([])

const prerequisitesMessage = ref(null)
const filter = ref('')
const rows = ref([])
const columns = ref([
  {
    name: 'code',
    label: 'Course Code',
    align: 'left',
    field: 'code',
  },
  {
    name: 'name',
    label: 'Course Name',
    align: 'left',
    field: 'name',
  },
  {
    name: 'unit',
    label: 'Units',
    align: 'left',
    field: 'unit',
  },
  {
    name: 'course',
    label: 'Program',
    align: 'left',
    field: 'course',
  },
  {
    name: 'prerequisites',
    label: 'Prerequisites',
    align: 'left',
    field: 'prerequisites',
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: (row) =>
      row.description.length > 50 ? row.description.substring(0, 50) + '...' : row.description,
  },
])

const prerequisitesRow = ref([])
const prerequisitesColumn = ref([
  {
    name: 'course',
    label: 'Selected Course',
    align: 'left',
    field: 'course',
  },
  {
    name: 'prerequisites',
    label: 'Missing Prerequisites',
    align: 'left',
    field: 'prerequisites',
  },
])

async function sendEmail() {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/sendEmail/${studentId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Email sent successfully',
      })
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to send email',
    })
  } finally {
    loading.value = false
  }
}

async function getCourses() {
  tableLoading.value = true
  try {
    const studentProfile = await axios.get(`${process.env.api_host}/users?query=${studentId}`)
    console.log(studentProfile.data[0].course)
    const token = localStorage.getItem('Authtoken')
    const response = await axios.get(
      `${process.env.api_host}/courses?isArchived=false&program=${studentProfile.data[0].course}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )

    if (response.data && Array.isArray(response.data)) {
      rows.value = response.data.map((course) => ({
        ...course,
        prerequisites:
          course.prerequisite && course.prerequisite.length > 0
            ? course.prerequisite.map((prereq) => prereq.code).join(', ')
            : 'None',
      }))
    } else {
      console.error('Invalid response format:', response)
      rows.value = []
      Notify.create({
        type: 'negative',
        message: 'Invalid data format received from server',
      })
    }
  } catch (err) {
    console.error(err)
    rows.value = []
    Notify.create({
      type: 'negative',
      message: 'Failed to fetch courses data',
    })
  } finally {
    tableLoading.value = false
  }
}

async function checkCourse() {
  loading.value = true
  try {
    if (selectedCourseIds.value.length <= 0) {
      Notify.create({
        type: 'warning',
        message: 'Please select at least one course to take',
      })
      return
    }
    const token = localStorage.getItem('authToken') //UPDATE: replace this with id and bypass auth check

    const response = await axios.post(
      `${process.env.api_host}/queues/checkPrerequisites`,
      {
        studentId: studentId,
        selectedCourses: selectedCourseIds.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    )
    if (response.data.missing) {
      prerequisitesRow.value = Object.entries(response.data.missingPrerequisites).map(
        ([course, prerequisites]) => ({
          id: course,
          course: course,
          prerequisites: prerequisites.map((prereq) => prereq.name).join(', '),
        }),
      )
      Notify.create({
        type: 'negative',
        message: response.data.message,
      })
    } else {
      prerequisitesRow.value = []
      Notify.create({
        type: 'positive',
        message: response.data.message,
      })

      const createQueueResponse = await axios.post(
        `${process.env.api_host}/queues/createQueue`,
        {
          selectedCourses: selectedCourseIds.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      )
      sendEmail()
      router.replace(`/new/addStudent/`)
    }
    prerequisitesMessage.value = response.data
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to update courses',
    })
  } finally {
    loading.value = false
  }
}

const onSelectAllClick = (val) => {
  selected.value = val ? [...rows.value] : []
}

watch(selected, (newVal) => {
  selectedCourseIds.value = newVal.map((course) => course._id)
  selectAll.value = newVal.length === rows.value.length
})

onMounted(() => {
  getCourses()
})
</script>

<style lang="sass" scoped>
.bg-container
  min-height: 100vh
  width: 100%
  overflow-y: auto
  padding: 1rem

.content-wrapper
  width: 95%
  max-width: 1200px
  margin: 0 auto

.container-courseInfo
  background-color: #fcfedf
  width: 100%
  height: auto
  padding: 1rem
  overflow-x: auto

.courseTable
  background-color: #fcfedf
  box-shadow: none
  min-height: 350px
  max-height: 60vh
  text-align: left

@media (max-width: 600px)
  .content-wrapper
    width: 100%

  .container-courseInfo
    padding: 0.5rem

  .text-h4
    font-size: 1.5rem !important
</style>
