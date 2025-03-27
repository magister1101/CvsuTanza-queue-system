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
              <div class="text-h4 text-weight-bold text-uppercase">Course Information</div>
            </q-card-section>
            <q-card-section class="container-courseInfo">
              <q-form>
                <q-card-section>
                  <div>
                    <q-card-section style="width: 100%">
                      <div style="width: 100%">
                        <q-input label="Program:" type="text" outlined v-model="program" />
                      </div>
                    </q-card-section>
                    <div style="display: flex">
                      <q-card-section style="width: 100%">
                        <div style="width: 100%">
                          <q-input label="Year:" type="number" outlined v-model="year" />
                        </div>
                      </q-card-section>
                      <q-card-section style="width: 100%">
                        <div style="width: 100%">
                          <q-input label="Section:" type="text" outlined v-model="section" />
                        </div>
                      </q-card-section>
                      <q-card-section style="width: 100%">
                        <div style="width: 100%">
                          <q-input label="Status:" type="text" outlined v-model="status" />
                        </div>
                      </q-card-section>
                    </div>
                  </div>
                </q-card-section>
                <!-- table -->
                <div v-if="isRegular">
                  <q-table
                    class="courseTable"
                    :rows="myGradesRow"
                    :columns="myGradesColumn"
                    separator="cell"
                    row-key="id"
                  >
                    <template #body="props">
                      <q-tr :props="props">
                        <q-td>{{ props.row.courseCode }}</q-td>
                        <q-td>{{ props.row.courseTitle }}</q-td>
                        <q-td>{{ props.row.units }}</q-td>
                        <q-td>{{ props.row.time }}</q-td>
                        <q-td>{{ props.row.day }}</q-td>
                        <q-td>{{ props.row.remarks }}</q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <div v-if="isIrregular">
                  <q-table
                    class="courseTable"
                    :rows="myGradesRow"
                    :columns="myGradesColumn"
                    separator="cell"
                    row-key="id"
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
                    <template #body="props">
                      <q-tr :props="props">
                        <q-td auto-width>
                          <q-checkbox v-model="props.selected" />
                        </q-td>
                        <q-td>{{ props.row.courseCode }}</q-td>
                        <q-td>{{ props.row.courseTitle }}</q-td>
                        <q-td>{{ props.row.units }}</q-td>
                        <q-td>{{ props.row.time }}</q-td>
                        <q-td>{{ props.row.day }}</q-td>
                        <q-td>{{ props.row.remarks }}</q-td>
                      </q-tr>
                    </template>
                  </q-table>
                  add popup notification for irregstudent before clicking the right button
                </div>
                <div style="display: flex; width: 100%" class="q-mt-md">
                  <div style="display: flex; justify-content: center" class="q-ml-md">
                    <q-btn
                      :loading="loading"
                      @click="backBtn"
                      icon="arrow_back"
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
                  <q-space />
                  <div style="display: flex; justify-content: center" class="q-ml-md">
                    <!-- change @click to submit later -->
                    <q-btn
                      :loading="loading"
                      @click="confirmBtn"
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
            </q-card-section>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
// router
const router = useRouter()
// input
const program = ref('')
const year = ref('')
const section = ref('')
const status = ref('')
const role = ref('irregular')
const isRegular = ref('')
const isIrregular = ref('')

async function roleValidation() {
  if (role.value === 'regular') {
    return (isRegular.value = true)
  } else if (role.value === 'irregular') {
    return (isIrregular.value = true)
  }
}

const selected = ref([])
const selectAll = ref(false)

const myGradesRow = ref([
  {
    id: 1,
    courseCode: 'itec101',
    courseTitle: 'brtbrt',
    units: 5,
    time: '500hrs',
    day: 5,
    remarks: 'Check',
  },
  {
    id: 2,
    courseCode: 'itec101',
    courseTitle: 'brtbrt',
    units: 5,
    time: '500hrs',
    day: 5,
    remarks: 'Check',
  },
  {
    id: 3,
    courseCode: 'itec101',
    courseTitle: 'brtbrt',
    units: 5,
    time: '500hrs',
    day: 5,
    remarks: 'Check',
  },
  {
    id: 4,
    courseCode: 'itec101',
    courseTitle: 'brtbrt',
    units: 5,
    time: '500hrs',
    day: 5,
    remarks: 'Check',
  },

  {
    id: 5,
    courseCode: 'itec101',
    courseTitle: 'brtbrt',
    units: 5,
    time: '500hrs',
    day: 5,
    remarks: 'Check',
  },
])

const myGradesColumn = ref([
  {
    name: 'courseCode',
    label: 'Course Code',
    align: 'left',
    field: 'courseCode',
  },
  {
    name: 'courseTitle',
    label: 'Course Title',
    align: 'left',
    field: 'courseTitle',
  },
  {
    name: 'units',
    label: 'Units',
    align: 'left',
    field: 'units',
  },
  {
    name: 'time',
    label: 'Time',
    align: 'left',
    field: 'time',
  },
  {
    name: 'day',
    label: 'Day',
    align: 'left',
    field: 'day',
  },
  {
    name: 'remarks',
    label: 'Remarks',
    align: 'left',
    field: 'remarks',
  },
])

async function backBtn() {
  router.replace(`/studentInfoInput`)
}

async function confirmBtn() {
  router.replace(`/reviewInfo`)
}

const onSelectAllClick = (val) => {
  selected.value = val ? [...myGradesRow.value] : []
}


watch(selected, (newVal) => {
  console.log('Selected rows:', newVal)

  selectAll.value = newVal.length === myGradesRow.value.length
})

onMounted(() => {
  roleValidation()
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
  height: 350px
</style>
