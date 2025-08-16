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
    // window.polaroidGallery = new PolaroidGallery();
});