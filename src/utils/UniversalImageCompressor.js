import Compressor from 'compressorjs';

class UniversalImageCompressor {
    constructor(options = {}) {
        this.options = {
            maxWidth: 1600,
            maxHeight: 900,
            quality: 0.8,
            format: 'webp',
            scale: 1,
            mode: 'balanced',
            strict: true,
            resize: 'contain',
            convertTypes: ['image/png', 'image/webp'],
            convertSize: 5000000,
            ...options
        };
    }

    isFormatSupported(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const supported = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
        return supported;
    }

    isVectorFormat(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return ['svg', 'emf', 'wmf'].includes(ext);
    }

    isSpecialFormat(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return ['tiff', 'tif', 'bmp', 'ico'].includes(ext);
    }

    getMimeType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'emf': 'image/x-emf',
            'wmf': 'image/x-wmf',
            'tiff': 'image/tiff',
            'tif': 'image/tiff',
            'bmp': 'image/bmp',
            'ico': 'image/x-icon'
        };
        return mimeTypes[ext] || 'image/png';
    }

    async ensureValidFileObject(file) {
        console.log(`[UniversalImageCompressor] Validating: ${file.name || 'unknown'} (${(file.size / 1024).toFixed(2)}KB)`);
        
        // 如果已经是 File 或 Blob 对象
        if (file instanceof File || file instanceof Blob) {
            // 检查并修复文件类型
            if (file instanceof File && (!file.type || file.type === '')) {
                const mimeType = this.getMimeType(file.name);
                const newFile = new File([file], file.name, { type: mimeType });return newFile;
            }
            return file;
        }

        // 如果是字符串（URL），尝试获取文件
        if (typeof file === 'string') {try {
                const response = await fetch(file);
                if (!response.ok) throw new Error('Failed to fetch file');
                const blob = await response.blob();
                const filename = file.split('/').pop();
                const mimeType = this.getMimeType(filename);
                return new File([blob], filename, { type: mimeType });
            } catch (error) {
                console.error('[UniversalImageCompressor] Error converting URL to File:', error);
                throw error;
            }
        }

        // 如果是其他类型，尝试转换为 Blob
        try {const mimeType = this.getMimeType('converted_image.png');
            const blob = new Blob([file], { type: mimeType });
            return new File([blob], 'converted_image.png', { type: mimeType });
        } catch (error) {
            console.error('[UniversalImageCompressor] Error converting to Blob:', error);
            throw new Error('Invalid file object');
        }
    }

    async getImageDimensions(file) {
        return new Promise((resolve, reject) => {
            // 对于矢量格式，返回默认尺寸
            if (this.isVectorFormat(file.name)) {resolve({ width: 800, height: 600 }); // 默认尺寸
                return;
            }

            // 对于特殊格式，返回默认尺寸
            if (this.isSpecialFormat(file.name)) {resolve({ width: 800, height: 600 }); // 默认尺寸
                return;
            }

            const img = new Image();
            img.onload = () => {
                const dimensions = {
                    width: img.width,
                    height: img.height
                };
                URL.revokeObjectURL(img.src);
                resolve(dimensions);
            };
            img.onerror = (error) => {
                URL.revokeObjectURL(img.src);
                console.error(`[UniversalImageCompressor] Error: ${file.name} - ${error.message}`);
                // 对于加载失败的图片，返回默认尺寸
                resolve({ width: 800, height: 600 });
            };
            img.src = URL.createObjectURL(file);
        });
    }

    async compressImage(file, settings = {}) {
        try {
            // 确保文件对象有效
            const validFile = await this.ensureValidFileObject(file);
            
            // 获取原始图片尺寸
            const originalDimensions = await this.getImageDimensions(validFile);
            console.log(`[UniversalImageCompressor] Process: ${validFile.name} (${(validFile.size / 1024).toFixed(2)}KB, ${originalDimensions.width}x${originalDimensions.height})`);

            // 检查小文件
            if (validFile.size < 1024) {
                console.log(`[UniversalImageCompressor] Skip: ${validFile.name} (small)`);
                return {
                    name: validFile.name,
                    size: validFile.size,
                    blob: validFile,
                    originalSize: validFile.size,
                    width: originalDimensions.width,
                    height: originalDimensions.height,
                    compressionRatio: 0,
                    skipped: true,
                    skipReason: 'small_file'
                };
            }

            // 检查矢量格式文件
            if (this.isVectorFormat(validFile.name)) {
                console.log(`[UniversalImageCompressor] Skip: ${validFile.name} (vector)`);
                return {
                    name: validFile.name,
                    size: validFile.size,
                    blob: validFile,
                    originalSize: validFile.size,
                    width: originalDimensions.width,
                    height: originalDimensions.height,
                    compressionRatio: 0,
                    skipped: true,
                    skipReason: 'vector_format'
                };
            }

            // 检查特殊格式文件
            if (this.isSpecialFormat(validFile.name)) {
                console.log(`[UniversalImageCompressor] Skip: ${validFile.name} (special)`);
                return {
                    name: validFile.name,
                    size: validFile.size,
                    blob: validFile,
                    originalSize: validFile.size,
                    width: originalDimensions.width,
                    height: originalDimensions.height,
                    compressionRatio: 0,
                    skipped: true,
                    skipReason: 'special_format'
                };
            }

            if (!this.isFormatSupported(validFile.name)) {
                console.log(`[UniversalImageCompressor] Skip: ${validFile.name} (unsupported)`);
                return {
                    name: validFile.name,
                    size: validFile.size,
                    blob: validFile,
                    originalSize: validFile.size,
                    width: originalDimensions.width,
                    height: originalDimensions.height,
                    compressionRatio: 0,
                    skipped: true,
                    skipReason: 'unsupported_format'
                };
            }

            // 合并默认选项和传入的设置
            const compressionSettings = { 
                ...this.options, 
                ...settings
            };

            // 根据压缩模式调整质量
            let quality = compressionSettings.quality;
            if (compressionSettings.mode === 'aggressive') {
                quality *= 0.8;
            } else if (compressionSettings.mode === 'maximum') {
                quality *= 0.6;
            }

            // 设置 compressorjs 的选项
            const compressorOptions = {
                strict: true,
                maxWidth: compressionSettings.maxWidth,
                maxHeight: compressionSettings.maxHeight,
                quality: quality,
                mimeType: `image/${compressionSettings.format}`,
                resize: 'contain',
                convertTypes: ['image/png', 'image/webp'],
                convertSize: 5000000,
                success: null,
                error: null
            };

            console.log(`[UniversalImageCompressor] Compress: ${validFile.name} (${compressionSettings.mode}, q=${quality})`);

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    console.error('[UniversalImageCompressor] Timeout: ' + validFile.name);
                    reject(new Error('Compression timeout'));
                }, 30000);

                new Compressor(validFile, {
                    ...compressorOptions,
                    success(result) {
                        clearTimeout(timeout);
                        const compressionRatio = ((validFile.size - result.size) / validFile.size * 100).toFixed(1);
                        
                        // 如果压缩后文件更大，返回原始文件
                        if (result.size >= validFile.size) {
                            console.log(`[UniversalImageCompressor] Skip: ${validFile.name} (larger)`);
                            resolve({
                                name: validFile.name,
                                size: validFile.size,
                                blob: validFile,
                                originalSize: validFile.size,
                                width: originalDimensions.width,
                                height: originalDimensions.height,
                                hasTransparency: validFile.type === 'image/png',
                                outputFormat: validFile.type.split('/')[1],
                                compressionRatio: 0
                            });
                            return;
                        }

                        console.log(`[UniversalImageCompressor] Done: ${validFile.name} ${(validFile.size / 1024).toFixed(2)}KB → ${(result.size / 1024).toFixed(2)}KB (${compressionRatio}%)`);
                        
                        resolve({
                            name: validFile.name || 'compressed_image',
                            size: result.size,
                            blob: result,
                            originalSize: validFile.size,
                            width: originalDimensions.width,
                            height: originalDimensions.height,
                            hasTransparency: result.type === 'image/png',
                            outputFormat: result.type.split('/')[1],
                            compressionRatio: compressionRatio
                        });
                    },
                    error(err) {
                        clearTimeout(timeout);
                        console.error(`[UniversalImageCompressor] Error: ${validFile.name} - ${err.message}`);
                        reject(new Error(err.message));
                    }
                });
            });
        } catch (error) {
            console.error('[UniversalImageCompressor] Error in compressImage:', error);
            throw error;
        }
    }

    async compressBatch(files, settings = {}, progressCallback = null) {const results = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];try {
                if (progressCallback) {
                    progressCallback({
                        progress: i / totalFiles,
                        currentFile: i + 1,
                        totalFiles: totalFiles,
                        fileName: file.name || 'unknown',
                        status: 'Processing...'
                    });
                }

                const result = await this.compressImage(file, settings);
                results.push(result);

            } catch (error) {
                console.error(`[UniversalImageCompressor] Failed: ${file.name || 'unknown'} - ${error.message}`);
                results.push({
                    name: file.name || `image_${i + 1}`,
                    error: error.message,
                    originalSize: file.size || 0,
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
        }return results;
    }

    destroy() {}
}

export default UniversalImageCompressor;