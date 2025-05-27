import PPTXProcessor from './PPTXProcessor.js';
import UniversalImageCompressor from './UniversalImageCompressor.js';

class PPTXCompressor {
    constructor(options = {}) {
        this.compressionOptions = {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.8,
            format: 'jpeg',
            scale: 1,
            mode: 'balanced',
            ...options
        };
        this.pptxProcessor = new PPTXProcessor();
        this.imageCompressor = new UniversalImageCompressor(this.compressionOptions);
    }

    async compressPPTX(pptxFile, progressCallback = null) {
        try {
            if (progressCallback) {
                progressCallback({
                    progress: 0.05,
                    fileName: 'Extracting media files',
                    status: 'Extracting...'
                });
            }

            const mediaFiles = await this.pptxProcessor.extractMediaFiles(pptxFile);
            
            if (mediaFiles.length === 0) {
                throw new Error('No media files found in PPTX');
            }

            if (progressCallback) {
                progressCallback({
                    progress: 0.1,
                    fileName: 'Starting compression',
                    status: 'Preparing...'
                });
            }

            const imageFiles = mediaFiles.map(m => m.file);
            const compressedResults = await this.imageCompressor.compressBatch(
                imageFiles,
                this.compressionOptions,
                (progress) => {
                    if (progressCallback) {
                        const currentFile = progress.currentFile || 0;
                        const totalFiles = progress.totalFiles || imageFiles.length;
                        const fileName = progress.fileName || `Image ${currentFile} of ${totalFiles}`;
                        const stageProgress = 0.1 + (progress.progress * 0.7);
                        
                        progressCallback({
                            progress: stageProgress,
                            fileName: fileName,
                            status: 'Compressing...'
                        });
                    }
                }
            );

            if (progressCallback) {
                progressCallback({
                    progress: 0.8,
                    fileName: 'Updating media files',
                    status: 'Updating...'
                });
            }

            this.pptxProcessor.compressedMediaFiles = mediaFiles.map((media, index) => ({
                ...media,
                compressedBlob: compressedResults[index].blob
            }));

            if (progressCallback) {
                progressCallback({
                    progress: 0.9,
                    fileName: 'Repacking PPTX',
                    status: 'Repacking...'
                });
            }

            const compressedPPTX = await this.pptxProcessor.repackPPTX(
                pptxFile,
                this.pptxProcessor.compressedMediaFiles
            );

            const stats = this.pptxProcessor.getCompressionStats();

            if (progressCallback) {
                progressCallback({
                    progress: 1,
                    fileName: 'Compression completed',
                    status: 'Completed'
                });
            }

            return {
                compressedFile: new File([compressedPPTX], 
                    pptxFile.name.replace('.pptx', '_compressed.pptx'),
                    { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
                ),
                stats: stats
            };

        } catch (error) {
            if (progressCallback) {
                progressCallback({
                    progress: 0,
                    fileName: 'Error occurred',
                    status: error.message
                });
            }
            throw error;
        }
    }

    destroy() {
        this.pptxProcessor.destroy();
        this.imageCompressor.destroy();
    }
}

export default PPTXCompressor;