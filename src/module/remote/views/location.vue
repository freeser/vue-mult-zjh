<template>
  <div class="location">
      <template>
        <div class="weui-cells__title">当前位置</div>
        <div class="weui-cells">
          <router-link class="weui-cell weui-cell_access" 
            :class="{'selected':selected==cityid}"
            :to="{ name: 'main', params: { cityid:cityid,cityname: cityname }}" replace>          
              <div @click="selected=cityid" class="weui-cell__bd">{{cityname}}</div>
              <div class="weui-cell__ft"></div>
          </router-link>
      </div>
      </template>
      <div class="weui-cells__title">已开通城市列表</div>
      <div class="weui-cells">
          <router-link v-for="l in citys" class="weui-cell weui-cell_access" 
            :class="{'selected':selected==l.remark}"
            :to="{ name: 'main', params: { cityid: l.remark,cityname: l.name }}" replace>          
              <div @click="selected=l.remark" class="weui-cell__bd">{{l.name}}</div>
              <div class="weui-cell__ft"></div>
          </router-link>
      </div>
    </div>
</template>
<script>
import $ from 'jquery'
import weui from 'weui'

export default {
  data () {
    return {
      citys: [],
      selected: '',
      cityid: '',
      cityname: '正在定位...'
    }
  },
  created () {
    var that = this,loading = weui.loading();
    wx.config(wxconfig);
    wx.ready(function(){
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
              var latitude = res.latitude;
              var longitude = res.longitude;
              $.get('/wzjh/gainCityByLocation',{latitude,longitude})
              .done(function(d){
                  that.cityid = d.remark || '';
                  that.cityname = d.city || '';
              });
          },
          fail: function (res) {
              //alert(JSON.stringify(res));
              that.cityname = '定位失败';
          }
      });
    });
    $.get('/wzjh/gainopencitys').done(function(d){
      that.citys = d.beans || [];
    }).always(function(){
      loading.hide();
    });
  }
}
  
</script>