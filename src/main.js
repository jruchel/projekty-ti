import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Matrix from '@/components/IntoTheMatrix'
import Temp from '@/components/Temp'

const routes = [
    {path: "/matrix", component: Matrix},
    {path: "/temp", component: Temp}
]

Vue.use(Router)
Vue.config.productionTip = false

const router = new Router({
    routes
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
