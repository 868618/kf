<template>
  <h1 v-if="isShow" ref="wifiEl" class="wifi"><span>WIFI</span>:{{ wifiName }}</h1>
  <h1 v-else ref="wifiEl" class="wifi red">断网中</h1>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, watchEffect } from 'vue'
import { useWifiInfo } from '@renderer/hooks'

const wifiEl = ref()
const wifiName = ref()
const isShow = ref(false)

window.addEventListener('online', async () => {
  const [{ ssid }] = await useWifiInfo()
  wifiName.value = ssid
  isShow.value = true
})

window.addEventListener('offline', async () => {
  isShow.value = false
})

onBeforeMount(async () => {
  const [{ ssid }] = await useWifiInfo()
  wifiName.value = ssid
  isShow.value = true
})

watchEffect(() => {
  if (wifiEl.value) {
    const { clientHeight, clientWidth } = wifiEl.value
    window['wifi:api'].changeSize(clientWidth, clientHeight)
  }
})

// onUpdated(() => {

// })
</script>

<style scoped lang="scss">
.wifi {
  display: inline-block;
  white-space: nowrap;
  font-weight: 300;
  color: aqua;
  padding-right: 30px;

  > span {
    -webkit-app-region: drag;
    display: inline;
    cursor: move;
    color: yellowgreen;
    user-select: none;
  }
}

.red {
  color: red;
}
</style>
