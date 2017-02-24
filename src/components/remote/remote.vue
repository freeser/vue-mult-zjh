<template>
    <div class="main fixedfooter">
        <header>
            当前位置<span>「<label v-text="cityname"></label>」</span> - 
            <router-link :to="{ name: 'location', params: { openid: openid }}" class="maincolor">切换 <i class="iconfont icon-qiehuan"></i></router-link>
        </header>
        <section>            
            <p class="title">当前城市合作医院<b>*</b></p>
            <div class="weui-flex hasselect">
                <div class="weui-flex weui-flex__item" style="width:55%">
                    <select v-model="hosid" class="weui-flex__item">
                        <option value="">请选择医院</option>
                        <option v-for="o in hos" :value="o.id">{{o.displayName}}</option>
                    </select>
                    <i class="iconfont icon-arrright"></i>
                </div>
                <div class="weui-flex weui-flex__item" style="padding-left:8px">
                    <select v-model="depid" class="weui-flex__item">
                        <option value="">请选择科室</option>
                        <option v-for="o in dep" :value="o.id">{{o.displayName}}</option>
                    </select>
                    <i class="iconfont icon-arrright"></i>
                </div>
            </div>
            <p class="line"></p>
            <p class="title">选择您要会诊的专家<b>*</b></p>
            <dl v-if="!hasdoc" class="selectdoc">
                <dd v-if="depid">
                    <router-link v-if="!expid" :to="{ name: 'explibs', params: { openid: openid, hosid: hosid, depid:depid }}" class="pickhandler whitespace">
                        我明确要会诊的专家，去选择<i class="iconfont icon-arrright"></i>
                    </router-link>
                    <div v-else class="weui-flex pickexps" style="line-height:36px;height:36px;">
                        <span class="weui-flex__item weui-flex" style="padding-right:6px">
                            <span class="f0">
                                <img :src="imgsrc(expinfo.listSpecialPicture)" style="width:30px;height:30px;border-radius:50%;" alt=""/>
                            </span>
                            <span class="weui-flex__item" style="padding-left:6px;overflow:hidden;">
                                {{expinfo.specialName}}
                                <small style="margin:0 6px;color:#aaa;font-size:12px;">
                                	{{expinfo.hosName}}&ensp;{{expinfo.depName}}
                                </small>
                            </span>
                            <span class="f0">
                                {{ expinfo.vedioAmount ? (expinfo.vedioAmount + '元') : '' }}
                            </span>
                        </span>
                        <router-link :to="{ name: 'explibs', params: { openid: openid, hosid: hosid, depid:depid }}" class="pickhandler" style="flex:0 0 5.5em;whitespace:nowrap">
                            更换专家<i class="iconfont icon-arrright"></i>
                        </router-link>
                    </div>
                </dd>
                <dd>
                    <button v-if="!levid" type="button" class="pickhandler whitespace" @click="picklevel">
                        不明确会诊专家，按级别选择<i class="iconfont icon-arrright"></i>
                    </button>
                    <div v-else class="weui-flex picklevel">
                        <span class="weui-flex__item whitespace" style="color:#aaa;padding-right:6px">
                            所选级别：<span style="color:#000">{{levname}}</span>
                        </span>
                        <button type="button" class="pickhandler" @click="picklevel" style="flex:0 0 3.5em;whitespace:nowrap">
                            更换<i class="iconfont icon-arrright"></i>
                        </button>
                    </div>
                </dd>
            </dl>
            <dl v-else class="selectdoc">
                <dd>
                    <div class="weui-flex pickexps" style="line-height:36px;height:36px;">
                        <span class="weui-flex__item weui-flex" style="padding-right:6px">
                            <span class="f0">
                                <img :src="imgsrc(expinfo.listSpecialPicture)" style="width:30px;height:30px;border-radius:50%;" alt=""/>
                            </span>
                            <span class="weui-flex__item" style="padding-left:6px;overflow:hidden;">
                                {{expinfo.specialName}}
                                <small style="margin:0 6px;color:#aaa;font-size:12px;">
                                	{{expinfo.hosName}}&ensp;{{expinfo.depName}}
                                </small>
                            </span>
                            <span class="f0">
                                {{ expinfo.vedioAmount ? (expinfo.vedioAmount + '元') : '' }}
                            </span>
                        </span>
                    </div>
                </dd>
            </dl>
            <p class="line"></p>
            <p class="title">期望会诊时间在<b>*</b></p>
            <div class="weui-cells_radio clearfix">
                <label v-for="l in time" class="weui-cell weui-check__label weui-flex__item" :for="'x' + l.id">
                    <div class="weui-cell__bd">
                        {{l.displayName}}
                    </div>
                    <div class="weui-cell__ft">
                        <input type="radio" class="weui-check" v-model="timeid" :value="l.id" :id="'x' + l.id">
                        <span class="weui-icon-checked"></span>
                    </div>
                </label>
            </div>
            <div class="remark">说明：选择期望会诊时间越长，成功率越高</div>
            <p class="line"></p>
            <div class="footer"><router-link :to="'remark'" class="pickhandler">服务流程 <i class="iconfont icon-arrright"></i></router-link></div>
        </section>
        <footer class="fixed bottom width100">
            <div class="btnarea">
                <button type="button" :disabled="validate" @click="isBind" class="weui-btn weui-btn_main">下一步</button>
            </div>
        </footer>
    </div>
