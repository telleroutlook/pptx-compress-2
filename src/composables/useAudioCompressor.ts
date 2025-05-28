import JSZip from 'jszip';
import type { Settings, CompressedResult } from '../types';

export function useAudioCompressor() {
  const isBrowser = typeof window !== 'undefined';
  const eventTarget = new EventTarget();
  const CLEAR_EVENT = 'clear-results';

  const compressAudio = async (
    file: File, 
    settings: Settings,
    onProgress: (progress: number) => void
  ): Promise<CompressedResult> => {
    if (!isBrowser) {
      throw new Error('Audio compression is only available in browser environment');
    }

    return new Promise(async (resolve, reject) => {
      try {
        onProgress(0);
        
        let worker: Worker;
        try {
          const workerUrl = new URL('../workers/audioCompressionWorker.js', import.meta.url);
          worker = new Worker(workerUrl);
          onProgress(5);
        } catch (err) {
          reject(new Error('Failed to initialize audio compression worker'));
          return;
        }
        
        worker.onmessage = (e) => {
          const data = e.data;
          
          switch (data.type) {
            case 'progress':
              onProgress(data.progress);
              break;
              
            case 'complete':
              onProgress(100);
              resolve({
                name: `${file.name.split('.')[0]}_compressed.${data.result.outputFormat}`,
                size: data.result.blob.size,
                blob: data.result.blob,
                type: `audio/${data.result.outputFormat}`,
                originalSize: file.size,
                duration: data.result.duration,
                sampleRate: data.result.sampleRate,
                channels: data.result.channels,
                outputFormat: data.result.outputFormat,
                compressionRatio: ((file.size - data.result.blob.size) / file.size * 100).toFixed(1)
              });
              worker.terminate();
              break;
              
            case 'error':
              reject(new Error(data.error));
              worker.terminate();
              break;
          }
        };
        
        worker.onerror = (error) => {
          reject(new Error(`Worker error: ${error.message}`));
          worker.terminate();
        };
        
        const audioContext = new AudioContext();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        onProgress(25);
        
        const leftChannel = audioBuffer.getChannelData(0);
        const rightChannel = audioBuffer.numberOfChannels > 1 ? 
          audioBuffer.getChannelData(1) : 
          leftChannel;
        
        worker.postMessage({
          leftChannel,
          rightChannel,
          settings: {
            ...settings,
            originalSize: file.size,
            channels: audioBuffer.numberOfChannels,
            sampleRate: audioBuffer.sampleRate,
            duration: audioBuffer.duration
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const downloadAll = async (results: CompressedResult[]) => {
    const zip = new JSZip();
    
    results.forEach(result => {
      zip.file(`${result.name.split('.')[0]}_compressed.${result.outputFormat}`, result.blob);
    });
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compressed_audio_files.zip';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    eventTarget.dispatchEvent(new Event(CLEAR_EVENT));
  };

  return {
    compressAudio,
    downloadAll,
    clearAll,
    eventTarget,
    CLEAR_EVENT
  };
} 