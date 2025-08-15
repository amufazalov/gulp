// Можно использовать шаблонизатор для подключения js
// @@include('includes/alert.js')

/**
 * Класс для определения поддержки WebP
 */
class WebPDetector {
    constructor() {
        this.detectWebPSupport();
    }

    /**
     * Определяет поддержку WebP и добавляет соответствующий класс к body
     */
    detectWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            const hasSupport = webP.height === 2;
            this.addWebPClass(hasSupport);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    /**
     * Добавляет класс webp или no-webp к body
     * @param {boolean} hasSupport - поддерживается ли WebP
     */
    addWebPClass(hasSupport) {
        const bodyClass = hasSupport ? 'webp' : 'no-webp';
        document.querySelector('body').classList.add(bodyClass);
    }
}

/**
 * Класс для расчета ширины полосок навигации
 */
class NavigationLineCalculator {
    constructor() {
        this.mobileBreakpoint = 767;
        this.lineOffset = 20; // отступ от навигации
    }

    /**
     * Рассчитывает и устанавливает ширину полосок навигации
     */
    calculateNavLineWidth() {
        if (this.isMobileView()) {
            return;
        }

        const navWrapper = document.querySelector('.header__nav_wrapper');
        const navList = document.querySelector('.nav__list');
        const nav = document.getElementById('nav');

        if (!this.areElementsExist(navWrapper, navList, nav)) {
            return;
        }

        const lineWidth = this.computeLineWidth(navWrapper, navList);
        nav.style.setProperty('--nav-line-width', `${lineWidth}px`);
    }

    /**
     * Проверяет, является ли текущий вид мобильным
     * @returns {boolean}
     */
    isMobileView() {
        return window.innerWidth <= this.mobileBreakpoint;
    }

    /**
     * Проверяет существование всех необходимых элементов
     * @param {...Element} elements - элементы для проверки
     * @returns {boolean}
     */
    areElementsExist(...elements) {
        return elements.every(element => element !== null);
    }

    /**
     * Вычисляет ширину полоски
     * @param {Element} navWrapper - контейнер навигации
     * @param {Element} navList - список навигации
     * @returns {number}
     */
    computeLineWidth(navWrapper, navList) {
        const wrapperWidth = navWrapper.offsetWidth;
        const listWidth = navList.offsetWidth;
        const freeSpace = (wrapperWidth - listWidth) / 2;
        return Math.max(0, freeSpace - this.lineOffset);
    }
}

/**
 * Класс для управления поляроид галереей
 */
class PolaroidGallery {
    constructor() {
        this.container = document.querySelector('.polaroid-container');
        this.leftPolaroid = null;
        this.rightPolaroid = null;
        this.currentImageIndex = 0;
        
        // Конфигурационные параметры
        this.config = {
            // Размеры и позиционирование
            leftImage: {
                width: 580,
                height: 686,
                imageHeight: 566,
                left: 80,
                top: 120, // Левая фотография ниже
                rotation: -12
            },
            rightImage: {
                width: 620,
                height: 720,
                imageHeight: 620,
                baseRight: 80,
                top: 0, // Правая фотография выше
                rotation: 8
            },
            // Наложение правой картинки на левую (в процентах)
            overlapPercent: 25, // Увеличиваем наложение
            // Анимация
            animation: {
                duration: 3000, // Интервал между сменами
                slideSpeed: 800, // Скорость анимации CSS
                slideDownDistance: 900, // Увеличиваем из-за нового расположения
                slideInDistance: 750
            },
            // Контейнер
            container: {
                maxWidth: 1300,
                height: 800 // Увеличиваем высоту из-за нового расположения
            }
        };
        
        this.images = [
            {
                src: 'images/test.jpeg',
                caption: 'Фото 1'
            },
            {
                src: 'images/test.jpeg',
                caption: 'Фото 2'
            },
            {
                src: 'images/test.jpeg',
                caption: 'Фото 3'
            },
            {
                src: 'images/test.jpeg',
                caption: 'Фото 4'
            }
        ];

        this.init();
    }

    /**
     * Инициализация галереи
     */
    init() {
        if (!this.container) {
            return;
        }

        this.applyCSSVariables();
        this.setupInitialPolaroids();
        this.startAnimation();
    }

