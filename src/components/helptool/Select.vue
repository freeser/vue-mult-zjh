<template>
  <div class="select">
    <share-to :isShow="false" ref="share"></share-to>
    <progress-bar :step="info.status || 2"></progress-bar>
    <form class="global-margin">
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>分诊负责人<b>*</b></span>
          <input type="text" v-model="form.triagePerson" />
        </label>
        <label class="weui-flex__item flex_2 form-group">
          <span>联系方式<b>*</b></span>
          <input type="tel" v-model="form.triagePersonTel" @blur="validateTel" />
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>推荐专家1<b>*</b></span>
          <div class="selectdoc">
            <router-link :to="{ name: 'explibs', params: {routeName:'select', remark: 'exp1', uuid: uuid }}" class="weui-flex acenter sdoc-item">
              <span class="thumb" :style="exp1.listSpecialPicture ? ('background-image: url('+ exp1.listSpecialPicture +')') : ''"></span>
              <span class="weui-flex__item">
                {{ exp1.specialName }} 
                <small><span v-if="exp1.duty">({{ exp1.duty }})&emsp; </span>
                <span class="gray">{{ exp1.hosName }}&ensp;{{ exp1.depName }}</span></small>
              </span>
              <span class="pickhandler"> {{ exp2.specialName ? '更换' : '选择' }} <i class="iconfont icon-arrright"></i></span>
            </router-link>
          </div>
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>推荐专家2</span>
          <div class="selectdoc">
            <router-link :to="{ name: 'explibs', params: {routeName:'select', remark: 'exp2', uuid: uuid }}" class="weui-flex acenter sdoc-item">
              <span class="thumb" :style="exp2.listSpecialPicture ? ('background-image: url('+ exp2.listSpecialPicture +')') : ''"></span>
              <span class="weui-flex__item">
                {{ exp2.specialName }} 
                <small><span v-if="exp2.duty">({{ exp2.duty }})&emsp; </span>
                <span class="gray">{{ exp2.hosName }}&ensp;{{ exp2.depName }}</span></small>
              </span>
              <span class="pickhandler"> {{ exp2.specialName ? '更换' : '选择' }} <i class="iconfont icon-arrright"></i></span>
            </router-link>
          </div>
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
      exp1: {},
      exp2: {},
      form:{
        uuid: this.$route.params.uuid,
        triagePerson:'',
        triagePersonTel:'',
        expertids: ''
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
        loading.hide();
        !this.info.uuid && this.$router.replace({name:'main'});
    });
  },
  activated () {
    if(this.$route.params.remark)
      this[this.$route.params.remark] = this.$route.params.pinfo;
  },
  computed: {
    validate() {
      return !(this.form.triagePerson && !this.tel && this.expids)
    },
    tel(){
      return !(this.form.triagePersonTel && B.valideTel(this.form.triagePersonTel))
    },
    expids () {
      var a = [];
      this.exp1.specialId && a.push(this.exp1.specialId);
      this.exp2.specialId && a.push(this.exp2.specialId);
      return this.form.expertids = a.join(',');
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
      if(!this.expids){
        return weui.topTips('请选择要推荐的专家', 3000),0
      }
      let loading = weui.loading();
      $.post('/rcapp/completetriage',this.form )
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
