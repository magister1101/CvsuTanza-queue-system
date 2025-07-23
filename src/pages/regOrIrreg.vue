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
                  @click="redirect('/regularPreReg')"
                />
              </div>
              <div class="divBtn">
                <q-btn
                  label="Irregular"
                  style="width: 100%; height: 100%; color: #ffffff; border-radius: 14px"
                  class="text-h5 text-weight-medium"
                  no-caps
                  @click="redirect('/irregularpreReg')"
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
import { useRouter } from 'vue-router'

const router = useRouter()

function redirect(path) {
  router.push(path)
}
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
