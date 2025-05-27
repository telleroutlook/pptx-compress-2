class UniversalImageCompressor {
    constructor(options = {}) {
        this.options = {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.8,
            format: 'jpeg',
            scale: 1,
            mode: 'balanced',
            ...options
        };
        this.worker = this.createCompressionWorker();
    }

    createCompressionWorker() {
        return new Worker(URL.createObjectURL(new Blob([`
            self.onmessage = async function(e) {
                const { imageData, settings } = e.data;
                try {
                    const response = await fetch(imageData);
                    if (!response.ok) throw new Error('Failed to fetch image data');
                    
                    const blob = await response.blob();
                    const bitmap = await createImageBitmap(blob);
                    
                    const isPNG = blob.type === 'image/png' || settings.originalName?.toLowerCase().endsWith('.png');
                    let hasTransparency = false;
                    
                    const testCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                    const testCtx = testCanvas.getContext('2d');
                    testCtx.drawImage(bitmap, 0, 0);
                    
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
                    
                    if (width > settings.maxWidth) {
                        height = (settings.maxWidth * height) / width;
                        width = settings.maxWidth;
                    }
                    if (height > settings.maxHeight) {
                        width = (settings.maxHeight * width) / height;
                        height = settings.maxHeight;
                    }
                    
                    width = Math.max(1, Math.round(width * settings.scale));
                    height = Math.max(1, Math.round(height * settings.scale));
                    
                    const resizedCanvas = new OffscreenCanvas(width, height);
                    const resizedCtx = resizedCanvas.getContext('2d');
                    
                    if (!resizedCtx) throw new Error('Failed to get resized canvas context');
                    
                    if (!hasTransparency) {
                        resizedCtx.fillStyle = '#FFFFFF';
                        resizedCtx.fillRect(0, 0, width, height);
                    }
                    
                    resizedCtx.drawImage(bitmap, 0, 0, width, height);
                    
                    let quality = Math.max(0.1, Math.min(1, settings.quality));
                    if (settings.mode === 'aggressive') {
                        quality *= 0.8;
                    } else if (settings.mode === 'maximum') {
                        quality *= 0.6;
                    }
                    
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
        `])));
    }

    isFormatSupported(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
    }

    async compressImage(file, settings = {}) {
        if (!this.isFormatSupported(file.name)) {
            return {
                name: file.name,
                size: file.size,
                blob: file,
                originalSize: file.size,
                width: 0,
                height: 0,
                compressionRatio: 0,
                skipped: true
            };
        }

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

    async compressBatch(files, settings = {}, progressCallback = null) {
        const results = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                if (progressCallback) {
                    progressCallback({
                        progress: i / totalFiles,
                        currentFile: i + 1,
                        totalFiles: totalFiles,
                        fileName: file.name,
                        status: 'Processing...'
                    });
                }

                const result = await this.compressImage(file, settings);
                results.push(result);

            } catch (error) {
                results.push({
                    name: file.name || `image_${i + 1}`,
                    error: error.message,
                    originalSize: file.size,
                    skipped: true
                });
            }
        }

        if (progressCallback) {
            progressCallback({
                progress: 1,
                fileName: 'Batch processing completed',
                status: 'Completed'
            });
        }

        return results;
    }

    destroy() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}

export default UniversalImageCompressor;