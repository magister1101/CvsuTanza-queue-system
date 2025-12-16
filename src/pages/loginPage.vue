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
        <div class="main-container">
          <q-card-section class="container-courseInfo">
            <q-card-section>
              <q-btn flat @click="backBtn">
                <q-icon name="arrow_back_ios" />
              </q-btn>
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-h4 text-weight-bold text-uppercase">Student Login</div>
            </q-card-section>
            <q-form @submit.prevent="login">
              <q-card-section style="width: 100%">
                <div style="width: 100%">
                  <q-input type="text" label="Student Number" outlined v-model="username" />
                </div>
              </q-card-section>
              <q-card-section style="width: 100%">
                <!-- Password: -->
                <div style="width: 100%">
                  <q-input type="password" outlined v-model="password" style="display: none" />
                </div>
              </q-card-section>
              <!-- <q-card-section style="display: flex; justify-content: space-between; width: 100%">
                <div>Create New Account?</div>
                <div
                  style="cursor: pointer; text-decoration: underline; color: #4a28c5"
                  clickable
                  @click="router.push('/studentRegister')"
                >
                  Sign up
                </div>
              </q-card-section> -->
              <q-card-section class="flex flex-center">
                <q-btn
                  class="q-py-md q-px-xl"
                  label="Sign In"
                  no-caps
                  type="submit"
                  :loading="loading"
                  flat
                  style="background-color: #30572d; color: #ffffff"
                />
              </q-card-section>
            </q-form>
            <q-card-section style="display: flex; justify-content: space-around">
              <!-- <q-btn label="Admin Login" flat style="border: 1px solid #606060" no-caps @click="router.push('/adminLogin')" /> -->

              <q-btn
                label="Public Monitor"
                flat
                style="border: 1px solid #606060"
                no-caps
                @click="router.push('/publicMonitor')"
              />
            </q-card-section>
          </q-card-section>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref(username)
const loading = ref(false)

async function login() {
  console.log('Logging in...', username.value)
  loading.value = true
  try {
    const response = await axios.post(
      `${process.env.api_host}/users/login`,
      {
        username: username.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status === 200) {
      const token = await response.data.token
      localStorage.setItem('authToken', 'Bearer ' + token)
      Notify.create({ type: 'positive', message: 'Login successful!' })
      await new Promise((resolve) => setTimeout(resolve, 500))

      // const newToken = localStorage.getItem('authToken')

      // const createQueueResponse = await axios.post(
      //   `${process.env.api_host}/queues/createQueue`,
      //   {},
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       authorization: newToken,
      //     },
      //   },
      // )
      // router.replace(`/queuingPage/` + `${createQueueResponse.data.queue._id}`)

      // Handle successful login (e.g., redirect or store user info)

      router.replace('/preRegCheck')
    } else {
      Notify.create({
        type: 'negative',
        message: 'Unexpected response from server.',
      })
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      message: 'Incorrect username or password.',
      type: 'negative',
    })
  } finally {
    loading.value = false
  }
}

async function backBtn() {
  router.push(`/`)
}
</script>

<style lang="sass" scoped>
.container-courseInfo
  background-color: #fcfedf
  width: 100%
  height: auto
  padding: 20px
  margin-top: 50px
  border-radius: 8px
  max-width: 500px
  margin-left: auto
  margin-right: auto

.main-container
  width: 90%
  max-width: 1200px
  margin: 0 auto
  padding: 20px
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center

@media (max-width: 600px)
  .container-courseInfo
    margin-top: 20px
    padding: 15px

  .text-h4
    font-size: 1.5rem
</style>
