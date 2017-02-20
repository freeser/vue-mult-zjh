<template>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
</template>
<script>
  import Remote from './views/remote.vue'
  import Location from './views/location.vue'
  import Remark from './views/remark.vue'
  import Explibs from './views/explibs.vue'
  import Step2 from './views/step2.vue'
  import Msg from './views/msg.vue'
  import Bind from './views/bind.vue'
  import NotFound from './views/404.vue'
  export default {
    name: 'modules',
    components: {
      Remote,
      Location,
      Remark,
      Explibs,
      Step2,
      Msg,
      Bind,
      NotFound
    },
  };
</script>

<style lang="scss">
  @import "../../assets/font/iconfont.css";
  @import "../../assets/css/zjh.scss";
</style>
