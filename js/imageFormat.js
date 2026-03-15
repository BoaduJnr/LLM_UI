/**
 * Compact Pure JavaScript Image Viewer - One Third Height
 * Creates a beautiful compact image viewer that accepts image data and displays a nice UI
 * Usage: const viewer = new ImageViewer(imageData, containerElement);
 */

export class ImageViewer {
    constructor(imageData, container, options = {}) {
        this.imageData = imageData;
        this.container = container;
        this.options = {
            title: options.title || 'Generated Image',
            subtitle: options.subtitle || 'AI Generated Content',
            showDownload: options.showDownload !== false,
            showShare: options.showShare !== false,
            showFullscreen: options.showFullscreen !== false,
            showInfo: options.showInfo !== false,
            theme: options.theme || 'gradient', // 'gradient', 'dark', 'light'
            maxHeight: options.maxHeight || '400px',
            enableZoom: options.enableZoom !== false,
            enablePan: options.enablePan !== false,
            ...options
        };
        
        this.image = null;
        this.isFullscreen = false;
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.imageLoaded = false;
        this.naturalWidth = 0;
        this.naturalHeight = 0;
        
        this.init();
    }
    
    init() {
        this.injectStyles();
        this.createImageElement();
        this.createViewerElement();
        this.setupEventListeners();
    }
    
