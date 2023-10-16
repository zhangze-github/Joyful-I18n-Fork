<template>
    <div class="wrapper">
        <a-button @click="openDir" type="primary">
            打开本地I18n文件夹
        </a-button>
<!--        <a-button @click="sortGlobal" type="primary" v-if="storage.fileList.length" style="margin-left: 20px">-->
<!--            Sort 一下所有语言包-->
<!--        </a-button>-->
        {{fileList}}
        <div class="list">
            <div class="item" v-for="i in storage.fileList">
                <div class="name">{{i.name}}</div>
<!--                <div class="content">{{i.content}}</div>-->
            </div>
        </div>
    </div>
</template>

<script setup>
import {message} from "ant-design-vue";
import {useStorage} from "../../store/storage.js";
import SortJson from 'sort-json';

const storage = useStorage();

async function openDir() {
    let dir = null;
    try {
        dir = await showDirectoryPicker()
    } catch (e) {
        message.error('打开文件夹失败')
        return;
    }
    let fileList = await dir.entries();
    let returnList = []

    try {
        for await (let file of fileList) {
            await new Promise(async (resolve, reject) => {
                const reader = new FileReader();
                let fileObject = await file[1].getFile()
                reader.readAsText(fileObject, "utf-8");
                reader.onload = function (e) {
                    returnList.push({
                        name: file[0],
                        content: JSON.parse(e.target.result),
                        file: file[1],
                        key: file[0].split('.')[0]
                    })
                    resolve()
                }
            })
        }
    } catch (e) {
        console.log(e)
        message.error('读取本地文件失败')
    }
    storage.$patch({
        fileList: returnList
    })
}

async function sortGlobal(){
    const {fileList} = storage;
    let returnList = []
    for (let i = 0; i < fileList.length; i++){
        let {name, content, file, key} = fileList[i];
        let writable = await file.createWritable();
        await writable.write(SortJson(content))
        await writable.close();
        returnList.push({
            name,
            content,
            file,
            key,
        })
    }
    message.success('排序完成，已写入源文件，请到源文件查看更改')
    storage.$patch({
        fileList: returnList
    })
}

</script>


<style scoped lang="less">

.list{
    .item{
        border: 1px solid #ccc;
        margin: 10px;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        border-radius: 10px;
        .name{
            margin-right: 20px;
        }
        .content{
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}

</style>
