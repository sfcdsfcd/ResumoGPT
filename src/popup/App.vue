<template>
  <div>
    <div id="message" :class="messageClass">{{ message }}</div>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleLogin">Login</button>
  </div>
</template>

<script>
export default {
  name: 'PopupApp',
  data() {
    return {
      email: '',
      password: '',
      message: '',
      success: false,
    };
  },
  computed: {
    messageClass() {
      return this.success ? 'success' : 'error';
    },
  },
  methods: {
    async handleLogin() {
      try {
        const res = await fetch(`${window.API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        const data = await res.json();
        if (data.token) {
          chrome.storage.local.set({ JWT_TOKEN: data.token }, () => {
            this.message = 'Login successful';
            this.success = true;
            chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
          });
        } else {
          this.message = data.error || 'Login failed';
          this.success = false;
        }
      } catch (e) {
        this.message = 'Login failed';
        this.success = false;
      }
    }
  }
};
</script>

<style scoped>
#message {
  margin-bottom: 10px;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
