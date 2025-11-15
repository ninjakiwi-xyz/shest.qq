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
    }, 3000);

    console.log('Заявка сохранена:', newApplication);
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
