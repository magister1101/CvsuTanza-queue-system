<template>
  <q-page>
    <div>
      <div
        style="
          background: url('https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617278/assets/queing/q5xrh22iplhm2bndvvru.jpg')
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
            <div style="color: #31572c" class="text-weight-bold">Transaction</div>
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
                  @click="toRegistrar"
                  :loading="registrarLoading"
                />
              </div>
              <div class="divBtn">
                <q-btn
                  label="Osas"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  @click="toOsas"
                  :loading="osasLoading"
                />
              </div>
              <div class="divBtn">
                <q-btn
                  label="Cashier"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  @click="toCashier"
                  :loading="cashierLoading"
                />
              </div>
            </div>
          </q-card-section>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { ref } from 'vue'
const registrarLoading = ref(false)
const osasLoading = ref(false)
const cashierLoading = ref(false)

const router = useRouter()

async function toRegistrar() {
  registrarLoading.value = true
  try {
    const response = await axios.post(
      `${process.env.api_host}/queues/createTransaction`,
      {
        destination: 'registrar',
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
async function toOsas() {
  osasLoading.value = true
  try {
    const response = await axios.post(
      `${process.env.api_host}/queues/createTransaction`,
      {
        destination: 'osas',
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
    osasLoading.value = false
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
