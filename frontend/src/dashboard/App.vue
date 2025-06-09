<template>
  <div class="popup-wrapper container mx-auto text-center p-3">
    <b-card>
      <h1>Dashboard</h1>
      <div id="info">{{ info }}</div>
      <b-form-input v-model="apiKey" id="api-key" type="text" placeholder="API Key" class="mb-3" />
      <b-form-select v-model="tipo" class="mb-3">
        <b-form-select-option value="openai">OpenAI (ChatGPT)</b-form-select-option>
        <b-form-select-option value="deepseek">DeepSeek</b-form-select-option>
      </b-form-select>
      <small class="text-muted d-block mb-2">DeepSeek usa a mesma API do OpenAI porém com outra base URL.</small>
      <div class="d-flex justify-content-between mb-3">
        <b-button id="save-api-key" variant="primary" @click="saveApiKey">Salvar API Key</b-button>
        <b-button id="logout" variant="danger" @click="logout">Logout</b-button>
      </div>
      <div id="api-message" class="success" v-if="apiMessage">{{ apiMessage }}</div>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const info = ref('')
const apiKey = ref('')
const tipo = ref<'openai' | 'deepseek'>('openai')
const apiMessage = ref('')
const router = useRouter()

onMounted(() => {
  chrome.storage.local.get('JWT_TOKEN', data => {
    const token = data.JWT_TOKEN
    if (!token) {
      router.push('/popup.html')
      return
    }
    info.value = 'Logged in'
    fetch(`${(window as any).API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      mode: 'cors'
    })
      .then(r => r.json())
      .then(u => {
        if (u.api_key) apiKey.value = u.api_key
        if (u.tipoApiKey) tipo.value = u.tipoApiKey
      })
  })
})

function logout() {
  chrome.storage.local.remove('JWT_TOKEN', () => {
    router.push('/popup.html')
  })
}

function saveApiKey() {
  chrome.storage.local.get('JWT_TOKEN', data => {
    const token = data.JWT_TOKEN;
    if (!token) {
      apiMessage.value = 'Você precisa estar logado';
      return;
    }
    fetch(`${(window as any).API_BASE_URL}/me/api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ apiKey: apiKey.value, tipo: tipo.value })
    })
      .then(r => r.json())
      .then(res => {
        if (res.message) {
          chrome.storage.local.set({ API_TOKEN: apiKey.value }, () => {
            apiMessage.value = 'API Key salva com sucesso';
          });
        } else {
          apiMessage.value = res.error || 'Erro ao salvar API Key';
        }
      })
      .catch(() => {
        apiMessage.value = 'Erro ao salvar API Key';
      });
  });
}
</script>
<style scoped>
.popup-wrapper {
  min-width: 300px;
  max-width: 400px;
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
}
</style>
