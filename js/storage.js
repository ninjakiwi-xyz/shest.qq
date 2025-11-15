// Модуль для управления хранилищем заявок
const ApplicationStorage = {
    STORAGE_KEY: 'lawyer_applications',
    NEXT_ID_KEY: 'lawyer_applications_next_id',

    // Получить все заявки
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Получить следующий ID
    getNextId() {
        let nextId = localStorage.getItem(this.NEXT_ID_KEY);
        if (nextId === null) {
            // Если это первая заявка, начинаем с 1
            nextId = 1;
        } else {
            nextId = parseInt(nextId) + 1;
        }
        localStorage.setItem(this.NEXT_ID_KEY, nextId);
        return nextId;
    },

    // Добавить новую заявку
    add(applicationData) {
        const applications = this.getAll();
        const newApplication = {
            id: this.getNextId(),
            ...applicationData,
            createdAt: new Date().toISOString(),
            status: 'новая'
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
