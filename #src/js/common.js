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

// Магнитный эффект для кнопки с тройным бордером
function initMagneticButton() {
    const container = document.querySelector('.btn-magnetic-container');
    if (!container) return;

    const outerBorder = container.querySelector('.btn-outline-triple');
    const innerBorder = container.querySelector('.btn-outline-triple__inner');
    const contentBorder = container.querySelector('.btn-outline-triple__content');
    const textButton = container.querySelector('.btn-outline-triple__btn');

    if (!outerBorder || !innerBorder || !contentBorder || !textButton) return;

    let isActive = false;
    const magneticDistance = 400;

    // Функция для вычисления расстояния между двумя точками
    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Функция для получения центра элемента
    function getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    // Функция анимации притяжения
    function applyMagneticEffect(mouseX, mouseY, containerCenter, distance) {
        // Вычисляем силу притяжения (чем ближе мышь, тем сильнее)
        const force = Math.max(0, 1 - distance / magneticDistance);
        
        // Вычисляем направление от центра контейнера к мыши
        const deltaX = mouseX - containerCenter.x;
        const deltaY = mouseY - containerCenter.y;
        
        // Получаем размеры текстового элемента для ограничения
        const textRect = textButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Вычисляем максимально допустимые смещения (оставляем отступ 20px от текста)
        const textMargin = 50;
        const maxOffsetX = Math.max(0, (containerRect.width - textRect.width) / 2 - textMargin);
        const maxOffsetY = Math.max(0, (containerRect.height - textRect.height) / 2 - textMargin);
        
        // Различные коэффициенты для каждого слоя (создают эффект "растяжения")
        const outerForce = force * 1.0;   // Внешний бордер притягивается максимально
        const innerForce = force * 0.6;   // Средний бордер притягивается умеренно
        const contentForce = force * 0.3; // Внутренний бордер притягивается слабо
        
        // Вычисляем желаемые смещения для каждого слоя
        let outerOffsetX = (deltaX / magneticDistance) * maxOffsetX * outerForce;
        let outerOffsetY = (deltaY / magneticDistance) * maxOffsetY * outerForce;
        
        let innerOffsetX = (deltaX / magneticDistance) * maxOffsetX * innerForce;
        let innerOffsetY = (deltaY / magneticDistance) * maxOffsetY * innerForce;
        
        let contentOffsetX = (deltaX / magneticDistance) * maxOffsetX * contentForce;
        let contentOffsetY = (deltaY / magneticDistance) * maxOffsetY * contentForce;
        
        // Ограничиваем смещения, чтобы бордеры не накрывали текст
        outerOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, outerOffsetX));
        outerOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, outerOffsetY));
        
        innerOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, innerOffsetX));
        innerOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, innerOffsetY));
        
        contentOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, contentOffsetX));
        contentOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, contentOffsetY));
        
        // Применяем трансформации к каждому слою бордера
        outerBorder.style.transform = `translate(${outerOffsetX}px, ${outerOffsetY}px)`;
        innerBorder.style.transform = `translate(${innerOffsetX}px, ${innerOffsetY}px)`;
        contentBorder.style.transform = `translate(${contentOffsetX}px, ${contentOffsetY}px)`;
        
        // Применяем обратную трансформацию к тексту, чтобы он остался на месте
        // Компенсируем движение всех родительских элементов
        const totalOffsetX = outerOffsetX + innerOffsetX + contentOffsetX;
        const totalOffsetY = outerOffsetY + innerOffsetY + contentOffsetY;
        textButton.style.transform = `translate(${-totalOffsetX}px, ${-totalOffsetY}px)`;
        
        // Добавляем свечение к внешнему бордеру
        outerBorder.style.boxShadow = `0 0 ${force * 20}px rgba(255, 255, 255, ${force * 0.3})`;
    }

    // Сброс эффекта
    function resetMagneticEffect() {
        outerBorder.style.transform = '';
        innerBorder.style.transform = '';
        contentBorder.style.transform = '';
        textButton.style.transform = '';
        outerBorder.style.boxShadow = '';
        isActive = false;
    }

    // Обработчик движения мыши
    function handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const containerCenter = getElementCenter(container);
        const distance = getDistance(mouseX, mouseY, containerCenter.x, containerCenter.y);

        if (distance <= magneticDistance) {
            if (!isActive) {
                isActive = true;
                outerBorder.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
                innerBorder.style.transition = 'transform 0.1s ease-out';
                contentBorder.style.transition = 'transform 0.1s ease-out';
                textButton.style.transition = 'transform 0.1s ease-out';
            }
            applyMagneticEffect(mouseX, mouseY, containerCenter, distance);
        } else if (isActive) {
            outerBorder.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
            innerBorder.style.transition = 'transform 0.3s ease-out';
            contentBorder.style.transition = 'transform 0.3s ease-out';
            textButton.style.transition = 'transform 0.3s ease-out';
            resetMagneticEffect();
        }
    }

    // Запуск обработчика
    document.addEventListener('mousemove', handleMouseMove);
    
    // Сброс при уходе мыши с экрана
    document.addEventListener('mouseleave', resetMagneticEffect);
}

// Запуск магнитного эффекта после загрузки DOM
document.addEventListener('DOMContentLoaded', initMagneticButton);