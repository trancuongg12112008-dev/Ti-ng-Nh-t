// Smooth scrolling and basic interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    document.body.classList.add('loaded');

    // Check deadline and disable submit button if expired
    checkDeadline();

    // Hiragana chart modal functionality
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.addEventListener('click', function() {
            openImageModal();
        });
    }
});

// Image modal functions
function openImageModal() {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="https://loptiengnhat.edu.vn/wp-content/uploads/2016/01/bang-chu-cai-tieng-nhat-hiragana.jpg" 
                     alt="Bảng chữ cái Hiragana" 
                     class="modal-image">
            </div>
        `;
        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeImageModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeImageModal();
            }
        });
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Check deadline function
function checkDeadline() {
    // Set deadline to 18/1/2026 20:00:00 Vietnam time
    const deadline = new Date('2026-01-18T20:00:00+07:00'); // UTC+7 Vietnam timezone
    const now = new Date();
    const submitBtn = document.getElementById('submit-btn');
    
    console.log('Current time:', now);
    console.log('Deadline:', deadline);
    console.log('Time difference (hours):', (deadline - now) / (1000 * 60 * 60));
    
    if (!submitBtn) return;
    
    if (now > deadline) {
        // Deadline has passed - disable the button
        submitBtn.href = '#';
        submitBtn.classList.add('disabled');
        submitBtn.innerHTML = `
            <div class="btn-content">
                <div class="btn-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <div class="btn-text">
                    <span class="btn-title">Hết hạn nộp bài</span>
                    <span class="btn-subtitle">Đã quá thời gian cho phép</span>
                </div>
            </div>
        `;
        submitBtn.onclick = function(e) {
            e.preventDefault();
            showExpiredNotification();
        };
        
        // Update deadline badge to show expired
        const deadlineBadge = document.querySelector('.homework-deadline');
        if (deadlineBadge) {
            deadlineBadge.innerHTML = '<i class="fas fa-times-circle"></i> <span>Hết hạn</span>';
            deadlineBadge.classList.add('expired');
        }
        
        console.log('Deadline has passed. Submit button disabled.');
    } else {
        // Still within deadline - show countdown
        console.log('Still within deadline. Showing countdown.');
        updateCountdown(deadline);
        
        // Update countdown every minute
        setInterval(() => {
            const currentTime = new Date();
            if (currentTime > deadline) {
                location.reload(); // Reload page to apply expired state
            } else {
                updateCountdown(deadline);
            }
        }, 60000); // Update every minute
    }
}

// Update countdown display
function updateCountdown(deadline) {
    const now = new Date();
    const timeLeft = deadline - now;
    
    if (timeLeft <= 0) return;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    // Add countdown info to the page
    let countdownElement = document.querySelector('.deadline-countdown');
    if (!countdownElement) {
        countdownElement = document.createElement('div');
        countdownElement.className = 'deadline-countdown';
        
        const homeworkInfo = document.querySelector('.homework-info');
        if (homeworkInfo) {
            homeworkInfo.appendChild(countdownElement);
        }
    }
    
    if (days > 0) {
        countdownElement.innerHTML = `
            <div class="info-item countdown-item">
                <i class="fas fa-hourglass-half"></i>
                <span>Còn lại: ${days} ngày ${hours} giờ</span>
            </div>
        `;
    } else if (hours > 0) {
        countdownElement.innerHTML = `
            <div class="info-item countdown-item urgent">
                <i class="fas fa-hourglass-end"></i>
                <span>Còn lại: ${hours} giờ ${minutes} phút</span>
            </div>
        `;
    } else {
        countdownElement.innerHTML = `
            <div class="info-item countdown-item critical">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Còn lại: ${minutes} phút</span>
            </div>
        `;
    }
}

// Show expired notification
function showExpiredNotification() {
    showNotification('⏰ Hết hạn nộp bài! Vui lòng liên hệ giáo viên để được hỗ trợ.', 'error');
}

// Refresh button functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-secondary')) {
        e.preventDefault();
        const btn = e.target.closest('.btn-secondary');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                icon.style.animation = '';
            }, 1000);
        }
    }
});

// Show notification function
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    
    const bgColor = type === 'error' 
        ? 'linear-gradient(135deg, #e74c3c, #c0392b)' 
        : 'linear-gradient(135deg, #27ae60, #2ecc71)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(39, 174, 96, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 300);
    }, 3000);
}

// Add spin animation for refresh button
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);