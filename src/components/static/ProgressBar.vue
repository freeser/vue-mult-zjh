<template>
  <div class="progressbar">
    <div class="weui-flex global-margin">
      <div class="f0">
        申请流程：
      </div>
      <div class="weui-flex weui-flex__item acenter tright steps">
        <span class="weui-flex__item" :class="{'passed' : step >= 1}">
          <span class="inner"><i class="iconfont icon-1"></i><label>申请</label></span>
        </span>
        <span class="weui-flex__item" :class="{'passed' : step >= 2}">
          <span class="inner"><i class="iconfont icon-2"></i><label>分诊</label></span>
        </span>
        <span class="weui-flex__item" :class="{'passed' : step >= 3}">
          <span class="inner"><i class="iconfont icon-3"></i><label>确认</label></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'axios'

export default {
  props: {
    step: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/css/var.scss";
  $pcolor:#879AA1;
  $mcolor:#0186D1;
  .steps{
    margin-left: 16%;
    .weui-flex__item{
      position: relative;
      color:$pcolor;
      text-align: center;
      &::before{
        content: "";
        position: absolute;left: 0;
        top: 50%;margin-top: -3px;
        background: $pcolor;
        height: 2px;
        width: 100%;z-index: 0;
      }
      &.passed{
        color: $mcolor;
        &::before{
          background: $mcolor;
        }
      }
      .inner{
        display: block;
        position: relative; z-index: 1;
        line-height: 1;padding-top:6px;
        text-align: center;
      }
      i{
        font-size: 1.2em;text-shadow: 0px 0px 3px #fff;
      }
      label{
        display: block;margin-top: 2px;
        font-size: 0.8em;
      }
    }
  }
  .progressbar{
    background: #eee;
    font-size:10px;
    .f0{
      line-height: 40px;
    }
  } 
</style>
