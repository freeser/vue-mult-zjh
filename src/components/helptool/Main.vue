<template>
  <div class="main">
    <share-to ref="share"></share-to>
    <progress-bar :step="step"></progress-bar>
    <form class="global-margin">
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>申请人<b>*</b></span>
          <input type="text" v-model="form.appConName" />
        </label>
        <label class="weui-flex__item flex_2 form-group">
          <span>联系方式<b>*</b></span>
          <input type="tel" v-model="form.appConTel" @blur="validateTel" />
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>患者姓名</span>
          <input type="text" v-model="form.patientName" />
        </label>
        <label class="weui-flex__item form-group">
          <span>年龄</span>
          <input type="number" v-model.number="form.age" />
        </label>
        <label class="weui-flex__item form-group">
          <span>性别</span>
          <select v-model="form.sex">
            <option value="0">请选择</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </select>
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>所在地区</span>
          <select v-model="form.conArea" @change="fillhos">
            <option v-for="(item,index) in citys" :value="item.remark">{{item.name}}</option>
          </select>
        </label>
        <label class="weui-flex__item form-group">
          <span>所在医院</span>
          <select v-model="form.hosId" @change="filldep">
             <option v-for="o in hos" :value="o.id">{{o.displayName}}</option>
          </select>
        </label>
        <label class="weui-flex__item form-group">
          <span>所在科室</span>
          <select v-model="form.depId" @change="filldoc">
             <option v-for="o in dep" :value="o.id">{{o.displayName}}</option>
          </select>
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>当地医师</span>
          <select v-model="form.localDoctorId">
             <option v-for="o in docs" :value="o.specialId">{{o.specialName}}</option>
          </select>
        </label>
        <label class="weui-flex__item form-group">
          <span>会诊费用</span>
          <input type="number" v-model.number="form.conMoney" placeholder="单位：元"/>
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>要求会诊时间</span>
          <select v-model="form.requireConDate">
            <option v-for="item in time" :value="item.displayName">{{ item.displayName }}</option>
          </select>
        </label>
      </div>
      <div class="weui-flex ">
        <div class="weui-flex__item form-group">
          <span>患者病情描述</span>
          <div class="textwithimg">
            <textarea v-model="form.patientDesc"></textarea>
            <div class="fileouter">
              <file :id="'localfile'" @success="uploadok" ref="localfile"></file>
              <p>病历图片或检查图片，方便精确分诊</p>
            </div>
          </div>
        </div>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>咨询目的</span>
          <textarea v-model="form.askProblem"></textarea>
        </label>
      </div>
      <div class="weui-flex ">
        <label class="weui-flex__item form-group">
          <span>备注</span>
          <textarea v-model="form.remark" placeholder="指定专家、医院或要求等"></textarea>
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
import File from 'components/share/File'
import $ from 'jquery'
import weui from 'weui'
import B from 'base'

export default {
  components: {
    ShareTo,
    ProgressBar,
    File
  },
  data () {
    return {
      step: 1,
      citys: [],
      hos: [],
      dep: [],
      docs: [],
      time: [],
      form:{
        appConName:'',
        appConTel:'',
        conArea:'',
        hosId: '',
        depId: '',
        patientName:'',
        age:'',
        sex:'',
        localDoctorId:'',
        conMoney:'',
        requireConDate:'',
        askProblem:'',
        patientDesc:'',
        normalImages: '',
        remark:''
      }
    }
  },
  activated () {
    document.title = '专家号远程会诊申请工具';
  },
  created () {
    loadcity(this);
    this.gaintime(); 
    function loadcity(that) {
      $.get('/wzjh/gainopencitys').done(function(res){
          that.citys = [{
            name: '请选择',
            remark: ''
          }].concat(res.beans || []);
      });
    }
  },
  mounted () {
      let that = this;
      wx.ready(function(){
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                $.get('/wzjh/gainCityByLocation',{latitude,longitude})
                .done(function(d){
                    that.citys.unshift({
                      name: '定位：' + d.city || '',
                      remark: d.remark || ''
                    });
                    that.form.conArea = d.remark
                });
            }
        });
      });
  },
  computed: {
    validate() {
      return !(this.form.appConName && !this.tel)
    },
    tel(){
      return !(this.form.appConTel && B.valideTel(this.form.appConTel))
    }
  },
  methods: {
    validateTel() {
      if(this.tel) return weui.topTips('请输入有效的联系方式', 3000),0;
    },
    submitNext() {
      if(this.validate){
        return weui.topTips('验证未通过，请检查所填项', 3000),0
      }
      let loading = weui.loading();
      let form = { ...this.form };
      form.requireConDate = form.requireConDate.replace('T',' ');
      $.post('/rcapp/basicapp',form )
      .done((res) => {
        loading.hide();
        let uuid = res.uuid;
        uuid ? (
          weui.toast('保存成功', 3000),
          this.$router.replace({name: 'detail', params: { uuid }})
          ): weui.alert('保存失败');
      });
    },
    uploadok() {
      this.form.normalImages = this.$refs.localfile.$data.ids.join(',');
    },
    gaintime() {
        $.get('/wzjh/loadwishtime')
            .done((d) => {
                this.time = d.times || [];
            });
    },
    fillhos() {
      this.docs = this.dep = this.hos = [];
      this.form.localDoctorId = this.form.depId = this.form.hosId = '';
      !!this.form.conArea && $.get('/wzjh/gainhosbycity', { dictcode: this.form.conArea })
          .then((res) => {
              this.hos = [{
                id:'',displayName:'请选择'
              }].concat(res.hospitals || []);
          });
    },
    filldep() {
      this.docs = this.dep = [];
      this.form.localDoctorId = this.form.depId = '';
      !!this.form.hosId && $.get('/wzjh/gaindepartsbyhos', { hosid: this.form.hosId })
          .then((res) => {
                this.dep = [{
                  id:'',displayName:'请选择'
                }].concat(res.departs || []);
          });
    },
    filldoc() {
      this.docs = [];
      this.form.localDoctorId = '';
      !!this.form.depId && $.get('/rcapp/loadcoodocs', { depid: this.form.depId })
          .then((res) => {
                this.docs = [{
                  specialId:'',specialName:'请选择'
                }].concat(res.docs || []);
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
