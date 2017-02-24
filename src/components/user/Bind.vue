<template>
  <div class="bindDiv">
      <header>
          <figcaption>
              <figure :style="'background-image:url('+ imgurl(info.headImageUrl) +')'"></figure>
              <label>{{ info.displayName }}</label>
          </figcaption>
          <p style="width: 70%;margin:0 auto;padding-bottom: 2em;">亲爱的微信用户，为了给您更好的服务，请输入您的手机号，进行验证。</p>
      </header>
      <section class="global-margin">
          <dl>
              <dd><input type="tel" v-model="form.tel" placeholder="请输入您的手机号"></dd>
              <dd class="flex">
                  <span class="flex_1"><input type="number" v-model.number="form.code" placeholder="请输入您的验证码"></span>                  
                  <button type="button" class="weui-btn btn-primary btn-border-2" style="width: 40%;margin-left: 10px;":disabled="tel || lock" @click="getcode" >{{ lock ? timer : '获取验证码'}}</button>
              </dd>
              <dt>
                  <button type="button" @click.prevent="bindto" :disabled="validate || islogin" class="weui-btn btn-primary btn-border-2">下一步</button>
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
                    code: ''
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
            $.get('/wzjh/gainpersoninfo',{ openid: this.openid })
            .then((d) => {
                this.info = d.uwr || {};
            });
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
                return !B.valideTel(this.form.tel)
            },
            cod () {
                return !(this.form.code && (this.form.code + '').length == 4);
            }
        },
        methods: {
            imgurl (src){
                return B.imgsrc(src)
            },
            bindto() {
                var that = this;
                if(this.validate) return weui.alert('无效的输入项'), 0;
                this.islogin = true;
                $.post('/wzjh/tellCodeNew',{code: this.form.code, tel: this.form.tel })
                .done(function(d){
                    let params = Object.assign({ tel: that.form.tel, openid: that.openid }, that.$route.params); 
                    if (d.status == 'error') {
                        return weui.alert('验证码错误，请重新输入'), 0;
                    } if (d.reg == 'true') { 
                        that.$router.replace({ name: 'confirm', params }) 
                    } else {
                        that.$router.replace({ name: 'next', params })
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
            },
            redirct (){
                this.$route.params.go && this.$route.params.go();
            }
        }
    };
</script>
<style scoped lang="scss">
    .bindDiv{
        height: 100vh;
        background: #eee;
    }
    header{
        text-align: center;
        font-size: 0.8em
    }
    figcaption{
        padding: 1em 0;
        line-height: 1.6em;
    }
    figure{
        width: 60px;height: 60px;margin: 0 auto;border-radius: 50%;
        background: no-repeat center center;
        background-size: cover;
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
