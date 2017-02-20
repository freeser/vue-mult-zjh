<template>
  <div class="detail">
    <share-to :shareconfig="shareconfig" ref="share"></share-to>
    <progress-bar :step="info.status" v-if="imodel != 'expert'"></progress-bar>
    <section class="sharetowho" v-if="imodel != 'expert'">
      <div class="weui-flex weui-cells_checkbox">
          <span>我要分享给：</span>
          <label class="weui-cell weui-check__label">
              <div class="weui-cell__hd">
                  <input type="radio" class="weui-check" v-model="model" value="">
                  <i class="weui-icon-checked"></i>
              </div>
              <div class="weui-cell__bd">
                  <p>同事</p>
              </div>
          </label>
          <label class="weui-cell weui-check__label">
              <div class="weui-cell__hd">
                  <input type="radio" class="weui-check" v-model="model" value="expert">
                  <i class="weui-icon-checked"></i>
              </div>
              <div class="weui-cell__bd">
                  <p>专家</p>
              </div>
          </label>
      </div>
    </section>
    <section>
      <header class="title">
        <span>申请人信息</span>
      </header>
      <dl class="list">
        <dd class="weui-flex"><label>姓名</label><span class="weui-flex__item">{{ info.appConName }}</span></dd>
        <dd class="weui-flex"><label>联系方式</label><span class="weui-flex__item">{{ info.appConTel }}</span></dd>
        <dd class="weui-flex"><label>申请日期</label><span class="weui-flex__item">{{ info.appCreateTime }}</span></dd>
      </dl>
    </section>
    <section>
      <header class="title">
        <span>会诊信息</span>
      </header>
      <dl class="list">
        <dd class="weui-flex"><label>所属医院</label><span class="weui-flex__item">{{ doc.hosName }}</span></dd>
        <dd class="weui-flex"><label>会诊科室</label><span class="weui-flex__item">{{ doc.depName }} </span></dd>
        <dd class="weui-flex"><label>当地医师</label><span class="weui-flex__item">{{ doc.specialName }}</span></dd>
        <dd class="weui-flex"><label>会诊费用</label><span class="weui-flex__item">{{ info.conMoney }}<span class="gray">（元）</span></span></dd>
        <dd class="weui-flex"><label>时间要求</label><span class="weui-flex__item">{{ info.requireConDate }}</span></dd>
      </dl>
    </section>
    <section v-if="info.askProblem">
      <header class="title">
        <span>咨询问题</span>
      </header>
      <dl class="list">
        <dd class="weui-flex"><span class="weui-flex__item">{{ info.askProblem }}</span></dd>
      </dl>
    </section>
    <section>
      <header class="title">
        <span>患者信息</span>
      </header>
      <dl class="list">
        <dd class="weui-flex"><span class="weui-flex__item">{{ info.patientName }}<span class="gray">（{{ info.age }}岁 {{ info.sex == 1 ? '男' : '女' }}）</span></span></dd>
        <dd class="weui-flex"><span class="weui-flex__item">{{ info.patientDesc }}</span></dd>
        <dd style="border-top:1px solid #E5E5E5;">
          <ul class="weui-uploader__files clearfix">
              <li v-for="img in imgs" @click="showpic(img.fileUrl)" class="weui-uploader__file" :style="'background-image:url('+ img.fileUrl +')'"></li>
          </ul>
        </dd>
      </dl>
    </section>
    <section v-if="info.remark">
      <header class="title">
        <span>备注</span>
      </header>
      <dl class="list">
        <dd class="weui-flex"><span class="weui-flex__item">{{ info.remark }}</span></dd>
      </dl>
    </section>
    <section v-if="imodel !='expert' && info.status == 1">
      <div class="footer">
        <router-link :to="{ name: 'select', params: { uuid: uuid }}" class="weui-btn btn-danger btn-border">开始分诊</router-link>
      </div>
    </section>
    <section v-if="imodel !='expert' && info.status >= 2">
      <header class="title organ">
        <span>分诊信息</span>
      </header>
      <dl class="list">
        <dd class="weui-flex"><label>分诊医师</label><span class="weui-flex__item">{{ info.triagePerson }}</span></dd>
        <dd class="weui-flex"><label>联系方式</label><span class="weui-flex__item">{{ info.triagePersonTel }}</span></dd>
        <dd class="weui-flex" v-for="(exp,index) in exps"><label>推荐专家{{ index + 1 }}</label>
          <span class="weui-flex__item weui-flex column">
            <span class="weui-flex__item">{{ exp.docName }}&ensp;{{ exp.duty }}</span>
            <span class="weui-flex__item">{{ exp.hosName }}&ensp;{{ exp.depName }}</span>
          </span>
        </dd>
      </dl>
      <div class="footer" v-if="info.status == 2">
        <router-link :to="{ name: 'confirm', params: { uuid: uuid }}" class="weui-btn btn-danger btn-border">确认会诊信息</router-link>
      </div>
    </section>
    <section v-if="imodel !='expert' && info.status >= 3">
      <header class="title organ">
        <span>确认专家信息</span>
      </header>
      <dl class="list">
        <dd class="weui-flex"><label>确认负责人</label><span class="weui-flex__item">{{ info.chargePersonName }}</span></dd>
        <dd class="weui-flex"><label>联系方式</label><span class="weui-flex__item">{{ info.chargePersonTel }}</span></dd>
        <dd class="weui-flex"><label>选定专家</label>
          <span class="weui-flex__item weui-flex column">
            <span class="weui-flex__item">{{ exp.specialName }}&ensp;<small class="gray">{{ exp.duty }}</small></span>
            <span class="weui-flex__item">{{ exp.hosName }}&ensp;{{ exp.depName }}</span>
          </span>
        </dd>
        <dd class="weui-flex"><label>会诊时间</label><span class="weui-flex__item">{{ info.conSureTime }}</span></dd>
      </dl>
      <div class="footer" v-if="info.status == 3">
        <button class="weui-btn btn-danger btn-border" @click="creatorder">生成订单</button>
      </div>
    </section> 
    <section style="height: 40px;"></section>   
  </div>
