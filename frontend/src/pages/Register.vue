<template>
  <div class="popup-wrapper d-flex align-items-center justify-content-center">
    <b-card class="auth-card shadow-sm">
      <h2 class="text-center mb-4">Cadastre-se</h2>
      <b-form-input v-model="registerUsername" placeholder="Usuário" class="mb-3" />
      <b-form-input v-model="registerEmail" type="email" placeholder="Email" class="mb-3" />
      <b-form-input v-model="registerPassword" type="password" placeholder="Senha" class="mb-3" />
      <div class="d-flex justify-content-between mb-3">
        <b-button variant="primary" @click="registerUser">
          <i class="bi bi-person-check" />
          <span class="ms-1">Registrar</span>
        </b-button>
        <b-button variant="secondary" @click="router.push('/login')">
          <i class="bi bi-arrow-left" />
          <span class="ms-1">Voltar</span>
        </b-button>
      </div>
      <div v-if="message" :class="messageType" class="mt-3 text-center">{{ message }}</div>
    </b-card>
  </div>
</template>

<script setup lang="ts">
/// <reference types="chrome" />
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const API_BASE_URL = (window as any).API_BASE_URL

const registerUsername = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const message = ref('')
const messageType = ref('')
const router = useRouter()

function showMessage(msg: string, success = false) {
  message.value = msg
  messageType.value = success ? 'success' : 'error'
}

async function verifyApiKeyAndRedirect(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      mode: 'cors'
    })
    if (!res.ok) {
      showMessage('Sessão expirada')
      return
    }
    const user = await res.json()
    const key = user?.api_key || user?.apiKey
    if (key) {
      router.push('/ready')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Falha ao verificar apiKey', err)
    showMessage('Erro ao verificar apiKey')
  }
}

async function registerUser() {
  try {
    const r = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        username: registerUsername.value,
        email: registerEmail.value,
        password: registerPassword.value
      })
    })
    const data = await r.json()
    if (data.token) {
      chrome.storage.local.set({ JWT_TOKEN: data.token }, async () => {
        await verifyApiKeyAndRedirect(data.token)
      })
    } else if (data.message) {
      showMessage(data.message, true)
    } else {
      showMessage(data.error || 'Register failed')
    }
  } catch {
    showMessage('Register failed')
  }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
.popup-wrapper {
  width: 360px;
  margin: 0 auto;
  font-family: 'Roboto', 'Open Sans', sans-serif;
}
.auth-card {
  border-radius: 0.75rem;
}
</style>

