<template>
    <a-drawer
            v-model:open="props.open"
            class="custom-class"
            root-class-name="root-class-name"
            title="设置I18n"
            destroyOnClose
            :closable="false"
            :maskClosable="false"
            width="600px"
    >
        <div class="item">
            <div class="left">key</div>
            <div class="center">
                <a-input v-model:value="keyValue" disabled v-if="props.isEditI18n"/>
                <a-input-group compact v-else>
                    <!-- <a-input v-model:value="qianzhui" style="width: 50%" disabled/> -->
                    <a-input v-model:value="keyValue" style="width: 100%" />
                </a-input-group>
            </div>
            <div class="right">
                <a-button type="primary" shape="circle" :icon="h(CopyOutlined)" @click="copy" style="margin-left: 20px"/>
            </div>
        </div>
        <div class="item" v-for="item in storage.fileList" v-if="!isEmpty(langValue)">
            <div class="left">{{ item.key }}</div>
            <div class="center">
                <a-textarea v-model:value="langValue[item.key]"/>
            </div>
            <div class="right">
                <a-button @click="translation(item.key)" style="margin-left: 20px" >
                    翻译
                </a-button>
            </div>
        </div>

        <template #footer>
            <a-button type="primary" @click="handleOk">
                确定
            </a-button>
            <a-button @click="handleCancel" danger style="margin-left: 20px">
                取消
            </a-button>
        </template>
    </a-drawer>
</template>

<script setup>
import {defineProps, onMounted, ref, toRaw, watch, h} from 'vue'
import {useStorage} from "../../store/storage.js";
import {message} from "ant-design-vue";
import {CopyOutlined} from "@ant-design/icons-vue";
import CopyToClipboardw from 'copy-to-clipboard';

const storage = useStorage();
const keyValue = ref('')
const langValue = ref({})
const qianzhui = ref('');
const isTranlating = ref(false)
import {find, get, isEmpty, isString, set, trim} from "lodash";
import {translationI18n} from "../../util/utils.js";

const props = defineProps({
    open: Boolean,
    editKey: String,
    isEditI18n: Boolean
})

const emit = defineEmits(['update:open', 'seti18nText'])

watch(() => props.open, () => {
    if (props.open) {
        keyValue.value = props.editKey
        let obj = {};
        storage.fileList.forEach(item => {
            let {key} = item;
            let currentValue = get(find(storage.fileList, {key}), `content`, {})
            currentValue = currentValue[props.editKey] || ''
            obj[item.key] = isString(currentValue) ? currentValue : '';
        })
        langValue.value = obj
        if(!props.isEditI18n){
            qianzhui.value = props.editKey + '.'
            keyValue.value = ''
        }
    } else {
        keyValue.value = ''
        langValue.value = {}
    }
})

function handleCancel() {
    emit('update:open', false)
}

function handleOk() {
    let key = '';
    if(props.isEditI18n){
        key = keyValue.value
    }else{
        let value = trim(keyValue.value);
        if(!value) {
            message.error('key不能为空')
            return;
        }
        // if(value.includes('.')){
        //     message.error('key不能包含.符号')
        //     return;
        // }
        key = value
    }

    let list = toRaw(storage.fileList)
    list.map(item => {
        item.content = {
            ...item.content,
            [key]: langValue.value[item.key]
        }
        // set(item, `content.${key}`, langValue.value[item.key])
    })
    storage.$patch({
        fileList: list
    })
    emit('seti18nText')
}

async function translation(key) {
    let value = langValue.value[key]
    if(isTranlating.value){
        message.error('翻译进行中')
    }
    isTranlating.value = true;
    try{
        for (let i = 0; i < storage.fileList.length; i++) {
            let {key: langKey} = storage.fileList[i];
            if (langKey !== key) {
                let res = await translationI18n(value, langKey)
                langValue.value[langKey] = res
            }
        }
    }catch (e){
        message.error('翻译失败')
    }finally {
        isTranlating.value = false;
    }
}

function copy() {
    let value = keyValue.value
    // if(props.isEditI18n){
        CopyToClipboardw(keyValue.value)
        message.success('已复制Key：' + keyValue.value)
    // }else{
    //     CopyToClipboardw(trim(keyValue.value))
    //     message.success('已复制Key：' + qianzhui.value + trim(keyValue.value))
    // }
}

</script>

<style lang="less" scoped>

.item {
  display: flex;
  align-content: center;
  justify-content: center;
  margin-bottom: 10px;

  .left {
    width: 20%;
    line-height: 30px;
    text-align: center;
    font-weight: 600;
  }

  .center {
    width: 60%;
  }

  .right {
    width: 20%;
  }
}

</style>
