import { Store } from 'pinia';

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

interface CompressorState {
  isProcessing: boolean;
  progress: number;
  currentFile: string;
  status: string;
  results: CompressionResult | null;
  hasResults: boolean;
  processFile: (file: File) => Promise<void>;
}

export const useCompressorStore: () => Store<'compressor', CompressorState>; 