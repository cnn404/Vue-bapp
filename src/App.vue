<template>
  <div id="app">
    <router-view></router-view>
    <j-alert :alertInfo="this.$store.state.jAlertInfo"></j-alert>
    <j-loading v-show="this.$store.state.showLoading"></j-loading>
  </div>
</template>

<script>
import JLoading from "@/components/JLoading";
import JAlert from "@/components/JAlert";
export default {
  name: "app",
  data: function() {
    return {};
  },
  components: { JLoading, JAlert }
};
</script>

<style>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  outline: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-size-adjust: none;
  -moz-text-size-adjust: none;
  -ms-text-size-adjust: none;
  -o-text-size-adjust: none;
  -webkit-text-size-adjust: none;
}

body,
div {
  margin: 0;
  padding: 0;
}

.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background: #eeeeee;
}

</style>
