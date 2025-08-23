document.addEventListener("DOMContentLoaded", () => {
  // Находим все кнопки с data-modal атрибутом
  const modalTriggers = document.querySelectorAll('[data-modal]');
  let currentOpenModal = null;
  let currentOpenButton = null;

  // Функция для открытия модалки
  const openModal = (modal, button) => {
    // Закрываем текущую открытую модалку, если есть
    if (currentOpenModal) {
      closeModal();
    }
    
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    currentOpenModal = modal;
    currentOpenButton = button;
    
    // Фокусируемся на кнопке закрытия (приоритет у крестика)
    const closeCross = modal.querySelector(".modal-close-cross");
    const closeBtn = modal.querySelector(".close-modal");
    
    if (closeCross) {
      closeCross.focus();
    } else if (closeBtn) {
      closeBtn.focus();
    }
    
    // Блокируем скролл body
    document.body.style.overflow = 'hidden';
  };

  // Функция для закрытия модалки
  const closeModal = () => {
    if (currentOpenModal) {
      currentOpenModal.classList.remove("show");
      currentOpenModal.setAttribute("aria-hidden", "true");
      
      // Возвращаем фокус на кнопку, которая открыла модалку
      if (currentOpenButton) {
        currentOpenButton.focus();
      }
      
      // Возвращаем скролл body
      document.body.style.overflow = '';
      
      currentOpenModal = null;
      currentOpenButton = null;
    }
  };

  // Обработчик клика вне модалки
  const handleOutsideClick = (evt) => {
    if (currentOpenModal && evt.target === currentOpenModal) {
      closeModal();
    }
  };

  // Обработчик нажатия клавиш
  const handleKeydown = (evt) => {
    if (evt.key === 'Escape' && currentOpenModal) {
      closeModal();
    }
  };

  // Настраиваем обработчики для каждой кнопки
  modalTriggers.forEach(button => {
    const modalId = button.getAttribute('data-modal');
    const modal = document.querySelector(`#${modalId}`);
    
    if (modal) {
      // Обработчик открытия модалки
      button.addEventListener("click", (evt) => {
        evt.preventDefault();
        openModal(modal, button);
      });
      
      // Обработчики закрытия модалки
      const closeBtn = modal.querySelector(".close-modal");
      const closeCross = modal.querySelector(".modal-close-cross");
      
      if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
      }
      
      if (closeCross) {
        closeCross.addEventListener("click", closeModal);
      }
      
      // Обработчик клика вне модалки
      modal.addEventListener("click", handleOutsideClick);
    }
  });

  // Глобальный обработчик клавиш
  document.addEventListener("keydown", handleKeydown);
});