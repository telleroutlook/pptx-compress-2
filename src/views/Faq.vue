<template>
  <div class="container">
    <SeoHead
      title="FAQ - Frequently Asked Questions About File Compression"
      description="Find answers to common questions about our PPTX and audio compression services. Learn about file formats, compression quality, security, and more."
      type="FAQPage"
    />
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Frequently Asked Questions</h1>
      <p class="subtitle">Find answers to common questions about our compression services</p>
    </header>

    <div class="max-w-3xl mx-auto">
      <div class="space-y-6">
        <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-3 text-gray-800">{{ faq.question }}</h2>
          <p class="text-gray-600">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SeoHead from '../components/SeoHead.vue';

const faqs = [
  {
    question: "How does the PPTX compression work?",
    answer: "Our PPTX compression tool uses advanced algorithms to optimize images, remove redundant data, and compress media files while maintaining the visual quality of your presentation. The process is completely automated and secure."
  },
  {
    question: "How does the audio compression work?",
    answer: "Our audio compression tool supports various audio formats and uses advanced algorithms to reduce file size while maintaining sound quality. It optimizes audio streams, removes unnecessary metadata, and applies efficient compression techniques."
  },
  {
    question: "Is my data safe?",
    answer: "Yes, your data is completely secure. We process all files locally in your browser, and no files are uploaded to our servers. Your privacy is our top priority."
  },
  {
    question: "What file formats are supported?",
    answer: "We support PowerPoint files (.pptx) and various audio formats including MP3, WAV, and M4A. The tool is designed to handle most common presentation and audio file types."
  },
  {
    question: "How much can I reduce my file size?",
    answer: "The compression ratio varies depending on the content of your files. For PPTX files, you can expect a reduction of 30-70% while maintaining good quality. For audio files, the compression ratio typically ranges from 20-60% depending on the original format and quality settings."
  },
  {
    question: "Is there a file size limit?",
    answer: "Yes, there is a limit of 500MB per file for both PPTX and audio files to ensure optimal performance. For larger files, we recommend splitting them into smaller parts before compression."
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation is required. Our tool runs entirely in your web browser. Just visit our website and start compressing your files immediately."
  },
  {
    question: "Will the compressed audio maintain the same quality?",
    answer: "Yes, our audio compression algorithm is designed to maintain the best possible sound quality while reducing file size. The compression focuses on optimizing audio streams and removing redundant data without significantly affecting the listening experience."
  }
];
</script>

<style scoped>
.subtitle {
  @apply text-gray-600 text-lg;
}
</style> 