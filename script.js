// 汉堡菜单功能
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 这里之后会添加照片轮播的功能 

// 表单处理
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 显示成功消息
                    showMessage('Message sent successfully! We will get back to you soon.', 'success');
                    this.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                // 显示错误消息
                showMessage('Sorry, message failed to send. Please try again or call us directly.', 'error');
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});

// 消息提示功能
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // 3秒后自动消失
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 照片轮播功能
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const images = document.querySelectorAll('.carousel-image');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    if (!carousel || !images.length) return;

    let currentIndex = 0;
    const totalImages = images.length;

    // 初始化第一张图片为激活状态
    images[0].classList.add('active');

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        
        // 更新激活状态
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex);
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    // 添加按钮事件监听
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevImage);
        nextButton.addEventListener('click', nextImage);
    }

    // 自动轮播
    let autoplayInterval = setInterval(nextImage, 4000);

    // 鼠标悬停时暂停自动轮播
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    // 鼠标离开时恢复自动轮播
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextImage, 4000);
    });

    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) { // 最小滑动距离
            if (difference > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    });
}); 