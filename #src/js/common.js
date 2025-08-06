// Можно использовать шаблонизатор для подключения js
// @@include('includes/alert.js')

// JS-функция определения поддержки Web
// Если есть поддержка, то добавляет к body класс webp
// Костыль для работы с gulp-webp-css
function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {

    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }else{
        document.querySelector('body').classList.add('no-webp');
    }
});

// Бургер меню
document.addEventListener('DOMContentLoaded', function() {
    const burgerButton = document.getElementById('burgerButton');
    const nav = document.getElementById('nav');
    const body = document.body;
    
    // Функция для расчета ширины полосок навигации
    function calculateNavLineWidth() {
        // Проверяем, что мы не на мобильной версии
        if (window.innerWidth <= 767) {
            return;
        }
        
        const navWrapper = document.querySelector('.header__nav_wrapper');
        const navList = document.querySelector('.nav__list');
        
        if (!navWrapper || !navList) {
            return;
        }
        
        // Получаем ширину контейнера навигации
        const wrapperWidth = navWrapper.offsetWidth;
        
        // Получаем ширину списка навигации
        const listWidth = navList.offsetWidth;
        
        // Вычисляем свободное пространство с каждой стороны
        const freeSpace = (wrapperWidth - listWidth) / 2;
        
        // Устанавливаем ширину полосок (немного меньше свободного пространства для отступов)
        const lineWidth = Math.max(0, freeSpace - 20); // 20px отступ от навигации
        
        // Применяем вычисленную ширину через CSS-переменную
        nav.style.setProperty('--nav-line-width', `${lineWidth}px`);
    }
    
    // Вызываем функцию при загрузке страницы
    calculateNavLineWidth();
    
    // Пересчитываем при изменении размера окна
    window.addEventListener('resize', calculateNavLineWidth);
    
    // Убираем создание overlay
    // const overlay = document.createElement('div');
    // overlay.className = 'nav-overlay';
    // body.appendChild(overlay);
    
    // Функция открытия/закрытия меню
    function toggleMenu() {
        const isOpen = nav.classList.contains('is-open');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Функция открытия меню
    function openMenu() {
        nav.classList.add('is-open');
        burgerButton.classList.add('is-active');
        // overlay.classList.add('is-open');
        body.style.overflow = 'hidden'; // Блокируем скролл
    }
    
    // Функция закрытия меню
    function closeMenu() {
        nav.classList.remove('is-open');
        burgerButton.classList.remove('is-active');
        // overlay.classList.remove('is-open');
        body.style.overflow = ''; // Возвращаем скролл
    }
    
    // Обработчик клика по бургер кнопке
    burgerButton.addEventListener('click', toggleMenu);
    
    // Убираем обработчик клика по overlay
    // overlay.addEventListener('click', closeMenu);
    
    // Закрытие меню при клике на ссылку
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            closeMenu();
        }
    });
    
    // Закрытие меню при изменении размера экрана
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && nav.classList.contains('is-open')) {
            closeMenu();
        }
        // Пересчитываем полоски при изменении размера
        calculateNavLineWidth();
    });
});