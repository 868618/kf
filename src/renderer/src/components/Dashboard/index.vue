<script lang="ts" setup>
import { onMounted } from 'vue'
import { CopyDocument } from '@element-plus/icons-vue'
import { chunk } from 'lodash'
import useCurrentDirsStore from '@/stores/useCurrentDir'

const currentDirsStore = useCurrentDirsStore()

const list = chunk(currentDirsStore.data, 6)

onMounted(() => {
  console.log('store.data', list)
})
</script>

<template>
  <div class="container">
    <el-row :gutter="6" v-for="(item, index) in list" :key="index" :class="{ 'mt-6': index > 0 }">
      <el-col :span="4" v-for="(i, n) in item" :key="n">
        <el-card shadow="hover" style="min-height: 250px">
          <template #header>
            <div class="card-header">
              <el-text tag="b" size="small"> {{ i.name }}</el-text>

              <el-button link :icon="CopyDocument" />
            </div>
          </template>

          <template v-for="(name, idx) in i.fileNames" :key="idx">
            <el-text tag="b" size="small"> {{ name }}</el-text>
            <el-divider />
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  // background-color: pink;
  padding: 6px;
  box-sizing: border-box;

  .mt-6 {
    margin-top: 6px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
