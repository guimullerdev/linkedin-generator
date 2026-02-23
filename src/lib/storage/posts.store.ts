import { getDB, type LocalPost } from './db'

export const postsStore = {
    async getAll() {
        const db = await getDB()
        return db.getAllFromIndex('posts', 'by-date')
    },

    async getById(id: string) {
        const db = await getDB()
        return db.get('posts', id)
    },

    async save(post: LocalPost) {
        const db = await getDB()
        return db.put('posts', post)
    },

    async delete(id: string) {
        const db = await getDB()
        return db.delete('posts', id)
    },

    async getByStatus(status: LocalPost['status']) {
        const db = await getDB()
        return db.getAllFromIndex('posts', 'by-status', status)
    }
}
