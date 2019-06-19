<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>
<script>
    import { mapActions, mapState } from 'vuex'
    export default {
        name: 'App',
        mounted () {
            window.addEventListener('load', this.setLeftMenus)
        },
        data(){
            return {
                ...mapState([
                    'leftMenus'
                ]),
            }
        },
        methods: {
            ...mapActions([
                'setLeftMenus'
            ]),
            checkLeftMenus: () => {
                if(this.leftMenus.length = 0){
                    this.setLeftMenus()
                }
            }
        }
    }
</script>