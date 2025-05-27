<template>
  <section class="progress-bar-section bg-white rounded-xl p-8 mb-8 shadow-lg transform transition-all duration-300">
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <div class="text-xl font-semibold text-gray-800">Processing Progress</div>
        <div class="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {{ progressPercentage }}%
        </div>
      </div>
      <div class="h-4 bg-primary-light/20 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        >
          <div class="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div class="text-base text-gray-600 truncate max-w-[60%]" :title="currentFile">{{ currentFile }}</div>
      <div class="text-base font-medium" :class="statusColor">{{ status }}</div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useCompressorStore } from '../stores/compressor';

const store = useCompressorStore();

const progressPercentage = computed(() => Math.round(store.progress * 100));
const currentFile = computed(() => store.currentFile);
const status = computed(() => store.status);

const statusColor = computed(() => {
  if (status.value === 'Completed') return 'text-green-600';
  if (status.value.includes('Error')) return 'text-red-600';
  return 'text-primary';
});
</script>

<style>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>