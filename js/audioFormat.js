/**
 * Compact Pure JavaScript Audio Player - One Third Height
 * Creates a beautiful compact audio player that accepts audio data and displays a nice UI
 * Usage: const player = new AudioPlayer(audioData, containerElement);
 */

export class AudioPlayer {
    constructor(audioData, container, options = {}) {
        this.audioData = audioData;
        this.container = container;
        this.options = {
            title: options.title || 'Audio Response',
            subtitle: options.subtitle || 'AI Generated Audio',
            showDownload: options.showDownload !== false,
            showShare: options.showShare !== false,
            showTranscript: options.showTranscript !== false,
            theme: options.theme || 'gradient', // 'gradient', 'dark', 'light'
            ...options
        };
        
        this.audio = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1;
        this.playbackRate = 1;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        this.injectStyles();
        this.createAudioElement();
        this.createPlayerElement();
        this.setupEventListeners();
    }
    
    injectStyles() {
        if (document.getElementById('audio-player-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'audio-player-styles';
        styles.textContent = `
            .audio-player {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 16px;
                margin: 8px 0;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                color: white;
                position: relative;
                overflow: hidden;
                max-width: 600px;
                user-select: none;
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-height: 120px;
            }
            
            .audio-player.theme-dark {
                background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }
            
            .audio-player.theme-light {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                color: #2d3748;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            }
            
            .audio-player::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
                pointer-events: none;
            }
            
            .audio-player-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                z-index: 2;
                min-height: 40px;
            }
            
            .audio-info {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                min-width: 0;
            }
            
            .audio-icon {
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
            
            .audio-text {
                min-width: 0;
                flex: 1;
            }
            
            .audio-title {
                font-weight: 600;
                font-size: 15px;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
            }
            
            .audio-subtitle {
                font-size: 12px;
                opacity: 0.7;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
            }
            
            .audio-duration {
                text-align: right;
                font-size: 11px;
                opacity: 0.8;
                flex-shrink: 0;
                margin-left: 12px;
                line-height: 1.3;
            }
            
            .current-time {
                font-size: 13px;
                font-weight: 600;
                display: block;
            }
            
            .total-time {
                opacity: 0.6;
                display: block;
            }
            
            .main-controls {
                display: flex;
                align-items: center;
                gap: 12px;
                position: relative;
                z-index: 2;
            }
            
            .left-controls {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
            }
            
            .waveform-container {
                flex: 1;
                position: relative;
                margin: 0 12px;
            }
            
            .waveform-track {
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                position: relative;
                cursor: pointer;
                overflow: hidden;
                transition: height 0.2s ease;
            }
            
            .waveform-track:hover {
                height: 8px;
            }
            
            .waveform-progress {
                height: 100%;
                background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
                border-radius: 3px;
                width: 0%;
                transition: width 0.1s ease;
                position: relative;
            }
            
            .waveform-thumb {
                position: absolute;
                right: -6px;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: all 0.2s ease;
                cursor: grab;
            }
            
            .waveform-thumb:active {
                cursor: grabbing;
            }
            
            .waveform-container:hover .waveform-thumb {
                opacity: 1;
            }
            
            .right-controls {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
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
            
            .play-pause-btn {
                width: 44px;
                height: 44px;
                background: rgba(255, 255, 255, 0.15);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .control-icon {
                width: 18px;
                height: 18px;
                fill: currentColor;
            }
            
            .play-pause-btn .control-icon {
                width: 22px;
                height: 22px;
            }
            
            .secondary-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                z-index: 2;
                gap: 12px;
            }
            
            .speed-control {
                position: relative;
            }
            
            .speed-btn {
                background: rgba(255, 255, 255, 0.08);
                border: none;
                border-radius: 16px;
                padding: 6px 12px;
                color: inherit;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
            }
            
            .speed-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            
            .speed-menu {
                position: absolute;
                bottom: calc(100% + 6px);
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                border-radius: 8px;
                padding: 6px;
                display: none;
                flex-direction: column;
                gap: 1px;
                backdrop-filter: blur(20px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .speed-menu.show {
                display: flex;
                animation: fadeInUp 0.2s ease;
            }
            
            .speed-option {
                background: transparent;
                border: none;
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                white-space: nowrap;
                transition: background 0.2s ease;
                text-align: center;
            }
            
            .speed-option:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .speed-option.active {
                background: rgba(255, 255, 255, 0.15);
                font-weight: 600;
            }
            
            .volume-control {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .volume-btn {
                background: transparent;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 6px;
                border-radius: 50%;
                transition: background 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .volume-btn:hover {
                background: rgba(255, 255, 255, 0.08);
            }
            
            .volume-slider {
                width: 60px;
                height: 3px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
            }
            
            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
                transition: transform 0.2s ease;
            }
            
            .volume-slider::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }
            
            .volume-slider::-moz-range-thumb {
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
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
            
            @keyframes fadeInUp {
                from { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(4px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(0); 
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
                .audio-player {
                    padding: 12px;
                    margin: 6px 0;
                    gap: 10px;
                    min-height: 100px;
                }
                
                .main-controls {
                    gap: 8px;
                }
                
                .left-controls, .right-controls {
                    gap: 6px;
                }
                
                .control-btn {
                    width: 32px;
                    height: 32px;
                }
                
                .play-pause-btn {
                    width: 40px;
                    height: 40px;
                }
                
                .control-icon {
                    width: 16px;
                    height: 16px;
                }
                
                .play-pause-btn .control-icon {
                    width: 20px;
                    height: 20px;
                }
                
                .volume-control {
                    display: none;
                }
                
                .waveform-container {
                    margin: 0 8px;
                }
                
                .action-buttons {
                    gap: 6px;
                }
                
                .action-btn {
                    padding: 6px 10px;
                    font-size: 10px;
                }
                
                .audio-info {
                    gap: 8px;
                }
                
                .audio-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 16px;
                }
                
                .secondary-controls {
                    gap: 8px;
                }
                
                .volume-slider {
                    width: 40px;
                }
            }
            
            .hidden {
                display: none !important;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    createAudioElement() {
        this.audio = new Audio();
        
        // Handle different audio data formats
        if (typeof this.audioData === 'string') {
            // Base64 data URL or regular URL
            this.audio.src = this.audioData;
        } else if (this.audioData instanceof Blob || this.audioData instanceof File) {
            // Blob or File object
            this.audio.src = URL.createObjectURL(this.audioData);
        } else if (this.audioData instanceof ArrayBuffer) {
            // ArrayBuffer
            const blob = new Blob([this.audioData], { type: 'audio/mpeg' });
            this.audio.src = URL.createObjectURL(blob);
        }
        
        this.audio.preload = 'metadata';
    }
    
    createPlayerElement() {
        const player = document.createElement('div');
        player.className = `audio-player theme-${this.options.theme}`;
        
        player.innerHTML = `
            <div class="audio-player-header">
                <div class="audio-info">
                    <div class="audio-icon">🎵</div>
                    <div class="audio-text">
                        <div class="audio-title">${this.options.title}</div>
                        <div class="audio-subtitle">${this.options.subtitle}</div>
                    </div>
                </div>
                <div class="audio-duration">
                    <span class="current-time">0:00</span>
                    <span class="total-time">0:00</span>
                </div>
            </div>

            <div class="main-controls">
                <div class="left-controls">
                    <button class="control-btn rewind-btn" title="Rewind 10s">
                        <svg class="control-icon" viewBox="0 0 24 24">
                            <path d="M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z"/>
                        </svg>
                    </button>

                    <button class="control-btn play-pause-btn" title="Play/Pause">
                        <svg class="control-icon play-icon" viewBox="0 0 24 24">
                            <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                        </svg>
                        <svg class="control-icon pause-icon hidden" viewBox="0 0 24 24">
                            <path d="M14,19V5H18V19H14M6,19V5H10V19H6Z"/>
                        </svg>
                    </button>

                    <button class="control-btn forward-btn" title="Forward 10s">
                        <svg class="control-icon" viewBox="0 0 24 24">
                            <path d="M12,5V1L17,6L12,11V7A6,6 0 0,0 6,13A6,6 0 0,0 12,19A6,6 0 0,0 18,13H20A8,8 0 0,1 12,21A8,8 0 0,1 4,13A8,8 0 0,1 12,5Z"/>
                        </svg>
                    </button>
                </div>

                <div class="waveform-container">
                    <div class="waveform-track">
                        <div class="waveform-progress">
                            <div class="waveform-thumb"></div>
                        </div>
                    </div>
                </div>

                <div class="right-controls">
                    <div class="volume-control">
                        <button class="volume-btn" title="Volume">
                            <svg class="control-icon" viewBox="0 0 24 24">
                                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                            </svg>
                        </button>
                        <input type="range" class="volume-slider" min="0" max="100" value="100" title="Volume">
                    </div>
                </div>
            </div>

            <div class="secondary-controls">
                <div class="speed-control">
                    <button class="speed-btn" title="Playbook Speed">
                        <span class="speed-text">1.0x</span>
                    </button>
                    <div class="speed-menu">
                        <button class="speed-option" data-speed="0.5">0.5x</button>
                        <button class="speed-option" data-speed="0.75">0.75x</button>
                        <button class="speed-option active" data-speed="1">1.0x</button>
                        <button class="speed-option" data-speed="1.25">1.25x</button>
                        <button class="speed-option" data-speed="1.5">1.5x</button>
                        <button class="speed-option" data-speed="2">2.0x</button>
                    </div>
                </div>

                ${this.createActionButtons()}
            </div>
        `;
        
        this.container.appendChild(player);
        this.playerElement = player;
    }
    
    createActionButtons() {
        const buttons = [];
        
        if (this.options.showDownload) {
            buttons.push(`
                <button class="action-btn download-btn" title="Download Audio">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                    </svg>
                    Download
                </button>
            `);
        }
        
        if (this.options.showShare) {
            buttons.push(`
                <button class="action-btn share-btn" title="Share Audio">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19C20.92,17.39 19.61,16.08 18,16.08M18,4A1,1 0 0,1 19,5A1,1 0 0,1 18,6A1,1 0 0,1 17,5A1,1 0 0,1 18,4M6,13A1,1 0 0,1 7,12A1,1 0 0,1 6,11A1,1 0 0,1 5,12A1,1 0 0,1 6,13M18,20C17.45,20 17,19.55 17,19C17,18.45 17.45,18 18,18C18.55,18 19,18.45 19,19C19,19.55 18.55,20 18,20Z"/>
                    </svg>
                    Share
                </button>
            `);
        }
        
        if (this.options.showTranscript) {
            buttons.push(`
                <button class="action-btn transcript-btn" title="Show Transcript">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    Transcript
                </button>
            `);
        }
        
        return buttons.length > 0 ? buttons.join('') : '';
    }
    
    setupEventListeners() {
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
            this.playerElement.querySelector('.total-time').textContent = this.formatTime(this.duration);
            this.playerElement.classList.remove('loading');
        });

        this.audio.addEventListener('timeupdate', () => {
            if (!this.isDragging) {
                this.currentTime = this.audio.currentTime;
                this.updateProgress();
            }
        });

        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayPauseButton();
        });

        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showError('Error loading audio');
        });

        // Control events
        this.setupControlEvents();
    }
    
    setupControlEvents() {
        const player = this.playerElement;
        
        // Play/Pause
        player.querySelector('.play-pause-btn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Skip buttons
        player.querySelector('.rewind-btn').addEventListener('click', () => {
            this.skip(-10);
        });

        player.querySelector('.forward-btn').addEventListener('click', () => {
            this.skip(10);
        });

        // Progress bar
        const waveformTrack = player.querySelector('.waveform-track');
        const waveformThumb = player.querySelector('.waveform-thumb');

        waveformTrack.addEventListener('click', (e) => {
            if (!this.isDragging) {
                const rect = waveformTrack.getBoundingClientRect();
                const progress = (e.clientX - rect.left) / rect.width;
                this.seekTo(progress);
            }
        });

        // Thumb dragging
        waveformThumb.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const rect = waveformTrack.getBoundingClientRect();
                const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                this.updateProgressDisplay(progress);
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                const progress = parseFloat(this.playerElement.querySelector('.waveform-progress').style.width) / 100;
                this.seekTo(progress);
                this.isDragging = false;
            }
        });

        // Volume control
        const volumeSlider = player.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseFloat(e.target.value) / 100);
            });
        }

        // Speed control
        const speedBtn = player.querySelector('.speed-btn');
        const speedMenu = player.querySelector('.speed-menu');

        speedBtn.addEventListener('click', () => {
            speedMenu.classList.toggle('show');
        });

        speedMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('speed-option')) {
                const speed = parseFloat(e.target.dataset.speed);
                this.setPlaybackRate(speed);
                speedMenu.classList.remove('show');
            }
        });

        // Action buttons
        if (this.options.showDownload) {
            player.querySelector('.download-btn')?.addEventListener('click', () => {
                this.downloadAudio();
            });
        }

        if (this.options.showShare) {
            player.querySelector('.share-btn')?.addEventListener('click', () => {
                this.shareAudio();
            });
        }

        if (this.options.showTranscript) {
            player.querySelector('.transcript-btn')?.addEventListener('click', () => {
                this.toggleTranscript();
            });
        }

        // Close speed menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!speedBtn.contains(e.target) && !speedMenu.contains(e.target)) {
                speedMenu.classList.remove('show');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.audio-player') === player) {
                this.handleKeyboard(e);
            }
        });
    }
    
    // Player control methods
    togglePlayPause() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(e => {
                console.error('Play failed:', e);
                this.showError('Unable to play audio');
            });
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
    }

    skip(seconds) {
        const newTime = Math.max(0, Math.min(this.duration, this.audio.currentTime + seconds));
        this.audio.currentTime = newTime;
    }

    seekTo(progress) {
        this.audio.currentTime = progress * this.duration;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
        this.updateVolumeIcon();
    }

    setPlaybackRate(rate) {
        this.playbackRate = rate;
        this.audio.playbackRate = rate;
        this.playerElement.querySelector('.speed-text').textContent = `${rate}x`;

        // Update active speed option
        this.playerElement.querySelectorAll('.speed-option').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.speed) === rate);
        });
    }

    // UI update methods
    updatePlayPauseButton() {
        const playIcon = this.playerElement.querySelector('.play-icon');
        const pauseIcon = this.playerElement.querySelector('.pause-icon');

        if (this.isPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    updateProgress() {
        const progress = (this.currentTime / this.duration) * 100;
        this.updateProgressDisplay(progress / 100);
        this.playerElement.querySelector('.current-time').textContent = this.formatTime(this.currentTime);
    }

    updateProgressDisplay(progress) {
        const progressPercent = progress * 100;
        this.playerElement.querySelector('.waveform-progress').style.width = `${progressPercent}%`;
    }

    updateVolumeIcon() {
        const volumeBtn = this.playerElement.querySelector('.volume-btn');
        if (!volumeBtn) return;
        
        const volumeIcon = volumeBtn.querySelector('.control-icon');
        
        if (this.volume === 0) {
            volumeIcon.innerHTML = '<path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>';
        } else if (this.volume < 0.5) {
            volumeIcon.innerHTML = '<path d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"/>';
        } else {
            volumeIcon.innerHTML = '<path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>';
        }
    }

    // Utility methods
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(220, 38, 38, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
        `;
        errorDiv.textContent = message;
        this.playerElement.style.position = 'relative';
        this.playerElement.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    // Action methods
    downloadAudio() {
        const link = document.createElement('a');
        link.href = this.audio.src;
        link.download = `${this.options.title.replace(/[^a-z0-9]/gi, '_')}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    shareAudio() {
        if (navigator.share) {
            navigator.share({
                title: this.options.title,
                text: this.options.subtitle,
                url: this.audio.src
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.audio.src).then(() => {
                this.showNotification('Audio URL copied to clipboard!');
            }).catch(() => {
                this.showNotification('Sharing not supported on this device');
            });
        }
    }

    toggleTranscript() {
        // Emit custom event for transcript toggle
        this.playerElement.dispatchEvent(new CustomEvent('transcriptToggle', {
            detail: { player: this, isVisible: !this.transcriptVisible }
        }));
        this.transcriptVisible = !this.transcriptVisible;
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
            z-index: 1000;
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
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.skip(-10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.skip(10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(Math.min(1, this.volume + 0.1));
                const volumeSlider = this.playerElement.querySelector('.volume-slider');
                if (volumeSlider) volumeSlider.value = this.volume * 100;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(Math.max(0, this.volume - 0.1));
                const volumeSliderDown = this.playerElement.querySelector('.volume-slider');
                if (volumeSliderDown) volumeSliderDown.value = this.volume * 100;
                break;
        }
    }

    // Public API methods
    play() {
        if (!this.isPlaying) {
            this.togglePlayPause();
        }
    }

    pause() {
        if (this.isPlaying) {
            this.togglePlayPause();
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.updateProgress();
    }

    getCurrentTime() {
        return this.currentTime;
    }

    getDuration() {
        return this.duration;
    }

    setCurrentTime(time) {
        this.audio.currentTime = Math.max(0, Math.min(this.duration, time));
    }

    getVolume() {
        return this.volume;
    }

    getPlaybackRate() {
        return this.playbackRate;
    }

    isPlayerPlaying() {
        return this.isPlaying;
    }

    destroy() {
        this.audio.pause();
        this.audio.src = '';
        if (this.playerElement && this.playerElement.parentNode) {
            this.playerElement.parentNode.removeChild(this.playerElement);
        }
        
        // Revoke object URL if it was created
        if (this.audio.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.audio.src);
        }
    }

    // Event listener methods
    addEventListener(event, callback) {
        this.playerElement.addEventListener(event, callback);
    }

    removeEventListener(event, callback) {
        this.playerElement.removeEventListener(event, callback);
    }
}

// Add slide animations to document if not already present
if (!document.getElementById('audio-player-animations')) {
    const animations = document.createElement('style');
    animations.id = 'audio-player-animations';
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



/*
 * COMPACT USAGE EXAMPLES:
 * 
 * // Basic usage with base64 audio data
 * const audioData = "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjAuMTAwAAAAAAAAAAAAAAD/82DEAB3jReQzRhgBCDCAhBzyZMmn...";
 * const container = document.getElementById('my-container');
 * const player = new AudioPlayer(audioData, container);
 * 
 * // With custom options
 * const player = new AudioPlayer(audioData, container, {
 *     title: "My Custom Audio",
 *     subtitle: "Generated by AI Assistant",
 *     theme: "dark", // "gradient", "dark", "light"
 *     showDownload: true,
 *     showShare: false,
 *     showTranscript: true
 * });
 * 
 * // All functionality remains the same - just more compact!
 * player.play();
 * player.pause();
 * player.setVolume(0.5);
 * player.setPlaybackRate(1.5);
 */
