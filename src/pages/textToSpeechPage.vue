<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-md shadow-2">
      <q-card-section>
        <q-input v-model="text" label="Enter text to speak" filled />
      </q-card-section>

      <q-card-actions align="around">
        <q-btn color="primary" label="Speak" @click="speakText" icon="record_voice_over" />
        <q-btn color="red" label="Stop" @click="stopSpeech" icon="stop" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const text = ref("Hello! This is a text-to-speech test.");
const synth = window.speechSynthesis;

const speakText = () => {
  if (synth.speaking) {
    console.warn("Speech already in progress...");
    return;
  }
  if (text.value.trim() !== "") {
    const utterance = new SpeechSynthesisUtterance(text.value);
    synth.speak(utterance);
  }
};

const stopSpeech = () => {
  if (synth.speaking) {
    synth.cancel();
  }
};
</script>
