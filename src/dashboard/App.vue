<template>
  <h1>Dashboard</h1>
  <div id="info">{{ info }}</div>
  <input v-model="apiKey" id="api-key" type="text" placeholder="API Key" />
  <button id="save-api-key" @click="saveApiKey">Salvar API Key</button>
  <div id="api-message" class="success" v-if="apiMessage">{{ apiMessage }}</div>
  <button id="logout" @click="logout">Logout</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const info = ref('')
const apiKey = ref('')
const apiMessage = ref('')

onMounted(() => {
  chrome.storage.local.get('JWT_TOKEN', data => {
    if (!data.JWT_TOKEN) {
      window.location.href = 'popup.html'
    } else {
      info.value = 'Logged in'
    }
  })

  chrome.storage.local.get('API_TOKEN', data => {
    if (data.API_TOKEN) {
      apiKey.value = data.API_TOKEN
    }
  })
})

function logout() {
  chrome.storage.local.remove('JWT_TOKEN', () => {
    window.location.href = 'popup.html'
  })
}

function saveApiKey() {
  chrome.storage.local.set({ API_TOKEN: apiKey.value }, () => {
    apiMessage.value = 'API Key salva com sucesso'
  })
}
</script>