    /**
     * Применяет конфигурационные переменные как CSS custom properties
     */
    applyCSSVariables() {
        const root = document.documentElement;
        
        // Размеры левой картинки
        root.style.setProperty('--polaroid-left-width', `${this.config.leftImage.width}px`);
        root.style.setProperty('--polaroid-left-height', `${this.config.leftImage.height}px`);
        root.style.setProperty('--polaroid-left-image-height', `${this.config.leftImage.imageHeight}px`);
        root.style.setProperty('--polaroid-left-position-left', `${this.config.leftImage.left}px`);
        root.style.setProperty('--polaroid-left-position-top', `${this.config.leftImage.top}px`);
        root.style.setProperty('--polaroid-left-rotation', `${this.config.leftImage.rotation}deg`);
        
        // Размеры правой картинки
        root.style.setProperty('--polaroid-right-width', `${this.config.rightImage.width}px`);
        root.style.setProperty('--polaroid-right-height', `${this.config.rightImage.height}px`);
        root.style.setProperty('--polaroid-right-image-height', `${this.config.rightImage.imageHeight}px`);
        root.style.setProperty('--polaroid-right-position-top', `${this.config.rightImage.top}px`);
        root.style.setProperty('--polaroid-right-rotation', `${this.config.rightImage.rotation}deg`);
        
        // Вычисляем позицию правой картинки с учетом наложения
        const overlapPixels = (this.config.leftImage.width * this.config.overlapPercent) / 100;
        const rightPosition = this.config.rightImage.baseRight + overlapPixels;
        root.style.setProperty('--polaroid-right-position-right', `${rightPosition}px`);
        
        // Анимация
        root.style.setProperty('--polaroid-slide-speed', `${this.config.animation.slideSpeed}ms`);
        root.style.setProperty('--polaroid-slide-down-distance', `${this.config.animation.slideDownDistance}px`);
        root.style.setProperty('--polaroid-slide-in-distance', `${this.config.animation.slideInDistance}px`);
        
        // Контейнер
        root.style.setProperty('--polaroid-container-max-width', `${this.config.container.maxWidth}px`);
        root.style.setProperty('--polaroid-container-height', `${this.config.container.height}px`);
    }

    /**
     * Обновляет конфигурацию и применяет изменения
     * @param {Object} newConfig - новые параметры конфигурации
     */
    updateConfig(newConfig) {
        // Глубокое слияние конфигураций
        this.config = this.mergeDeep(this.config, newConfig);
        this.applyCSSVariables();
    }

    /**
     * Глубокое слияние объектов
     * @param {Object} target - целевой объект
     * @param {Object} source - исходный объект
     * @returns {Object}
     */
    mergeDeep(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.mergeDeep(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }

    /**
     * Настройка начальных поляроид карточек
     */
    setupInitialPolaroids() {
        this.leftPolaroid = this.container.querySelector('.polaroid--left');
        this.rightPolaroid = this.container.querySelector('.polaroid--right');

        if (this.leftPolaroid && this.rightPolaroid) {
            this.updatePolaroidContent(this.leftPolaroid, 0);
            this.updatePolaroidContent(this.rightPolaroid, 1);
        }
    }

    /**
     * Обновляет содержимое поляроид карточки
     * @param {Element} polaroid - элемент поляроида
     * @param {number} imageIndex - индекс изображения
     */
    updatePolaroidContent(polaroid, imageIndex) {
        const image = polaroid.querySelector('.polaroid__image');
        const caption = polaroid.querySelector('.polaroid__caption');
        const imageData = this.images[imageIndex];

        if (image && caption && imageData) {
            image.src = imageData.src;
            image.alt = imageData.caption;
            caption.textContent = imageData.caption;
            polaroid.dataset.image = imageIndex + 1;
        }
    }

    /**
     * Запускает циклическую анимацию
     */
    startAnimation() {
        setInterval(() => {
            this.animateSlide();
        }, this.config.animation.duration);
    }

    /**
     * Выполняет анимацию смены слайдов
     */
    animateSlide() {
        if (!this.leftPolaroid || !this.rightPolaroid) {
            return;
        }

        // Шаг 1: Левая фотография уходит вниз
        this.slideDownLeft();

        // Шаг 2: Правая фотография перемещается влево (через 400мс)
        setTimeout(() => {
            this.moveRightToLeft();
        }, 400);

        // Шаг 3: Новая фотография появляется справа (через 800мс)
        setTimeout(() => {
            this.showNewRight();
        }, 800);

        // Шаг 4: Очистка и подготовка к следующей анимации (через 1200мс)
        setTimeout(() => {
            this.resetForNextAnimation();
        }, 1200);
    }

    /**
     * Анимация ухода левой фотографии вниз
     */
    slideDownLeft() {
        this.leftPolaroid.classList.add('polaroid--moving-down');
    }

    /**
     * Перемещение правой фотографии на место левой
     */
    moveRightToLeft() {
        this.rightPolaroid.classList.remove('polaroid--right');
        this.rightPolaroid.classList.add('polaroid--transitioning-to-left');
    }

    /**
     * Показ новой фотографии справа
     */
    showNewRight() {
        // Обновляем индекс для следующих двух изображений
        const nextLeftIndex = (this.currentImageIndex + 1) % this.images.length;
        const nextRightIndex = (this.currentImageIndex + 2) % this.images.length;

        // Обновляем содержимое старой левой карточки для использования справа
        this.updatePolaroidContent(this.leftPolaroid, nextRightIndex);
        
        // Убираем все предыдущие классы и добавляем класс появления справа
        this.leftPolaroid.classList.remove('polaroid--left', 'polaroid--moving-down');
        this.leftPolaroid.classList.add('polaroid--appearing-right');

        // Анимируем появление справа
        setTimeout(() => {
            this.leftPolaroid.classList.add('animate-in');
        }, 50);
    }

    /**
     * Сброс для следующей анимации
     */
    resetForNextAnimation() {
        // Очищаем все анимационные классы с левого поляроида (который ушел вниз)
        this.leftPolaroid.classList.remove('polaroid--moving-down', 'polaroid--left');

        // Очищаем классы с правого поляроида (который стал левым)
        this.rightPolaroid.classList.remove('polaroid--transitioning-to-left', 'polaroid--right');
        this.rightPolaroid.classList.add('polaroid--left');

        // Правый поляроид становится обычным правым
        this.leftPolaroid.classList.remove('polaroid--appearing-right', 'animate-in');
        this.leftPolaroid.classList.add('polaroid--right');

        // Переключаем ссылки на элементы
        const temp = this.leftPolaroid;
        this.leftPolaroid = this.rightPolaroid;
        this.rightPolaroid = temp;

        // Обновляем индекс
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }

    // Примеры использования:
    // 
    // Изменить процент наложения:
    // polaroidGallery.updateConfig({ overlapPercent: 20 });
    // 
    // Изменить размеры левой картинки:
    // polaroidGallery.updateConfig({ 
    //     leftImage: { width: 600, height: 700, imageHeight: 580 } 
    // });
    // 
    // Изменить скорость анимации:
    // polaroidGallery.updateConfig({ 
    //     animation: { duration: 5000, slideSpeed: 1000 } 
    // });
    // 
    // Изменить углы поворота:
    // polaroidGallery.updateConfig({ 
    //     leftImage: { rotation: -10 },
    //     rightImage: { rotation: 8 }
    // });
}

/**
 * Класс для управления бургер-меню
 */
class BurgerMenu {
    constructor() {
        this.burgerButton = document.getElementById('burgerButton');
        this.nav = document.getElementById('nav');
        this.body = document.body;
        this.mobileBreakpoint = 767;
        
        this.navigationCalculator = new NavigationLineCalculator();
        
        this.init();
    }

