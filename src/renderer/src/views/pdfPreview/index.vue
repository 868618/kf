<template>
  <el-card shadow="never">
    <el-button ref="backIconRef" link type="primary" @click="goBack">
      <el-icon size="25">
        <Back />
      </el-icon>
    </el-button>
  </el-card>

  <el-card shadow="never">
    <div v-for="(item, index) in (route.query.pdfs as string[])" :key="index">
      <el-button link size="small" @click="showPreview(item)">
        <Icon :icon="pdfSolid" style="font-size: 30px; color: #f56c6c" />
        {{ item }}
      </el-button>
      <el-divider border-style="dashed" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import pdfSolid from '@iconify-icons/teenyicons/pdf-solid'
import { useRouter, useRoute } from 'vue-router'
// import { glob } from 'glob'

const router = useRouter()
const route = useRoute()

const goBack = router.back

// const [pdf] = route.query.pdfs as string[]
console.log('AT-[ route.query.pdfs &&&&&********** ]', route.query)

const showPreview = (src: string) => {
  window.api.previewPdf(src)
}
</script>
