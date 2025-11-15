// Модуль для управления хранилищем заявок
const ApplicationStorage = {
    STORAGE_KEY: 'lawyer_applications',
    NEXT_ID_KEY: 'lawyer_applications_next_id',

    // Получить все заявки
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Инициализация счётчика ID на основе существующих заявок
    initNextId() {
        let nextId = localStorage.getItem(this.NEXT_ID_KEY);
        if (nextId === null) {
            const applications = this.getAll();
            if (applications.length === 0) {
                nextId = 1;
            } else {
                // Получаем максимальный ID из существующих заявок и добавляем 1
                const maxId = Math.max(...applications.map(app => app.id || 0));
                nextId = maxId + 1;
            }
            localStorage.setItem(this.NEXT_ID_KEY, nextId);
        }
    },

    // Получить следующий ID
    getNextId() {
        this.initNextId(); // Убедимся, что счётчик инициализирован
        let nextId = parseInt(localStorage.getItem(this.NEXT_ID_KEY));
        const newNextId = nextId + 1;
        localStorage.setItem(this.NEXT_ID_KEY, newNextId);
        return nextId;
    },

    // Добавить новую заявку
    add(applicationData) {
        const applications = this.getAll();
        const newApplication = {
            id: this.getNextId(),
            ...applicationData,
            createdAt: applicationData.createdAt || new Date().toISOString(),
            status: applicationData.status || 'новая'
        };
        applications.push(newApplication);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
        return newApplication;
    },

    // Удалить заявку по ID
    delete(id) {
        let applications = this.getAll();
        applications = applications.filter(app => app.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
    },

    // Обновить заявку
    update(id, updatedData) {
        let applications = this.getAll();
        const index = applications.findIndex(app => app.id === id);
        if (index !== -1) {
            applications[index] = { ...applications[index], ...updatedData };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
            return applications[index];
        }
        return null;
    },

    // Очистить все заявки
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.NEXT_ID_KEY);
    }
};