    injectStyles() {
        if (document.getElementById('image-viewer-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'image-viewer-styles';
        styles.textContent = `
            .image-viewer {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 16px;
                margin: 8px 0;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                color: white;
                position: relative;
                overflow: hidden;
                max-width: 800px;
                user-select: none;
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-height: 120px;
            }
            
            .image-viewer.theme-dark {
                background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }
            
            .image-viewer.theme-light {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                color: #2d3748;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            }
            
            .image-viewer::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
                pointer-events: none;
            }
            
            .image-viewer-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                z-index: 2;
                min-height: 40px;
            }
            
            .image-info {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                min-width: 0;
            }
            
            .image-icon {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.12);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                backdrop-filter: blur(10px);
                flex-shrink: 0;
            }
            
            .image-text {
                min-width: 0;
                flex: 1;
            }
            
            .image-title {
                font-weight: 600;
                font-size: 15px;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
            }
            
            .image-subtitle {
                font-size: 12px;
                opacity: 0.7;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
            }
            
            .image-dimensions {
                text-align: right;
                font-size: 11px;
                opacity: 0.8;
                flex-shrink: 0;
                margin-left: 12px;
                line-height: 1.3;
            }
            
            .dimensions-text {
                font-size: 13px;
                font-weight: 600;
                display: block;
            }
            
            .file-size {
                opacity: 0.6;
                display: block;
            }
            
            .image-container {
                position: relative;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
                cursor: grab;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                max-height: 400px;
                z-index: 1;
            }
            
            .image-container.dragging {
                cursor: grabbing;
            }
            
            .image-container.zoom-enabled:hover {
                cursor: zoom-in;
            }
            
            .image-container.zoomed {
                cursor: grab;
            }
            
            .image-container.zoomed:hover {
                cursor: grab;
            }
            
            .main-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 6px;
                transition: transform 0.3s ease;
                transform-origin: center center;
                user-select: none;
                -webkit-user-drag: none;
            }
            
            .image-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
            }
            
            .loading-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid rgba(255, 255, 255, 0.2);
                border-top: 3px solid rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 12px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .zoom-controls {
                position: absolute;
                top: 8px;
                right: 8px;
                display: flex;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 3;
            }
            
            .image-container:hover .zoom-controls {
                opacity: 1;
            }
            
            .zoom-btn {
                background: rgba(0, 0, 0, 0.6);
                border: none;
                border-radius: 6px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
            }
            
            .zoom-btn:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: scale(1.05);
            }
            
            .zoom-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .zoom-icon {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }
            
            .main-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                position: relative;
                z-index: 2;
            }
            
            .control-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: inherit;
                cursor: pointer;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                position: relative;
            }
            
            .control-btn:hover {
                background: rgba(255, 255, 255, 0.18);
                transform: scale(1.05);
            }
            
            .control-btn:active {
                transform: scale(0.95);
            }
            
            .control-icon {
                width: 18px;
                height: 18px;
                fill: currentColor;
            }
            
            .fullscreen-btn {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.12);
            }
            
            .action-buttons {
                display: flex;
                justify-content: center;
                gap: 8px;
                flex-wrap: wrap;
                position: relative;
                z-index: 2;
            }
            
            .action-btn {
                background: rgba(255, 255, 255, 0.08);
                border: none;
                border-radius: 20px;
                padding: 8px 14px;
                color: inherit;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                font-weight: 500;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
            }
            
            .action-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-1px);
            }
            
            .action-icon {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }
            
            .fullscreen-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .fullscreen-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .fullscreen-image {
                max-width: 95vw;
                max-height: 95vh;
                object-fit: contain;
                border-radius: 8px;
                transition: transform 0.3s ease;
                transform-origin: center center;
                cursor: grab;
            }
            
            .fullscreen-image.dragging {
                cursor: grabbing;
            }
            
            .fullscreen-controls {
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 8px;
            }
            
            .fullscreen-control-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 8px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
            }
            
            .fullscreen-control-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .fullscreen-info {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                backdrop-filter: blur(10px);
                text-align: center;
            }
            
            .error-message {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                color: #ef4444;
                font-size: 14px;
                text-align: center;
                flex-direction: column;
                gap: 8px;
            }
            
            .error-icon {
                width: 48px;
                height: 48px;
                opacity: 0.7;
            }
            
            @keyframes fadeInUp {
                from { 
                    opacity: 0; 
                    transform: translateY(20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            .loading {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            /* Mobile Responsive */
            @media (max-width: 480px) {
                .image-viewer {
                    padding: 12px;
                    margin: 6px 0;
                    gap: 10px;
                    min-height: 100px;
                }
                
                .main-controls {
                    gap: 8px;
                }
                
                .control-btn {
                    width: 32px;
                    height: 32px;
                }
                
                .fullscreen-btn {
                    width: 36px;
                    height: 36px;
                }
                
                .control-icon {
                    width: 16px;
                    height: 16px;
                }
                
                .image-container {
                    min-height: 150px;
                    max-height: 300px;
                }
                
                .action-buttons {
                    gap: 6px;
                }
                
                .action-btn {
                    padding: 6px 10px;
                    font-size: 10px;
                }
                
                .image-info {
                    gap: 8px;
                }
                
                .image-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 16px;
                }
                
                .zoom-controls {
                    opacity: 1;
                }
                
                .fullscreen-controls {
                    top: 10px;
                    right: 10px;
                }
                
                .fullscreen-info {
                    bottom: 10px;
                    left: 10px;
                    right: 10px;
                    transform: none;
                }
            }
            
            .hidden {
                display: none !important;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    createImageElement() {
        this.image = new Image();
        console.log(this.imageData)
        // Handle different image data formats
        if (typeof this.imageData === 'string') {
            // Base64 data URL or regular URL
            this.image.src = this.imageData;
            console.log(this.image)
        } else if (this.imageData instanceof Blob || this.imageData instanceof File) {
            // Blob or File object
            this.image.src = URL.createObjectURL(this.imageData);
        } else if (this.imageData instanceof ArrayBuffer) {
            // ArrayBuffer
            const blob = new Blob([this.imageData], { type: 'image/png' });
            this.image.src = URL.createObjectURL(blob);
        }
        
        this.image.crossOrigin = 'anonymous';
    }
    
    createViewerElement() {
        const viewer = document.createElement('div');
        viewer.className = `image-viewer theme-${this.options.theme}`;
        
        viewer.innerHTML = `
            <div class="image-viewer-header">
                <div class="image-info">
                    <div class="image-icon">🖼️</div>
                    <div class="image-text">
                        <div class="image-title">${this.options.title}</div>
                        <div class="image-subtitle">${this.options.subtitle}</div>
                    </div>
                </div>
                <div class="image-dimensions">
                    <span class="dimensions-text">Loading...</span>
                    <span class="file-size"></span>
                </div>
            </div>

            <div class="image-container">
                <div class="image-loading">
                    <div class="loading-spinner"></div>
                    Loading image...
                </div>
                
                ${this.options.enableZoom ? `
                <div class="zoom-controls">
                    <button class="zoom-btn zoom-out-btn" title="Zoom Out">
                        <svg class="zoom-icon" viewBox="0 0 24 24">
                            <path d="M19,13H5V11H19V13Z"/>
                        </svg>
                    </button>
                    <button class="zoom-btn zoom-reset-btn" title="Reset Zoom">
                        <svg class="zoom-icon" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"/>
                        </svg>
                    </button>
                    <button class="zoom-btn zoom-in-btn" title="Zoom In">
                        <svg class="zoom-icon" viewBox="0 0 24 24">
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                        </svg>
                    </button>
                </div>
                ` : ''}
            </div>

            <div class="main-controls">
                <button class="control-btn rotate-left-btn" title="Rotate Left">
                    <svg class="control-icon" viewBox="0 0 24 24">
                        <path d="M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M4.07,11H6.09C6.23,10.12 6.58,9.28 7.1,8.53L5.69,7.1C4.79,8.27 4.24,9.61 4.07,11Z"/>
                    </svg>
                </button>

                <button class="control-btn rotate-right-btn" title="Rotate Right">
                    <svg class="control-icon" viewBox="0 0 24 24">
                        <path d="M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11H19.93M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12S7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12S8.16,6.57 11,6.09V10L15.55,5.55Z"/>
                    </svg>
                </button>

                ${this.options.showFullscreen ? `
                <button class="control-btn fullscreen-btn" title="Fullscreen">
                    <svg class="control-icon" viewBox="0 0 24 24">
                        <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/>
                    </svg>
                </button>
                ` : ''}

                <button class="control-btn copy-btn" title="Copy Image">
                    <svg class="control-icon" viewBox="0 0 24 24">
                        <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                    </svg>
                </button>
            </div>

            ${this.createActionButtons()}

            <div class="fullscreen-overlay">
                <img class="fullscreen-image" alt="Fullscreen view">
                <div class="fullscreen-controls">
                    <button class="fullscreen-control-btn zoom-out-fullscreen" title="Zoom Out">
                        <svg class="control-icon" viewBox="0 0 24 24">
                            <path d="M19,13H5V11H19V13Z"/>
                        </svg>
                    </button>
                    <button class="fullscreen-control-btn zoom-reset-fullscreen" title="Reset">
                        <svg class="control-icon" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"/>
                        </svg>
                    </button>
                    <button class="fullscreen-control-btn zoom-in-fullscreen" title="Zoom In">
                        <svg class="control-icon" viewBox="0 0 24 24">
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                        </svg>
                    </button>
                    <button class="fullscreen-control-btn close-fullscreen" title="Close">
                        <svg class="control-icon" viewBox="0 0 24 24">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>
                <div class="fullscreen-info">
                    <div class="fullscreen-title"></div>
                    <div class="fullscreen-dimensions"></div>
                </div>
            </div>
        `;
        
        this.container.appendChild(viewer);
        this.viewerElement = viewer;
    }
    
    createActionButtons() {
        const buttons = [];
        
        if (this.options.showDownload) {
            buttons.push(`
                <button class="action-btn download-btn" title="Download Image">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                    </svg>
                    Download
                </button>
            `);
        }
        
        if (this.options.showShare) {
            buttons.push(`
                <button class="action-btn share-btn" title="Share Image">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19C20.92,17.39 19.61,16.08 18,16.08M18,4A1,1 0 0,1 19,5A1,1 0 0,1 18,6A1,1 0 0,1 17,5A1,1 0 0,1 18,4M6,13A1,1 0 0,1 7,12A1,1 0 0,1 6,11A1,1 0 0,1 5,12A1,1 0 0,1 6,13M18,20C17.45,20 17,19.55 17,19C17,18.45 17.45,18 18,18C18.55,18 19,18.45 19,19C19,19.55 18.55,20 18,20Z"/>
                    </svg>
                    Share
                </button>
            `);
        }
        
        if (this.options.showInfo) {
            buttons.push(`
                <button class="action-btn info-btn" title="Image Info">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                    </svg>
                    Info
                </button>
            `);
        }
        
        return buttons.length > 0 ? `
            <div class="action-buttons">
                ${buttons.join('')}
            </div>
        ` : '';
    }
    
    setupEventListeners() {
    // Image loading events
    this.image.addEventListener('load', () => {
        this.imageLoaded = true;
        this.naturalWidth = this.image.naturalWidth;
        this.naturalHeight = this.image.naturalHeight;
        this.displayImage();
        this.updateImageInfo();
        this.viewerElement.classList.remove('loading');
    });
    
    this.image.addEventListener('error', (e) => {
        console.error('Image error:', e);
        this.showError('Error loading image');
        this.viewerElement.classList.remove('loading');
    });

    // Setup control events
    this.setupControlEvents();
}
    
    setupControlEvents() {
        const viewer = this.viewerElement;
        
        // Rotation controls
        viewer.querySelector('.rotate-left-btn').addEventListener('click', () => {
            this.rotateImage(-90);
        });

        viewer.querySelector('.rotate-right-btn').addEventListener('click', () => {
            this.rotateImage(90);
        });

        // Copy button
        viewer.querySelector('.copy-btn').addEventListener('click', () => {
            this.copyImage();
        });

        // Fullscreen controls
        if (this.options.showFullscreen) {
            viewer.querySelector('.fullscreen-btn').addEventListener('click', () => {
                this.enterFullscreen();
            });

            const fullscreenOverlay = viewer.querySelector('.fullscreen-overlay');
            viewer.querySelector('.close-fullscreen').addEventListener('click', () => {
                this.exitFullscreen();
            });

            // Close fullscreen on escape or overlay click
            fullscreenOverlay.addEventListener('click', (e) => {
                if (e.target === fullscreenOverlay) {
                    this.exitFullscreen();
                }
            });
        }

        // Zoom controls
        if (this.options.enableZoom) {
            this.setupZoomControls();
        }

        // Pan controls
        if (this.options.enablePan) {
            this.setupPanControls();
        }

        // Action buttons
        if (this.options.showDownload) {
            viewer.querySelector('.download-btn')?.addEventListener('click', () => {
                this.downloadImage();
            });
        }

        if (this.options.showShare) {
            viewer.querySelector('.share-btn')?.addEventListener('click', () => {
                this.shareImage();
            });
        }

        if (this.options.showInfo) {
            viewer.querySelector('.info-btn')?.addEventListener('click', () => {
                this.showImageInfo();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isFullscreen) {
                this.handleKeyboard(e);
            }
        });
    }

    setupZoomControls() {
        const viewer = this.viewerElement;
        
        // Regular zoom controls
        viewer.querySelector('.zoom-in-btn')?.addEventListener('click', () => {
            this.zoomIn();
        });

        viewer.querySelector('.zoom-out-btn')?.addEventListener('click', () => {
            this.zoomOut();
        });

        viewer.querySelector('.zoom-reset-btn')?.addEventListener('click', () => {
            this.resetZoom();
        });

        // Fullscreen zoom controls
        viewer.querySelector('.zoom-in-fullscreen')?.addEventListener('click', () => {
            this.zoomIn(true);
        });

        viewer.querySelector('.zoom-out-fullscreen')?.addEventListener('click', () => {
            this.zoomOut(true);
        });

        viewer.querySelector('.zoom-reset-fullscreen')?.addEventListener('click', () => {
            this.resetZoom(true);
        });

        // Mouse wheel zoom
        const imageContainer = viewer.querySelector('.image-container');
        const fullscreenImage = viewer.querySelector('.fullscreen-image');

        [imageContainer, fullscreenImage].forEach(element => {
            element?.addEventListener('wheel', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const isFullscreen = element === fullscreenImage;
                    if (e.deltaY < 0) {
                        this.zoomIn(isFullscreen);
                    } else {
                        this.zoomOut(isFullscreen);
                    }
                }
            });
        });
    }

    setupPanControls() {
        const viewer = this.viewerElement;
        const imageContainer = viewer.querySelector('.image-container');
        const fullscreenImage = viewer.querySelector('.fullscreen-image');

        [imageContainer, fullscreenImage].forEach(element => {
            element?.addEventListener('mousedown', (e) => {
                if (this.zoomLevel > 1) {
                    this.startPan(e, element === fullscreenImage);
                }
            });
        });

        document.addEventListener('mousemove', (e) => {
            this.updatePan(e);
        });

        document.addEventListener('mouseup', () => {
            this.endPan();
        });

        // Touch events for mobile
        [imageContainer, fullscreenImage].forEach(element => {
            element?.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1 && this.zoomLevel > 1) {
                    this.startPan(e.touches[0], element === fullscreenImage);
                }
            });
        });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                this.updatePan(e.touches[0]);
            }
        });

        document.addEventListener('touchend', () => {
            this.endPan();
        });
    }

    // Image display methods
    displayImage() {
        const container = this.viewerElement.querySelector('.image-container');
        const loading = container.querySelector('.image-loading');
        
        if (loading) {
            loading.remove();
        }

        const displayImage = document.createElement('img');
        displayImage.className = 'main-image';
        displayImage.src = this.image.src;
        displayImage.alt = this.options.title;
        displayImage.style.maxHeight = this.options.maxHeight;
        
        container.appendChild(displayImage);
        this.mainImage = displayImage;

        // Add zoom cursor if zoom is enabled
        if (this.options.enableZoom) {
            container.classList.add('zoom-enabled');
        }
    }

    updateImageInfo() {
        const dimensionsEl = this.viewerElement.querySelector('.dimensions-text');
        const fileSizeEl = this.viewerElement.querySelector('.file-size');
        
        dimensionsEl.textContent = `${this.naturalWidth} × ${this.naturalHeight}`;
        
        // Calculate approximate file size if possible
        if (this.image.src.startsWith('data:')) {
            const base64Data = this.image.src.split(',')[1];
            const sizeInBytes = Math.round((base64Data.length * 3) / 4);
            fileSizeEl.textContent = this.formatFileSize(sizeInBytes);
        } else {
            fileSizeEl.textContent = '';
        }
    }

    // Transform methods
    rotateImage(degrees) {
        this.rotation = (this.rotation || 0) + degrees;
        this.applyTransform();
    }

    zoomIn(isFullscreen = false) {
        this.zoomLevel = Math.min(5, this.zoomLevel * 1.2);
        this.applyTransform(isFullscreen);
        this.updateZoomButtons(isFullscreen);
    }

    zoomOut(isFullscreen = false) {
        this.zoomLevel = Math.max(0.1, this.zoomLevel / 1.2);
        this.applyTransform(isFullscreen);
        this.updateZoomButtons(isFullscreen);
    }

    resetZoom(isFullscreen = false) {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform(isFullscreen);
        this.updateZoomButtons(isFullscreen);
    }

    applyTransform(isFullscreen = false) {
        const image = isFullscreen ? 
            this.viewerElement.querySelector('.fullscreen-image') : 
            this.mainImage;
            
        if (!image) return;

        const rotation = this.rotation || 0;
        const transform = `
            translate(${this.panX}px, ${this.panY}px) 
            scale(${this.zoomLevel}) 
            rotate(${rotation}deg)
        `;
        
        image.style.transform = transform;

        // Update container class for cursor
        const container = isFullscreen ? 
            this.viewerElement.querySelector('.fullscreen-overlay') :
            this.viewerElement.querySelector('.image-container');
            
        if (this.zoomLevel > 1) {
            container?.classList.add('zoomed');
        } else {
            container?.classList.remove('zoomed');
        }
    }

    updateZoomButtons(isFullscreen = false) {
        const suffix = isFullscreen ? '-fullscreen' : '-btn';
        const zoomInBtn = this.viewerElement.querySelector(`.zoom-in${suffix}`);
        const zoomOutBtn = this.viewerElement.querySelector(`.zoom-out${suffix}`);
        
        if (zoomInBtn) zoomInBtn.disabled = this.zoomLevel >= 5;
        if (zoomOutBtn) zoomOutBtn.disabled = this.zoomLevel <= 0.1;
    }

    // Pan methods
    startPan(e, isFullscreen = false) {
        this.isDragging = true;
        this.dragStartX = e.clientX - this.panX;
        this.dragStartY = e.clientY - this.panY;
        
        const element = isFullscreen ? 
            this.viewerElement.querySelector('.fullscreen-image') :
            this.viewerElement.querySelector('.image-container');
            
        element?.classList.add('dragging');
    }

    updatePan(e) {
        if (!this.isDragging) return;
        
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        
        this.applyTransform(this.isFullscreen);
    }

    endPan() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // Remove dragging class from both possible elements
        ['.image-container', '.fullscreen-image'].forEach(selector => {
            this.viewerElement.querySelector(selector)?.classList.remove('dragging');
        });
    }

    // Fullscreen methods
    enterFullscreen() {
        const overlay = this.viewerElement.querySelector('.fullscreen-overlay');
        const fullscreenImage = this.viewerElement.querySelector('.fullscreen-image');
        const fullscreenTitle = this.viewerElement.querySelector('.fullscreen-title');
        const fullscreenDimensions = this.viewerElement.querySelector('.fullscreen-dimensions');
        
        fullscreenImage.src = this.image.src;
        fullscreenTitle.textContent = this.options.title;
        fullscreenDimensions.textContent = `${this.naturalWidth} × ${this.naturalHeight}`;
        
        overlay.classList.add('active');
        this.isFullscreen = true;
        
        // Reset fullscreen transforms
        this.resetZoom(true);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    exitFullscreen() {
        const overlay = this.viewerElement.querySelector('.fullscreen-overlay');
        overlay.classList.remove('active');
        this.isFullscreen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Action methods
    downloadImage() {
        const link = document.createElement('a');
        link.href = this.image.src;
        link.download = `${this.options.title.replace(/[^a-z0-9]/gi, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async copyImage() {
        try {
            if (navigator.clipboard && window.ClipboardItem) {
                // Modern clipboard API
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                
                ctx.drawImage(this.image, 0, 0);
                
                canvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        this.showNotification('Image copied to clipboard!');
                    } catch (err) {
                        this.fallbackCopy();
                    }
                });
            } else {
                this.fallbackCopy();
            }
        } catch (err) {
            this.fallbackCopy();
        }
    }

    fallbackCopy() {
        // Fallback: copy image URL
        navigator.clipboard.writeText(this.image.src).then(() => {
            this.showNotification('Image URL copied to clipboard!');
        }).catch(() => {
            this.showNotification('Copy not supported on this device');
        });
    }

    shareImage() {
        if (navigator.share) {
            navigator.share({
                title: this.options.title,
                text: this.options.subtitle,
                url: this.image.src
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.image.src).then(() => {
                this.showNotification('Image URL copied to clipboard!');
            }).catch(() => {
                this.showNotification('Sharing not supported on this device');
            });
        }
    }

    showImageInfo() {
        const info = {
            'File Name': this.options.title,
            'Dimensions': `${this.naturalWidth} × ${this.naturalHeight} pixels`,
            'Aspect Ratio': (this.naturalWidth / this.naturalHeight).toFixed(2),
            'Format': this.getImageFormat(),
            'Size': this.getImageSize()
        };

        let infoText = 'Image Information:\n\n';
        for (const [key, value] of Object.entries(info)) {
            if (value) infoText += `${key}: ${value}\n`;
        }

        alert(infoText);
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getImageFormat() {
        if (this.image.src.includes('data:image/')) {
            const format = this.image.src.split('data:image/')[1].split(';')[0];
            return format.toUpperCase();
        }
        return 'Unknown';
    }

    getImageSize() {
        if (this.image.src.startsWith('data:')) {
            const base64Data = this.image.src.split(',')[1];
            const sizeInBytes = Math.round((base64Data.length * 3) / 4);
            return this.formatFileSize(sizeInBytes);
        }
        return '';
    }

    showError(message) {
        const container = this.viewerElement.querySelector('.image-container');
        container.innerHTML = `
            <div class="error-message">
                <svg class="error-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.9 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H5V21H19V9Z"/>
                </svg>
                <div>${message}</div>
            </div>
        `;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 2000);
    }

    // Keyboard shortcuts
    handleKeyboard(e) {
        if (!this.isFullscreen) return;
        
        switch(e.code) {
            case 'Escape':
                e.preventDefault();
                this.exitFullscreen();
                break;
            case 'Equal':
            case 'NumpadAdd':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.zoomIn(true);
                }
                break;
            case 'Minus':
            case 'NumpadSubtract':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.zoomOut(true);
                }
                break;
            case 'Digit0':
            case 'Numpad0':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.resetZoom(true);
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.rotateImage(-90);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.rotateImage(90);
                break;
        }
    }

    // Public API methods
    setImage(imageData) {
        this.imageData = imageData;
        this.imageLoaded = false;
        this.resetZoom();
        this.rotation = 0;
        
        // Update image source
        if (typeof imageData === 'string') {
            this.image.src = imageData;
        } else if (imageData instanceof Blob || imageData instanceof File) {
            this.image.src = URL.createObjectURL(imageData);
        } else if (imageData instanceof ArrayBuffer) {
            const blob = new Blob([imageData], { type: 'image/png' });
            this.image.src = URL.createObjectURL(blob);
        }
        
        // Show loading state
        const container = this.viewerElement.querySelector('.image-container');
        container.innerHTML = `
            <div class="image-loading">
                <div class="loading-spinner"></div>
                Loading image...
            </div>
        `;
        
        this.viewerElement.classList.add('loading');
    }

    getImageData() {
        return this.imageData;
    }

    getCurrentZoom() {
        return this.zoomLevel;
    }

    getCurrentPan() {
        return { x: this.panX, y: this.panY };
    }

    getCurrentRotation() {
        return this.rotation || 0;
    }

    getDimensions() {
        return {
            width: this.naturalWidth,
            height: this.naturalHeight
        };
    }

    isImageLoaded() {
        return this.imageLoaded;
    }

    destroy() {
        // Exit fullscreen if active
        if (this.isFullscreen) {
            this.exitFullscreen();
        }
        
        // Revoke object URL if it was created
        if (this.image.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.image.src);
        }
        
        // Remove element
        if (this.viewerElement && this.viewerElement.parentNode) {
            this.viewerElement.parentNode.removeChild(this.viewerElement);
        }
    }

