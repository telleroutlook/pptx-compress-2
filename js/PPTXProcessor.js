class PPTXProcessor {
    constructor() {
        this.mediaFiles = [];
        this.compressedMediaFiles = [];
    }

    /**
     * 解压 PPTX 文件并提取媒体文件
     * @param {File} pptxFile - PPTX 文件
     * @returns {Promise<Array>} 媒体文件数组
     */
    async extractMediaFiles(pptxFile) {
        try {
            const zip = await JSZip.loadAsync(pptxFile);
            this.mediaFiles = [];
            
            // 遍历所有文件，找到媒体文件
            for (const [path, file] of Object.entries(zip.files)) {
                if (path.startsWith('ppt/media/') && !file.dir) {
                    const blob = await file.async('blob');
                    const mediaFile = new File([blob], path.split('/').pop(), {
                        type: blob.type,
                        lastModified: new Date().getTime()
                    });
                    this.mediaFiles.push({
                        path: path,
                        file: mediaFile
                    });
                }
            }
            
            return this.mediaFiles;
        } catch (error) {
            throw new Error(`Failed to extract media files: ${error.message}`);
        }
    }

    /**
     * 使用压缩后的媒体文件重新打包 PPTX
     * @param {File} originalPptx - 原始 PPTX 文件
     * @param {Array} compressedMedia - 压缩后的媒体文件数组
     * @returns {Promise<Blob>} 压缩后的 PPTX 文件
     */
    async repackPPTX(originalPptx, compressedMedia) {
        try {
            const zip = await JSZip.loadAsync(originalPptx);
            
            // 更新压缩后的媒体文件
            for (const media of compressedMedia) {
                if (media.compressedBlob) {
                    zip.file(media.path, media.compressedBlob);
                }
            }
            
            // 生成新的 PPTX 文件
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            });
            
            return content;
        } catch (error) {
            throw new Error(`Failed to repack PPTX: ${error.message}`);
        }
    }

    /**
     * 获取压缩统计信息
     * @returns {Object} 压缩统计信息
     */
    getCompressionStats() {
        const originalSize = this.mediaFiles.reduce((sum, media) => sum + media.file.size, 0);
        const compressedSize = this.compressedMediaFiles.reduce((sum, media) => 
            sum + (media.compressedBlob ? media.compressedBlob.size : media.file.size), 0);
        
        return {
            totalFiles: this.mediaFiles.length,
            originalSize: originalSize,
            compressedSize: compressedSize,
            savedSize: originalSize - compressedSize,
            compressionRatio: originalSize > 0 ? 
                ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0
        };
    }

    /**
     * 清理资源
     */
    destroy() {
        this.mediaFiles = [];
        this.compressedMediaFiles = [];
    }
}

export default PPTXProcessor; 