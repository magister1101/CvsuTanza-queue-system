<template>
  <div class="text-white" v-if="notAdmin">
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/dashboardPage`)">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dashboard</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/addStudent`)">
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Student</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/email`)">
        <q-item-section avatar>
          <q-icon name="email" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Email</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/addProgram`)">
        <q-item-section avatar>
          <q-icon name="folder" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Program</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/addCourses`)">
        <q-item-section avatar>
          <q-icon name="library_books" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Course</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/schedule`)">
        <q-item-section avatar>
          <q-icon name="schedule" />
        </q-item-section>
        <q-item-section>
          <q-item-label>schedule</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/adminQueuePage`)">
        <q-item-section avatar>
          <q-icon name="menu" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Queue</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/verifyStudent`)">
        <q-item-section avatar>
          <q-icon name="confirmation_number" />
        </q-item-section>
        <q-item-section> Verify </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/adminCreateAccount`)">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section> Users </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/cor`)">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section> COR </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/adminSettings`)">
        <q-item-section avatar>
          <q-icon name="settings" />
        </q-item-section>
        <q-item-section> Settings </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="handleLogout">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
  <!-- admin -->
  <div class="text-white" v-if="isAdmin">
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/dashboardPage`)">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dashboard</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/addStudent`)">
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Student</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/email`)">
        <q-item-section avatar>
          <q-icon name="email" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Email</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/addProgram`)">
        <q-item-section avatar>
          <q-icon name="folder" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Program</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/addCourses`)">
        <q-item-section avatar>
          <q-icon name="library_books" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Course</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/schedule`)">
        <q-item-section avatar>
          <q-icon name="schedule" />
        </q-item-section>
        <q-item-section>
          <q-item-label>schedule</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/adminQueuePage`)">
        <q-item-section avatar>
          <q-icon name="menu" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Queue</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/verifyStudent`)">
        <q-item-section avatar>
          <q-icon name="confirmation_number" />
        </q-item-section>
        <q-item-section> Verify </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/adminCreateAccount`)">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section> Users </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/cor`)">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section> COR </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="router.replace(`/new/adminSettings`)">
        <q-item-section avatar>
          <q-icon name="settings" />
        </q-item-section>
        <q-item-section> Settings </q-item-section>
      </q-item>
    </div>
    <div class="q-py-sm">
      <q-item clickable @click="handleLogout">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const roleValidation = ref('')
const isAdmin = ref('')
const notAdmin = ref('')
const isStudent = ref('')
const router = useRouter()
const semester = ref('')

const clearLocalStorage = () => {
  localStorage.clear()
}

const handleLogout = async () => {
  try {
    // Clear localStorage when logging out
    clearLocalStorage()
    // Show a notification
    Notify.create({ type: 'positive', message: 'Logout Successful' })
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Redirect to the login page
    router.replace('/adminLogin')
  } catch (error) {
    // If an error occurs during logout
    Notify.create({ type: 'negative', message: 'Error during logout' })
    console.error(error)
  } finally {
    // await isLogin();
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
    roleValidation.value = response.data.role
    if (roleValidation.value === 'admin') {
      return (isAdmin.value = true)
    } else if (roleValidation.value === 'student') {
      return (isStudent.value = true)
    } else {
      return (notAdmin.value = true)
    }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error fetching user information',
    })
  }
}

onMounted(() => {
  userInfo()
})
</script>
