// Функция для загрузки и отображения заявок
function loadApplications() {
    const applications = ApplicationStorage.getAll();
    const tableWrapper = document.getElementById('tableWrapper');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('applicationsTable');

    if (applications.length === 0) {
        tableWrapper.style.display = 'none';
        emptyState.style.display = 'block';
        updateStats([]);
        return;
    }

    emptyState.style.display = 'none';
    tableWrapper.style.display = 'block';
    table.innerHTML = '';

    applications.forEach(app => {
        const row = document.createElement('tr');
        const date = new Date(app.createdAt);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusClass = `status-${app.status.toLowerCase().replace(' ', '-')}`;
        const statusText = getStatusText(app.status);

        row.innerHTML = `
            <td>#${app.id}</td>
            <td>${escapeHtml(app.name)}</td>
            <td>${escapeHtml(app.email)}</td>
            <td>${escapeHtml(app.phone)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewDetails(${app.id})">Просмотр</button>
                    <button class="btn-small btn-delete" onclick="deleteApplication(${app.id})">Удалить</button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });

    updateStats(applications);
}

// Функция для преобразования статуса
function getStatusText(status) {
    const statusMap = {
        'новая': 'Новая',
        'в обработке': 'В обработке',
        'обработка': 'В обработке',
        'processing': 'В обработке',
        'завершённая': 'Завершённая',
        'completed': 'Завершённая'
    };
    return statusMap[status.toLowerCase()] || status;
}

// Функция для экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция для просмотра деталей заявки
function viewDetails(id) {
    const applications = ApplicationStorage.getAll();
    const app = applications.find(a => a.id === id);

    if (!app) return;

    const modalBody = document.getElementById('modalBody');
    const date = new Date(app.createdAt);
    const formattedDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    modalBody.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">ID заявки</div>
            <div class="detail-value">#${app.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Имя</div>
            <div class="detail-value">${escapeHtml(app.name)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Email</div>
            <div class="detail-value"><a href="mailto:${escapeHtml(app.email)}">${escapeHtml(app.email)}</a></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Телефон</div>
            <div class="detail-value"><a href="tel:${escapeHtml(app.phone)}">${escapeHtml(app.phone)}</a></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Сообщение</div>
            <div class="detail-value">${escapeHtml(app.message).replace(/\n/g, '<br>')}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Статус</div>
            <div class="detail-value"><span class="status-badge status-${app.status.toLowerCase()}">${getStatusText(app.status)}</span></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Дата получения</div>
            <div class="detail-value">${formattedDate}</div>
        </div>
    `;

    document.getElementById('detailModal').classList.add('active');
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Функция для удаления заявки
function deleteApplication(id) {
    if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
        ApplicationStorage.delete(id);
        loadApplications();
    }
}

// Функция для фильтрации заявок
function filterApplications() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const applications = ApplicationStorage.getAll();

    const filtered = applications.filter(app => {
        return app.name.toLowerCase().includes(searchTerm) ||
               app.email.toLowerCase().includes(searchTerm) ||
               app.phone.toLowerCase().includes(searchTerm);
    });

    const table = document.getElementById('applicationsTable');
    table.innerHTML = '';

    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">Заявки не найдены</td></tr>';
        return;
    }

    filtered.forEach(app => {
        const row = document.createElement('tr');
        const date = new Date(app.createdAt);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusClass = `status-${app.status.toLowerCase().replace(' ', '-')}`;
        const statusText = getStatusText(app.status);

        row.innerHTML = `
            <td>#${app.id}</td>
            <td>${escapeHtml(app.name)}</td>
            <td>${escapeHtml(app.email)}</td>
            <td>${escapeHtml(app.phone)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewDetails(${app.id})">Просмотр</button>
                    <button class="btn-small btn-delete" onclick="deleteApplication(${app.id})">Удалить</button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

// Функция для обновления статистики
function updateStats(applications) {
    const total = applications.length;
    const newCount = applications.filter(a => a.status === 'новая').length;
    const processingCount = applications.filter(a => a.status === 'в обработке' || a.status === 'обработка').length;
    const completedCount = applications.filter(a => a.status === 'завершённая' || a.status === 'completed').length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('newCount').textContent = newCount;
    document.getElementById('processingCount').textContent = processingCount;
    document.getElementById('completedCount').textContent = completedCount;
}

// Функция для очистки поиска
document.addEventListener('DOMContentLoaded', function() {
    loadApplications();

    // Очистка поиска при очистке поля
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterApplications();
        }
    });
});

// Закрытие модального окна при клике вне его
document.addEventListener('click', function(e) {
    const modal = document.getElementById('detailModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ===== EXCEL EXPORT ФУНКЦИЯ =====
// Используем SheetJS библиотеку для экспорта в Excel

function exportToExcel() {
    const applications = ApplicationStorage.getAll();

    if (applications.length === 0) {
        alert('Нет заявок для экспорта');
        return;
    }

    // Проверяем, загружена ли библиотека SheetJS
    if (typeof XLSX === 'undefined') {
        // Загружаем библиотеку динамически
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js', function() {
            performExport(applications);
        });
    } else {
        performExport(applications);
    }
}

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
        alert('Ошибка при загрузке библиотеки для экспорта. Используется альтернативный метод...');
        exportToCSV(ApplicationStorage.getAll());
    };
    document.head.appendChild(script);
}

function performExport(applications) {
    // Подготовка данных для экспорта
    const exportData = applications.map(app => {
        const date = new Date(app.createdAt);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }) + ' ' + date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return {
            'ID': app.id,
            'Имя': app.name,
            'Email': app.email,
            'Телефон': app.phone,
            'Сообщение': app.message,
            'Статус': getStatusText(app.status),
            'Дата создания': formattedDate
        };
    });

    // Создание книги Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData, {
        header: ['ID', 'Имя', 'Email', 'Телефон', 'Сообщение', 'Статус', 'Дата создания']
    });

    // Установка ширины колонок
    worksheet['!cols'] = [
        { wch: 12 },  // ID
        { wch: 20 },  // Имя
        { wch: 25 },  // Email
        { wch: 15 },  // Телефон
        { wch: 40 },  // Сообщение
        { wch: 15 },  // Статус
        { wch: 20 }   // Дата создания
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заявки');

    // Скачивание файла
    const fileName = `заявки_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

// Альтернативная функция экспорта в CSV (на случай если SheetJS не загружается)
function exportToCSV(applications) {
    let csv = '\uFEFF'; // BOM для корректного отображения русских символов
    csv += 'ID,Имя,Email,Телефон,Сообщение,Статус,Дата создания\n';

    applications.forEach(app => {
        const date = new Date(app.createdAt);
        const formattedDate = date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU');
        
        const message = app.message.replace(/"/g, '""'); // Экранирование кавычек
        csv += `"${app.id}","${app.name}","${app.email}","${app.phone}","${message}","${getStatusText(app.status)}","${formattedDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `заявки_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Функция для очистки всех заявок
function clearAllApplications() {
    if (confirm('Вы уверены, что хотите удалить ВСЕ заявки? Это действие нельзя отменить!')) {
        ApplicationStorage.clear();
        loadApplications();
        alert('Все заявки успешно удалены');
    }
}

// Функция для загрузки примеров данных
function loadSampleData() {
    const sampleApplications = [
        {
            name: 'Иван Петров',
            email: 'ivan.petrov@example.com',
            phone: '+79991234567',
            message: 'Нужна консультация по гражданскому праву. Вопрос касается наследования недвижимого имущества.'
        },
        {
            name: 'Мария Сидорова',
            email: 'maria.sidorova@example.com',
            phone: '+79999876543',
            message: 'Требуется судебное представительство в деле по трудовому праву. Ищу опытного адвоката.'
        },
        {
            name: 'Алексей Иванов',
            email: 'aleksey.ivanov@example.com',
            phone: '+79995556677',
            message: 'Помощь в оформлении договора купли-продажи квартиры. Нужна проверка документов.'
        },
        {
            name: 'Елена Козлова',
            email: 'elena.kozlova@example.com',
            phone: '+79998887766',
            message: 'Консультация по семейному праву. Вопросы опеки над несовершеннолетним.'
        },
        {
            name: 'Сергей Морозов',
            email: 'sergey.morozov@example.com',
            phone: '+79997776655',
            message: 'Нужна защита в уголовном деле. Требуется компетентный адвокат с опытом.'
        }
    ];

    sampleApplications.forEach(app => {
        ApplicationStorage.add(app);
    });

    loadApplications();
    alert('Примеры данных загружены успешно!');
}
