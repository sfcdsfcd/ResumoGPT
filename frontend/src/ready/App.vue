<template>
  <div class="popup-wrapper ready-wrapper">
    <b-card class="text-center dashboard-card">
      <h2>Pronto! Agora é só resumir as coisas 😎</h2>
      <b-button variant="outline-primary" class="mt-3" @click="irParaDashboard">
        Alterar API Key
      </b-button>
    </b-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function irParaDashboard() {
  router.push('/dashboard')
}
</script>

<style scoped>
.ready-wrapper {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
