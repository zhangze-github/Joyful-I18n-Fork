import {defineStore} from 'pinia'
import {toRaw} from "vue";

export const useStorage = defineStore('storage', {
    state: () => ({
        fileList: [],
    }),
    actions: {
        async updateFileList() {
            let list = toRaw(this.fileList);
            for (let i = 0; i < list.length; i++) {
                let {
                    content,
                    file,
                } = list[i];
                let writable = await file.createWritable();
                writable.write(JSON.stringify(content, null, 2))
                await writable.close();
            }
        }
    }
})
