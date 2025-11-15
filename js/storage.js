// Модуль для управления хранилищем заявок
const ApplicationStorage = {
    STORAGE_KEY: 'lawyer_applications',

    // Получить все заявки
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Добавить новую заявку
    add(applicationData) {
        const applications = this.getAll();
        const newApplication = {
            id: Date.now(),
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
    }
};
