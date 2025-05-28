interface CompressionStats {
  originalSize: number;
  compressedSize: number;
}

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: string;
  scale?: number;
  mode?: string;
}

interface ProgressData {
  progress: number;
  fileName: string;
  status: string;
}

interface CompressionResult {
  compressedFile: File;
  stats: CompressionStats;
}

declare class PPTXCompressor {
  constructor(options?: CompressionOptions);
  compressPPTX(file: File, progressCallback?: (data: ProgressData) => void): Promise<CompressionResult>;
  destroy(): void;
}

export default PPTXCompressor; 