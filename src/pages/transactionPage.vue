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
        <q-card-section>
          <q-btn flat @click="backBtn">
            <q-icon name="arrow_back_ios" />
          </q-btn>
        </q-card-section>
        <div class="main-container">
          <q-card-section style="text-align: center; font-size: 2rem">
            <div style="color: #ffffff" class="text-weight-bold">Transaction</div>
          </q-card-section>
          <q-card-section class="container-courseInfo">
            <!-- btn -->
            <div class="button-container">
              <div class="divBtn">
                <q-btn
                  label="Registrar"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  @click="registrarDialog = true"
                />
              </div>
              <div class="divBtn">
                <q-btn
                  label="admission"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  @click="admissionDialog = true"
                />
              </div>
              <div class="divBtn">
                <q-btn
                  label="Cashier"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  @click="cashierDialog = true"
                />
              </div>
            </div>
          </q-card-section>
        </div>
      </div>
    </div>
    <!-- registrar dialog -->
    <q-dialog v-model="registrarDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="assignment_ind" class="q-mr-sm" />
          <div class="text-h6 text-weight-medium">Registrar Services</div>
        </q-card-section>

        <q-separator class="q-my-sm" />

        <q-card-section>
          <q-option-group
            v-model="selectedRegistrarServices"
            type="checkbox"
            :options="[
              { label: 'COR', value: 'COR' },
              { label: 'COG', value: 'COG' },
              { label: 'TOR', value: 'TOR' },
              { label: 'CAV', value: 'CAV' },
            ]"
            color="primary"
            class="q-gutter-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Back" flat color="primary" @click="registrarDialog = false" />
          <q-btn
            label="Submit"
            color="primary"
            unelevated
            @click="toRegistrar"
            :disable="selectedRegistrarServices.length === 0"
            :loading="registrarLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- admission dialog -->
    <q-dialog v-model="admissionDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 300px">
        <!-- Title Section -->
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="assignment_ind" class="q-mr-sm" />
          <div class="text-h6 text-weight-medium">Admission Services</div>
        </q-card-section>

        <q-separator class="q-my-sm" />

        <!-- Multiple Select Options -->
        <q-card-section>
          <q-option-group
            v-model="selectedAdmissionServices"
            type="checkbox"
            :options="[
              { label: 'Admission form', value: 'Admission form' },
              { label: 'Form 137', value: 'Form 137' },
              { label: 'Notice of admission', value: 'Notice of admission' },
              { label: 'Medical', value: 'Medical' },
              { label: 'Good moral', value: 'Good moral' },
              { label: 'COR', value: 'COR' },
              { label: 'Honorable dismissal', value: 'Honorable dismissal' },
              { label: 'TOR', value: 'TOR' },
            ]"
            color="primary"
            class="q-gutter-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Back" flat color="primary" @click="admissionDialog = false" />
          <q-btn
            label="Submit"
            color="primary"
            unelevated
            @click="toAdmission"
            :disable="selectedAdmissionServices.length === 0"
            :loading="admissionLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- cashier dialog -->
    <q-dialog v-model="cashierDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 300px">
        <!-- Title Section -->
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="assignment_ind" class="q-mr-sm" />
          <div class="text-h6 text-weight-medium">Cashier Services</div>
        </q-card-section>

        <q-separator class="q-my-sm" />

        <q-card-actions align="right">
          <q-btn label="Back" flat color="primary" @click="cashierDialog = false" />
          <q-btn
            label="Continue"
            color="primary"
            unelevated
            @click="toCashier"
            :loading="cashierLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { ref } from 'vue'
const registrarLoading = ref(false)
const admissionLoading = ref(false)
const cashierLoading = ref(false)

const registrarDialog = ref(false)
const admissionDialog = ref(false)
const cashierDialog = ref(false)

const selectedRegistrarServices = ref([])
const selectedAdmissionServices = ref([])

const router = useRouter()

async function toRegistrar() {
  registrarLoading.value = true
  try {
    const response = await axios.post(
      `${process.env.api_host}/queues/createTransaction`,
      {
        destination: 'registrar',
        subCategory: selectedRegistrarServices.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    Notify.create({
      type: 'positive',
      message: response.data.message,
    })
    router.replace(`/queuingPage/` + `${response.data.queue._id}`)
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to create Queue',
    })
  } finally {
    registrarLoading.value = false
  }
}
async function toAdmission() {
  admissionLoading.value = true
  try {
    const response = await axios.post(
      `${process.env.api_host}/queues/createTransaction`,
      {
        destination: 'admission',
        subCategory: selectedAdmissionServices.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    Notify.create({
      type: 'positive',
      message: response.data.message,
    })
    router.replace(`/queuingPage/` + `${response.data.queue._id}`)
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to create Queue',
    })
  } finally {
    admissionLoading.value = false
  }
}
async function toCashier() {
  cashierLoading.value = true
  try {
    const response = await axios.post(
      `${process.env.api_host}/queues/createTransaction`,
      {
        destination: 'cashier',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    Notify.create({
      type: 'positive',
      message: response.data.message,
    })
    router.replace(`/queuingPage/` + `${response.data.queue._id}`)
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to create Queue',
    })
  } finally {
    cashierLoading.value = false
  }
}
async function backBtn() {
  router.push(`/`)
}
</script>

<style lang="sass" scoped>
.container-courseInfo
  width: 75vw
  height: auto
  border-radius: 8px

.main-container
  width: 90%
  max-width: 1200px
  margin: 0 auto
  min-height: 99vh
  display: flex
  align-items: center
  flex-direction: column
  padding-top: 5%
.divBtn
  background-color: #31572c
  width: 300px
  height: 200px
  border-radius: 14px

.button-container
  margin-top: 120px
  display: flex
  justify-content: space-between

@media (max-width:1280px)
  .button-container
    display: flex
    flex-direction: column
    align-items: center
    margin-top: 0px
    row-gap: 30px
    width: 100%
  .divBtn
    width: 50vw
</style>
