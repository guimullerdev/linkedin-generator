import { openDB, type DBSchema } from 'idb'

export interface LocalPost {
    id: string
    userId: string
    topic: string
    hook: string
    body: string
    cta: string
    hashtags: string[]
    tone?: string
    status: 'draft' | 'saved' | 'scheduled' | 'published'
    createdAt: string
    updatedAt: string
}

export interface LocalIdea {
    id: string
    userId: string
    topic: string
    title: string
    angle: string
    type: string
    estimatedEngagement: string
    saved: boolean
    createdAt: string
}

interface AppDB extends DBSchema {
    posts: {
        key: string
        value: LocalPost
        indexes: { 'by-topic': string; 'by-status': string; 'by-date': string }
    }
    ideas: {
        key: string
        value: LocalIdea
        indexes: { 'by-topic': string; 'by-date': string }
    }
}

const DB_NAME = 'linkedin-generator'
const DB_VERSION = 1

export const getDB = () => openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
        const postStore = db.createObjectStore('posts', { keyPath: 'id' })
        postStore.createIndex('by-topic', 'topic')
        postStore.createIndex('by-status', 'status')
        postStore.createIndex('by-date', 'createdAt')

        const ideaStore = db.createObjectStore('ideas', { keyPath: 'id' })
        ideaStore.createIndex('by-topic', 'topic')
        ideaStore.createIndex('by-date', 'createdAt')
    },
})
