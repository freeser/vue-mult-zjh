<template>
  <div class="explibs">
    <div class="weui-tab">
        <div class="weui-search-bar weui-search-bar_focusing">
            <form @submit.prevent="seachkey" class="weui-search-bar__form">
                <div class="weui-search-bar__box">
                    <i class="weui-icon-search"></i>
                    <input type="search" class="weui-search-bar__input" v-model="form.keywords" placeholder="请输入医院、科室或者医生姓名">
                    <a href="javascript:;" v-show="form.keywords" @click="form.keywords=''" class="weui-icon-clear"></a>
                </div>
            </form>
            <a href="javascript:;" @click="seachkey" class="weui-search-bar__cancel-btn">确认</a>
        </div>
        <div class="weui-tab__panel" id="filteresult">
            <dl class="filteresult">
              <dd v-for="d in list" class="rlist flex">
                <div class="thumb">
                  <img :src="imgsrc(d.listSpecialPicture)" alt=""/>
                </div>
                <div class="f1 pinfo">
                  <p class="whitespace"><b>{{d.specialName}}</b>{{d.duty}}&ensp;{{d.profession}}</p>
                  <p class="whitespace">{{d.hosName}}&ensp;{{d.depName}}</p>
                  <p class="remark">{{ d.specialty }}</p>
                  <router-link class="selected" :to="{ name: 'main', params: { pinfo: d }}" replace>选定</router-link>
                </div>
              </dd>
            </dl>
        </div>
        <!--div class="weui-tabbar">
            <a href="javascript:;" @click="pick1" class="weui-tabbar__item">
                <p class="weui-tabbar__label">按医院 <i class="iconfont icon-arr_up"></i></p>
                <label class="whitespace">{{hosname}}</label>
            </a>
            <a href="javascript:;" @click="pick2" class="weui-tabbar__item">
                <p class="weui-tabbar__label">按科室 <i class="iconfont icon-arr_up"></i></p>
                <label class="whitespace">{{depname}}</label>
            </a>
            <a href="javascript:;" @click="pick3" class="weui-tabbar__item">
                <p class="weui-tabbar__label">按职称 <i class="iconfont icon-arr_up"></i></p>
                <label class="whitespace">{{dutyname}}</label>
            </a>
        </div-->
    </div>
</div>
</template>
<script>
  
import $ from 'jquery'
import weui from 'weui'
import Scroll from 'scroller'
import B from 'base'

