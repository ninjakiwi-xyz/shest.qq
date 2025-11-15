// Обработка формы контактов
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получение данных формы
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Сохранение заявки в localStorage
    const newApplication = ApplicationStorage.add(formData);

    // Отображение сообщения об успехе
    const form = this;
    const successMessage = document.getElementById('successMessage');
    
    form.style.display = 'none';
    successMessage.classList.add('show');
    
    // Восстановление формы через 3 секунды
    setTimeout(function() {
        form.reset();
        form.style.display = 'block';
        successMessage.classList.remove('show');
        updateSubmitButtonState(); // Отключаем кнопку после сброса
    }, 3000);

    console.log('Заявка сохранена:', newApplication);
});

// Функция для управления состоянием кнопки отправки
function updateSubmitButtonState() {
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = !consentCheckbox.checked;
}

// Обработка изменения чекбокса согласия
document.getElementById('consent').addEventListener('change', function() {
    updateSubmitButtonState();
});

// Инициализация состояния кнопки при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateSubmitButtonState();
});

// Обработка плавной прокрутки для навигации
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Проверяем, что это внутренняя ссылка (якорь)
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
