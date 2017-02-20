<template>
    <div class="msgtip">
      <div class="page msg_success js_show" v-if="bol">
          <div class="weui-msg">
              <div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>
              <div class="weui-msg__text-area">
                  <h2 class="weui-msg__title">操作成功</h2>
                  <p class="weui-msg__desc">{{msg}}</p>
              </div>
              <div class="weui-msg__opr-area">
                  <p class="weui-btn-area">
                      <a href="javascript:;" @click="closemsg" class="weui-btn weui-btn_default">关闭</a>
                  </p>
              </div>
          </div>
      </div>
      <div v-else class="page msg_warn js_show">
          <div class="weui-msg">
              <div class="weui-msg__icon-area"><i class="weui-icon-warn weui-icon_msg"></i></div>
              <div class="weui-msg__text-area">
                  <h2 class="weui-msg__title">操作失败</h2>
                  <p class="weui-msg__desc">{{msg}}</p>
              </div>
              <div class="weui-msg__opr-area">
                  <p class="weui-btn-area">
                      <a href="javascript:history.back();" class="weui-btn weui-btn_default">返回</a>
                      <a href="javascript:;" @click="closemsg" class="weui-btn weui-btn_default">关闭</a>
                  </p>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                bol: true,
                msg: ''
            }
        },
        activated() {
            this.bol = this.$route.params.state == 'ok';
            this.msg = this.$route.params.msg || ''
        },
        methods: {
            closemsg() {
                WeixinJSBridge.call('closeWindow');
            }
        }
    }

</script>