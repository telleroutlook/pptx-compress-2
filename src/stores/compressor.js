import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PPTXCompressor from '../utils/PPTXCompressor';

export const useCompressorStore = defineStore('compressor', () => {
  const compressor = new PPTXCompressor();
  const isProcessing = ref(false);
  const progress = ref(0);
  const currentFile = ref('');
  const status = ref('');
  const results = ref(null);

  const hasResults = computed(() => results.value !== null);

  async function processFile(file) {
    try {
      isProcessing.value = true;
      results.value = null;

      const result = await compressor.compressPPTX(file, (progressData) => {
        progress.value = progressData.progress;
        currentFile.value = progressData.fileName;
        status.value = progressData.status;
      });

      results.value = result;
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    isProcessing,
    progress,
    currentFile,
    status,
    results,
    hasResults,
    processFile
  };
});