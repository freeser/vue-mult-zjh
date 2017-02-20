import VueRouter from 'vue-router';
import Vue from 'vue';
import App from './Modules';
import $ from 'jquery'

Vue.use(VueRouter);

const Index = resolve => require(['components/helptool/App'], resolve);
const Main = resolve => require(['components/helptool/Main'], resolve);
const Detail = resolve => require(['components/helptool/Detail'], resolve);
const Select = resolve => require(['components/helptool/Select'], resolve);
const Confirm = resolve => require(['components/helptool/Confirm'], resolve);
const Libs = resolve => require(['components/share/Explibs'], resolve);
const NotFound = resolve => require(['components/static/404'], resolve);

const routes = [
  { path: '/', component: Index },
  { path: '/app', component: Index },
  { path: '/main', name:'main', component: Main },
  { path: '/detail/:uuid', name:'detail', component: Detail },
  { path: '/detail/:uuid/:model', name:'detailshare', component: Detail },
  { path: '/select/:uuid', name:'select', component: Select },
  { path: '/confirm/:uuid', name:'confirm', component: Confirm },
  { path: '/explibs', name:'explibs', component: Libs },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  routes
})

router.afterEach(route => {
  let hrf = location.href;
  if(hrf.indexOf('?from=singlemessage&isappinstalled=0') != -1){
    location.href = hrf.replace('?from=singlemessage&isappinstalled=0','');
    return 0;
  }
  $.get('/rcapp/gainshareparams',{ shareurl: hrf })
    .done((res) => {
        let cfg = Object.assign(res, {
          jsApiList: [
            'hideAllNonBaseMenuItem',
            'showMenuItems',
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'showAllNonBaseMenuItem', 
            'hideMenuItems',
            'getLocation'
          ]
        });
        wx.config(cfg);
    });
})

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
