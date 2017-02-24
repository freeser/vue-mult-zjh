<template>
    <div class="bindtel">
      <div class="page msg_success js_show">
          <div class="weui-msg">
              <div class="weui-msg__icon-area">
                <img src="../../../assets/img/icon@2x.png" alt="">
              </div>
              <div class="weui-msg__text-area" style="padding:0;">
                  <div class="weui-cells weui-cells_form">
                     <div class="weui-cell weui-cell_vcode">
                        <div class="weui-cell__hd">
                            <label class="weui-label" style="width: 4em;text-align:left;">手机号</label>
                        </div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="tel" v-model="telphone" placeholder="请输入手机号">
                        </div>
                        <div class="weui-cell__ft">
                            <button class="weui-vcode-btn" :disabled="tel || lock" @click="getcode" >{{ lock ? timer : '获取验证码'}}</button>
                        </div>
                    </div>
                    <div class="weui-cell weui-cell_vcode">
                        <div class="weui-cell__hd">
                            <label class="weui-label" style="width: 4em;line-height:44px;text-align:left;">验证码</label>
                        </div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="number" v-model.number="code" placeholder="请输入验证码">
                        </div>
                    </div>
                </div>
              </div>
              <div class="weui-msg__opr-area">
                  <p class="weui-btn-area">
                      <button @click.prevent="bindto" :disabled="validate || islogin" class="weui-btn weui-btn_primary">确定</button>
                  </p>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
import B from 'base'
import weui from 'weui'
import $ from 'jquery'
export default {
    data() {
        return {
            openid: '',
            telphone: '',
            code: '',
            timer: 60,
            islogin: false,
            lock: false
        }
    },
    activated() {
        this.timer = 60;
    },
    watch:{
        lock: function(n, o){
            this.timer = 60;
        }
    },
    computed: {
        validate() {
            return this.tel || this.cod
        },
        tel () {
            return !B.valideTel(this.telphone)
        },
        cod () {
            return !(this.code && (this.code + '').length == 4);
        }
    },
    methods: {
        bindto() {
            var that = this;
            if(this.validate) return weui.alert('无效的输入项'), 0;
            this.islogin = true;
            $.post('/wzjh/tellCode',{code: this.code,tel: this.telphone, openid: this.openid })
            .done(function(d){
                if(d.status == 'success'){
                    that.redirct();
                }else{
                    weui.alert('验证码错误，请重新输入');
                }
            })
            .always(function(){
                that.islogin = false;
            })
        },
        getcode() {
            var that = this;
            if(this.tel) return weui.topTips('请输入有效的手机号码', 3000),0;
            this.lock = true;
            $.post('/wzjh/gainVeryCode',{ telphone: this.telphone})
            .done(function(){
                weui.alert('验证码发送成功');
                that.timeleave();
            })
            .fail(function(){
                weui.alert('网络出错');
                that.lock = false;
            });
        },
        timeleave () {
            (this.timer -= 1) ? window.setTimeout(this.timeleave,1000) : (this.lock = false);
        },
        redirct (){
            this.$route.params.go && this.$route.params.go();
        }
    }
}    
</script>