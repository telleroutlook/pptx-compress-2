// 通用图片压缩模块
class UniversalImageCompressor {
    constructor(options = {}) {
        this.options = {
            format: options.format || 'jpeg',
            quality: options.quality || 0.8,
            maxWidth: options.maxWidth || 1600,
            maxHeight: options.maxHeight || 1200,
            scale: options.scale || 1,
            mode: options.mode || 'aggressive',
            preserveMetadata: options.preserveMetadata || false
        };
        
        this.worker = this.createCompressionWorker();
        this.compressionQueue = [];
        this.isProcessing = false;
    }

    createCompressionWorker() {
        return new Worker(URL.createObjectURL(new Blob([`
            self.onmessage = async function(e) {
                const { imageData, settings } = e.data;
                try {
                    const response = await fetch(imageData);
                    if (!response.ok) throw new Error('Failed to fetch image data');
                    
                    const bitmap = await createImageBitmap(await response.blob());
                    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) throw new Error('Failed to get canvas context');
                    
                    ctx.drawImage(bitmap, 0, 0);
                    
                    let width = bitmap.width;
                    let height = bitmap.height;
                    
                    // 尺寸限制
                    if (width > settings.maxWidth) {
                        height = (settings.maxWidth * height) / width;
                        width = settings.maxWidth;
                    }
                    if (height > settings.maxHeight) {
                        width = (settings.maxHeight * width) / height;
                        height = settings.maxHeight;
                    }
                    
                    // 缩放处理
                    width = Math.max(1, Math.round(width * settings.scale));
                    height = Math.max(1, Math.round(height * settings.scale));
                    
                    const resizedCanvas = new OffscreenCanvas(width, height);
                    const resizedCtx = resizedCanvas.getContext('2d');
                    
                    if (!resizedCtx) throw new Error('Failed to get resized canvas context');
                    
                    resizedCtx.drawImage(bitmap, 0, 0, width, height);
                    
                    // 质量调整
                    let quality = Math.max(0.1, Math.min(1, settings.quality));
                    if (settings.mode === 'aggressive') {
                        quality *= 0.8;
                    } else if (settings.mode === 'maximum') {
                        quality *= 0.6;
                    }
                    
                    const blob = await resizedCanvas.convertToBlob({ 
                        type: 'image/' + settings.format, 
                        quality: quality 
                    });
                    
                    bitmap.close();
                    
                    self.postMessage({
                        blob: blob,
                        width: width,
                        height: height,
                        originalSize: settings.originalSize
                    });
                } catch (error) {
                    self.postMessage({ error: error.message });
                }
            };
        `], { type: 'text/javascript' })));
    }

    /**
     * 压缩单个图片文件
     * @param {File|Blob} file - 图片文件
     * @param {Object} settings - 压缩设置
     * @returns {Promise<Object>} 压缩结果
     */
    async compressImage(file, settings = {}) {
        const compressionSettings = { ...this.options, ...settings, originalSize: file.size };
        
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Compression timeout'));
            }, 30000);

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    this.worker.postMessage({
                        imageData: e.target.result,
                        settings: compressionSettings
                    });

                    const handleMessage = (event) => {
                        clearTimeout(timeout);
                        this.worker.removeEventListener('message', handleMessage);

                        if (event.data.error) {
                            reject(new Error(event.data.error));
                        } else {
                            const { blob, width, height } = event.data;
                            if (!blob) {
                                reject(new Error('No blob received from worker'));
                                return;
                            }

                            resolve({
                                name: file.name || 'compressed_image',
                                size: blob.size,
                                blob: blob,
                                originalSize: file.size,
                                width: width,
                                height: height,
                                compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1)
                            });
                        }
                    };

                    this.worker.addEventListener('message', handleMessage);
                } catch (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
            };

            reader.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * 批量压缩图片
     * @param {Array} files - 图片文件数组
     * @param {Object} settings - 压缩设置
     * @param {Function} progressCallback - 进度回调函数
     * @returns {Promise<Array>} 压缩结果数组
     */
    async compressBatch(files, settings = {}, progressCallback = null) {
        const results = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                if (progressCallback) {
                    progressCallback({
                        stage: 'processing',
                        currentFile: i + 1,
                        totalFiles: totalFiles,
                        fileName: file.name || `image_${i + 1}`,
                        progress: ((i / totalFiles) * 100).toFixed(1)
                    });
                }

                const result = await this.compressImage(file, settings);
                results.push(result);

            } catch (error) {
                console.error(`Failed to compress ${file.name}:`, error);
                results.push({
                    name: file.name || `image_${i + 1}`,
                    error: error.message,
                    originalSize: file.size
                });
            }
        }

        if (progressCallback) {
            progressCallback({
                stage: 'completed',
                currentFile: totalFiles,
                totalFiles: totalFiles,
                progress: 100
            });
        }

        return results;
    }

    /**
     * 获取压缩统计信息
     * @param {Array} results - 压缩结果数组
     * @returns {Object} 统计信息
     */
    getCompressionStats(results) {
        const successResults = results.filter(r => !r.error);
        const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
        const totalCompressedSize = successResults.reduce((sum, r) => sum + r.size, 0);
        const totalSaved = totalOriginalSize - totalCompressedSize;

        return {
            totalFiles: results.length,
            successCount: successResults.length,
            failedCount: results.length - successResults.length,
            totalOriginalSize,
            totalCompressedSize,
            totalSaved,
            averageCompressionRatio: totalOriginalSize > 0 ? 
                ((totalSaved / totalOriginalSize) * 100).toFixed(1) : 0
        };
    }

    /**
     * 更新压缩设置
     * @param {Object} newOptions - 新的压缩设置
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }

    /**
     * 销毁压缩器
     */
    destroy() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}

export default UniversalImageCompressor;