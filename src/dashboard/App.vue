<template>
  <!-- BootstrapVue components unify the styling of inputs and buttons -->
  <!-- BCard groups dashboard actions for a cleaner layout -->
  <b-card>
    <h1>Dashboard</h1>
    <div id="info">{{ info }}</div>
    <b-form-input v-model="apiKey" id="api-key" type="text" placeholder="API Key" class="mb-3" />
    <!-- Actions aligned with Bootstrap utility classes -->
    <div class="d-flex justify-content-between mb-3">
      <!-- Variant colors draw attention to primary and destructive actions -->
      <b-button id="save-api-key" variant="primary" @click="saveApiKey">Salvar API Key</b-button>
      <b-button id="logout" variant="danger" @click="logout">Logout</b-button>
    </div>
    <div id="api-message" class="success" v-if="apiMessage">{{ apiMessage }}</div>
  </b-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const info = ref('')
const apiKey = ref('')
const apiMessage = ref('')
const router = useRouter()

onMounted(() => {
  chrome.storage.local.get('JWT_TOKEN', data => {
    if (!data.JWT_TOKEN) {
      router.push('/popup.html')
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
      body: JSON.stringify({ apiKey: apiKey.value })
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
