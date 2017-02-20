<template>
  <div class="shareto" v-if="isShow">
    <img src="../../assets/img/share.png" alt="" />
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  props: {
    shareconfig: {
      type: Object,
      default: function () {
        return {
          title: document.title,
          desc: document.title,
          link: location.href,
          imgUrl: 'https://www.51zjh.com/img/website/icon@2x.png'
        }
      }
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      timeout: 0
    }
  },
  created () {
    this.setConfig();
  },
  watch: {
    shareconfig() {
      this.setConfig()
    }
  },
  methods: {
    setConfig(){
      let _this = this;
      wx.ready(() => {
        wx.hideAllNonBaseMenuItem();
        if(_this.isShow){
          wx.showMenuItems({
              menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
          });
          wx.onMenuShareAppMessage(_this.shareconfig);
          wx.onMenuShareTimeline(_this.shareconfig);
        }
      });      
    }
  }
}
</script>

<style scoped>
  .shareto{font-size: 0;}
  img { width: 100%;}
</style>
