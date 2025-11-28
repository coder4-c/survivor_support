// Safe Circle Frontend JavaScript
class SafeCircleApp {
    constructor() {
        this.currentSection = 'home';
        this.uploadedFiles = [];
        this.apiBaseUrl = 'http://localhost:3000'; // Backend URL
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.notifications = [];
        this.notificationCount = 3;
        this.isNotificationCenterOpen = false;
        this.modalQueue = [];
        this.currentModal = null;
        
        this.init();
    }

    // Dark Mode Functionality
    setupDarkMode() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', () => {
            this.toggleDarkMode();
        });
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('darkMode', this.isDarkMode);
        
        // Announce theme change to screen readers
        const message = this.isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
        this.announceToScreenReader(message);
    }

    applyTheme() {
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    initializeTheme() {
        // Check for system preference
        if (!localStorage.getItem('darkMode')) {
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.applyTheme();
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Add skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Focus management for modal-like interactions
        this.setupFocusManagement();

        // Announce page changes
        this.setupPageChangeAnnouncements();
    }

    handleKeyboardNavigation(e) {
        // Enhanced ESC key handling
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
            
            // Close any open notifications
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => notification.remove());
        }

        // Arrow key navigation for menu items
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('nav-link')) {
                e.preventDefault();
                this.navigateMenuWithArrows(e.key === 'ArrowDown');
            }
        }
    }

    navigateMenuWithArrows(moveNext) {
        const menuItems = document.querySelectorAll('.nav-link');
        const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
        let nextIndex;

        if (moveNext) {
            nextIndex = (currentIndex + 1) % menuItems.length;
        } else {
            nextIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
        }

        menuItems[nextIndex].focus();
    }

    setupFocusManagement() {
        // Track focus for trap in modals/overlays
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusable = document.querySelectorAll(this.focusableElements);
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    setupPageChangeAnnouncements() {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            this.liveRegion = liveRegion;
        }
    }

    announceToScreenReader(message, priority = 'polite') {
        const region = priority === 'assertive' ? 
            document.getElementById('urgent-region') : 
            this.liveRegion;
        
        if (region) {
            region.textContent = message;
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Return focus to toggle button
            navToggle.focus();
        }
    }

    // Notification Center Functionality
    setupNotificationCenter() {
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationCenter = document.getElementById('notificationCenter');
        const notificationClose = document.getElementById('notificationClose');

        if (notificationBtn && notificationCenter) {
            notificationBtn.addEventListener('click', () => {
                this.toggleNotificationCenter();
            });

            if (notificationClose) {
                notificationClose.addEventListener('click', () => {
                    this.closeNotificationCenter();
                });
            }

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (this.isNotificationCenterOpen && 
                    !notificationCenter.contains(e.target) && 
                    !notificationBtn.contains(e.target)) {
                    this.closeNotificationCenter();
                }
            });
        }

        this.updateNotificationBadge();
    }

    toggleNotificationCenter() {
        const notificationCenter = document.getElementById('notificationCenter');
        if (notificationCenter) {
            this.isNotificationCenterOpen = !this.isNotificationCenterOpen;
            notificationCenter.classList.toggle('active', this.isNotificationCenterOpen);
            
            if (this.isNotificationCenterOpen) {
                this.announceToScreenReader('Notification center opened');
            }
        }
    }

    closeNotificationCenter() {
        const notificationCenter = document.getElementById('notificationCenter');
        if (notificationCenter) {
            this.isNotificationCenterOpen = false;
            notificationCenter.classList.remove('active');
        }
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (this.notificationCount > 0) {
                badge.textContent = this.notificationCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    addNotification(title, message, type = 'info', autoClose = true) {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item unread';
        notificationItem.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <div>
                <strong>${title}</strong>
                <p>${message}</p>
                <small>Just now</small>
            </div>
        `;

        // Add click handler to mark as read
        notificationItem.addEventListener('click', () => {
            this.markNotificationAsRead(notificationItem);
        });

        notificationList.insertBefore(notificationItem, notificationList.firstChild);
        this.notificationCount++;
        this.updateNotificationBadge();

        // Auto-close after delay if specified
        if (autoClose) {
            setTimeout(() => {
                this.removeNotification(notificationItem);
            }, 10000);
        }

        this.announceToScreenReader(`New ${type} notification: ${title}`);
    }

    markNotificationAsRead(element) {
        element.classList.remove('unread');
        this.notificationCount = Math.max(0, this.notificationCount - 1);
        this.updateNotificationBadge();
    }

    removeNotification(element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
            this.notificationCount = Math.max(0, this.notificationCount - 1);
            this.updateNotificationBadge();
        }
    }

    // Modal System
    setupModalSystem() {
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modalCancel) {
            modalCancel.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modalConfirm) {
            modalConfirm.addEventListener('click', () => {
                this.handleModalConfirm();
            });
        }

        // Close on backdrop click
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.closeModal();
                }
            });
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }

    showModal(title, message, onConfirm = null, options = {}) {
        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalConfirm = document.getElementById('modalConfirm');

        if (modal && modalTitle && modalMessage && modalConfirm) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modalConfirm.textContent = options.confirmText || 'Confirm';
            modalConfirm.className = `btn ${options.confirmClass || 'btn-primary'}`;

            this.currentModal = {
                onConfirm: onConfirm,
                options: options
            };

            modal.classList.add('active');
            this.announceToScreenReader(`Modal opened: ${title}`);
            
            // Focus management
            setTimeout(() => {
                modalConfirm.focus();
            }, 100);
        }
    }

    closeModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.remove('active');
            this.currentModal = null;
        }

        // Close any open modal backdrops
        document.querySelectorAll('.modal-backdrop.active').forEach(backdrop => {
            backdrop.classList.remove('active');
        });
    }

    handleModalConfirm() {
        if (this.currentModal && this.currentModal.onConfirm) {
            this.currentModal.onConfirm();
        }
        this.closeModal();
    }

    // Enhanced File Upload with Progress
    async handleFileUpload() {
        if (this.uploadedFiles.length === 0) {
            this.showNotification('Please select files to upload.', 'error');
            return;
        }

        // Show upload modal with progress
        this.showUploadModal();

        this.showLoading(true);

        try {
            const formData = new FormData();
            this.uploadedFiles.forEach(item => {
                formData.append('files', item.file);
            });

            // Simulate progress updates
            this.updateUploadProgress(0, 'Preparing files...');
            
            // Simulate progress
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 200));
                this.updateUploadProgress(i, `Uploading... ${i}%`);
            }

            const response = await fetch(`${this.apiBaseUrl}/api/evidence/upload-evidence`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.updateUploadProgress(100, 'Upload completed successfully!');
                
                setTimeout(() => {
                    this.closeUploadModal();
                }, 2000);

                this.showNotification('Files uploaded securely. Your evidence is now protected.', 'success');
                this.uploadedFiles = [];
                this.renderFileList();
                document.getElementById('fileInput').value = '';
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            this.showNotification('Failed to upload files. Please try again later.', 'error');
            this.closeUploadModal();
        } finally {
            this.showLoading(false);
        }
    }

    showUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    updateUploadProgress(percentage, status) {
        const progressFill = document.getElementById('uploadProgress');
        const progressText = document.getElementById('uploadProgressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = status;
        }
    }

    // FAB (Floating Action Button) Functionality
    setupFab() {
        const fabButton = document.getElementById('fabButton');
        if (fabButton) {
            fabButton.addEventListener('click', () => {
                this.handleFabClick();
            });
        }
    }

    handleFabClick() {
        const actions = [
            {
                text: 'New Support Request',
                icon: 'fa-hands-helping',
                section: 'support',
                color: 'primary'
            },
            {
                text: 'Upload Evidence',
                icon: 'fa-lock',
                section: 'evidence',
                color: 'success'
            },
            {
                text: 'Emergency Help',
                icon: 'fa-phone',
                section: 'emergency',
                color: 'emergency'
            }
        ];

        this.showModal(
            'Quick Actions',
            'What would you like to do?',
            null,
            {
                customContent: this.createFabMenu(actions)
            }
        );
    }

    createFabMenu(actions) {
        const menu = document.createElement('div');
        menu.innerHTML = actions.map(action => `
            <button class="btn btn-${action.color} fab-menu-item" data-section="${action.section}">
                <i class="fas ${action.icon}"></i>
                ${action.text}
            </button>
        `).join('');

        // Add event listeners
        menu.querySelectorAll('.fab-menu-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
                this.closeModal();
            });
        });

        return menu;
    }

    // Enhanced Form Validation
    setupFormValidation() {
        const supportForm = document.getElementById('supportForm');
        if (supportForm) {
            // Real-time validation
            const requiredFields = supportForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            });

            // Enhanced form submission
            supportForm.addEventListener('submit', (e) => {
                this.handleEnhancedFormSubmission(e);
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required.`;
        }

        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Message length validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details (at least 10 characters).';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    showFieldError(field, message) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.id}-error`);

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.id = `${field.id}-error`;
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: var(--danger-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        errorElement.textContent = message;

        field.parentNode.appendChild(errorElement);

        // Add error styling
        field.style.borderColor = 'var(--danger-color)';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    }

    clearFieldError(field) {
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.remove();
        }

        // Reset field styling
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    async handleEnhancedFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name') || null,
            email: formData.get('email') || null,
            type: formData.get('type'),
            message: formData.get('message')
        };

        // Validate all fields
        const requiredFields = form.querySelectorAll('[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors in the form before submitting.', 'error');
            this.announceToScreenReader('Form submission failed. Please check the errors.', 'assertive');
            return;
        }

        this.showLoading(true);
        this.announceToScreenReader('Submitting support request...');

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/support/support-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('Support request submitted successfully. We will contact you soon.', 'success');
                this.announceToScreenReader('Support request submitted successfully.');
                form.reset();
                this.clearAllFieldErrors(form);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting support request:', error);
            this.showNotification('Failed to submit support request. Please try again later.', 'error');
            this.announceToScreenReader('Support request submission failed. Please try again.', 'assertive');
        } finally {
            this.showLoading(false);
        }
    }

    clearAllFieldErrors(form) {
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(element => element.remove());
        
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.setAttribute('aria-invalid', 'false');
            field.style.borderColor = '';
            field.style.boxShadow = '';
        });
    }

    init() {
        this.setupEventListeners();
        this.setupFileUpload();
        this.setupDarkMode();
        this.setupAccessibility();
        this.setupFormValidation();
        this.setupNotificationCenter();
        this.setupModalSystem();
        this.setupFab();
        this.showSection('home');
        this.initializeTheme();
        this.loadInitialData();
    }

    loadInitialData() {
        // Load user data for dashboard
        setTimeout(() => {
            this.updateDashboardStats();
        }, 1000);

        // Simulate receiving new notifications
        setTimeout(() => {
            this.addNotification(
                'Welcome to Safe Circle',
                'Your secure support platform is ready to help.',
                'success',
                false
            );
        }, 2000);
    }

    updateDashboardStats() {
        // This would typically fetch data from the backend
        // For now, we'll simulate with random data
        const stats = {
            supportRequests: Math.floor(Math.random() * 5) + 1,
            evidenceFiles: Math.floor(Math.random() * 10) + 3,
            sessionStatus: 'active'
        };

        // Update dashboard display if on dashboard section
        if (this.currentSection === 'dashboard') {
            const supportStat = document.querySelector('.dashboard-card:nth-child(1) .dashboard-stat');
            const evidenceStat = document.querySelector('.dashboard-card:nth-child(2) .dashboard-stat');
            
            if (supportStat) supportStat.textContent = stats.supportRequests;
            if (evidenceStat) evidenceStat.textContent = stats.evidenceFiles;
        }
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Hero action buttons
        document.querySelectorAll('[data-section]').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Support form submission
        const supportForm = document.getElementById('supportForm');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                this.handleSupportFormSubmission(e);
            });
        }

        // Upload button
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.handleFileUpload();
            });
        }

        // Support action buttons
        document.querySelectorAll('.support-card .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleSupportAction(e);
            });
        });

        // Emergency action buttons
        document.querySelectorAll('.emergency-card .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleEmergencyAction(e);
            });
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        if (uploadArea && fileInput) {
            // Drag and drop functionality
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = Array.from(e.dataTransfer.files);
                this.addFiles(files);
            });

            // Click to select files
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.addFiles(files);
            });
        }
    }

    addFiles(files) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                             'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        files.forEach(file => {
            if (allowedTypes.includes(file.type) && file.size <= maxSize) {
                this.uploadedFiles.push({
                    file: file,
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            } else {
                this.showNotification('Invalid file type or size. Please use PDF, DOC, DOCX, JPG, PNG, or TXT files under 10MB.', 'error');
            }
        });

        this.renderFileList();
    }

    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(item => item.id !== fileId);
        this.renderFileList();
    }

    renderFileList() {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;

        if (this.uploadedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }

        fileList.innerHTML = this.uploadedFiles.map(item => `
            <div class="file-item card-enhanced">
                <div class="file-info">
                    <i class="fas ${this.getFileIcon(item.type)}"></i>
                    <div class="file-details">
                        <span class="file-name">${item.name}</span>
                        <small class="file-size">(${this.formatFileSize(item.size)})</small>
                        <div class="file-progress" style="display: none;">
                            <div class="progress-bar-container">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-preview" onclick="app.previewFile(${item.id})" title="Preview">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="file-remove" onclick="app.removeFile(${item.id})" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    previewFile(fileId) {
        const fileItem = this.uploadedFiles.find(item => item.id === fileId);
        if (!fileItem) return;

        const file = fileItem.file;
        const fileType = fileItem.type;

        if (fileType.startsWith('image/')) {
            this.showImagePreview(file);
        } else {
            this.showGenericPreview(fileItem);
        }
    }

    showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const modal = document.getElementById('confirmationModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalConfirm = document.getElementById('modalConfirm');

            if (modal && modalTitle && modalMessage && modalConfirm) {
                modalTitle.textContent = 'Image Preview';
                modalMessage.innerHTML = `
                    <div style="text-align: center;">
                        <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 400px; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-light);">
                            ${file.name} - ${this.formatFileSize(file.size)}
                        </p>
                    </div>
                `;
                modalConfirm.style.display = 'none';
                
                modal.classList.add('active');
            }
        };
        reader.readAsDataURL(file);
    }

    showGenericPreview(fileItem) {
        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalConfirm = document.getElementById('modalConfirm');

        if (modal && modalTitle && modalMessage && modalConfirm) {
            modalTitle.textContent = 'File Information';
            modalMessage.innerHTML = `
                <div class="file-preview-info">
                    <div class="file-icon-large">
                        <i class="fas ${this.getFileIcon(fileItem.type)}"></i>
                    </div>
                    <div class="file-details-preview">
                        <h4>${fileItem.name}</h4>
                        <p><strong>Type:</strong> ${fileItem.type || 'Unknown'}</p>
                        <p><strong>Size:</strong> ${this.formatFileSize(fileItem.size)}</p>
                        <p><strong>Last Modified:</strong> ${new Date(fileItem.file.lastModified).toLocaleDateString()}</p>
                        <div class="badge badge-primary">${this.getFileTypeDescription(fileItem.type)}</div>
                    </div>
                </div>
            `;
            modalConfirm.style.display = 'none';
            
            modal.classList.add('active');
        }
    }

    getFileTypeDescription(fileType) {
        const descriptions = {
            'application/pdf': 'PDF Document',
            'application/msword': 'Word Document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
            'image/jpeg': 'JPEG Image',
            'image/jpg': 'JPEG Image',
            'image/png': 'PNG Image',
            'text/plain': 'Text File'
        };
        return descriptions[fileType] || 'Unknown File Type';
    }

    getFileIcon(fileType) {
        const iconMap = {
            'application/pdf': 'fa-file-pdf',
            'application/msword': 'fa-file-word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
            'image/jpeg': 'fa-file-image',
            'image/jpg': 'fa-file-image',
            'image/png': 'fa-file-image',
            'text/plain': 'fa-file-alt'
        };
        return iconMap[fileType] || 'fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.setAttribute('aria-hidden', 'true');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.setAttribute('aria-hidden', 'false');
            this.currentSection = sectionName;
            
            // Focus management for accessibility
            setTimeout(() => {
                this.focusSection(targetSection);
            }, 100);
        }

        // Update navigation with enhanced accessibility
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Close mobile menu
        this.closeMobileMenu();

        // Update page title
        document.title = `Safe Circle - ${this.getSectionTitle(sectionName)}`;
        
        // Announce section change to screen readers
        this.announceToScreenReader(`Navigated to ${this.getSectionTitle(sectionName)} section`);
    }

    focusSection(section) {
        // Focus the main heading of the section for screen readers
        const heading = section.querySelector('h1, h2');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
            
            // Remove tabindex after focus to maintain natural tab order
            setTimeout(() => {
                heading.removeAttribute('tabindex');
            }, 100);
        }
    }

    getSectionTitle(section) {
        const titles = {
            'home': 'Survivor Support',
            'support': 'Get Support',
            'evidence': 'Secure Upload',
            'emergency': 'Emergency Support',
            'dashboard': 'Dashboard'
        };
        return titles[section] || 'Safe Circle';
    }

    async handleSupportFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name') || null,
            email: formData.get('email') || null,
            type: formData.get('type'),
            message: formData.get('message')
        };

        if (!data.type || !data.message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/support/support-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('Support request submitted successfully. We will contact you soon.', 'success');
                form.reset();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting support request:', error);
            this.showNotification('Failed to submit support request. Please try again later.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleFileUpload() {
        if (this.uploadedFiles.length === 0) {
            this.showNotification('Please select files to upload.', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const formData = new FormData();
            this.uploadedFiles.forEach(item => {
                formData.append('files', item.file);
            });

            const response = await fetch(`${this.apiBaseUrl}/api/evidence/upload-evidence`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.showNotification('Files uploaded securely. Your evidence is now protected.', 'success');
                this.uploadedFiles = [];
                this.renderFileList();
                document.getElementById('fileInput').value = '';
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            this.showNotification('Failed to upload files. Please try again later.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleSupportAction(e) {
        const buttonText = e.target.textContent.trim();
        
        switch (buttonText) {
            case 'Start Chat':
                this.showNotification('Chat support is coming soon. Please use the support form or call our hotline.', 'info');
                break;
            case 'Call Now':
                this.makePhoneCall('+1-800-SUPPORT');
                break;
            case 'Book Now':
                this.showNotification('Appointment booking is coming soon. Please use the support form to request a session.', 'info');
                break;
        }
    }

    handleEmergencyAction(e) {
        const buttonText = e.target.textContent.trim();
        
        switch (buttonText) {
            case 'Call Now':
                this.makeEmergencyCall();
                break;
            case 'Get Help':
                this.showSection('support');
                this.showNotification('For immediate safe house placement, please call our emergency hotline.', 'info');
                break;
        }
    }

    makePhoneCall(phoneNumber) {
        if (confirm(`Would you like to call ${phoneNumber}?`)) {
            window.location.href = `tel:${phoneNumber}`;
        }
    }

    makeEmergencyCall() {
        const confirmed = confirm(
            'Are you currently in immediate danger?\n\n' +
            'If yes, please call 911 immediately.\n\n' +
            'If you need crisis support, press OK to call our hotline.'
        );
        
        if (confirmed) {
            window.location.href = 'tel:+1-800-XXX-XXXX';
        }
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('active', show);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        return colors[type] || colors.info;
    }

    // Utility methods
    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/`);
            return response.ok;
        } catch (error) {
            console.warn('Backend connection failed:', error);
            return false;
        }
    }

    // Initialize app when DOM is loaded
    static init() {
        // Check if we're on the frontend page
        if (document.querySelector('.nav-brand')) {
            window.app = new SafeCircleApp();
        }
    }
}

// Global functions for inline event handlers
function callEmergency() {
    if (window.app) {
        window.app.makeEmergencyCall();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SafeCircleApp.init);
} else {
    SafeCircleApp.init();
}

// Service Worker for offline support (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (window.app && event.state && event.state.section) {
        window.app.showSection(event.state.section);
    }
});

// Update history when changing sections
const originalShowSection = SafeCircleApp.prototype.showSection;
SafeCircleApp.prototype.showSection = function(sectionName) {
    originalShowSection.call(this, sectionName);
    
    // Update browser history
    const url = new URL(window.location);
    url.hash = `#${sectionName}`;
    history.pushState({ section: sectionName }, '', url);
};

// Load section from URL hash on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'support', 'evidence', 'emergency'].includes(hash)) {
        setTimeout(() => {
            if (window.app) {
                window.app.showSection(hash);
            }
        }, 100);
    }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // User left the tab - could implement auto-logout or session timeout
        console.log('User left the page');
    } else {
        // User returned - could implement session refresh
        console.log('User returned to the page');
    }
});

// Keyboard accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
    
    // Ctrl/Cmd + K to focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if it exists
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // In production, you might want to send this to an error tracking service
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafeCircleApp;
}