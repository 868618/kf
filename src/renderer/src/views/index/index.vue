<template>
  <el-row justify="end">
    <el-col :span="1">
      <el-button link @click="showWifiName">
        <Icon :icon="wifiFill" style="font-size: 25px" />
      </el-button>
    </el-col>
  </el-row>

  <div class="drag_area">
    <h1 class="title">学道科技</h1>

    <div ref="holderEl" class="holder" @click="handleClick">
      <el-icon class="el-icon--upload" size="60" color="#529b2e">
        <upload-filled />
      </el-icon>

      <el-text class="mt-20" type="primary"> 拖动目录到此 </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import wifiFill from '@iconify-icons/mingcute/wifi-fill'

const holderEl = ref()
const router = useRouter()

const toDashboardPage = (dir: string) => {
  router.push({
    path: '/directory',
    query: {
      dir
    }
  })
}

document.addEventListener('drop', (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  if (holderEl.value == e.target) {
    const [{ path: dir, type }] = e.dataTransfer?.files as FileList & { path: string }[]

    if (!type && dir) {
      toDashboardPage(dir)
    }
  }
})

document.addEventListener('dragover', (e) => {
  e.preventDefault()
  e.stopPropagation()
})

const handleClick = async () => {
  const [dir] = await window.api.showOpenDialogSync()

  toDashboardPage(dir)
}

const showWifiName = () => {
  window.api.showWifiName()
}
</script>

<style scoped lang="scss">
.drag_area {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  transform: translate(-50%, -50%);
  background: radial-gradient(transparent, rgba(255, 255, 255, 1) 2px);
  background-size: 4px 4px;
  // height: 400px;
  // background-color: red;

  .title {
    background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 54px;
    letter-spacing: -0.5px;
    margin-bottom: 30px;
    text-align: center;
  }
}

.holder {
  width: 400px;
  height: 185px;
  border-radius: 3px;
  border: 1px dashed #ccc;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  cursor: pointer;

  position: relative;

  &:hover {
    border-color: #647eff;
  }

  .file {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: red;
    opacity: 0;
  }
}

.mt-20 {
  margin-top: 20px;
}
</style>
