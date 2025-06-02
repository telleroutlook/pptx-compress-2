<template>
  <div ref="imageContainer" class="lazy-image-container">
    <img
      v-if="isLoaded"
      :src="src"
      :alt="alt"
      :class="['lazy-image', { 'fade-in': isLoaded }]"
      @load="onImageLoad"
    />
    <div v-else class="lazy-image-placeholder" :style="{ paddingBottom: `${aspectRatio}%` }">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLazyLoad } from '@/composables/useLazyLoad';

const props = defineProps<{
  src: string;
  alt: string;
  aspectRatio?: number;
}>();

const imageContainer = ref<HTMLElement | null>(null);
const isLoaded = ref(false);
const { observe } = useLazyLoad();

const onImageLoad = () => {
  isLoaded.value = true;
};

onMounted(() => {
  if (imageContainer.value) {
    observe(imageContainer.value, () => {
      // Image will be loaded when it becomes visible
      const img = new Image();
      img.src = props.src;
      img.onload = () => {
        isLoaded.value = true;
      };
    });
  }
});
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image.fade-in {
  opacity: 1;
}

.lazy-image-placeholder {
  position: relative;
  background-color: #f0f0f0;
  width: 100%;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style> 