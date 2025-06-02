import { ref, onMounted, onUnmounted } from 'vue';

export function useLazyLoad() {
  const observer = ref<IntersectionObserver | null>(null);
  const observedElements = ref<Set<Element>>(new Set());

  const observe = (element: Element, callback: () => void) => {
    if (!observer.value) {
      observer.value = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            if (observer.value) {
              observer.value.unobserve(entry.target);
              observedElements.value.delete(entry.target);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
    }

    observer.value.observe(element);
    observedElements.value.add(element);
  };

  onUnmounted(() => {
    if (observer.value) {
      observedElements.value.forEach(element => {
        observer.value?.unobserve(element);
      });
      observer.value.disconnect();
      observer.value = null;
      observedElements.value.clear();
    }
  });

  return {
    observe
  };
} 