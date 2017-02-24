<template>
  <div class="diyupload clearfix" :id="id">
      <ul class="weui-uploader__files" :id="id + 'Files'">
          <li v-for="(l, idx) in list" class="weui-uploader__file" :data-id="idx" :style="`background-image: url(${l.url})`">  </li>
      </ul>
      <div class="weui-uploader__input-box">
          <slot name="name"></slot>
          <input :id="id + 'Input'" class="weui-uploader__input" type="file" accept="image/*" :multiple="multiple">
      </div>
  </div>
</template>

<script>
import weui from 'weui'

export default {
  props: {
    id: {
      type: String,
      default: 'localfile'
    },
    list: {
      type: Array
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      ids: [],
      urls: []
    }
  },
  mounted () {
    var that = this;
    weui.uploader('#' + this.id, {
        url: '/doctor/uploadFileNew',
        auto: true,
        type: 'file',
        compress: {
            width: 1600,
            height: 1600,
            quality: .8
        },
        onBeforeQueued: function (files) {
            if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0) {
                weui.alert('请上传图片');
                return false;
            }
            if (this.size > 10 * 1024 * 1024) {
                weui.alert('请上传不超过10M的图片');
                return false;
            }
            if(!that.multiple){
                document.querySelector(`#${that.id}Files`).innerHTML = ''
            }
            // if (files.length > 5) { // 防止一下子选择过多文件
            //   weui.alert('最多只能上传5张图片，请重新选择');
            //   return false;
            // }
            // return true; // 阻止默认行为，不插入预览图的框架
        },
        onQueued: function () {
            //console.log(name + '--onQueued--');
            //console.log(this);
            // console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64

            // this.upload(); // 如果是手动上传，这里可以通过调用upload来实现

            // return true; // 阻止默认行为，不显示预览图的图像
        },
        onBeforeSend: function (data, headers) {
            //console.log(name + '--onBeforeSend--');
            //console.log(this, data, headers);
            // $.extend(data, { test: 1 }); // 可以扩展此对象来控制上传参数
            // $.extend(headers, { Origin: 'http://127.0.0.1' }); // 可以扩展此对象来控制上传头部

            // return false; // 阻止文件上传
        },
        onProgress: function (procent) {
            //console.log(name + '--onProgress--');
            //console.log(this, procent);
            // return true; // 阻止默认行为，不使用默认的进度显示
        },
        onSuccess: function (res) {
            //console.log(name + '--onSuccess--');
            //console.log(this, res);
            if(!that.multiple){
                that.ids = [res.upid];
                that.urls = [res.urlpath];
            }else{
                that.ids.push(res.upid);
                that.urls.push(res.urlpath);
            }
            that.$emit('success', that.ids.join(','), that.urls.join(','));
            // return true; // 阻止默认行为，不使用默认的成功态
        },
        onError: function (err) {
            console.log(name + '--onError--');
            console.log(this, err);
            // return true; // 阻止默认行为，不使用默认的失败态
        }
    });
  }
}
</script>

<style>
    .weui-uploader__input-box {
        background: url(../../assets/img/upload.png) no-repeat;
        background-size: 100% 100%;
        border: 0;
    }
    .weui-uploader__input-box:before,
    .weui-uploader__input-box:after{
        display: none;
    }
</style>
