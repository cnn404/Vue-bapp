<template>
  <div class="JCheckBox">
    <input type="checkbox">
  </div>
</template>
<style scoped>
  .JCheckBox{
    width: 16px;
    height: 16px;
    display: inline-block;
    -webkit-tap-highlight-color: rgba(0,255,0,0);
  }
  input[type=checkbox]{
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 100%;
    background: #E5E5E5;
    border: 1px solid lightgray;
    outline: none;
    padding: 0;margin: 0;
    border-radius: 2px;
  }
  input[type=checkbox]:checked{
    -webkit-appearance: none;
    appearance: none;
    background: url("/static/images/select_square.png") no-repeat;
    background-size: 100%;
    outline: none;
    /*-webkit-box-sizing: border-box;*/
    /*-moz-box-sizing: border-box;*/
    /*box-sizing: border-box;*/
    padding: 0;margin: 0;
    /*border-radius: 3px;*/
    border: none;
  }
</style>
