<template>
  <div class="container">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PPTX Compressor</h1>
      <p class="subtitle">Compress your PowerPoint files while maintaining quality</p>
    </header>
    <FileUpload />
    <ProgressBar v-if="showProgress" />
    <CompressionResults v-if="showResults" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCompressorStore } from '../stores/compressor';
import FileUpload from '../components/FileUpload.vue';
import ProgressBar from '../components/ProgressBar.vue';
import CompressionResults from '../components/CompressionResults.vue';

const store = useCompressorStore();
const showProgress = computed(() => store.isProcessing);
const showResults = computed(() => store.results !== null);
</script> 