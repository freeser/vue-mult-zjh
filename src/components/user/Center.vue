<template>
  <div class="center">
    <header>
        <dl>
            <router-link :to="{ name: 'info', params: { openid: info.openId }}" tag="dd" class="flex acenter">
                <span class="thumb" :style="'background-image: url('+ imgurl(info.headImageUrl) +')'"></span>
                <span class="flex_1">{{ nickname }} <i class="iconfont icon-arrright"></i></span>
            </router-link>
        </dl>
    </header>
    <section>
        <dl>
            <dd class="flex acenter" @click="redirectOrder">
                <span><i class="iconfont icon-wodedingdan"></i> 我的订单</span>
                <span class="flex_1"><i class="iconfont icon-arrright"></i></span>
            </dd>
            <dd class="flex acenter" @click="redirectTelus">
                <span><i class="iconfont icon-kefuerji"></i> 联系我们</span>
                <span class="flex_1"><i class="iconfont icon-arrright"></i></span>
            </dd>
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
                code: B.getParam('code'),
                info: {},
                uinfo: {},
                ages: []
            };
        },
        beforeRouteEnter (to, from, next) {
            let code = B.getParam('code');
            let openid = B.getParam('openid');
            let loading = weui.loading();
            (code || openid) ? 
                $.post('/wzjh/gainpersoninfo', { code, openid })
                .done(function (d) {
                    d.uwr && d.uwr.openId ? isbind(d) : weui.alert('数据异常');
                }) : 
                (next('/'), loading.hide());
            function isbind(d) {
                let info = d.uwr;
                let uinfo = d.uinfo;
                $.post('/wzjh/tellbind', { openid: info.openId || openid })
                .done(function (d) {
                    if (d.isbind == true) {
                        next((vm) => {
                            vm.info = info;
                            vm.uinfo = uinfo;
                        });
                    } else {
                        next({ 
                            name: 'bind', 
                            params:{ 
                                openid: info.openId || openid, 
                                go: function(that){
                                    that.$router.replace({ name: 'center' });
                                } 
                            }
                        });
                    }                    
                })
                .always(() => {
                    loading.hide();
                });
            }            
        },
        computed: {
          nickname () {
              let s = this.uinfo.mobileNumber || '***********';
              return s.substr(0, 3) + '****' + s.substr(7, 4);
          }  
        },
        mounted () {
          this.ages = (function(){
                var a = [];
                for(let i = 0; i < 100; i++){
                    a.push({
                        label: i,
                        value: i
                    });                        
                }
                return a;
            })();
        },
        methods: {
            imgurl (src) {
                return B.imgsrc(src)
            },
            redirectOrder () {
                location.href = '/wzjh/myorders?response_type=code&code='+ this.code +'&state=123&winzoom=1';
            },
            redirectTelus () {
                location.href = '/app.jsp#home_statichtm/contactus';
            }
        }
    };
</script>
<style scoped lang="scss">
    header{
        background: #fff;
        margin: 6px 0 10px;
        .thumb{
            width: 60px;height: 60px;border-radius: 50%;
            background: no-repeat center center;
            background-size: cover;
        }
    }
    dl{
        margin: 0 0 0 12px;
        dd{
            padding: 14px 12px 14px 0;
            text-align:right;
            & + dd{
                border-top:1px solid #EFEFEF;
            }
            .iconfont{color: #aaa;vertical-align: -1px;}
            span:first-child{
                .iconfont{
                    color: #B1BFC8;
                    font-size: 1.3em;
                }
            }
            label{ color: #aaa;}
        }
    }
    section, footer{
        background: #fff;
        margin: 10px 0;
    }
</style>
<style lang="scss">  
    .flex{ display: -webkit-box; display: -webkit-flex; display: flex; }
    .flex_1{ -webkit-box-flex: 1; -webkit-flex:1; flex:1;}
    .jcenter{ -webkit-justify-content:center;justify-content:center;}
    .acenter{ -webkit-box-align: center;-webkit-align-items: center;align-items: center;}

    header .diyupload{
        @extend .flex;
        @extend .acenter;
        ul li{
            width: 60px;height: 60px;border-radius: 50%;margin:0;
        }
        .weui-uploader__input-box{
            @extend .flex_1;
            @extend .flex;
            @extend .acenter;
            -webkit-justify-content:flex-end;justify-content:flex-end;
            margin: 0; background-image: none; text-align: right;
            width: auto;height: auto;
        }
    }
</style>
