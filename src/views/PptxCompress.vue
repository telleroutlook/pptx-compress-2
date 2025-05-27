<template>
  <div class="container">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Advanced PPTX Compressor
      </h1>
      <p class="text-gray-600">Compress your PowerPoint files by optimizing embedded images</p>
    </header>

    <FeatureInfo />
    <FileUpload />
    <ProgressBar v-if="showProgress" />
    <CompressionResults v-if="showResults" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCompressorStore } from '../stores/compressor';
import FeatureInfo from '../components/FeatureInfo.vue';
import FileUpload from '../components/FileUpload.vue';
import ProgressBar from '../components/ProgressBar.vue';
import CompressionResults from '../components/CompressionResults.vue';

const store = useCompressorStore();
const showProgress = computed(() => store.isProcessing);
const showResults = computed(() => store.hasResults);
</script> 