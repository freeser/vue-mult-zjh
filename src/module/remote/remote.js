import VueRouter from 'vue-router';
import Vue from 'vue';
import App from './Modules';

Vue.use(VueRouter);

const Index = resolve => require(['components/helptool/App'], resolve);
const Remote = resolve => require(['components/remote/remote'], resolve);
const Location = resolve => require(['components/remote/location'], resolve);
const Remark = resolve => require(['components/remote/remark'], resolve);
const Explibs = resolve => require(['components/remote/explibs'], resolve);
const Step2 = resolve => require(['components/remote/step2'], resolve);
const Msg = resolve => require(['components/remote/msg'], resolve);
const Bind = resolve => require(['components/user/Bind'], resolve);
const Confirm = resolve => require(['components/user/Confirm'], resolve);
const Next = resolve => require(['components/user/Next'], resolve);
const NotFound = resolve => require(['components/static/404'], resolve);

const routes = [
  { path: '/', component: Index },
  { path: '/main', name: 'main', component: Remote },
  { path: '/main/:openid', name: 'main2', component: Remote },
  { path: '/main/:openid/:docid', name: 'main3', component: Remote },
  { path: '/location/:openid', name: 'location', component: Location },
  { path: '/remark', name: 'remark', component: Remark },
  { path: '/explibs/:openid', name: 'explibs', component: Explibs },
  { path: '/step2/:openid', name: 'step2', component: Step2 },
  { path: '/msg', name: 'msg', component: Msg },
  { path: '/bind/:openid', name: 'bind', component: Bind },
  { path: '/confirm/:openid/:tel', name:'confirm', component: Confirm },
  { path: '/next/:openid/:tel', name:'next', component: Next },
  { path: '*', component: NotFound }
];

const router = new VueRouter({
  routes
});

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
