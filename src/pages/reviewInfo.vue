<template>
  <q-page>
    <div>
      <div
        style="
          background: url('https://res.cloudinary.com/drv1z32zg/image/upload/v1747746555/Screenshot_20250428_204509_Facebook_fazdlr.jpg')
            no-repeat center center;
          background-size: cover;
          width: 100%;
          height: 100vh;
          border: 3px solid #606060;
        "
      >
        <!-- Main Content -->
        <div class="q-ml-xl q-pt-xl" style="float: left; position: absolute; z-index: 100">
          <q-btn icon="arrow_back_ios" size="20px" flat @click="backBtn" />
        </div>
        <q-card-section class="flex flex-center">
          <div style="width: 80%">
            <q-card-section class="text-center" style="margin-top: 90px">
              <div class="text-h4 text-weight-bold text-uppercase">Review Information</div>
            </q-card-section>
          </div>
          <q-card-section class="container-reviewInfo">
            <q-form>
              <div>
                <div>
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
              </div>
              <q-card-section class="flex flex-center">
                <div
                  style="
                    width: 120px;
                    background-color: #31562d;
                    color: #ffffff;
                    height: 50px;
                    border-radius: 5px;
                  "
                >
                  <q-btn style="width: 100%; height: 100%" @click="submit" flat label="Submit" />
                </div>
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// router
const router = useRouter()

async function backBtn() {
  router.replace(`/courseInfo`)
}

async function submit() {
  router.replace(`/queuingPage`)
}
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
</script>

<style lang="sass" scoped>
.container-reviewInfo
  background-color: #fcfedf
  width: 80%
  height: auto
.courseTable
  background-color: #fcfedf
  box-shadow: none
  height: 350px
</style>
