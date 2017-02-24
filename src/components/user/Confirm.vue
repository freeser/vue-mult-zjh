<template>
  <div class="bindDiv">
      <header>
          <h3>您的手机号已注册过专家号帐号。</h3>
          <p>用户名：<span>{{ username }}</span></p>
      </header>
      <section class="global-margin">
          <dl>
              <dt>
                  <button type="button" @click.prevent="bindto" class="weui-btn btn-primary btn-border-2">确认绑定帐号</button>
                  <label>绑定后，您的微信平台帐号与专家号帐号互通，并可以直接登录</label>
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
                openid: '',
                islogin: false
            };
        },
        activated () {
          this.username = this.$route.params.tel;  
          this.openid = this.$route.params.openid;  
        },
        methods: {
            bindto() {
                let that = this;
                let loading = weui.loading();
                $.post('/wzjh/suretobind',{
                    openid: this.openid,
                    tel: this.username
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
            padding: 1em 0;
            font-weight: 400;
        }
        p{
            padding: 1em 0;
            span{color: #007EC3;}
        }
    }
    section{
        dd{
            padding: 5px 0;
        }
        dt{
            padding:0 0 3em 0;
            label{
                display:block;
                font-size: 0.6em;
                color: #aaa;
                line-height: 1.6em;
                padding: 1em 0;
            }
        }
    }
</style>
