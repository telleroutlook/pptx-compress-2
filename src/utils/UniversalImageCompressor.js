import Compressor from 'compressorjs';

class UniversalImageCompressor {
    constructor(options = {}) {
        this.options = options;
        console.log('[UniversalImageCompressor] Initialized with options:', this.options);
    }

    isFormatSupported(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const supported = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
        console.log(`[UniversalImageCompressor] Format check for ${filename}: ${supported ? 'supported' : 'not supported'}`);
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
        console.log('[UniversalImageCompressor] Validating file object:', file);
        
        // 如果已经是 File 或 Blob 对象
        if (file instanceof File || file instanceof Blob) {
            console.log('[UniversalImageCompressor] File is already a valid File/Blob object');
            
            // 检查并修复文件类型
            if (file instanceof File && (!file.type || file.type === '')) {
                console.log('[UniversalImageCompressor] Fixing empty file type');
                const mimeType = this.getMimeType(file.name);
                const newFile = new File([file], file.name, { type: mimeType });
                console.log('[UniversalImageCompressor] New file type:', mimeType);
                return newFile;
            }
            return file;
        }

        // 如果是字符串（URL），尝试获取文件
        if (typeof file === 'string') {
            console.log('[UniversalImageCompressor] Converting URL to File object');
            try {
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
        try {
            console.log('[UniversalImageCompressor] Attempting to convert to Blob');
            const mimeType = this.getMimeType('converted_image.png');
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
            if (this.isVectorFormat(file.name)) {
                console.log(`[UniversalImageCompressor] Vector format detected for ${file.name}, using default dimensions`);
                resolve({ width: 800, height: 600 }); // 默认尺寸
                return;
            }

            // 对于特殊格式，返回默认尺寸
            if (this.isSpecialFormat(file.name)) {
                console.log(`[UniversalImageCompressor] Special format detected for ${file.name}, using default dimensions`);
                resolve({ width: 800, height: 600 }); // 默认尺寸
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
                console.error(`[UniversalImageCompressor] Error loading image ${file.name}:`, error);
                // 对于加载失败的图片，返回默认尺寸
                resolve({ width: 800, height: 600 });
            };
            img.src = URL.createObjectURL(file);
        });
    }

    async compressImage(file, settings = {}) {
        console.log(`[UniversalImageCompressor] Starting compression for file: ${file.name || 'unknown'} (${(file.size / 1024).toFixed(2)}KB)`);
        
        try {
            // 确保文件对象有效
            const validFile = await this.ensureValidFileObject(file);
            console.log('[UniversalImageCompressor] File validation successful, type:', validFile.type);

            // 检查文件类型
            const fileExt = validFile.name.split('.').pop().toLowerCase();
            
            // 获取原始图片尺寸
            const originalDimensions = await this.getImageDimensions(validFile);
            console.log(`[UniversalImageCompressor] Original dimensions: ${originalDimensions.width}x${originalDimensions.height}`);

            // 检查小文件
            if (validFile.size < 1024) {
                console.log(`[UniversalImageCompressor] Skipping small file: ${validFile.name} (${(validFile.size / 1024).toFixed(2)}KB)`);
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
                console.log(`[UniversalImageCompressor] Skipping vector format file: ${validFile.name} (${(validFile.size / 1024).toFixed(2)}KB)`);
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
                console.log(`[UniversalImageCompressor] Skipping special format file: ${validFile.name} (${(validFile.size / 1024).toFixed(2)}KB)`);
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
                console.log(`[UniversalImageCompressor] Skipping unsupported file: ${validFile.name} (${(validFile.size / 1024).toFixed(2)}KB)`);
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
            console.log('[UniversalImageCompressor] Compression settings:', compressionSettings);

            // 根据压缩模式调整质量
            let quality = compressionSettings.quality;
            if (compressionSettings.mode === 'aggressive') {
                quality *= 0.8;
            } else if (compressionSettings.mode === 'maximum') {
                quality *= 0.6;
            }
            console.log(`[UniversalImageCompressor] Adjusted quality for mode ${compressionSettings.mode}: ${quality}`);

            // 计算压缩后的尺寸
            let finalWidth = originalDimensions.width;
            let finalHeight = originalDimensions.height;

            // 应用最大尺寸限制
            if (finalWidth > compressionSettings.maxWidth) {
                finalHeight = (compressionSettings.maxWidth * finalHeight) / finalWidth;
                finalWidth = compressionSettings.maxWidth;
            }
            if (finalHeight > compressionSettings.maxHeight) {
                finalWidth = (compressionSettings.maxHeight * finalWidth) / finalHeight;
                finalHeight = compressionSettings.maxHeight;
            }

            // 应用缩放比例
            if (compressionSettings.scale !== 1) {
                finalWidth = Math.round(finalWidth * compressionSettings.scale);
                finalHeight = Math.round(finalHeight * compressionSettings.scale);
            }

            console.log(`[UniversalImageCompressor] Target dimensions: ${finalWidth}x${finalHeight}`);

            // 设置 compressorjs 的选项
            const compressorOptions = {
                maxWidth: compressionSettings.maxWidth,
                maxHeight: compressionSettings.maxHeight,
                quality: quality,
                mimeType: `image/${compressionSettings.format}`,
                convertSize: Infinity, // 禁用自动转换
                success: null,
                error: null
            };
            console.log('[UniversalImageCompressor] Compressor options:', compressorOptions);

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    console.error('[UniversalImageCompressor] Compression timeout');
                    reject(new Error('Compression timeout'));
                }, 30000);

                console.log('[UniversalImageCompressor] Starting compressor with file type:', validFile.type);
                new Compressor(validFile, {
                    ...compressorOptions,
                    success(result) {
                        clearTimeout(timeout);
                        const compressionRatio = ((validFile.size - result.size) / validFile.size * 100).toFixed(1);
                        
                        // 如果压缩后文件更大，返回原始文件
                        if (result.size >= validFile.size) {
                            console.log(`[UniversalImageCompressor] Compression increased file size, using original file`);
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

                        console.log(`[UniversalImageCompressor] Compression completed:
                            - Original size: ${(validFile.size / 1024).toFixed(2)}KB
                            - Compressed size: ${(result.size / 1024).toFixed(2)}KB
                            - Compression ratio: ${compressionRatio}%
                            - Output format: ${result.type}
                            - Original dimensions: ${originalDimensions.width}x${originalDimensions.height}
                            - Final dimensions: ${finalWidth}x${finalHeight}`);
                        
                        resolve({
                            name: validFile.name || 'compressed_image',
                            size: result.size,
                            blob: result,
                            originalSize: validFile.size,
                            width: finalWidth,
                            height: finalHeight,
                            hasTransparency: result.type === 'image/png',
                            outputFormat: result.type.split('/')[1],
                            compressionRatio: compressionRatio
                        });
                    },
                    error(err) {
                        clearTimeout(timeout);
                        console.error('[UniversalImageCompressor] Compression error:', err);
                        reject(new Error(err.message));
                    }
                });
            });
        } catch (error) {
            console.error('[UniversalImageCompressor] Error in compressImage:', error);
            throw error;
        }
    }

    async compressBatch(files, settings = {}, progressCallback = null) {
        console.log(`[UniversalImageCompressor] Starting batch compression for ${files.length} files`);
        const results = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`[UniversalImageCompressor] Processing file ${i + 1}/${totalFiles}: ${file.name || 'unknown'}`);
            
            try {
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
                console.log(`[UniversalImageCompressor] Successfully processed: ${file.name || 'unknown'}`);

            } catch (error) {
                console.error(`[UniversalImageCompressor] Failed to process ${file.name || 'unknown'}:`, error);
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
        }

        console.log('[UniversalImageCompressor] Batch compression completed');
        return results;
    }

    destroy() {
        console.log('[UniversalImageCompressor] Instance destroyed');
    }
}

export default UniversalImageCompressor;