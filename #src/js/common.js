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
        this.mobileBreakpoint = 768.98; // Исправлено: приведено в соответствие с SCSS
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
        const nav = document.querySelector('.header__nav'); // Исправлено: используем класс вместо id

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
        this.nav = document.querySelector('.header__nav'); // Исправлено: используем класс вместо id
        this.body = document.body;
        this.mobileBreakpoint = 768.98; // Исправлено: приведено в соответствие с SCSS
        
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
            if (!link.classList.contains('nav__link--dropdown')) {
                link.addEventListener('click', () => this.closeMenu());
            }
        });

        // Обработчики для dropdown ссылок
        this.bindDropdownEvents();
        this.bindOutsideClickEvents();
    }

    /**
     * Привязывает события для dropdown меню
     */
    bindDropdownEvents() {
        const dropdownLinks = this.nav.querySelectorAll('.nav__link--dropdown');
        const dropdownSubLinks = this.nav.querySelectorAll('.nav__dropdown-link');

        // Обработчик для основных dropdown ссылок
        dropdownLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleDropdown(link);
            });
        });

        // Обработчик для подссылок dropdown
        dropdownSubLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobileView()) {
                    this.closeMenu();
                } else {
                    this.closeAllDropdowns();
                }
            });
        });
    }

    /**
     * Переключает состояние dropdown меню
     * @param {Element} dropdownLink - ссылка dropdown
     */
    toggleDropdown(dropdownLink) {
        const dropdownItem = dropdownLink.closest('.nav__item--dropdown');
        const dropdown = dropdownItem.querySelector('.nav__dropdown');
        
        // Закрываем другие открытые dropdown
        this.closeOtherDropdowns(dropdownItem);
        
        // Переключаем текущий dropdown
        dropdown.classList.toggle('is-open');
        dropdownLink.classList.toggle('is-active');
        dropdownItem.classList.toggle('is-active');
    }

    /**
     * Закрывает все dropdown кроме указанного
     * @param {Element} currentDropdownItem - текущий dropdown элемент
     */
    closeOtherDropdowns(currentDropdownItem) {
        const allDropdownItems = this.nav.querySelectorAll('.nav__item--dropdown');
        
        allDropdownItems.forEach(item => {
            if (item !== currentDropdownItem) {
                const dropdown = item.querySelector('.nav__dropdown');
                const dropdownLink = item.querySelector('.nav__link--dropdown');
                
                dropdown.classList.remove('is-open');
                dropdownLink.classList.remove('is-active');
                item.classList.remove('is-active');
            }
        });
    }

    /**
     * Закрывает все dropdown меню
     */
    closeAllDropdowns() {
        const allDropdownItems = this.nav.querySelectorAll('.nav__item--dropdown');
        
        allDropdownItems.forEach(item => {
            const dropdown = item.querySelector('.nav__dropdown');
            const dropdownLink = item.querySelector('.nav__link--dropdown');
            
            dropdown.classList.remove('is-open');
            dropdownLink.classList.remove('is-active');
            item.classList.remove('is-active');
        });
    }

    /**
     * Привязывает события для закрытия dropdown при клике вне области
     */
    bindOutsideClickEvents() {
        document.addEventListener('click', (event) => {
            const dropdownItems = this.nav.querySelectorAll('.nav__item--dropdown');
            const clickedInsideDropdown = Array.from(dropdownItems).some(item => 
                item.contains(event.target)
            );
            
            if (!clickedInsideDropdown) {
                this.closeAllDropdowns();
            }
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
        this.closeAllDropdowns();
    }

    /**
     * Проверяет, является ли текущий вид мобильным
     * @returns {boolean}
     */
    isMobileView() {
        return window.innerWidth <= this.mobileBreakpoint;
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