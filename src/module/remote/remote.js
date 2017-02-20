import VueRouter from 'vue-router';
import Vue from 'vue';
import App from './Modules';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: App.components.Remote },
  { path: '/main', name: 'main', component: App.components.Remote },
  { path: '/location', name: 'location', component: App.components.Location },
  { path: '/remark', name: 'remark', component: App.components.Remark },
  { path: '/explibs', name: 'explibs', component: App.components.Explibs },
  { path: '/step2', name: 'step2', component: App.components.Step2 },
  { path: '/msg', name: 'msg', component: App.components.Msg },
  { path: '/bind', name: 'bind', component: App.components.Bind },
  { path: '*', component: App.components.NotFound }
];

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
