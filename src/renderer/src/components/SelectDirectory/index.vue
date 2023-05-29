<script setup lang="ts">
// import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useCurrentDir from '@/stores/useCurrentDir'
// import fs from 'node:fs'

// import { ElLoading } from 'element-plus'

// onMounted(() => {
//   console.log('fs', fs)
// })

// import { ElMessageBox } from 'element-plus'

const router = useRouter()

const store = useCurrentDir()
// console.log('AT-[ store &&&&&********** ]', store)

// interface Window {
//   version: any
// }

const onClick = async () => {
  const targetPaths = await window.ipcRenderer.selectDir()
  // console.log('AT-[ targetPaths &&&&&********** ]', targetPaths)
  store.update(targetPaths)

  router.push('/dashboard')

  // const loading = ElLoading.service({
  //   lock: true,
  //   text: 'Loading',
  //   background: 'rgba(0, 0, 0, 0.7)',
  //   fullscreen: true,
  // })
  // ipcRenderer
  //   .invoke('selectDir')
  //   .then(targetPaths => {
  //     console.log('AT-[ targetPaths &&&&&********** ]', targetPaths)
  //     // store.update(targetPaths)
  //     // router.push('/dashboard')
  //   })
  //   .finally(loading.close)
}
</script>

<template>
  <div class="drag_area">
    <h1 class="title">魏灿灿专属软件</h1>
    <el-upload
      ref="upload"
      drag
      multiple
      :auto-upload="false"
      :show-file-list="false"
      disabled
      @click="onClick"
    >
      <el-icon class="el-icon--upload" style="color: #529b2e">
        <upload-filled />
      </el-icon>

      <div class="el-upload__text">
        <em>点击选择目录</em>
      </div>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
.drag_area {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  transform: translate(-50%, -50%);
  background: radial-gradient(transparent, rgba(255, 255, 255, 1) 2px);
  background-size: 4px 4px;

  .title {
    background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 54px;
    letter-spacing: -0.5px;
    margin-bottom: 30px;
  }
}
</style>
