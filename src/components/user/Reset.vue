<template>
  <div class="bind">
      <header style="height: 1em;"></header>
      <section class="global-margin">
          <dl>
              <dd><input type="tel" v-model="form.tel" placeholder="请输入您的手机号"></dd>
              <dd class="flex">
                  <span class="flex_1"><input type="number" v-model.number="form.code" placeholder="请输入您的验证码"></span>                  
                  <button type="button" class="weui-btn btn-primary btn-border-2" style="width: 40%;margin-left: 10px;":disabled="tel || lock" @click="getcode" >{{ lock ? timer : '获取验证码'}}</button>
              </dd>
              <dd><input type="text" v-model="form.psd" placeholder="请设置密码（6-16位字母数字组合）"></dd>
              <dt>
                  <button type="button" @click.prevent="bindto" :disabled="validate || islogin" class="weui-btn btn-primary btn-border-2">重置密码</button>
              </dt>
          </dl>
      </section>
  </div>
</template>
<script>
    import B from 'base'
    import weui from 'weui'
    import $ from 'jquery'
    export default{
        data() {
            return {
                info: {},
                form: {
                    tel: '',
                    code: '',
                    psd: ''
                },
                openid: '',
                timer: 60,
                islogin: false,
                lock: false
            };
        },
        activated() {
            this.timer = 60;
            this.openid = this.$route.params.openid || '';
            this.form.tel = this.$route.params.tel || '';
            this.form.code = '';
            this.form.psd = '';
        },
        watch:{
            lock: function(n, o){
                this.timer = 60;
            }
        },
        computed: {
            validate() {
                return this.tel || this.cod || this.psd
            },
            tel () {
                return !B.valideTel(this.form.tel)
            },
            cod () {
                return !(this.form.code && (this.form.code + '').length == 4);
            },
            psd () {
                return !(this.form.psd.length >=6 && this.form.psd.length <=16)
            }
        },
        methods: {
            imgurl (src){
                return B.imgsrc(src)
            },
            updateDB (params, fn) {
                $.post('/wzjh/modifyinfo', Object.assign({ openid: this.openid }, params))
                .done(() => {
                    weui.toast('修改成功', 1500);
                    fn();
                })
                .fail(() => {
                    weui.alert('保存失败，请重试');
                })
            },
            bindto() {
                var that = this;
                if(this.validate) return weui.alert('无效的输入项'), 0;
                this.islogin = true;
                $.post('/wzjh/tellCodeNew',{code: this.form.code, tel: this.form.tel })
                .done(function(d){
                    if (d.status == 'error') {
                        return weui.alert('验证码错误，请重新输入'), 0;
                    } 
                    that.updateDB({
                        newpassword: that.form.psd
                    },function(){
                        that.$router.back();
                    });
                })
                .always(function(){
                    that.islogin = false;
                })
            },
            getcode() {
                var that = this;
                if(this.tel) return weui.topTips('请输入有效的手机号码', 3000),0;
                this.lock = true;
                $.post('/wzjh/gainVeryCode',{ telphone: this.form.tel})
                .done(function(d){
                    if(d.status == 'success'){
                        weui.alert('验证码发送成功');
                        that.timeleave();
                    }else{
                        weui.alert('验证码发送失败，请重试');
                        that.lock = false;
                    }
                })
                .fail(function(){
                    weui.alert('网络出错');
                    that.lock = false;
                });
            },
            timeleave () {
                (this.timer -= 1) ? window.setTimeout(this.timeleave,1000) : (this.lock = false);
            }
        }
    };
</script>
<style scoped lang="scss">
    header{
        text-align: center;
        h3{ font-weight: 400; padding: 1em 0;}
    }
    section{
        dd{
            padding: 5px 0;
        }
        dt{
            padding: 3em 0;
        }
        input{
            width:100%;
            height: 2.6em;
            box-sizing:border-box;
            padding: 5px 10px;
            border: 0;
            border-radius:2px;
        }
    }
</style>
