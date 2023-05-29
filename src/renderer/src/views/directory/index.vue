<template>
  <el-container class="container">
    <el-aside class="aside">
      <el-container>
        <el-header class="aside-header">
          <el-autocomplete
            ref="autocomplete"
            class="xxx"
            clearable
            placeholder="请输入目录名称"
            @blur="onAutocompleteBlur"
          >
            <template #suffix>
              <el-icon><ArrowDown /></el-icon>
            </template>

            <template #default="{ item }">
              <div class="value">{{ item.value }}</div>
              <span class="link">{{ item.link }}</span>
            </template>
          </el-autocomplete>

          <el-button v-if="showMenu.searchBtn" :icon="Search" @click="showFullInput" />
        </el-header>

        <el-main class="aside-main">
          <el-link type="info" :underline="false">/Users/kenny/Desktop/全部资料</el-link>
          <el-divider />
          <el-link type="info" :underline="false">/Users/kenny/Desktop/全部资料</el-link>
          <el-divider />
          <el-link type="info" :underline="false">/Users/kenny/Desktop/全部资料</el-link>
        </el-main>
      </el-container>
    </el-aside>

    <el-main class="main">
      <Dashboard />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// import { useRoute } from 'vue-router'
import Dashboard from '@renderer/views/dashboard/index.vue'
import { Search } from '@element-plus/icons-vue'

// const { query } = useRoute()
// console.log('AT-[ query &&&&&********** ]', query)
const showMenu = reactive({
  searchBtn: true
})

const autocomplete = ref()

const showFullInput = () => {
  showMenu.searchBtn = false

  autocomplete.value.focus()
}
const onAutocompleteBlur = () => {
  showMenu.searchBtn = true
}
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .aside {
    width: 300px;

    $header-height: 80px;

    resize: horizontal;

    // background-color: red;
    border-right: 1px dashed rgba(128, 128, 128, 0.3);

    .aside-header {
      box-sizing: border-box;
      height: $header-height;

      display: flex;
      align-items: center;
      justify-content: center;

      border-bottom: 1px dashed rgba(128, 128, 128, 0.2);

      &:deep(.xxx) {
        flex: 1;
        margin-right: 10px;
      }
    }

    .aside-main {
      // background-color: aqua;
      height: calc(100vh - $header-height);
    }
  }

  .main {
    // background-color: pink;
    // padding-top: 0;
    // padding-bottom: 0;
    padding: 0;
  }
}
</style>