export default{
  data() {
    return {
      form: {
        depid: '',
        standdepid: '',
        hosid: '',
        zc: '',
        pageSize: 10,
        pageNo: 1,
        keywords: ''
      },
      list: [],
      hos: [],
      hosname: '',
      hosid: [],
      dep: [],
      depid: [],
      depname: '',
      duty: [
        { value: '主任医师:主任医师', label: '主任医师' },
        { value: '副主任医师:副主任医师', label: '副主任医师' }
      ],
      dutyname: '',
      scll: {},
      isload: false
    }
  },
  // created(){
  //   var that = this;
  //   $.get('/propagate/gainHospitalsByArea')
  //       .done(function(d){
  //           var h = {};
  //           $.each(d.hospitals || [],function(i,n){
  //               var dis = n.distCode.substring(0,2) || '99';
  //               var dis4 = n.distCode.substring(0,4);
  //               if(dis4 == '4401' || dis4 == '4403') dis = dis4;
  //               if(dis in h){
  //                   h[dis]['children'].push({
  //                       value: n.id + ':' + n.displayName,
  //                       label: n.displayName
  //                   });
  //               }else{
  //                   h[dis] = {
  //                       label: getcity(dis),
  //                       value: n.distCode,
  //                       children: [{
  //                           value: n.id + ':' + n.displayName,
  //                           label: n.displayName
  //                       }]
  //                   };
  //               }
  //           });
  //           that.hos = (function(){
  //             var aa = [];
  //             $.each(h, function(k,v){
  //               aa.push(v);
  //             });
  //             return aa;
  //           })();
  //       });

  //       $.get('/propagate/gainBigDepartments')
  //       .done(function(d){
  //         var da = [].concat(JSON.parse(d));
  //         var out = [];
  //           $.each(da,function(i, n){
  //             out.push({
  //               label: n.name,
  //               value: n.stands[0]['bigDepId'] + ':' + n.name,
  //               children: (function(arr){
  //                 var innn = [];
  //                 $.each(arr,function(k,v){
  //                   innn.push({
  //                     label: v.displayName,
  //                     value: v.id + ':' + v.displayName
  //                   });                  
  //                 });
  //                 return innn
  //               })(n.stands)
  //             });
  //           });
  //           that.dep = out;
  //       });

  //       function getcity(id){
  //           var discodes = {
  //               '11' : '北京',
  //               '31' : '上海',
  //               '36' : '江西',
  //               '42' : '湖北',
  //               '43' : '湖南',
  //               '44' : '广东',
  //               '51' : '华西',
  //               '4401' : '广州',
  //               '4403' : '深圳',
  //               '99' : '未知'
  //           };
  //           return id in discodes ? discodes[id] : (id || '未知');
  //       }
  // },
  mounted() {
    this.scll = new Scrollload(document.querySelector('#filteresult'), this.gaindata, {
      window: document.querySelector('#filteresult'),
      noDataHtml: `<div class="weui-loadmore weui-loadmore_line weui-loadmore_dot"><span class="weui-loadmore__tips"></span></div>`,
      loadingHtml: `<div class="weui-loadmore"><i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span></div>`,
      exceptionHtml: `<div class="weui-loadmore weui-loadmore_line weui-loadmore_dot"><span class="weui-loadmore__tips"></span></div>`,
      isInitLock: true
    });
  },
  deactivated() {
    this.hosname = '';
    this.hosid = [];
    this.depname = '';
    this.depid = [];
    this.dutyname = '';
    this.form = {
      depid: '',
      standdepid: '',
      hosid: '',
      zc: '',
      pageSize: 10,
      pageNo: 1,
      keywords: ''
    };
    this.scll.lock()
  },
  activated() {
    this.form.depid = this.$route.params.depid || '';
    this.form.pageNo = 1;
    this.list = [];
    if (!this.form.depid) return this.$router.replace({ name: 'main' }), 0;
    this.gaindata(this.scll);
  },
  methods: {
    imgsrc: function (v) {
      return B.imgsrc(v)
    },
    seachkey: function () {
      this.form.pageNo = 1;
      this.list = [];
      this.gaindata(this.scll);
    },
    gaindata: function (sl) {
      var that = this;
      $.get('/wzjh/loadexperts', this.form)
        .done(function (d) {
          var l = d.specials || [];
          if (l.length) {
            that.list = that.list.concat(l);
            that.form.pageNo += 1;
            sl.unLock()
          } else {
            sl.noData()
          }
        })
        .fail(function () {
          sl.throwException()
        })
    },
    pick1() {
      var that = this;
      weui.picker(this.hos, {
        defaultValue: this.hosid,
        onConfirm: function (result) {
          var arr1 = result[0].split(':');
          var arr2 = result[1].split(':');
          that.form.hosid = arr2[0],
            that.hosid = [arr1[0], arr2[0]];
          that.hosname = arr2[1],
            that.seachkey()
        },
        id: 'pick1'
      });
    },
    pick2() {
      var that = this;
      weui.picker(this.dep, {
        defaultValue: this.depid,
        onConfirm: function (result) {
          var arr1 = result[0].split(':');
          var arr2 = result[1].split(':');
          that.form.depid = arr2[0],
            that.form.standdepid = arr1[0],
            that.depid = [arr1[0], arr2[0]];
          that.depname = arr2[1],
            that.seachkey()
        },
        id: 'pick2'
      });
    },
    pick3() {
      var that = this;
      weui.picker(this.duty, {
        defaultValue: [this.form.zc],
        onConfirm: function (result) {
          var arr = result[0].split(':')
          that.form.zc = arr[0],
            that.dutyname = arr[1],
            that.seachkey()
        },
        id: 'pick3'
      });
    }
  }
}

</script>