    /**
     * Инициализация бургер-меню
     */
    init() {
        if (!this.areRequiredElementsExist()) {
            console.warn('Необходимые элементы бургер-меню не найдены');
            return;
        }

        this.bindEvents();
        this.navigationCalculator.calculateNavLineWidth();
    }

    /**
     * Проверяет существование необходимых элементов
     * @returns {boolean}
     */
    areRequiredElementsExist() {
        return this.burgerButton && this.nav && this.body;
    }

    /**
     * Привязывает обработчики событий
     */
    bindEvents() {
        this.burgerButton.addEventListener('click', () => this.toggleMenu());
        this.bindNavigationLinks();
        this.bindKeyboardEvents();
        this.bindResizeEvents();
    }

    /**
     * Привязывает события к ссылкам навигации
     */
    bindNavigationLinks() {
        const navLinks = this.nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    /**
     * Привязывает события клавиатуры
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
    }

    /**
     * Привязывает события изменения размера окна
     */
    bindResizeEvents() {
        window.addEventListener('resize', () => {
            if (this.shouldCloseMenuOnResize()) {
                this.closeMenu();
            }
            this.navigationCalculator.calculateNavLineWidth();
        });
    }

    /**
     * Определяет, нужно ли закрыть меню при изменении размера
     * @returns {boolean}
     */
    shouldCloseMenuOnResize() {
        return window.innerWidth > this.mobileBreakpoint && this.isMenuOpen();
    }

    /**
     * Переключает состояние меню
     */
    toggleMenu() {
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * Открывает меню
     */
    openMenu() {
        this.nav.classList.add('is-open');
        this.burgerButton.classList.add('is-active');
        this.body.style.overflow = 'hidden';
    }

    /**
     * Закрывает меню
     */
    closeMenu() {
        this.nav.classList.remove('is-open');
        this.burgerButton.classList.remove('is-active');
        this.body.style.overflow = '';
    }

    /**
     * Проверяет, открыто ли меню
     * @returns {boolean}
     */
    isMenuOpen() {
        return this.nav.classList.contains('is-open');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new WebPDetector();
    new BurgerMenu();
    
    // Инициализируем поляроид галерею и сохраняем ссылку для возможности изменения настроек
    window.polaroidGallery = new PolaroidGallery();
});