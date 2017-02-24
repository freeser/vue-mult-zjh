<template>
  <div class="bindDiv">
      <header>
          <h3>手机号验证成功！</h3>
          <p>请设置您的登录密码。</p>
      </header>
      <section class="global-margin">
          <dl>
              <dd>登录名：<span>{{ username }}</span></dd>
              <dd><input type="text" v-model="psd" placeholder="请设置密码（6-16位字母数字组合）"></dd>
              <dd>
                  <label style="font-size:0.8em" class="checkbox">
                      <input type="checkbox" v-model="agree" value="1">
                      <i class="iconfont" :class="agree=='1' ? 'icon-fangxingxuanzhongfill' : 'icon-fangxingweixuanzhong'"></i>
                      同意<span>《专家号用户注册协议》</span>
                  </label>
                </dd>
              <dt>
                  <button type="button" @click.prevent="bindto" :disabled="validate" class="weui-btn btn-primary btn-border-2">确认绑定帐号</button>
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
                username: '',
                psd: '',
                islogin: false,
                agree: '1'
            };
        },
        activated () {
          this.username = this.$route.params.tel;  
          this.openid = this.$route.params.openid;   
        },
        computed: {
          validate () {
              return !(this.psd.length >=6 && this.psd.length <=16)
          }  
        },
        methods: {
            bindto() {
                let that = this;
                let loading = weui.loading();
                $.post('/wzjh/suretobind',{
                    openid: this.openid,
                    tel: this.username,
                    password: this.psd
                }).done((res) => {
                    weui.toast('绑定成功', 1500);
                    that.$route.params.go ? 
                        that.$route.params.go(that) : 
                        that.$route.params.redirect ? 
                            location.replace(decodeURIComponent(that.$route.params.redirect)) :
                            weui.alert('未知跳转地址')
                })
                .always(() => {
                    loading.hide();
                });
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
        padding: 2em 0;
        h3{
            padding: 1em 0 0;
            font-weight: 400;
        }
        p{
            padding: 1em 0 0;
            span{color: #007EC3;}
        }
    }
    section{
        dd{
            padding: 8px 0;
            span{color: #007EC3;}
        }        
        dt{
            padding:1.6em 0 3em 0;
        }
        input[type="text"],
        input[type="number"],
        input[type="tel"],
        input[type="date"]{
            width:100%;
            height: 3rem;
            box-sizing:border-box;
            padding: 5px 10px;
            border: 0;
            border-radius:2px;
        }
        button{
            height: 3rem;
            box-sizing:border-box;
        }
    }
    .checkbox{
        input{ display:none; }
        .iconfont{
            color: #007EC3;
        }
    }
</style>
