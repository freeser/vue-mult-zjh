<template>
  <div class="step2 fixedfooter">
        <header>
          请详细填写疾病信息，方便我们更好的为您服务
        </header>
        <section>
          <dl>
            <dd class="weui-flex">
              <span class="label">姓名<b>*</b></span>
              <input class="weui-flex__item" type="text" v-model="form.contactName">
              <span class="label">年龄<b>*</b></span>
              <input class="weui-flex__item" type="text" v-model.number="form.age">
            </dd>
            <dd class="weui-flex">
              <span class="label">性别<b>*</b></span>
              <div class="weui-cells_checkbox weui-flex__item clearfix">
                  <label class="weui-cell weui-check__label" for="s11">
                      <div class="weui-cell__hd">
                          <input type="radio" class="weui-check" v-model="form.sex" value="1" id="s11">
                          <i class="weui-icon-checked"></i>
                      </div>
                      <div class="weui-cell__bd">男</div>
                  </label>
                  <label class="weui-cell weui-check__label" for="s12">
                      <div class="weui-cell__hd">
                          <input type="radio" v-model="form.sex" value="2" class="weui-check" id="s12">
                          <i class="weui-icon-checked"></i>
                      </div>
                      <div class="weui-cell__bd">女</div>
                  </label>
              </div>
            </dd>
            <dd class="weui-flex">
              <span class="label">身份证</span>
              <input class="weui-flex__item" type="text" v-model="form.idcard" @blur="blurCodeId">
            </dd>
            <dd class="weui-flex">
              <span class="label">手机号<b>*</b></span>
              <input class="weui-flex__item" type="tel" v-model="form.telphone" @blur="blurTel">
            </dd>
            <dd>
              <span class="label">病情描述<b>*</b></span>
              <textarea v-model="form.mainSuit" placeholder="请详细描述体检报告、身体情况、查体等，以便专家更好的给出意见" rows="4"></textarea>
              <div class="diyupload clearfix" id="localfile">
                  <ul class="weui-uploader__files" id="localfileFiles"></ul>
                  <div class="weui-uploader__input-box">
                      <input id="localfileInput" class="weui-uploader__input" type="file" accept="image/*" multiple="">
                  </div>
              </div>
            </dd>
            <dd>
              <span class="label">咨询目的<b>*</b></span>
              <textarea v-model="form.askProblem" rows="4"></textarea>
            </dd>
            <dd>
              <span class="label">检查报告 <small>病理报告、手术记录、生化检查单等...</small></span>
              <div class="diyupload clearfix" id="lispic">
                  <ul class="weui-uploader__files" id="lispicFiles"></ul>
                  <div class="weui-uploader__input-box">
                      <input id="lispicInput" class="weui-uploader__input" type="file" accept="image/*" multiple="">
                  </div>
              </div>
            </dd>
            <dd>
              <span class="label">影像胶片 <small>使用相机拍摄的B超、CT/MR等...</small></span>
              <div class="diyupload clearfix" id="pacpic">
                  <ul class="weui-uploader__files" id="pacpicFiles"></ul>
                  <div class="weui-uploader__input-box">
                      <input id="pacpicInput" class="weui-uploader__input" type="file" accept="image/*" multiple="">
                  </div>
              </div>
            </dd>
          </dl>
        </section>
        <footer class="fixed bottom width100">
            <div class="btnarea">
                <button type="button" :disabled="validate" @click="finshstep" class="weui-btn weui-btn_main">提交并支付</button>
            </div>
        </footer>
    </div>
</template>
<script>

import $ from 'jquery'
import weui from 'weui'
import B from 'base'

export default{
  data() {
    return {
      openid: '',
      form: {
        contactName: '',
        age: '',
        idcard: '',
        sex: '',
        telphone: '',
        mainSuit: '',
        report: '',
        askProblem: '',
        normalImages: '',
        checkReportImages: '',
        radiographFilmImags: ''
      },
      req:{}
    }
  },
  mounted() {
    var that = this;
    B.initUpload(weui, '#localfile', function(res){
      that.form.normalImages = (function(arr){
        var a = arr.concat([res.upid]);
        return a.join(',');
      })(that.form.normalImages ? that.form.normalImages.split(',') : []);
    });
    B.initUpload(weui, '#lispic', function(res){
      that.form.checkReportImages = (function(arr){
        var a = arr.concat([res.upid]);
        return a.join(',');
      })(that.form.checkReportImages ? that.form.checkReportImages.split(',') : []);
    });
    B.initUpload(weui, '#pacpic', function(res){
      that.form.radiographFilmImags = (function(arr){
        var a = arr.concat([res.upid]);
        return a.join(',');
      })(that.form.radiographFilmImags ? that.form.radiographFilmImags.split(',') : []);
    });
  },
  activated() {
    this.openid = this.$route.params.openid;
    if(this.$route.params.hosid)
      this.req = this.$route.params;
    else
      this.$router.replace({ name: 'main' });
  },
  computed: {
    validate() {
      return !this.form.contactName || this.tel || this.ag || this.card || !this.form.sex || !this.form.mainSuit || !this.form.askProblem
    },
    ag(){
      return !(this.form.age && this.form.age < 150)
    },
    tel(){
      return !(this.form.telphone && B.valideTel(this.form.telphone))
    },
    card(){
      return !!this.form.idcard && !B.valideCard(this.form.idcard)
    }
  },
  methods: {
    finshstep() {
      // if(!this.form.contactName) return weui.topTips('请填写姓名', 3000),0;
      // if(this.ag) return weui.topTips('请填写有效的年龄', 3000),0;
      // if(this.card) return weui.topTips('请填写有效的身份证号', 3000),0;
      // if(!this.form.sex) return weui.topTips('请选择性别', 3000),0;
      if(this.validate) return weui.topTips('请填写正确的字段', 3000),0;
      var loading = weui.loading(),that = this;
      $.post('/wzjh/subremotecase',$.extend({ openid : this.openid }, this.form, this.req))
      .done(function(d){
        //d.payStatus == true ? that.wxpay(d) : that.paysuccess();
        that.wxpay(d);
      })
      .always(function(){
        loading.hide();
      });
    },
    blurTel (){
      if(this.tel) return weui.topTips('请填写有效的电话', 3000),0;
    },
    blurCodeId (){
      if(this.card) return weui.topTips('请填写有效的身份证号', 3000),0;
    },
    wxpay (d) {
      B.jsApiCall({
        "appId":d.appid,
        "timeStamp":d.timeStamp,
        "nonceStr":d.nonceStr,
        "package":d['package'],
        "paySign":d.sign,
        "signType":"MD5"
      },this.paysuccess);
    },
    paysuccess () {
      this.$router.replace({ name: 'msg',params:{ state: 'ok'} });
    }
  }
}
  
</script>