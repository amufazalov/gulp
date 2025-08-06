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
    });
});