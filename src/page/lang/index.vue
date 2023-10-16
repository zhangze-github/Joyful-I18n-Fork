<template>
    <div>
        <a-button @click="addRootKey" style="margin-bottom: 20px" v-if="!isEmpty(treeData)">
            添加一个根目录Key
        </a-button>
        <div class="content" v-if="!isEmpty(treeData)">
            <a-tree v-model:selectedKeys="selectedKeys" :tree-data="treeData" show-icon showLine>
                <template #title="{ title, key, children }">
                    <div :flagKey="key">
                        {{ title }}
                        <span v-if="children">
                             <a-tooltip title="添加一个文件夹" @click="addI18nDir(key)">
                                 <FolderAddOutlined style="margin-left: 20px"/>
                             </a-tooltip>
                             <a-tooltip title="添加一个I18n Key" @click="addI18n(key)">
                                <PlusCircleOutlined style="margin-left: 20px"/>
                             </a-tooltip>
                              <a-tooltip title="删除" @click="deleteItem(key)">
                                 <DeleteOutlined style="margin-left: 20px; color: #f40"/>
                             </a-tooltip>
                        </span>
                        <span v-else>
                             <a-tooltip title="编辑" @click="editI18n(key)">
                                 <EditOutlined style="margin-left: 20px"/>
                             </a-tooltip>
                             <a-tooltip title="删除" @click="deleteItem(key)">
                                 <DeleteOutlined style="margin-left: 20px; color: #f40" />
                             </a-tooltip>
                        </span>
                    </div>
                </template>
            </a-tree>
        </div>
    </div>
    <a-modal v-model:open="modalVisible" title="输入文件夹名称" @ok="handleOk" @cancel="handleCancel" size="small">
        <a-input v-model:value="modalInputValue"></a-input>
    </a-modal>
    <EditI18n v-model:open="drawerVisible" :editKey="editKey" :isEditI18n="isEditI18n" @seti18nText="seti18nText"/>
</template>

<script setup>
import {message} from "ant-design-vue";
import {useStorage} from "../../store/storage.js";
import {onMounted, ref, toRaw, watch, h, nextTick} from "vue";
import { find, isEmpty, set, trim} from "lodash";
import {handleData, removeEmptyValues} from "../../util/utils.js";
import {PlusCircleOutlined, FolderAddOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import EditI18n from "./editI18n.vue";
import {useRouter} from "vue-router";

const router = useRouter()
const storage = useStorage();
const treeData = ref({})
const selectedKeys = ref(['']);
const modalVisible = ref(false);
const modalInputValue = ref('')
const isEditI18n = ref(false)
const drawerVisible = ref(false)
const editKey = ref('')

onMounted(() => {
    // if(isEmpty(storage.fileList)){
    //     message.error('请先选中一个语言包文件夹')
    //     router.push('/home/list')
    // }else{
        initData()
    // }
})

function initData() {
    let value = find(storage.fileList, {key: 'en'}) || {}
    if (isEmpty(value)) return;
    let parsedValue = handleData(toRaw(value.content))
    treeData.value = parsedValue
}

function addI18n(e) {
    isEditI18n.value = false;
    drawerVisible.value = true;
    editKey.value = e
}

function editI18n(e) {
    isEditI18n.value = true;
    editKey.value = e
    drawerVisible.value = true;
}


function addI18nDir(e) {
    modalVisible.value = e;
}

function handleOk() {
    let value = modalInputValue.value;
    value = trim(value);
    if(value.length === 0) {
        message.error('文件夹名称不能为空')
        return;
    }
    if(value.includes('.')) {
        message.error('文件夹名称不能包含.')
        return;
    }
    let key = modalVisible.value;
    key = key ? `${key}.${value}` : value;
    let langList = toRaw(storage.fileList);
    langList = langList.map(item => {
        let {content} = item;
        set(content, key, {});
        return {
            ...item,
            content
        }
    })
    storage.$patch({
        fileList: langList
    })
    nextTick(() => {
        initData()
        modalVisible.value = false;
        storage.updateFileList();
    })
    modalInputValue.value = '';
}

function seti18nText(){
    initData();
    drawerVisible.value = false;
    storage.updateFileList()
}

function handleCancel() {
    modalVisible.value = false;
    modalInputValue.value = '';
}

function addRootKey(){
    modalVisible.value = '';
}

function deleteItem(e){
    let langList = toRaw(storage.fileList);
    langList = langList.map(item => {
        let {content} = item;
        // 将要删除的值置为空串
        set(content, e, "");
        // 移除掉所有为空串的键值对
        removeEmptyValues(content)
        return {
            ...item,
            content
        }
    })
    storage.$patch({
        fileList: langList
    })
    nextTick(() => {
        initData()
        storage.updateFileList();
    })
}

function deleteDir(){

}

</script>

<style lang="less" scoped>


</style>
