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
                    
                    const blob = await response.blob();
                    
                    // Handle special file formats
                    const fileType = blob.type.toLowerCase();
                    const fileName = settings.originalName?.toLowerCase() || '';
                    
                    // List of formats that should be passed through without processing
                    const passThroughFormats = [
                        'image/svg+xml',
                        'image/tiff',
                        'image/x-tiff',
                        'image/tif',
                        'image/x-tif',
                        'image/x-emf',
                        'image/emf',
                        'application/x-emf',
                        'application/emf'
                    ];
                    
                    // Check if file should be passed through
                    if (passThroughFormats.includes(fileType) || 
                        fileName.endsWith('.svg') || 
                        fileName.endsWith('.tiff') || 
                        fileName.endsWith('.tif') ||
                        fileName.endsWith('.emf')) {
                        
                        // For special formats, return the original blob
                        self.postMessage({
                            blob: blob,
                            width: 0,
                            height: 0,
                            originalSize: settings.originalSize,
                            hasTransparency: true,
                            outputFormat: fileType.split('/')[1] || 'unknown'
                        });
                        return;
                    }
                    
                    // For supported formats, proceed with normal processing
                    const bitmap = await createImageBitmap(blob);
                    
                    // Check if PNG format or has transparency
                    const isPNG = blob.type === 'image/png' || settings.originalName?.toLowerCase().endsWith('.png');
                    let hasTransparency = false;
                    
                    // Create temporary canvas to check transparency
                    const testCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                    const testCtx = testCanvas.getContext('2d');
                    testCtx.drawImage(bitmap, 0, 0);
                    
                    // Check for transparent pixels
                    if (isPNG) {
                        const imageData = testCtx.getImageData(0, 0, bitmap.width, bitmap.height);
                        const data = imageData.data;
                        for (let i = 3; i < data.length; i += 4) {
                            if (data[i] < 255) {
                                hasTransparency = true;
                                break;
                            }
                        }
                    }
                    
                    let width = bitmap.width;
                    let height = bitmap.height;
                    
                    // Size limits
                    if (width > settings.maxWidth) {
                        height = (settings.maxWidth * height) / width;
                        width = settings.maxWidth;
                    }
                    if (height > settings.maxHeight) {
                        width = (settings.maxHeight * width) / height;
                        height = settings.maxHeight;
                    }
                    
                    // Scale processing
                    width = Math.max(1, Math.round(width * settings.scale));
                    height = Math.max(1, Math.round(height * settings.scale));
                    
                    const resizedCanvas = new OffscreenCanvas(width, height);
                    const resizedCtx = resizedCanvas.getContext('2d');
                    
                    if (!resizedCtx) throw new Error('Failed to get resized canvas context');
                    
                    // Set white background for non-transparent images
                    if (!hasTransparency) {
                        resizedCtx.fillStyle = '#FFFFFF';
                        resizedCtx.fillRect(0, 0, width, height);
                    }
                    
                    resizedCtx.drawImage(bitmap, 0, 0, width, height);
                    
                    // Quality adjustment
                    let quality = Math.max(0.1, Math.min(1, settings.quality));
                    if (settings.mode === 'aggressive') {
                        quality *= 0.8;
                    } else if (settings.mode === 'maximum') {
                        quality *= 0.6;
                    }
                    
                    // Determine output format based on transparency
                    let outputFormat = settings.format;
                    if (hasTransparency && (settings.format === 'jpeg' || settings.format === 'jpg')) {
                        outputFormat = 'png';
                    }
                    
                    const blobOptions = { type: 'image/' + outputFormat };
                    if (outputFormat !== 'png') {
                        blobOptions.quality = quality;
                    }
                    
                    const resultBlob = await resizedCanvas.convertToBlob(blobOptions);
                    
                    bitmap.close();
                    
                    self.postMessage({
                        blob: resultBlob,
                        width: width,
                        height: height,
                        originalSize: settings.originalSize,
                        hasTransparency: hasTransparency,
                        outputFormat: outputFormat
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
        const compressionSettings = { 
            ...this.options, 
            ...settings, 
            originalSize: file.size,
            originalName: file.name || ''
        };
        
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
                            const { blob, width, height, hasTransparency, outputFormat } = event.data;
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
                                hasTransparency: hasTransparency,
                                outputFormat: outputFormat,
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