<template>
  <q-page>
    <!-- content -->
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
        <div class="main-container">
          <q-card-section class="container-courseInfo">
            <div class="divBtn">
              <q-btn
                label="Login"
                style="width: 100%; height: 100%; color: #ffffff;border-radius: 14px;"
                class="text-h5 text-weight-medium"
                no-caps
                @click="toLoginPage"
                />
            </div>
            <div class="divBtn">
              <q-btn
                label="Transaction"
                style="width: 100%; height: 100%; color: #ffffff;border-radius: 14px;"
                class="text-h5 text-weight-medium"
                no-caps
                @click="toTransactionPage"
                />
            </div>
          </q-card-section>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

async function toLoginPage() {
  router.push(`/loginPage`)
}

async function toTransactionPage() {
  router.push(`/transactionPage`)
}
</script>

<style lang="sass" scoped>
.container-courseInfo
  width: 100%
  height: auto
  border-radius: 8px
  display: flex
  justify-content: space-between
.main-container
  width: 90%
  max-width: 1200px
  margin: 0 auto
  padding: 20px
  min-height: 99vh
  display: flex
  align-items: center
  justify-content: center
.divBtn
  background-color: #31572c
  width: 45%
  height: 200px
  border-radius: 14px

@media (max-width:530px)
  .container-courseInfo
    display: flex
    flex-direction: column
    align-items: center
    row-gap: 30px
    justify-content: space-around
  .divBtn
    width: 80%
</style>
