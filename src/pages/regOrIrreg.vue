<template>
  <q-page class="q-pa-md">
    <q-card-section>
      <q-btn flat @click="redirect('/preRegCheck')">
        <q-icon name="arrow_back_ios" />
      </q-btn>
    </q-card-section>
    <div>
      <div>
        <div class="main-container">
          <q-card-section style="text-align: center; font-size: 2rem">
            <div style="color: #ffffff" class="text-weight-bold">PRE-REGISTRATION</div>
          </q-card-section>
          <q-card-section class="container-courseInfo">
            <!-- btn -->
            <div class="button-container">
              <div class="divBtn">
                <q-btn
                  label="Regular"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  :disable="isIrregular"
                  @click="handleRegularClick"
                >
                  <q-tooltip v-if="isIrregular" class="bg-negative">
                    The student is irregular. You cannot go to regular registration.
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="divBtn">
                <q-btn
                  label="Irregular"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  :disable="isRegular"
                  @click="handleIrregularClick"
                >
                  <q-tooltip v-if="isRegular" class="bg-negative">
                    The student is regular. You cannot go to irregular registration.
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

const router = useRouter()
const isRegular = ref(null)
const isIrregular = ref(null)
const loading = ref(true)

async function getUserStatus() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })
    
    // Check if isRegular is explicitly true or false
    const userIsRegular = response.data.isRegular === true
    const userIsIrregular = response.data.isRegular === false
    
    // Only disable buttons if we have a definitive status
    isRegular.value = userIsRegular
    isIrregular.value = userIsIrregular
  } catch (error) {
    console.error('Error fetching user status:', error)
    // If error, allow both buttons (fallback)
    isRegular.value = false
    isIrregular.value = false
  } finally {
    loading.value = false
  }
}

function redirect(path) {
  router.push(path)
}

function handleRegularClick() {
  if (isIrregular.value) {
    Notify.create({
      type: 'negative',
      message: 'The student is irregular. You cannot go to regular registration.',
      position: 'top',
    })
    return
  }
  redirect('/regularPreReg')
}

function handleIrregularClick() {
  if (isRegular.value) {
    Notify.create({
      type: 'negative',
      message: 'The student is regular. You cannot go to irregular registration.',
      position: 'top',
    })
    return
  }
  redirect('/irregularpreReg')
}

onMounted(() => {
  getUserStatus()
})
</script>

<style lang="sass" scoped>
.container-courseInfo
  width: 50vw
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
  opacity: 1
  transition: opacity 0.3s ease

.divBtn:has(button:disabled)
  opacity: 0.5


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
