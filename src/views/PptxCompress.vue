<template>
  <div class="container">
    <SeoHead
      title="PPTX Compressor - Free Online PowerPoint File Compression"
      description="Free online PPTX compressor tool. Reduce PowerPoint file size while maintaining quality. Fast, secure, and easy to use. No registration required."
      type="WebApplication"
    />
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PPTX Compressor</h1>
      <p class="subtitle">Shrink your presentations without compromising visual excellence</p>
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
import SeoHead from '../components/SeoHead.vue';

const store = useCompressorStore();
const showProgress = computed(() => store.isProcessing);
const showResults = computed(() => store.results !== null);
</script> 