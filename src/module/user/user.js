import VueRouter from 'vue-router';
import Vue from 'vue';
import App from './Modules';
import $ from 'jquery'

Vue.use(VueRouter);

const Index = resolve => require(['components/helptool/App'], resolve);
const Center = resolve => require(['components/user/Center'], resolve);
const Baseinfo = resolve => require(['components/user/Baseinfo'], resolve);
const Bind = resolve => require(['components/user/Bind'], resolve);
const Confirm = resolve => require(['components/user/Confirm'], resolve);
const Next = resolve => require(['components/user/Next'], resolve);
const Reset = resolve => require(['components/user/Reset'], resolve);
const NotFound = resolve => require(['components/static/404'], resolve);

const routes = [
  { path: '/', component: Index },
  { path: '/app', component: Index },
  { path: '/center', name:'center', component: Center },
  { path: '/info/:openid', name:'info', component: Baseinfo },
  { path: '/bind/:openid', name:'bind', component: Bind },
  { path: '/bind/:openid/:redirect', name:'bindr', component: Bind },
  { path: '/confirm/:openid/:tel', name:'confirm', component: Confirm },
  { path: '/next/:openid/:tel', name:'next', component: Next },
  { path: '/reset/:openid/:tel', name:'reset', component: Reset },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
