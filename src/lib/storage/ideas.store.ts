import { getDB, type LocalIdea } from './db'

export const ideasStore = {
    async getAll() {
        const db = await getDB()
        return db.getAllFromIndex('ideas', 'by-date')
    },

    async getById(id: string) {
        const db = await getDB()
        return db.get('ideas', id)
    },

    async save(idea: LocalIdea) {
        const db = await getDB()
        return db.put('ideas', idea)
    },

    async delete(id: string) {
        const db = await getDB()
        return db.delete('ideas', id)
    },

    async getByTopic(topic: string) {
        const db = await getDB()
        return db.getAllFromIndex('ideas', 'by-topic', topic)
    }
}
