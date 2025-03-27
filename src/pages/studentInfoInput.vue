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
        <div class="q-ml-xl q-pt-xl" style="float: left; position: absolute; z-index: 100">
          <q-btn icon="arrow_back_ios" size="20px" flat @click="backBtn" />
        </div>
        <q-card-section class="flex flex-center">
          <div class="form-container">
            <q-card-section class="text-center q-pt-xl">
              <div class="text-h4 text-weight-bold text-uppercase">Student Information</div>
            </q-card-section>
            <q-card-section class="container-courseInfo">
              <q-card-section class="form-section">
                <q-form @submit.prevent="submitStudentInfo">
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                      <q-card-section style="width: 100%">
                        Surname:
                        <div>
                          <q-input v-model="surName" type="text" outlined />
                        </div>
                      </q-card-section>
                      <q-card-section style="width: 100%">
                        Middle Name:
                        <div>
                          <q-input v-model="middleName" type="text" outlined />
                        </div>
                      </q-card-section>

                      <q-card-section style="width: 100%">
                        Program:
                        <div>
                          <q-input v-model="program" type="text" outlined />
                        </div>
                      </q-card-section>
                      <q-card-section style="width: 100%">
                        Section:
                        <div>
                          <q-input v-model="section" type="text" outlined />
                        </div>
                      </q-card-section>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-card-section style="width: 100%">
                        First Name:
                        <div>
                          <q-input v-model="firstName" type="text" outlined />
                        </div>
                      </q-card-section>
                      <q-card-section style="width: 100%">
                        Student No:
                        <div>
                          <q-input v-model="studentNo" type="number" outlined />
                        </div>
                      </q-card-section>
                      <q-card-section style="width: 100%">
                        Year:
                        <div>
                          <q-input v-model="year" type="number" outlined />
                        </div>
                      </q-card-section>
                      <q-card-section class="notification-section">
                        <div class="notification-box q-pa-md">
                          <q-icon name="notifications" color="red" size="30px" />
                          KINDLY REVIEW IF THE FILLED INFORMATION IS CORRECT BEFORE PROCEEDING. IF
                          YOU NOTICE ANY ERROR OR MISSPELLED INFORMATION, JUST VISIT REGISTRAR TO
                          ADDRESS YOUR CONCERN.
                        </div>
                        <div class="submit-button-container q-ml-md">
                          <q-btn
                            :loading="loading"
                            type="submit"
                            icon="arrow_forward"
                            size="24px"
                            class="submit-button"
                          ></q-btn>
                        </div>
                      </q-card-section>
                    </div>
                  </div>
                </q-form>
              </q-card-section>
            </q-card-section>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Notify } from 'quasar';

// router
const router = useRouter()
// loading
const loading = ref(false);
// input info
const firstName = ref('')
const surName = ref('')
const middleName = ref('')
const program = ref('')
const section = ref('')
const studentNo = ref('')
const year = ref('')

async function backBtn() {
  router.replace(`/studentInfo`)
}

async function submitStudentInfo() {
  loading.value = true
  try{
    if(!firstName.value || !surName.value || !middleName.value || !program.value || !section.value || !studentNo.value || !year.value){
      Notify.create({
        type: 'warning',
        message: 'please filled all the required filleds'
      })
      return
    }
    router.replace(`/courseInfo`)
  }catch(err){
    console.error(err)
  }finally{
    loading.value = false
  }
}
</script>

<style lang="sass" scoped>
.container-courseInfo
  background-color: #fcfedf
  width: 100%
  height: auto
  min-height: 550px
  padding: 20px

.form-container
  width: 90%
  max-width: 1200px
  margin: 0 auto

.form-section
  height: auto
  min-height: 520px

.notification-section
  width: 100%
  display: flex
  flex-direction: row
  @media (max-width: 600px)
    flex-direction: column
    align-items: center
    gap: 20px

.notification-box
  background-color: #ffffff
  border: 1px solid black
  width: 100%
  display: flex
  text-align: justify
  align-items: center
  gap: 8px

.submit-button-container
  width: 25%
  display: flex
  justify-content: center
  @media (max-width: 600px)
    width: 100%

.submit-button
  width: 100px
  height: 100px
  color: #ffffff
  background-color: #31562d
  border-radius: 50%

@media (max-width: 600px)
  .text-h4
    font-size: 1.5rem
</style>
