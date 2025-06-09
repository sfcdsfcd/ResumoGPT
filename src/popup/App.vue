<template>
  <div class="popup-wrapper d-flex align-items-center justify-content-center">
    <b-card class="auth-card shadow-sm">
      <h2 class="text-center mb-4">{{ isLogin ? 'Login' : 'Cadastre-se' }}</h2>
      <b-form-input
        v-if="isLogin"
        v-model="loginEmail"
        type="email"
        placeholder="Email"
        class="mb-3"
      />
      <b-form-input
        v-if="isLogin"
        v-model="loginPassword"
        type="password"
        placeholder="Senha"
        class="mb-3"
      />
      <b-form-input
        v-if="!isLogin"
        v-model="registerUsername"
        placeholder="Usuário"
        class="mb-3"
      />
      <b-form-input
        v-if="!isLogin"
        v-model="registerEmail"
        type="email"
        placeholder="Email"
        class="mb-3"
      />
      <b-form-input
        v-if="!isLogin"
        v-model="registerPassword"
        type="password"
        placeholder="Senha"
        class="mb-3"
      />
      <div class="d-flex justify-content-between mb-3">
        <b-button variant="primary" @click="isLogin ? login() : register()">
          <i class="bi" :class="isLogin ? 'bi-box-arrow-in-right' : 'bi-person-check'" />
          <span class="ms-1">{{ isLogin ? 'Login' : 'Registrar' }}</span>
        </b-button>
        <b-button variant="secondary" @click="toggleForm">
          <i class="bi" :class="isLogin ? 'bi-person-plus' : 'bi-arrow-left'" />
          <span class="ms-1">{{ isLogin ? 'Cadastre-se' : 'Voltar' }}</span>
        </b-button>
      </div>
      <b-button
        v-if="loginSuccess"
        variant="success"
        class="w-100"
        @click="openDashboard"
      >
        Abrir Dashboard
      </b-button>
      <div v-if="message" :class="messageType" class="mt-3 text-center">{{ message }}</div>
    </b-card>
  </div>
</template>

<script setup lang="ts">
/// <reference types="chrome" />
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const API_BASE_URL = (window as any).API_BASE_URL

const loginEmail = ref('')
const loginPassword = ref('')
const registerUsername = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const message = ref('')
const messageType = ref('')
const isLogin = ref(true)
const loginSuccess = ref(false)
const router = useRouter()

function showMessage(msg: string, success = false) {
  message.value = msg
  messageType.value = success ? 'success' : 'error'
}

function toggleForm() {
  isLogin.value = !isLogin.value
}

function openDashboard() {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') })
  window.close()
}
async function verifyApiKeyAndRedirect(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      mode: 'cors'
    })
    if (!res.ok) {
      chrome.storage.local.remove('JWT_TOKEN')
      showMessage('Sessão expirada')
      return
    }
    const user = await res.json()
    const key = user?.api_key || user?.apiKey
    if (key) {
      location.href = chrome.runtime.getURL('ready.html')
    } else {
      location.href = chrome.runtime.getURL('dashboard.html')
    }
  } catch (err) {
    console.error('Falha ao verificar apiKey', err)
    showMessage('Erro ao verificar apiKey')
  }
}
function checkAuth() {
  chrome.storage.local.get('JWT_TOKEN', async (result) => {
    const token = result.JWT_TOKEN
    if (!token) return
    await verifyApiKeyAndRedirect(token)
  })
}
onMounted(() => {
  checkAuth()
})

async function login() {
  try {
    const r = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value
      })
    })
    const data = await r.json()
    if (data.token) {
      chrome.storage.local.set({ JWT_TOKEN: data.token }, async () => {
        await verifyApiKeyAndRedirect(data.token)
      })
    } else {
      showMessage(data.error || 'Login failed')
    }
  } catch {
    showMessage('Login failed')
  }
}

async function register() {
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
