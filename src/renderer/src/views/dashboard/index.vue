<template>
  <el-table
    :data="tableData"
    stripe
    :height="innerHeight"
    :show-overflow-tooltip="true"
    size="small"
  >
    <el-table-column type="index" width="70" />

    <el-table-column prop="name" label="名称" width="250" header-align="left">
      <template #default="scope">
        <el-link type="primary" @click="showDetiaDialog(scope.row, scope.$index)">{{
          scope.row.name
        }}</el-link>
      </template>
    </el-table-column>

    <el-table-column label="统计" width="300">
      <template #default="scope">
        <el-row>
          <el-col :span="2">
            <el-statistic :value="scope.row.pdfCount">
              <template #title>
                <Icon :icon="pdfSolid" style="color: #f56c6c" />
              </template>
            </el-statistic>
          </el-col>

          <el-col :span="2">
            <el-statistic :value="scope.row.docCount">
              <template #title>
                <Icon :icon="docSolid" style="color: #337ecc" />
              </template>
            </el-statistic>
          </el-col>

          <el-col :span="2">
            <el-statistic :value="scope.row.mp4Count">
              <template #title>
                <Icon :icon="videoFill" />
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </template>
    </el-table-column>

    <el-table-column>
      <template #header>
        <el-autocomplete
          v-model="state"
          clearable
          placeholder="输入搜索内容"
          :fetch-suggestions="querySearch"
          @change="handleChange"
          @keyup="handleKeyup"
        />
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="dialogs.detail"
    :title="mark.dialogTitle"
    width="60%"
    @close="hideDialogClose"
  >
    <el-table :data="dirDetailsList" :show-header="false" max-height="450px">
      <el-table-column type="index" width="50" />

      <el-table-column property="shortName" label="shortName">
        <template #default="scope">
          <template v-if="scope.row.shortName.endsWith('.pdf')">
            <el-button link size="small" @click="showPreview($event, scope.row)">
              <Icon :icon="pdfSolid" style="margin-right: 5px; color: #f56c6c" />
              {{ scope.row.shortName }}
            </el-button>
          </template>

          <template v-else>
            <Icon :icon="docSolid" style="margin-right: 5px; color: #337ecc" />
            {{ scope.row.shortName }}
          </template>
        </template>
      </el-table-column>

      <el-table-column width="100">
        <template #default="scope">
          <el-space v-if="scope.row.shortName.endsWith('.pdf')" :size="10">
            <template v-if="!scope.row.molting">
              <el-tooltip v-if="!scope.row.converting" content="转成视频" placement="top-start">
                <el-button circle link @click="convertToVideo(scope.row, scope.$index)">
                  <Icon :icon="rocketLaunch" style="color: #f56c6c" />
                </el-button>
              </el-tooltip>

              <el-tooltip v-else content="转换中" placement="top-start">
                <Icon :icon="bubbleLoading" />
              </el-tooltip>
            </template>

            <el-tooltip v-else content="播放" placement="top-start">
              <el-button circle link @click="showVideoPreviewDialog(scope.row)">
                <Icon :icon="videoFill" style="color: #409eff" />
              </el-button>
            </el-tooltip>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog
    v-model="dialogs.videoPreview"
    width="340px"
    title="视频预览"
    @close="onVideoPreviewClose"
  >
    <div class="video">
      <video :src="mark.video" controls autoplay></video>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useSubDirs, useDir } from '@renderer/hooks'
import { ElLoading } from 'element-plus'

import { Icon } from '@iconify/vue'
import pdfSolid from '@iconify-icons/teenyicons/pdf-solid'
import docSolid from '@iconify-icons/teenyicons/doc-solid'
import videoFill from '@iconify-icons/mingcute/video-fill'
// import debugStart from '@iconify-icons/codicon/debug-start'
// import okIcon from '@iconify-icons/flat-color-icons/ok'
import bubbleLoading from '@iconify-icons/eos-icons/bubble-loading'
import rocketLaunch from '@iconify-icons/mdi/rocket-launch'

const { query } = useRoute()

interface IData {
  name: string
  p: string
  converting: boolean
}

const tableData = ref<IData[]>()

const state = ref()

// const backIconRef = ref()

