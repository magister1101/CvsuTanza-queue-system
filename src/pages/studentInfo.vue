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
        <!-- Main Content -->
        <div class="q-ml-xl q-pt-xl" style="float: left;position: absolute;z-index: 100;">
          <q-btn icon="arrow_back_ios" size="20px" flat @click="backBtn" />
        </div>
        <q-card-section class="flex flex-center">
          <div style="width: 80%">
            <q-card-section class="text-center" style="margin-top: 90px">
              <div class="text-h4 text-weight-bold text-uppercase">Student Information</div>
            </q-card-section>
            <q-card-section class="container-semester">
              <div class="text-h4 text-weight-medium text-uppercase q-my-lg" style="color: #245022">
                School Semester:
              </div>

              <div style="width: 100%; display: flex; justify-content: space-evenly">
                <div class="semesterBtn">
                  <q-btn
                    flat
                    style="width: 100%; height: 100%; color: #fcfddd"
                    class="text-h5 text-weight-medium"
                    label="1st Semester "
                    @click="firstSem"
                  />
                </div>
                <div class="semesterBtn">
                  <q-btn
                    flat
                    style="width: 100%; height: 100%; color: #fcfddd"
                    class="text-h5 text-weight-medium"
                    label="2nd Semester "
                  />
                </div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  width: 100%;
                  height: 120px;
                  margin-top: 50px;
                "
              >
                <q-btn
                  flat
                  style="width: 40%; height: 100%; color: #fcfddd; background-color: #30572d"
                  class="text-h5 text-weight-medium"
                  label="Midyear"
                />
              </div>
            </q-card-section>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
async function backBtn() {
  router.replace(`/`)
}

async function firstSem() {
  router.replace(`/studentInfoInput`)
}
</script>

<style lang="sass" scoped>
.container-semester
  background-color: #fcfedf
  width: 100%
  height: 550px
.semesterBtn
  width: 40%
  background-color: #30572d
  height: 120px
</style>