</template>

<script>
import ShareTo from 'components/static/ShareTo'
import ProgressBar from 'components/static/ProgressBar'
import $ from 'jquery'
import weui from 'weui'

export default {
  components: {
    ShareTo,
    ProgressBar
  },
  data () {
    return {
      uuid: this.$route.params.uuid,
      model: this.$route.params.model || '',
      imodel: this.$route.params.model || '',
      info: {},
      doc: {},
      exps: [],
      exp: {},
      imgs: [],
      haspay: 1,
      oid: '',
      shareconfig: {}
    }
  },
  activated () {
    if(!this.uuid){
      return this.$router.replace({name:'main'}),0;
    }
    document.title = '专家号远程会诊申请表';
    this.initPage();
  },
  watch: {
    model (){
      this.setshareconfig()
    }
  },
  methods: {
    setshareconfig () {
      this.shareconfig = {
          title: (() => {
            if(this.model=='expert'){
              return document.title;
            }
            switch(this.info.status){
              case 2:
                return `分诊人：${this.info.triagePerson}/${this.info.triagePersonTel}`;
              case 3:
                return `分诊确认人：${this.info.chargePersonName}/${this.info.chargePersonTel}`;
              default:
                return `申请人：${this.info.appConName}/${this.info.appConTel}`;
            }
          })(),
          desc: `${this.info.patientName}/${this.info.age}岁/${this.info.sex == '1' ? '男' : '女'}/${this.info.patientDesc}`,
          link: `${location.origin + location.pathname}#detail/${this.uuid}` + (this.model=='expert' ? ('/expert') : ''),
          imgUrl: this.imgs.length ? this.imgs[0]['fileUrl'] : 'https://www.51zjh.com/img/website/icon@2x.png'
        };
    },
    initPage () {
      let loading = weui.loading();
      $.get('/rcapp/appdetail',{ uuid: this.uuid, model: this.model })
      .done((res) => {
        loading.hide();
        this.info = res.appinfo || {};
        this.doc = res.localdoc || {};
        this.exps = res.recs || [];
        this.imgs = res.caseimages || [];
        this.haspay = res.payStatus || 1;
        this.oid = res.oid || '';
        this.model != res.model ? (this.model = res.model) : this.setshareconfig();
        this.imodel != 'expert' && res.payStatus == 4 && res.oid && this.checkispay();
        res.appinfo.conExpertId && getexpinfo(res.appinfo.conExpertId, this);
      });
      function getexpinfo(docid, that){
        $.get('/kangxin/gainspedetail',{ docid })
        .done((res) => {
          that.exp = res.special;
        });
      }
    },
    showpic (cur) {
      var that = this;
      wx.ready(function () {
				wx.previewImage({
			      current: cur,urls: (function(){
              var arr = [];
              $.each(that.imgs,function(i,n){
                arr.push(n.fileUrl);
              });
              return arr;
            })()
			  });
		  });
    },
    creatorder () {
      let loading = weui.loading();
      $.post('/rcapp/generateorder',{ uuid: this.uuid })
      .done((res) => {
        !!res.code_url ? this.showPay(res.code_url) : weui.alert('订单生成失败，请重试');
      })
      .always(()=>{
        loading.hide();
      });
    },
    checkispay () {
      let loading = weui.loading();
      $.post('/rcapp/gainerweima',{ oid: this.oid ,uuid: this.uuid})
      .done((res) => {
        !!res.code_url ? this.showPay(res.code_url) : weui.alert('检测失败，请刷新重试');
      })
      .always(()=>{
        loading.hide();
      });
    },
    showPay (url) {
      weui.alert(`
        <label style="display:block;padding:0.5em 0;text-align:center;">订单生成成功，请在微信中扫码支付</label>
        <img src="/kangxin/showqr?code_url=${url}" style="width:100%;"/>
      `,{
          title: `支付订单${this.info.conMoney}元`,
          buttons: [
            {
              type: 'default',
              label: '以后支付'
            },
            {
              label: '完成支付',
              type: 'primary',
              onClick: () => {
                this.listenPay(url,() => {
                  weui.toast('支付成功', 3000),
                  this.initPage()
                },() => {
                  weui.alert('订单尚未支付成功',() => {
                    this.showPay(url)
                  })
                });
              }
          }]
      });
    },
    listenPay (url, ok, err) {
      let loading = weui.loading();
      $.post('/rcapp/listenpaystatus',{oid: this.oid})
          .done((d) => {
              d.status == 'success' ? ok() : err();
          })
          .fail(err)
          .always(() => {
            loading.hide();
          });
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/css/var.scss";
  section{
    margin:0 $body-margin
  }
  .sharetowho{
    border-bottom: 12px solid #eee;
    margin: 0;
    padding: 10px $body-margin;
    span{
      padding: 10px 0;
      color: $main-color;
    }
    .weui-cell:before{
      display: none;
    }
    .weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before{
      color: $main-color;
    }
  }
</style>
