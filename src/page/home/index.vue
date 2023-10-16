<template>
    <div class="wrapper">
        <div class="header">
            <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="change"/>
        </div>
        <div class="content">
            <router-view/>
        </div>
    </div>
</template>
<script setup>
import {ref, watch} from 'vue';
const current = ref(['list']);
import {useRouter, useRoute} from "vue-router";
const route = useRoute();

watch(() => route.path, () =>{
    if(route.path === '/home/list'){
        current.value = ['list']
    }else if(route.path === '/home/lang'){
        current.value = ['lang']
    }else{
        current.value = []
    }
}, {
    immediate: true
})

const router = useRouter();

const items = ref([
    {
        key: 'list',
        label: '列表',
        title: '列表',
    },
    {
        key: 'lang',
        label: '语言包',
        title: '语言包',
    }
]);

function change(e){
    router.push(`/home/${e.key}`)
}

</script>

<style lang="less" scoped>

.wrapper {
    .header{
        padding: 4px 20px;
        border-radius: 10px;
    }
    .content{
        padding: 20px;
    }
}
</style>
