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
        <!-- main-content -->
        <q-card-section class="flex flex-center">
          <div style="width: 80%; height: 93vh">
            <q-card-section style="margin-top: 120px" class="q-pl-none">
              <div class="text-h4 text-weight-medium" style="color: #312f2f">
                Welcome, Students!
              </div>
            </q-card-section>
            <q-card-section class="q-px-xl">
              <div
                class="text-h4 text-weight-medium"
                style="color: #312f2f; margin-left: 90px; margin-top: 30px"
              >
                Admission Status:
              </div>
              <div class="container-btn">
                <div class="btn">
                  <q-btn
                    class="text-h4 text-weight-medium"
                    no-caps
                    style="width: 100%; height: 100%; color: #fdfcfc"
                    @click="regularStudent"
                    flat
                    >Regular<br />Student</q-btn
                  >
                </div>
                <div class="btn">
                  <q-btn
                    class="text-h4 text-weight-medium"
                    no-caps
                    style="width: 100%; height: 100%; color: #fdfcfc"
                    @click="irregularStudent"
                    >Irregular <br />
                    Student</q-btn
                  >
                </div>
              </div>
            </q-card-section>
            <q-btn label="admin" @click="adminLogin" />
            <q-btn label="public" @click="publicMonitor" />
          </div>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

async function regularStudent() {
  console.log('regular Student')
  router.replace(`/studentInfo`)
}

async function irregularStudent() {
  console.log('irregular Student')
}

async function adminLogin() {
  router.replace(`/adminLogin`)
}

async function publicMonitor() {
  router.replace(`/publicMonitor`)
}
</script>

<style lang="sass" scoped>

.container-btn
  margin-top: 30px
  width: 100%
  display: flex
  justify-content: space-evenly
.btn
  width: 40%
  background-color: #30572d
  height: 250px
  border: 3px solid #5c7459
</style>
