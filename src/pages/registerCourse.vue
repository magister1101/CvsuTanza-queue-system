<template>
  <q-page>
    <div>
      <div
        style="
          background: url('https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617278/assets/queing/q5xrh22iplhm2bndvvru.jpg')
            no-repeat center center;
          background-size: cover;
          width: 100%;
          height: 100vh;
          border: 3px solid #606060;
        "
      >
        <!-- Main Content -->

        <q-card-section class="flex flex-center">
          <div style="width: 80%">
            <q-card-section class="text-center" style="margin-top: 40px">
              <div class="text-h4 text-weight-bold text-uppercase">Course Taken</div>
            </q-card-section>
            <q-card-section class="container-courseInfo">
              <q-form @submit.prevent="updateCourses">
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
                      <q-td>{{ formatPrerequisites(props.row.prerequisite) }}</q-td>
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
                      size="24px"
                      style="
                        width: 100px;
                        height: 100px;
                        color: #ffffff;
                        background-color: #31562d;
                        border-radius: 50%;
                      "
                    />
                  </div>
                </div>
              </q-form>
              <q-card-section>
                <div>Take Note, Only Select the Courses that you have taken.</div>
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
// input
const userId = route.params.userId

const selected = ref([])
const selectAll = ref(false)
const selectedCourseIds = ref([])

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
    name: 'prerequisite',
    label: 'Prerequisite',
    align: 'left',
    field: 'prerequisite',
  },
])

async function getStudent() {
  tableLoading.value = true
  try {
    const response = await axios.get(`${process.env.api_host}/users?query=${userId}`)
    const user = response.data[0]
    const course = user.course
    console.log(course)
    getCourses(course)
  } catch (err) {
    console.error(err)
  } finally {
    tableLoading.value = false
  }
}

async function getCourses(course) {
  tableLoading.value = true
  try {
    const token = localStorage.getItem('Authtoken')

    // const userResponse = await axios.get(`${process.env.api_host}/users/myProfile`, {
    //   headers: {
    //     Authorization: token,
    //   },
    // })
    // const user = userResponse.data

    const response = await axios.get(
      `${process.env.api_host}/courses?isArchived=false&program=${course}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.data && Array.isArray(response.data)) {
      rows.value = response.data
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
      message: 'Failed to fetch students data',
    })
  } finally {
    tableLoading.value = false
  }
}

async function updateCourses() {
  try {
    const token = localStorage.getItem('Authtoken')
    const response = await axios.post(
      `${process.env.api_host}/users/update/${userId}`,
      {
        courses: selectedCourseIds.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    Notify.create({
      type: 'positive',
      message: 'Courses updated successfully',
    })
    router.replace(`/thankYou`)
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to update courses',
    })
  }
}

const onSelectAllClick = (val) => {
  selected.value = val ? [...rows.value] : []
}

watch(selected, (newVal) => {
  selectedCourseIds.value = newVal.map((course) => course._id)
  selectAll.value = newVal.length === rows.value.length
})

const formatPrerequisites = (prerequisites) => {
  if (!prerequisites) return 'None'
  if (Array.isArray(prerequisites)) {
    return prerequisites.map((pre) => pre.code).join(', ')
  }
  return prerequisites.code || 'None'
}

onMounted(() => {
  getStudent()
})
</script>

<style lang="sass" scoped>
.container-courseInfo
  background-color: #fcfedf
  width: 100%
  height: auto
.courseTable
  background-color: #fcfedf
  box-shadow: none
  height: 450px
  text-align: left
</style>
