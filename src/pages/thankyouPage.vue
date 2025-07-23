<template>
  <q-page class="page-background">
    <div class="main-container">
      <q-card-section class="container-courseInfo bg-white">
        <div class="divContent">
          <p class="thank-you-text text-uppercase">
            Thank you for registering, kindly wait for an Adviser to evaluate your Courses, then
            queue number will be assigned to you.
          </p>
          <div class="divBtn">
            <q-btn
              label="Done"
              class="login-btn text-h5 text-weight-medium"
              no-caps
              @click="redirect('/')"
            />
          </div>
        </div>
      </q-card-section>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function redirect(path) {
  localStorage.clear()
  router.push(path)
}
</script>

<style lang="sass" scoped>
.page-background
  background: url('https://res.cloudinary.com/drv1z32zg/image/upload/v1747746555/Screenshot_20250428_204509_Facebook_fazdlr.jpg') no-repeat center center
  background-size: cover
  width: 100%
  min-height: 100vh
  border: 3px solid #606060
  display: flex
  align-items: center
  justify-content: center

.main-container
  width: 100%
  display: flex
  justify-content: center
  align-items: center

.container-courseInfo
  display: flex
  justify-content: center
  align-items: center
  width: 40%
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.2)

.divContent
  width: 60%
  max-width: 500px
  padding: 40px 20px
  border-radius: 14px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  text-align: center
  row-gap: 20px

.thank-you-text
  color: #000000
  font-size: 1.3rem
  font-weight: 500
  line-height: 1.5

.login-btn
  width: 100%
  color: #ffffff
  background-color: #4f772d
  border-radius: 14px

@media (max-width: 530px)
  .divContent
    width: 85%
    padding: 30px 15px

  .thank-you-text
    font-size: 1.1rem

  .container-courseInfo
    width: 90%
</style>
