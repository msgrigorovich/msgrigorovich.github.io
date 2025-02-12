// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Анимация появления элементов при прокрутке
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Функция для проверки видимости элемента
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
        rect.top <= windowHeight * 0.8 && // Элемент входит в область видимости сверху
        rect.bottom >= 0 // Элемент еще не ушел за верхнюю границу экрана
    );
}

// Функция для анимации элементов
function animateOnScroll() {
    // Анимация для всех элементов с анимацией
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .skill-item');
    
    animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible'); // Удаляем класс, когда элемент не виден
        }
    });

    // Анимация прогресс-баров при скролле
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar && isElementInViewport(statsBar)) {
        initProgressBars();
    }
}

// Добавляем классы для анимации к элементам
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем классы к заголовкам секций
    document.querySelectorAll('section h2').forEach(element => {
        element.classList.add('fade-in');
    });

    // Добавляем классы к карточкам навыков
    document.querySelectorAll('.skill-item').forEach(element => {
        element.classList.add('fade-in');
    });

    // Добавляем классы к timeline
    const timeline = document.querySelector('.experience-timeline');
    if (timeline) {
        timeline.classList.add('slide-in-right');
    }

    // Добавляем классы к портфолио
    document.querySelectorAll('.portfolio-card').forEach(element => {
        element.classList.add('fade-in');
    });

    // Добавляем классы к контактам
    document.querySelectorAll('.contact-item').forEach((element, index) => {
        element.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
    });

    // Запускаем первичную проверку видимости элементов
    animateOnScroll();
    initProgressBars();
});

// Добавляем обработчик прокрутки с небольшой оптимизацией
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        animateOnScroll();
    });
});

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        // Сначала устанавливаем ширину в 0
        bar.style.width = '0%';
        
        // Используем setTimeout, чтобы дать браузеру время отрисовать начальное состояние
        setTimeout(() => {
            // Устанавливаем конечную ширину
            bar.style.width = targetWidth + '%';
        }, 100);
    });
}

// Добавим определение браузера для специфичных оптимизаций
const browser = {
    isChrome: !!window.chrome,
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isFirefox: typeof InstallTrigger !== 'undefined',
    isEdge: /Edge/.test(navigator.userAgent)
};

// Оптимизация прокрутки для iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.addEventListener('touchmove', function() {
        requestAnimationFrame(function() {
            animateOnScroll();
        });
    }, { passive: true });
}

// Оптимизация производительности
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Применяем debounce к обработчику прокрутки
const debouncedScroll = debounce(function() {
    animateOnScroll();
}, 16);

window.addEventListener('scroll', debouncedScroll);

// Оптимизация для мобильных устройств
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Проверка поддержки функций
const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(5px)');
if (!supportsBackdropFilter) {
    document.body.classList.add('no-backdrop-filter');
}

// Функция для проверки, находится ли элемент в поле зрения
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Обработчик прокрутки для анимации прогресс-баров
function handleProgressBarsOnScroll() {
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar && isInViewport(statsBar)) {
        initProgressBars();
        // Удаляем обработчик после первой анимации
        window.removeEventListener('scroll', handleProgressBarsOnScroll);
    }
}

// Добавляем обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем анимацию при загрузке, если прогресс-бары видны
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar && isInViewport(statsBar)) {
        initProgressBars();
    } else {
        // Если не видны, добавляем обработчик прокрутки
        window.addEventListener('scroll', handleProgressBarsOnScroll);
    }
}); 