</template>
<script>
    import weui from 'weui'
    import $ from 'jquery'
    import B from 'base'

    export default {
        data() {
            return {
                expid: this.$route.params.docid || '',
                openid: '',
                cityname: '正在定位...',
                cityid: '',
                hosid: '',
                hos: [],
                depid: '',
                dep: [],
                expinfo: {},
                levid: '',
                levname: '',
                levarr: [],
                timeid: '',
                time: [],
                islogin: false,
                hasdoc: false
            }
        },
        beforeRouteEnter (to, from, next) {
            let code = B.getParam('code');
            let openid = to.params.openid || B.getParam('openid');
            if( openid ){
                next((vm) => {
                    vm.openid = openid;
                })
            } else if( code ){
                let loading = weui.loading();
                $.post('/wzjh/gainpersoninfo', { code })
                .done(function (d) {
                    loading.hide()
                    d.uwr && d.uwr.openId ? 
                        next((vm) => {
                            vm.openid = d.uwr.openId || openid;
                        }) : 
                        weui.alert('数据异常');
                })
            } else {
                next('/')
            }
        },
        created() {
            var that = this,loading = weui.loading();
            wx.ready(function () {
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        var latitude = res.latitude;
                        var longitude = res.longitude;
                        $.get('/wzjh/gainCityByLocation', { latitude, longitude })
                            .done(function (d) {
                                that.cityid = d.distcode || '';
                                that.cityname = d.city || '';
                                that.gainhos();
                            });
                    },
                    fail: function (res) {
                        that.cityname = '定位失败';
                    }
                });
            });
            this.gaintime();
            if(!!this.expid){
                this.hasdoc = true;
                $.post('/kangxin/gainspedetail',{docid: that.expid})
                .done(function(d){
                    that.expinfo = d.special || {};
                })
                .always(function(){
                    loading.hide();
                });
            }else{
                loading.hide();
            }
        },
        activated() {
            if (this.$route.query.cityid) {
                this.cityid = this.$route.query.cityid;
                this.cityname = this.$route.query.cityname;
                this.hosid = '', this.depid = '';
                this.gainhos();
            }
            if (this.$route.query.explibid) {
                let docid = this.$route.query.explibid;
                let loading = weui.loading();
                $.post('/kangxin/gainspedetail',{ docid })
                .done((d) => {
                    this.expinfo = d.special || {};
                    loading.hide();
                });
                this.expid = docid;
            }
        },
        computed: {
            validate: function () {
                return !(this.hosid && this.depid && (this.expid || this.levid) && this.timeid);
            }
        },
        watch: {
            hosid: function () {
                this.gaindep();
                if(!this.hasdoc){
                    this.expid = '';
                    this.expinfo = {};
                }
            },
            depid: function(){
                if(!this.hasdoc){
                    this.expid = '';
                    this.expinfo = {};
                }
            },
            expid: function(n,o){
                !!n && (this.levid = this.levname = '');
            },
            levid: function(n,o){
                !!n && (this.expid = '',this.expinfo = {});
            }
        },
        methods: {
            gainhos() {
                $.get('/wzjh/gainhosbycity', { dictcode: this.cityid })
                    .done((d) => {
                        this.hos = d.hospitals || [];
                    });
            },
            gaindep() {
                $.get('/wzjh/gaindepartsbyhos', { hosid: this.hosid })
                    .done((d) => {
                        this.dep = d.departs || [];
                    });
            },
            gaintime() {
                $.get('/wzjh/loadwishtime')
                    .done((d) => {
                        this.time = d.times || [];
                    });
            },
            picklevel() {
                var loading, that = this;
                if (this.levarr.length) return this.showpick(), 0;
                loading = weui.loading();
                $.get('/wzjh/loadlevels')
                    .done(function (data) {
                        loading.hide();
                        that.levarr = (function (d) {
                            var arr = [];
                            $.each(d, function (i, n) {
                                arr.push({
                                    label: n.displayName + ' / ' + n.displayValue + '元',
                                    value: n.id
                                });
                            });
                            return arr
                        })(data.splevels || []);
                        that.showpick();
                    });
            },
            showpick() {
                var that = this;
                weui.picker(this.levarr, {
                    className: 'custom-classname',
                    defaultValue: [that.levid],
                    onChange: function (result) { },
                    onConfirm: function (result) {
                        var idx = B.arrayFindObjIndex(result, 'value', that.levarr);
                        that.levid = result[0];
                        that.levname = idx != -1 ? that.levarr[idx]['label'] : '';
                    },
                    id: 'picklevel'
                });
            },
            imgsrc(v) {
                return B.imgsrc(v)
            },
            nextstep(s) {
                var that = this;
                var cfg = {
                    name: 'step2',
                    params: {
                        openid: this.openid,
                        cityid: this.cityid,
                        hosid: this.hosid,
                        departid: this.depid,
                        expertid: this.expid,
                        levelid: this.levid,
                        timeid: this.timeid
                    }
                };
                (this.$router[s])(cfg);
            },
            isBind(){
                var that = this;
                if (this.validate) return 0;
                this.islogin = true;
                $.post('/wzjh/tellbind', { openid: this.openid })
                    .done(function (d) {
                        if (d.isbind == true) {
                            that.nextstep('push')
                        } else {
                            that.$router.push({
                                name: 'bind',
                                params: {
                                    openid: that.openid,
                                    go:function(){
                                        that.nextstep('replace')
                                    } 
                                }
                            });
                        }
                    });
            }
        }
    }
</script>