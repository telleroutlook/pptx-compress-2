import PPTXCompressor from './PPTXCompressor.js';

class PPTXCompressorApp {
    constructor() {
        this.compressor = new PPTXCompressor({
            format: 'jpeg',
            quality: 0.7,
            maxWidth: 1600,
            maxHeight: 1200,
            scale: 0.9,
            mode: 'maximum'
        });
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.summaryStats = document.getElementById('summaryStats');
        this.statusMessage = document.getElementById('statusMessage');
    }

    bindEvents() {
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.name.toLowerCase().endsWith('.pptx'));
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files).filter(file => 
            file.name.toLowerCase().endsWith('.pptx'));
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    async processFile(file) {
        try {
            this.showProgress();
            this.showStatus('Processing file...', 'info');

            const result = await this.compressor.compressPPTX(file, (progress) => {
                this.updateProgress(progress);
            });

            this.showResults(result);
            this.showStatus('Compression completed successfully!', 'success');
        } catch (error) {
            console.error('Compression failed:', error);
            this.showStatus(`Compression failed: ${error.message}`, 'error');
        } finally {
            this.hideProgress();
        }
    }

    showProgress() {
        this.progressSection.style.display = 'block';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = 'Starting...';
    }

    updateProgress(progress) {
        this.progressFill.style.width = `${progress.progress}%`;
        this.progressText.textContent = progress.message;
    }

    hideProgress() {
        this.progressSection.style.display = 'none';
    }

    showResults(result) {
        this.resultsSection.style.display = 'block';
        this.summaryStats.style.display = 'block';

        // Update summary stats
        document.getElementById('totalFiles').textContent = result.stats.totalFiles;
        document.getElementById('totalSaved').textContent = this.formatFileSize(result.stats.savedSize);
        document.getElementById('avgCompression').textContent = `${result.stats.compressionRatio}%`;

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(result.compressedFile);
        downloadLink.download = result.compressedFile.name;
        downloadLink.className = 'result-download';
        downloadLink.textContent = 'Download Compressed PPTX';
        
        this.resultsContainer.innerHTML = '';
        this.resultsContainer.appendChild(downloadLink);
    }

    showStatus(message, type = 'info') {
        this.statusMessage.className = `status-message status-${type}`;
        this.statusMessage.textContent = message;
        this.statusMessage.style.display = 'block';
        
        setTimeout(() => {
            this.statusMessage.style.display = 'none';
        }, 3000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    destroy() {
        this.compressor.destroy();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PPTXCompressorApp();
}); 