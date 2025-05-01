<template>
  <div class="container">
    <h1>Upload Excel File</h1>

    <!-- Simple file input -->
    <input type="file" @change="handleFileChange" accept=".xlsx,.xls" />

    <!-- Upload button -->
    <button @click="uploadFile" :disabled="!file">Upload</button>

    <!-- Loading spinner (simple text indicator) -->
    <p v-if="loadingImport">Uploading...</p>

    <!-- Success and error messages -->
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const file = ref(null)
const loadingImport = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleFileChange = (event) => {
  // Capture the selected file
  file.value = event.target.files[0]
}

const uploadFile = async () => {
  if (!file.value) return

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    loadingImport.value = true
    successMessage.value = ''
    errorMessage.value = ''

    // Make the API request to upload the file
    const response = await axios.post(
      `${process.env.api_host}/users/excel/insertStudents`, // Replace with your backend URL
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    // Handle success
    successMessage.value = response.data.message
    file.value = null // Clear the file input after success
  } catch (error) {
    // Handle error
    errorMessage.value = error.response?.data?.error || 'An error occurred'
  } finally {
    loadingImport.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
