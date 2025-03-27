<template>

  <q-layout view="hHh lpR fFf" class="bg-white">
    <q-header class="bg-secondary" style="position: fixed; z-index: 2000">
      <q-toolbar class="q-pa-sm">
        <q-btn
          flat
          color="green-10"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="z-max"
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      style="background-color: #30582d"
      overlay
      behavior="mobile"
      elevated
      :width="250"
      :breakpoint="500"
    >
      <q-list>
        <div class="q-pa-md flex flex-center">
          <q-avatar size="60px">
            <q-img
              src="https://res.cloudinary.com/dqaw6ndtn/image/upload/v1737617283/assets/queing/ja3s742lgdzsca55fu1w.png"
            />
          </q-avatar>
        </div>
        <q-item-label>
          <EssentialLink />
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import EssentialLink from 'src/components/EssentialLink.vue'
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
