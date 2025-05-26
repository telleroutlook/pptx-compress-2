import JSZip from 'jszip';

class PPTXProcessor {
    constructor() {
        this.mediaFiles = [];
        this.compressedMediaFiles = [];
        this.originalPptxSize = 0;
        this.compressedPptxSize = 0;
    }

    async extractMediaFiles(pptxFile) {
        try {
            const zip = await JSZip.loadAsync(pptxFile);
            this.mediaFiles = [];
            
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

    async repackPPTX(originalPptx, compressedMedia) {
        try {
            const zip = await JSZip.loadAsync(originalPptx);
            
            this.originalPptxSize = originalPptx.size;
            
            for (const media of compressedMedia) {
                if (media.compressedBlob) {
                    zip.file(media.path, media.compressedBlob);
                }
            }
            
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            });
            
            this.compressedPptxSize = content.size;
            
            return content;
        } catch (error) {
            throw new Error(`Failed to repack PPTX: ${error.message}`);
        }
    }

    getCompressionStats() {
        const originalSize = this.mediaFiles.reduce((sum, media) => sum + media.file.size, 0);
        const compressedSize = this.compressedMediaFiles.reduce((sum, media) => 
            sum + (media.compressedBlob ? media.compressedBlob.size : media.file.size), 0);
        
        const totalCompressionRatio = this.originalPptxSize > 0 ? 
            ((this.originalPptxSize - this.compressedPptxSize) / this.originalPptxSize * 100).toFixed(1) : 0;
        
        return {
            totalFiles: this.mediaFiles.length,
            originalSize: originalSize,
            compressedSize: compressedSize,
            savedSize: originalSize - compressedSize,
            compressionRatio: totalCompressionRatio
        };
    }

    destroy() {
        this.mediaFiles = [];
        this.compressedMediaFiles = [];
    }
}

export default PPTXProcessor;