<template>
  <div class="history-wrapper container mx-auto">
    <b-card>
      <h2>Histórico de Resumos</h2>
      <div v-if="items.length === 0">Nenhum resumo salvo</div>
      <div v-for="it in items" :key="it.timestamp" class="mb-3">
        <div class="small text-muted">
          {{ new Date(it.timestamp).toLocaleString() }} -
          <a :href="it.url" target="_blank">{{ it.url }}</a>
        </div>
        <div class="fw-bold">{{ it.original }}</div>
        <div>{{ it.resumo }}</div>
        <hr />
      </div>
      <b-button variant="primary" @click="voltar">Voltar</b-button>
    </b-card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
interface Item {
  original: string
  resumo: string
  url: string
  timestamp: number
}
const items = ref<Item[]>([])
const router = useRouter()

onMounted(() => {
  chrome.storage.local.get('SUMMARY_HISTORY', data => {
    items.value = data.SUMMARY_HISTORY || []
  })
})
function voltar() {
  router.back()
}
</script>
<style scoped>
.history-wrapper {
  max-width: 400px;
  margin: auto;
  max-height: 600px;
  overflow-y: auto;
}
</style>
