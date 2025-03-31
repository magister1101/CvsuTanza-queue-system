<template>
  <q-page>
    <div>
      <!-- <div class="q-ml-xl q-pt-md" style="float: left; position: absolute; z-index: 100">
        <q-btn icon="arrow_back_ios" size="20px" flat @click="backBtn" />
      </div> -->
      <div
        class="main-container"
        style="
          background: url('https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617278/assets/queing/q5xrh22iplhm2bndvvru.jpg')
            no-repeat center center;
          background-size: cover;
          width: 100%;
          height: 100vh;
          border: 3px solid #606060;
        "
      >
        <q-card class="login-container q-pb-xl">
          <div class="sub-container">
            <q-card-section
              class="q-pb-xl"
              style="
                padding-top: 70px;
                width: 100%;
                border-radius: 14px 0px 0px 14px;
                background-color: #fdffdf;
                display: flex;
                align-items: center;
                flex-direction: column;
                text-align: center;
              "
            >
              <div class="logo">
                <q-img
                  src="https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617283/assets/queing/ja3s742lgdzsca55fu1w.png"
                />
              </div>
              <div class="text-h3 text-weight-bold q-mt-xl" style="color: #393939">
                TANZA CAMPUS
              </div>
            </q-card-section>
            <q-card-section
              style="
                padding-top: 70px;
                width: 100%;

                background-color: #30562c;
                border-radius: 0px 14px 14px 0px;
                color: #f6f8ed;
              "
            >
              <q-card-section class="text-h4 text-center">
                <div>Welcome, Admin!</div>
                <div>LOG IN</div>
              </q-card-section>
              <q-card-section class="q-mt-sm">
                <!-- double check if email or username need pang login sa admin -->
                <q-form @submit.prevent="login">
                  <div>
                    <q-input
                      type="text"
                      v-model="username"
                      label="Username/Email"
                      input-style="color: #f6f8ed"
                      label-color="white"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" size="34px" />
                      </template>
                    </q-input>
                  </div>
                  <div>
                    <q-input
                      :type="isPwd ? 'password' : 'text'"
                      v-model="password"
                      label="Password"
                      input-style="color: #f6f8ed"
                      label-color="white"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" size="34px" />
                      </template>

                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>
                  </div>
                  <div
                    class="q-mt-xl"
                    style="
                      background-color: #ffffff;
                      width: 130px;
                      height: 50px;
                      border-radius: 10px;
                      display: flex;
                      justify-self: center;
                    "
                  >
                    <q-btn
                      type="submit"
                      label="LOGIN"
                      :loading="loading"
                      class="text-subtitle1 text-weight-medium"
                      flat
                      style="width: 100%; height: 100%; color: #4f5944"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card-section>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

// imports
const loading = ref(false)
const router = useRouter()
// login input
const username = ref('')
const password = ref('')

// async function backBtn() {
//   router.replace(`/`)
// }

async function login() {
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
      const token = response.data.token
      localStorage.setItem('authToken', 'Bearer ' + token)
      Notify.create({ type: 'positive', message: 'Login successful!' })
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.replace(`/new/dashboardPage`)
    } else {
      Notify.create({
        type: 'negative',
        message: 'Unexpected response from server.',
      })
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      message: 'Wrong username or password.',
      type: 'negative',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="sass" scoped>
.login-container
  width: 60%
  height: 490px
  border-radius: 14px

.logo
  width: 350px

.sub-container
  display: flex

.main-container
  display: flex
  justify-content: center
  padding-top: 140px

@media (max-width: 1024px)
  .login-container
    width: 80%
  .logo
    width: 250px
  .text-h3
    font-size: 2rem !important
  .text-h4
    font-size: 1.5rem !important
@media (max-width: 768px)
  .login-container
    width: 70%
  .logo
    width: 150px
  .sub-container
    flex-direction: column
  .main-container
    padding-top: 100px

@media (max-width: 480px)
  .login-container
    width: 95%

  .logo
    width: 150px

  .text-h3
    font-size: 1.5rem !important

  .text-h4
    font-size: 1.2rem !important

  .main-container
    padding-top: 80px
</style>
