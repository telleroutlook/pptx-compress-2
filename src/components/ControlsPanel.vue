<template>
  <section class="controls-panel">
    <div class="control-group">
      <h3>Output Format</h3>
      <div class="format-buttons">
        <button 
          v-for="format in formats" 
          :key="format"
          :class="['btn', modelValue.format === format ? 'btn-primary' : 'btn-secondary']"
          @click="updateSettings('format', format)"
        >
          {{ format.toUpperCase() }}
        </button>
      </div>
      <div class="mode-description">
        <p v-if="modelValue.format === 'mp3'">
          <strong>MP3</strong>: Most popular format with good compression. Compatible with all devices and platforms.
        </p>
        <p v-else-if="modelValue.format === 'aac'">
          <strong>AAC</strong>: Better quality than MP3 at same bitrate. Used by Apple devices and streaming services.
        </p>
        <p v-else-if="modelValue.format === 'wav'">
          <strong>WAV</strong>: Uncompressed format with best quality but larger file size. Suitable for professional audio editing.
        </p>
      </div>
    </div>

    <div class="control-group">
      <h3>Compression Mode</h3>
      <div class="format-buttons">
        <button 
          v-for="mode in modes" 
          :key="mode"
          :class="['btn', modelValue.mode === mode ? 'btn-primary' : 'btn-secondary']"
          @click="updateSettings('mode', mode)"
        >
          {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
        </button>
      </div>
      <div class="mode-description">
        <p v-if="modelValue.mode === 'balanced'">
          <strong>Balanced Mode</strong>: Maintains good audio quality with moderate compression. Suitable for most audio files.
        </p>
        <p v-else-if="modelValue.mode === 'aggressive'">
          <strong>Aggressive Mode</strong>: Higher compression rate with slight quality loss. Limited to 2 channels maximum. Suitable for smaller file size requirements.
        </p>
        <p v-else-if="modelValue.mode === 'maximum'">
          <strong>Maximum Mode</strong>: Maximum compression with mono output. Suitable for minimum file size requirements.
        </p>
      </div>
    </div>

    <button class="compress-btn" @click="handleCompress">
      Compress Audio
    </button>
  </section>
</template>

<script setup lang="ts">
import type { Settings } from '../types';

const props = defineProps<{
  modelValue: Settings
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Settings): void
  (e: 'compress'): void
}>();

const formats = ['mp3', 'aac', 'wav'] as const;
const modes = ['balanced', 'aggressive', 'maximum'] as const;

const updateSettings = (key: keyof Settings, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};

const handleCompress = () => {
  emit('compress');
};
</script>

<style scoped>
.controls-panel {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
}

.control-group {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  margin-bottom: 20px;
}

.control-group h3 {
  color: #333;
  margin-bottom: 15px;
}

.format-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.mode-description {
  margin-top: 15px;
  color: #666;
  font-size: 0.9em;
}

.compress-btn {
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white !important;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  display: block;
  text-align: center;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
}

.compress-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(102, 126, 234, 0.3);
  background: linear-gradient(to right, #5a6fd6, #6a3f9d);
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.btn-primary {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
}

.btn-primary:hover {
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}
</style>