const innerHeight = ref(window.innerHeight)

const dialogs = reactive({
  detail: false,
  videoPreview: false
})

const dirDetailsList = ref()

interface IMark {
  row: Record<string, unknown> | null
  rowIndex: number | null
  dialogTitle: string
  video: string
}

const mark = reactive<IMark>({
  row: null,
  rowIndex: null,
  dialogTitle: '',
  video: ''
})

const express = ref()

onBeforeMount(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const result = await useSubDirs(query.dir)
  loading.close()
  tableData.value = result

  window.api.setStore(query.dir as string, result)
})

onMounted(() => {
  innerHeight.value = window.innerHeight
})

const querySearch = (queryString: string, cb: any) => {
  const queryStrs = queryString.trim().split(' ')

  const results = queryString
    ? tableData.value?.filter((item) =>
        queryStrs.every((str) => JSON.stringify(item).includes(str))
      )
    : []

  cb(
    results?.map((i) => ({
      value: i.name,
      link: i
    }))
  )
}

const handleChange = async (queryString: string) => {
  const queryStrs = queryString.trim().replace(/\s+/, ' ').split(' ')

  const results = queryString
    ? tableData.value?.filter((item) =>
        queryStrs.every((str: string) => JSON.stringify(item).includes(str))
      )
    : await useSubDirs(query.dir)

  tableData.value = results
}

const handleKeyup = useDebounceFn(() => {
  console.log('state.value', state.value)
  handleChange(state.value)
}, 300)

// const goBack = router.back

const convertToVideo = async (row: Record<string, any>, index: number) => {
  // list.value[index].converting = true
  dirDetailsList.value[index].converting = true

  const { rowIndex, row: currentRow } = mark

  await window.api.convertToVideo(row.fullPath).then(async () => {
    const result = await useDir(currentRow?.p as string)

    tableData.value && (tableData.value[rowIndex as number] = result)
  })

  // list.value[index].molting = true
  dirDetailsList.value[index].molting = true

  showDetiaDialog(mark.row)
}

const refreshDetailDialog = async (row: any) => {
  const mp4s = await window.api.glob(`${row.p}/**/*.mp4`)

  const res = await window.api.glob(row.p + '/*')

  dialogs.detail = true

  mark.dialogTitle = row.base

  const tmpArr: any[] = []

  for (const p of res) {
    const { name } = await window.api.pathParse(p)
    const molting = mp4s.some((mp4) => mp4.includes(`${name}.mp4`))

    const item = {
      shortName: p.replace(row.p + '/', ''),
      fullPath: p,
      dir: row.p,
      molting
    }

    tmpArr.push(item)
  }

  dirDetailsList.value = tmpArr.filter((i) => !i.shortName.endsWith('.mp4'))
}

const showDetiaDialog = async (row: any, index?: number) => {
  mark.rowIndex = index != undefined ? index : null

  refreshDetailDialog(row)

  mark.row = row
}

const hideDialogClose = () => {
  window.api.closeAllChildWindows()
}

window.addEventListener('focus', () => {
  window.api.closeAllChildWindows()
})

const showPreview = async ($event, row: Record<string, unknown>) => {
  // console.log('AT-[ event &&&&&********** ]', row)
  if (row.fullPath.endsWith('.pdf')) {
    await window.api.closeAllChildWindows()
    await window.api.previewPdf(row.fullPath)
    $event.target.focus()
  } else {
    // const res = window.api.blob(row.fullPath)
    // console.log('AT-[ res &&&&&********** ]', res.size)
  }
}

const showVideoPreviewDialog = async (row: any) => {
  const { dir } = row

  if (!express.value) {
    const app = await window.api.createHttpServer({
      static: dir,
      port: 7777
    })

    express.value = app
  }

  const [port] = express.value._connectionKey.match(/\d+$/g)

  const video = row.shortName.replace(/\.pdf$/gi, '.mp4')

  mark.video = `http://localhost:${port}/${video}`

  dialogs.videoPreview = true
}

const onVideoPreviewClose = () => {
  // window.api.closeHttpServer()
}
</script>

<style lang="scss" scoped>
.video {
  > video {
    width: 300px;
  }
}
</style>
