import Dexie from 'dexie'
import type { Table } from 'dexie'

export interface File {
    id?: number
    name: string
    size: number
    mime: string
    data: Blob
    updated_at: number // 时间戳
}

class FileCacheDatabase extends Dexie {
    file!: Table<File>

    constructor() {
        super('FileCacheDatabase')
        this.version(1).stores({
            file: '++id, &name, size, mime, data', // id is autoincrement primary key, name is unique field
        })
    }
}

export class Instance {
    static db: FileCacheDatabase
    static init() {
        Instance.db = new FileCacheDatabase()
    }

    static async get(id: number): Promise<File | undefined> {
        return Instance.db.file.get(id)
    }

    static async batchGet(ids: number[]) {
        return Instance.db.file.where('id').anyOf(ids).toArray()
    }

    static async getByName(name: string): Promise<File | undefined> {
        return Instance.db.file.where('name').equals(name).first()
    }

    static async batchGetByName(names: string[]) {
        return Instance.db.file.where('name').anyOf(names).toArray()
    }

    static async getAll(): Promise<File[]> {
        return Instance.db.file.toArray()
    }

    static async add(name: string, file: Blob) {
        const buff: File = {
            name,
            size: file.size,
            mime: file.type,
            data: file,
            updated_at: Date.now(),
        }
        return Instance.db.file.add(buff)
    }

    /**
     * 批量添加文件
     */
    static batchAdd(items: { name: string; file: Blob }[]) {
        return Instance.db.file.bulkAdd(
            items.map((v) => {
                return {
                    name: v.name,
                    size: v.file.size,
                    mime: v.file.type,
                    data: v.file,
                    updated_at: Date.now(),
                }
            }),
            {
                allKeys: true,
            },
        )
    }

    static async remove(id: number) {
        return Instance.db.file.delete(id)
    }

    static async batchRemove(ids: number[]) {
        return Instance.db.file.bulkDelete(ids)
    }

    static async removeByName(name: string) {
        return Instance.db.file.where('name').equals(name).delete()
    }

    static async batchRemoveByName(names: string[]) {
        return Instance.db.file.where('name').anyOf(names).delete()
    }

    static async removeAll() {
        return Instance.db.file.clear()
    }

    static async update(id: number, name: string, file: Blob) {
        const buff: File = {
            name,
            size: file.size,
            mime: file.type,
            data: file,
            updated_at: Date.now(),
        }
        return Instance.db.file.update(id, buff)
    }

    static async batchUpdate(
        items: { id: number; name: string; file: Blob }[],
    ) {
        return Instance.db.file.bulkPut(
            items.map((v) => {
                return {
                    id: v.id,
                    name: v.name,
                    size: v.file.size,
                    mime: v.file.type,
                    data: v.file,
                    updated_at: Date.now(),
                }
            }),
            {
                allKeys: true,
            },
        )
    }

    static async updateByName(
        oldName: string,
        file: Blob,
        newName: string = oldName,
    ) {
        const buff: File = {
            name: newName,
            size: file.size,
            mime: file.type,
            data: file,
            updated_at: Date.now(),
        }
        return Instance.db.file.where('name').equals(oldName).modify(buff)
    }

    static async batchUpdateByName(
        items: { oldName: string; file: Blob; newName?: string }[],
    ) {
        return Instance.db.transaction('rw', Instance.db.file, () => {
            return Promise.all(
                items.map((v) => {
                    return Instance.db.file
                        .where('name')
                        .equals(v.oldName)
                        .modify({
                            name: v.newName || v.oldName,
                            size: v.file.size,
                            mime: v.file.type,
                            data: v.file,
                            updated_at: Date.now(),
                        })
                }),
            )
        })
    }

    static getDB() {
        return Instance.db
    }
}

export class Utils {
    static async addResources(items: { name: string; url: string }[]) {
        const queue: Promise<any>[] = []
        items.forEach((item) => queue.push(fetch(item.url)))
        const responses: Response[] = await Promise.all(queue)
        queue.length = 0 // 清空数组（其实并没有
        responses.forEach((response) => {
            queue.push(response.blob())
        })
        const blobs: Blob[] = await Promise.all(queue)
        return Instance.batchAdd(
            items.flatMap((v, i) => [{ name: v.name, file: blobs[i] }]),
        )
    }

    static async addResource(name: string, url: string) {
        return (await this.addResources([{ name, url }]))[0]
    }

    static async updateResources(
        items: { id: number; name: string; url: string }[],
    ) {
        const queue: Promise<any>[] = []
        items.forEach((item) => queue.push(fetch(item.url)))
        const responses: Response[] = await Promise.all(queue)
        queue.length = 0 // 清空数组（其实并没有
        responses.forEach((response) => {
            queue.push(response.blob())
        })
        const blobs: Blob[] = await Promise.all(queue)
        return Instance.batchUpdate(
            items.flatMap((v, i) => [
                { id: v.id, name: v.name, file: blobs[i] },
            ]),
        )
    }

    static async updateResource(id: number, name: string, url: string) {
        return (await this.updateResources([{ id, name, url }]))[0]
    }

    static async rememberResource(name: string, url: string, ex: number) {
        const buff = await Instance.getByName(name)
        if (buff && (ex <= 0 || Date.now() - buff.updated_at > ex)) {
            return buff
        }
        // TODO: 下面的细节可以优化一下
        if (!buff) {
            await this.addResource(name, url)
            return (await Instance.getByName(name))!
        }
        await this.updateResource(buff.id!, name, url)
        return (await Instance.getByName(name))!
    }

    static async rememberResources(
        items: { name: string; url: string; ex: number }[],
    ) {
        const queue: Promise<File>[] = []
        items.forEach((item) =>
            queue.push(this.rememberResource(item.name, item.url, item.ex)),
        )
        return Promise.all(queue)
    }
}
