<template>
  <div id="message" :class="messageType" v-if="message">{{ message }}</div>
  <div v-if="isLogin">
    <h1>Login</h1>
    <input v-model="loginEmail" type="email" placeholder="Email" />
    <input v-model="loginPassword" type="password" placeholder="Password" />
    <button @click="login">Login</button>
    <button @click="toggleForm">Cadastre-se</button>
  </div>
  <div v-else>
    <h1>Register</h1>
    <input v-model="registerUsername" type="text" placeholder="Username" />
    <input v-model="registerEmail" type="email" placeholder="Email" />
    <input v-model="registerPassword" type="password" placeholder="Password" />
    <button @click="register">Register</button>
    <button @click="toggleForm">Voltar ao login</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const API_BASE_URL = (window as any).API_BASE_URL

const loginEmail = ref('')
const loginPassword = ref('')
const registerUsername = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const message = ref('')
const messageType = ref('')
const isLogin = ref(true)

function showMessage(msg: string, success = false) {
  message.value = msg
  messageType.value = success ? 'success' : 'error'
}

function toggleForm() {
  isLogin.value = !isLogin.value
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
          setTimeout(() => {
            window.location.href = 'dashboard.html'
          }, 500)
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
            window.location.href = 'dashboard.html'
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
