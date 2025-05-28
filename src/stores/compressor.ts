import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PPTXCompressor from '../utils/PPTXCompressor.js';

interface ProgressData {
  progress: number;
  fileName: string;
  status: string;
}

interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  fileName: string;
  downloadUrl: string;
}

export const useCompressorStore = defineStore('compressor', () => {
  const compressor = new PPTXCompressor();
  const isProcessing = ref(false);
  const progress = ref(0);
  const currentFile = ref('');
  const status = ref('');
  const results = ref<CompressionResult | null>(null);

  const hasResults = computed(() => results.value !== null);

  async function processFile(file: File) {
    try {
      isProcessing.value = true;
      results.value = null;
      progress.value = 0;
      currentFile.value = '';
      status.value = '';

      const result = await compressor.compressPPTX(file, (progressData: ProgressData) => {
        progress.value = progressData.progress;
        currentFile.value = progressData.fileName;
        status.value = progressData.status;
      });

      results.value = result;
    } catch (error: unknown) {
      console.error('Compression error:', error);
      status.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      throw error;
    } finally {
      isProcessing.value = false;
      if (!results.value) {
        progress.value = 0;
        currentFile.value = '';
      }
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