    // Event listener methods
    addEventListener(event, callback) {
        this.viewerElement.addEventListener(event, callback);
    }

    removeEventListener(event, callback) {
        this.viewerElement.removeEventListener(event, callback);
    }
}

// Add slide animations to document if not already present
if (!document.getElementById('image-viewer-animations')) {
    const animations = document.createElement('style');
    animations.id = 'image-viewer-animations';
    animations.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(animations);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageViewer;
} else if (typeof window !== 'undefined') {
    window.ImageViewer = ImageViewer;
}

/*
 * COMPACT USAGE EXAMPLES:
 * 
 * // Basic usage with base64 image data
 * const imageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
 * const container = document.getElementById('my-container');
 * const viewer = new ImageViewer(imageData, container);
 * 
 * // With custom options
 * const viewer = new ImageViewer(imageData, container, {
 *     title: "My Generated Image",
 *     subtitle: "Created by AI Assistant",
 *     theme: "dark", // "gradient", "dark", "light"
 *     maxHeight: "500px",
 *     showDownload: true,
 *     showShare: true,
 *     showFullscreen: true,
 *     enableZoom: true,
 *     enablePan: true
 * });
 * 
 * // With File or Blob objects
 * const fileInput = document.getElementById('file-input');
 * fileInput.addEventListener('change', (e) => {
 *     const file = e.target.files[0];
 *     if (file) {
 *         const viewer = new ImageViewer(file, container, {
 *             title: file.name,
 *             subtitle: `${file.type} • ${(file.size / 1024).toFixed(1)} KB`
 *         });
 *     }
 * });
 * 
 * // Public API usage
 * viewer.zoomIn();
 * viewer.zoomOut();
 * viewer.resetZoom();
 * viewer.rotateImage(90);
 * viewer.enterFullscreen();
 * viewer.setImage(newImageData) **/