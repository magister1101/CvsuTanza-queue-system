<template>
  <q-page style="height: 90vh">
    <div class="main-container">
      <div class="content-container q-px-md q-px-sm-xl q-pt-xl">
        <div class="cards-wrapper">
          <q-card-section
            style="background-color: #fbfedf; width: 270px; display: flex; align-items: center"
          >
            <div class="text-h3 text-weight-medium">120</div>
            <div style="width: 100%">
              <div style="display: flex; flex-direction: column; align-items: flex-end">
                <div>
                  <q-icon class="q-mr-md" name="manage_history" size="50px"></q-icon>
                </div>
                <div class="text-h6 text-weight-medium">TOTAL QUEUE</div>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            style="background-color: #caf981; width: 270px; display: flex; align-items: center"
          >
            <div class="text-h3 text-weight-medium">24</div>
            <div style="width: 100%">
              <div style="display: flex; flex-direction: column; align-items: flex-end">
                <div style="width: 50px" class="q-mr-md">
                  <q-img
                    src="https://res.cloudinary.com/dqaw6ndtn/image/upload/v1738069163/assets/queing/czwqb7jga7xbii49y5fe.png"
                  />
                </div>
                <div class="text-h6 text-weight-medium">REGISTER QUEUE</div>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            style="background-color: #fbfedf; width: 270px; display: flex; align-items: center"
          >
            <div class="text-h3 text-weight-medium">24</div>
            <div style="width: 100%">
              <div style="display: flex; flex-direction: column; align-items: flex-end">
                <div>
                  <q-icon class="q-mr-md" name="point_of_sale" size="50px"></q-icon>
                </div>
                <div class="text-h6 text-weight-medium">CASHIER QUEUE</div>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            style="background-color: #caf981; width: 270px; display: flex; align-items: center"
          >
            <div class="text-h3 text-weight-medium">10</div>
            <div style="width: 100%">
              <div style="display: flex; flex-direction: column; align-items: flex-end">
                <div>
                  <q-icon class="q-mr-md" name="groups" size="50px"></q-icon>
                </div>
                <div class="text-h6 text-weight-medium">OSAS QUEUE</div>
              </div>
            </div>
          </q-card-section>
        </div>
        <!-- table -->
        <div class="q-mt-lg">
          <q-table
            style="border-radius: 14px; background-color: #fdffdf"
            :rows="rows"
            :columns="columns"
            row-key="id"
            separator="cell"
            :filter="filter"
            :rows-per-page-options="[0, 15, 20, 25, 30]"
            class="responsive-table"
          >
            <template v-slot:top-left>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Add filter ref
const filter = ref('')

const columns = ref([
  {
    name: 'departmentName',
    required: true,
    label: 'Department Name',
    align: 'left',
    field: (row) => row.departmentName,
    sortable: true,
  },
  {
    name: 'facilitator',
    label: 'Facilitator',
    align: 'left',
    field: (row) => row.facilitator,
  },
  {
    name: 'logStatus',
    label: 'Log Status',
    align: 'left',
    field: (row) => row.logStatus,
  },
  {
    name: 'timeIn',
    label: 'Time In',
    align: 'left',
    field: (row) => row.timeIn,
  },
  {
    name: 'timeOut',
    label: 'Time Out',
    align: 'left',
    field: (row) => row.timeOut,
  },
])

const rows = ref([
  {
    departmentName: 'REGISTRAR',
    facilitator: 'Jogn Smith',
    logStatus: 'In',
    timeIn: '1:00pm',
    timeOut: '2:00pm',
  },
  {
    departmentName: 'OSAS',
    facilitator: 'Hela Brt',
    logStatus: 'In',
    timeIn: '5:00pm',
    timeOut: '2:00am',
  },
  {
    departmentName: 'CASHIER',
    facilitator: 'Hela Brt',
    logStatus: 'Out',
    timeIn: '5:00pm',
    timeOut: '2:00am',
  },
])
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100%

.cards-wrapper
  width: 100%
  display: flex
  flex-wrap: wrap
  gap: 16px
  justify-content: flex-start
  @media (max-width: 599px)
    gap: 8px
</style>
