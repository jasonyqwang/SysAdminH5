<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in leftMenus">
                <template v-if="item.children">
                    <el-submenu :index="item.name" :key="item.id">
                        <template slot="title">
                            <i :class="item.icon ? item.icon : 'el-icon-menu'"></i><span slot="title">{{ item.label }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.name" :key="subItem.id" >
                                <template slot="title">{{ subItem.label }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :key="threeItem.id" :index="threeItem.name">
                                    {{ threeItem.label }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.name" :key="subItem.id">
                                {{ subItem.label }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.name" :key="item.id">
                        <i :class="item.icon"></i><span slot="title">{{ item.label }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import { mapState } from 'vuex'
    export default {
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },
            ...mapState({
                'leftMenus': state => {
                    return state.app.leftMenus
                }
            })
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        data() {
            return {
                collapse: false
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
