interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: string;
  scale?: number;
  mode?: string;
}

interface CompressionResult {
  compressedFile: File;
  stats: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  };
}

interface ProgressData {
  progress: number;
  fileName: string;
  status: string;
}

declare class PPTXCompressor {
  constructor(options?: CompressionOptions);
  compressPPTX(file: File, progressCallback?: (data: ProgressData) => void): Promise<CompressionResult>;
  destroy(): void;
}

export default PPTXCompressor; 