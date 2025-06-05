<template>
  <div class="popup-wrapper container mx-auto text-center p-3">
    <!-- BootstrapVue inputs and buttons provide consistent styling and better accessibility -->
    <div id="message" :class="messageType" v-if="message">{{ message }}</div>
    <!-- Using a BCard groups related fields with consistent padding and a subtle shadow, improving focus -->
    <b-card v-if="isLogin" class="mb-3">
      <h1>Login</h1>
      <b-form-input v-model="loginEmail" type="email" placeholder="Email" class="mb-3" />
      <b-form-input v-model="loginPassword" type="password" placeholder="Password" class="mb-3" />
      <!-- Utility classes keep actions aligned and spaced -->
      <div class="d-flex justify-content-between mb-3">
        <b-button variant="primary" @click="login">Login</b-button>
        <b-button variant="secondary" @click="toggleForm">Cadastre-se</b-button>
      </div>
      <b-button v-if="loginSuccess" variant="success" @click="openDashboard">Abrir Dashboard</b-button>
    </b-card>
    <b-card v-else class="mb-3">
      <h1>Register</h1>
      <b-form-input v-model="registerUsername" type="text" placeholder="Username" class="mb-3" />
      <b-form-input v-model="registerEmail" type="email" placeholder="Email" class="mb-3" />
      <b-form-input v-model="registerPassword" type="password" placeholder="Password" class="mb-3" />
      <!-- Buttons share space evenly on small screens -->
      <div class="d-flex justify-content-between">
        <b-button variant="primary" @click="register">Register</b-button>
        <b-button variant="secondary" @click="toggleForm">Voltar ao login</b-button>
      </div>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

function login() {
  fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  })
    .then(r => r.json())
    .then(data => {
      if (data.token) {
        chrome.storage.local.set({ JWT_TOKEN: data.token }, () => {
          showMessage('Login successful', true)
          loginSuccess.value = true
        })
      } else {
        showMessage(data.error || 'Login failed')
      }
    })
    .catch(() => showMessage('Login failed'))
}

function register() {
  fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify({
      username: registerUsername.value,
      email: registerEmail.value,
      password: registerPassword.value
    })
  })
    .then(r => r.json())
    .then(data => {
      if (data.token) {
        chrome.storage.local.set({ JWT_TOKEN: data.token }, () => {
          showMessage('Registered', true)
          setTimeout(() => {
            router.push('/dashboard.html')
          }, 500)
        })
      } else if (data.message) {
        showMessage(data.message, true)
      } else {
        showMessage(data.error || 'Register failed')
      }
    })
    .catch(() => showMessage('Register failed'))
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
