<template>
  <q-page class="main-container">
    <div class="content-container q-px-md q-px-sm-xl">
      <q-card-section class="q-pt-md">
        <div class="text-h6 text-weight-medium" style="color: #282726">
          Admin/<span style="color: #b1b2b4">Admin Profile</span>
        </div>
      </q-card-section>
      <q-card-section class="flex flex-center" style="width: 100%">
        <q-card class="profile-card q-pa-md">
          <!-- Profile Header -->
          <div class="profile-header q-mb-xl flex flex-center column">
            <div class="profile-image-container">
              <q-img
                class="rounded-image"
                src="https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617283/assets/queing/ja3s742lgdzsca55fu1w.png"
                style="border-radius: 50%; width: 180px; height: 180px; object-fit: cover"
              />
            </div>
            <!-- <div class="text-h5 text-weight-bold text-center q-mt-md" style="color: #193018">
              {{ userFullName }}
            </div> -->
          </div>
          <!-- Profile Form -->
          <q-form @submit.prevent="editInfo">
            <!-- Profile Information Section -->
            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">Profile Information</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input v-model="username" label="Username" outlined />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="designation" label="Department" outlined disable />
                </div>
              </div>
            </div>
            <!-- Password Change Section -->
            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">Change Password</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input v-model="newPassword" type="password" label="New Password" outlined />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="confirmPassword" type="password" label="Confirm Password" outlined />
                </div>
              </div>
            </div>
            <!-- Save Button -->
            <div class="flex flex-center">
              <q-btn
                label="Save"
                type="submit"
                :loading="loading"
                color="primary"
                style="background-color: #13260f; color: #ffffff"
              />
            </div>
          </q-form>
        </q-card>
      </q-card-section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'

const loading = ref(false)
const username = ref('')
const designation = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const userFullName = ref('')
const userId = ref('')

async function editInfo() {
  loading.value = true
  try {
    if (!username.value || !designation.value) {
      Notify.create({
        type: 'negative',
        message: 'Username and Designation cannot be empty'
      })
      return
    }
    if (newPassword.value || confirmPassword.value) {
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/
      if (newPassword.value.length < 6 || !specialCharRegex.test(newPassword.value)) {
        Notify.create({
          type: 'negative',
          message: 'New Password must be at least 6 characters and include a special character.'
        })
        return
      }
      if (newPassword.value !== confirmPassword.value) {
        Notify.create({
          type: 'negative',
          message: 'Password do not match.'
        })
        return
      }
    }
    const token = localStorage.getItem('authToken')
    const updateData = {
      username: username.value,
      role: designation.value
    }
    if (newPassword.value) {
      updateData.password = newPassword.value
    }
    await axios.post(`${process.env.api_host}/users/update/${userId.value}`, updateData, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    Notify.create({
      type: 'positive',
      message: 'Profile updated successfully!'
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error updating profile.'
    })
  } finally {
    loading.value = false
  }
}

async function userInfo() {
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })
    console.log(response.data)
    userId.value = response.data._id
    const userData = response.data
    username.value = userData.username
    designation.value = userData.role
    userFullName.value = `${userData.firstName} ${userData.middleName} ${userData.lastName}`
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error fetching user information'
    })
  }
}

onMounted(() => {
  userInfo()
})
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100vh

.profile-card
  width: 95%
  max-width: 1200px
  background-color: #fbfedf
  border-radius: 14px

.profile-header
  .profile-image-container
    width: 200px
    height: 200px
    border: 4px solid black
    border-radius: 50%
    display: flex
    justify-content: center
    align-items: center

@media (max-width: 599px)
  .profile-image-container
    width: 150px !important
    height: 150px !important
  .rounded-image
    width: 130px !important
    height: 130px !important
</style>
