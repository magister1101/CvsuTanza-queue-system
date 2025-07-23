<template>
  <div>
    <q-layout>
      <q-page-container class="background-container">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup></script>

<style lang="sass">
.background-container
  background: url('https://res.cloudinary.com/drv1z32zg/image/upload/v1747746555/Screenshot_20250428_204509_Facebook_fazdlr.jpg') no-repeat center center
  background-size: cover
  width: 100%
  min-height: 100vh
  border: 3px solid #606060
  overflow-y: auto
</style>
