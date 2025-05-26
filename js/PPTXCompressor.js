import PPTXProcessor from './PPTXProcessor.js';
import UniversalImageCompressor from './UniversalImageCompressor.js';

class PPTXCompressor {
    constructor(options = {}) {
        this.pptxProcessor = new PPTXProcessor();
        this.imageCompressor = new UniversalImageCompressor(options);
        this.compressionOptions = {
            format: options.format || 'jpeg',
            quality: options.quality || 0.7,
            maxWidth: options.maxWidth || 1600,
            maxHeight: options.maxHeight || 1200,
            scale: options.scale || 0.9,
            mode: options.mode || 'maximum'
        };
    }

    /**
     * 压缩 PPTX 文件
     * @param {File} pptxFile - PPTX 文件
     * @param {Function} progressCallback - 进度回调函数
     * @returns {Promise<Object>} 压缩结果
     */
    async compressPPTX(pptxFile, progressCallback = null) {
        try {
            // 1. 提取媒体文件
            if (progressCallback) {
                progressCallback({
                    stage: 'extracting',
                    progress: 0,
                    message: 'Extracting media files...'
                });
            }

            const mediaFiles = await this.pptxProcessor.extractMediaFiles(pptxFile);
            
            if (mediaFiles.length === 0) {
                throw new Error('No media files found in PPTX');
            }

            // 2. 压缩图片
            if (progressCallback) {
                progressCallback({
                    stage: 'compressing',
                    progress: 10,
                    message: 'Compressing images...'
                });
            }

            const imageFiles = mediaFiles.map(m => m.file);
            const compressedResults = await this.imageCompressor.compressBatch(
                imageFiles,
                this.compressionOptions,
                (progress) => {
                    if (progressCallback) {
                        progressCallback({
                            stage: 'compressing',
                            progress: 10 + (progress.progress * 0.7),
                            message: `Compressing image ${progress.currentFile}/${progress.totalFiles}...`
                        });
                    }
                }
            );

            // 3. 更新压缩后的媒体文件
            this.pptxProcessor.compressedMediaFiles = mediaFiles.map((media, index) => ({
                ...media,
                compressedBlob: compressedResults[index].blob
            }));

            // 4. 重新打包 PPTX
            if (progressCallback) {
                progressCallback({
                    stage: 'repacking',
                    progress: 80,
                    message: 'Repacking PPTX...'
                });
            }

            const compressedPPTX = await this.pptxProcessor.repackPPTX(
                pptxFile,
                this.pptxProcessor.compressedMediaFiles
            );

            // 5. 获取压缩统计信息
            const stats = this.pptxProcessor.getCompressionStats();

            if (progressCallback) {
                progressCallback({
                    stage: 'completed',
                    progress: 100,
                    message: 'Compression completed'
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
                    stage: 'error',
                    progress: 0,
                    message: error.message
                });
            }
            throw error;
        }
    }

    /**
     * 更新压缩选项
     * @param {Object} newOptions - 新的压缩选项
     */
    updateOptions(newOptions) {
        this.compressionOptions = { ...this.compressionOptions, ...newOptions };
        this.imageCompressor.updateOptions(this.compressionOptions);
    }

    /**
     * 清理资源
     */
    destroy() {
        this.pptxProcessor.destroy();
        this.imageCompressor.destroy();
    }
}

export default PPTXCompressor; 