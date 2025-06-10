<template>
  <div class="ready-wrapper container mx-auto d-flex align-items-center justify-content-center">
    <b-card class="text-center">
      <h2>Pronto! Agora é só resumir as coisas 😎</h2>
      <b-button variant="outline-primary" class="mt-3" @click="irParaDashboard">
        Alterar API Key
      </b-button>
    </b-card>
  </div>
</template>

<script setup lang="ts">
function irParaDashboard() {
  window.location.href = 'dashboard.html'
}
</script>

<style scoped>
.ready-wrapper {
  max-width: 400px;
  margin: auto;
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
