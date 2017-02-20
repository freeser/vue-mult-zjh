<template>
  <div class="select">
    <share-to ref="share" :isShow="false"></share-to>
    <progress-bar :step="info.status || 2"></progress-bar>
    <form class="global-margin">
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>确认负责人<b>*</b></span>
          <input type="text" v-model="form.chargePersonName" />
        </label>
        <label class="weui-flex__item flex_2 form-group">
          <span>联系方式<b>*</b></span>
          <input type="tel" v-model="form.chargePersonTel" @blur="validateTel" />
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group weui-cells_checkbox">
          <span>选定专家<b>*</b></span>
          <div class="selectdoc" v-for="exp in exps">
            <label class="weui-flex acenter sdoc-item">
              <span class="thumb" :style="exp.headImage ? ('background-image: url('+ exp.headImage +')') : ''"></span>
              <span class="weui-flex__item">
                {{ exp.docName }} 
                <small><span v-if="exp.duty">({{ exp.duty }})&emsp; </span>
                <span class="gray">{{ exp.hosName }}&ensp;{{ exp.depName }}</span></small>
              </span>
              <span class="pickhandler"> 
                <input type="radio" class="weui-check" v-model="form.expertId" :value="exp.doctorId">
                <i class="weui-icon-checked"></i>
              </span>
            </label>
          </div>
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>专家不合适？自行选择</span>
          <div class="selectdoc" style="padding: 0;display: inline-block;border-color: #0284D2;margin: 10px 0;">
            <router-link :to="{ name: 'explibs', params: {routeName:'confirm', remark: 'exps', uuid: uuid }}" class="acenter sdoc-item">
              <span class="pickhandler"> 专家库 <i class="iconfont icon-arrright"></i></span>
            </router-link>
          </div>
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>确定会诊时间</span>
          <input type="datetime-local" v-model="form.conSureTime" />
        </label>
      </div>
      <div class="footer">
        <button type="button" :disabled="validate" @click.prevent="submitNext" class="weui-btn btn-primary btn-border">保存</button>
      </div>
    </form>
  </div>
</template>

<script>
import ShareTo from 'components/static/ShareTo'
import ProgressBar from 'components/static/ProgressBar'
import $ from 'jquery'
import weui from 'weui'
import B from 'base'

export default {
  components: {
    ShareTo,ProgressBar
  },
  data () {
    return {
      uuid: this.$route.params.uuid,
      info: {},
      exps: [],
      _exps: [],
      form:{
        uuid: this.$route.params.uuid,
        chargePersonName: '',
        chargePersonTel: '',
        conSureTime: '',
        expertId: ''
      }
    }
  },
  created () {
    if(!this.uuid){
      return this.$router.replace({name:'main'}),0;
    }
    let loading = weui.loading();
    $.get('/rcapp/triageinfo',{ uuid: this.uuid }).done((res) => {
        this.info = res.appinfo || {};
        this.exps = res.recs || [];
        this._exps = res.recs || [];
        loading.hide();
        !this.info.uuid && this.$router.replace({name:'main'});
    });
  },
  activated () {
    if(this.$route.params.remark){
      let _exp = this.$route.params.pinfo;
      let exp = {
        doctorId: _exp.specialId,
        docName: _exp.specialName,
        headImage: _exp.listSpecialPicture,
        hosName: _exp.hosName,
        depName: _exp.depName,
        duty: _exp.duty
      };
      this[this.$route.params.remark] = [exp].concat(this._exps);
      this.form.expertId = _exp.specialId;
    }
  },
  computed: {
    validate() {
      return !(this.form.chargePersonName && !this.tel && this.form.expertId)
    },
    tel(){
      return !(this.form.chargePersonTel && B.valideTel(this.form.chargePersonTel))
    }
  },
  methods: {
    validateTel() {
      if(this.tel) return weui.topTips('请输入有效的联系方式', 3000),0
    },
    submitNext() {
      if(this.validate){
        return weui.topTips('验证未通过，请检查所填项', 3000),0
      }
      if(!this.form.expertId){
        return weui.topTips('请选择要推荐的专家', 3000),0
      }
      let loading = weui.loading();
      let form = { ...this.form };
      form.conSureTime = form.conSureTime.replace('T',' ');
      $.post('/rcapp/completetriage',form )
      .done((res) => {
        loading.hide();
        let uuid = res.uuid;
        uuid ? (
          weui.toast('保存成功', 3000),
          this.$router.replace({name: 'detail', params: { uuid }})
          ): weui.alert('保存失败');
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/css/var.scss";
  form{
    padding-bottom:1em;    
  }
  .fileouter{
    padding-top: $body-margin;
    margin:0 $body-margin;
    border-top: 1px solid #DCDADB;
    p{
      color: #ccc;
      padding: 0 0 10px 0;
    }
  }
</style>
