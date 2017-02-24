<template>
  <div class="center">
    <header>
        <dl>
            <dd>
                <file :multiple="false" :list="[{ url: imgurl(info.headImageUrl) }]" @success="uploadok">
                    <label slot="name">修改头像 <i class="iconfont icon-arrright"></i></label>
                </file>
            </dd>
        </dl>
    </header>
    <section>
        <dl>
            <dd class="flex acenter">
                <label>帐户 </label>
                <span class="flex_1">{{ uinfo.mobileNumber }}</span>
            </dd>
            <dd class="flex acenter" @click="showDialog(true)">
                <label>用户名 </label>
                <span class="flex_1">{{ info.displayName }} <i class="iconfont icon-arrright"></i></span>
            </dd>
            <dd class="flex acenter" @click="picksex">
                <label>性别 </label>
                <span class="flex_1">{{ info.sex == '1' ? '男' : '女' }} <i class="iconfont icon-arrright"></i></span>
            </dd>
            <dd class="flex acenter" @click="pickage">
                <label>年龄 </label>
                <span class="flex_1">{{ info.age || '未知' }}岁 <i class="iconfont icon-arrright"></i></span>
            </dd>
        </dl>
    </section>
    <footer>
        <dl>
            <router-link :to="{ name: 'reset', params:{ openid: info.openId, tel: uinfo.mobileNumber}}" tag="dd" class="flex acenter">
                <label>修改密码 </label>
                <span class="flex_1"> <i class="iconfont icon-arrright"></i></span>
            </router-link>
        </dl>
    </footer>
    <div class="js_dialog" v-if="editname">
        <div class="weui-mask"></div>
        <div class="weui-dialog">
            <div class="weui-dialog__hd"><strong class="weui-dialog__title">用户名修改</strong></div>
            <div class="weui-dialog__bd">
                <input type="text" id="username" v-model="username" placeholder="请输入新用户名" style="width: 100%;height: 3em;border: 0;background: #eee;padding: 5px 10px;box-sizing: border-box;">
            </div>
            <div class="weui-dialog__ft">
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="showDialog(false)">取消</a>
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="saveUname">保存</a>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
    import B from 'base'
    import weui from 'weui'
    import $ from 'jquery'
    import File from 'components/share/File'
    export default{
        components: {
            File
        },
        data() {
            return {
                info: {},
                uinfo: {},
                ages: [],
                username: '',
                editname: false
            };
        },
        beforeRouteEnter (to, from, next) {
            let openid = to.params.openid;
            let loading = weui.loading();
            openid ? 
                $.post('/wzjh/gainpersoninfo', { openid })
                .done(function (d) {
                    d.uwr && d.uwr.openId ? isbind(d) : weui.alert('数据异常');
                }) : 
                (next('/'), loading.hide());
            function isbind(d) {
                let info = d.uwr;
                let uinfo = d.uinfo;
                $.post('/wzjh/tellbind', { openid: info.openId })
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
                                openid: info.openId, 
                                go: function(that){
                                    that.$router.replace({ name: 'info', params: { openid: info.openId } });
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
            uploadok (ids, urls) {
                ids && this.updateDB({ headimgurl: urls });
            },
            updateDB (params, fn) {
                $.post('/wzjh/modifyinfo', Object.assign({ openid: this.info.openId }, params))
                .done(() => {
                    weui.toast('修改成功', 2000);
                    typeof fn == 'function' && fn();
                })
                .fail(() => {
                    weui.alert('保存失败，请重试');
                })
            },
            picksex () {
                let that = this;
                weui.picker([
                        {label: '男',value: 1},
                        {label: '女',value: 2}
                    ], {
                    defaultValue: [this.info.sex],
                    onConfirm: function (result) {                        
                        that.updateDB({ sex: result[0] }, () => {
                            that.info.sex = result[0];
                        });
                    },
                    id: 'sexPicker'
                });
            },
            pickage () {     
                let that = this;           
                weui.picker(this.ages, {
                    defaultValue: [this.info.age],
                    onConfirm: function (result) {
                        that.updateDB({ age: result[0] }, () => {
                            that.info.age = result[0];
                        });
                    },
                    id: 'agePicker'
                });
            },
            showDialog (bol) {
                this.editname = bol;
                this.username = bol ? this.info.displayName : '';
            },
            saveUname () {
                let username = this.username;
                this.updateDB({ username }, () => {
                    this.info.displayName = username;
                });
                this.showDialog(false);
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
            .iconfont{vertical-align: 1px;color: #aaa;}
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
