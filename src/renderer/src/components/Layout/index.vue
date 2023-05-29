<template>
  <el-container class="container">
    <el-aside class="aside">
      <div class="avatar">
        <el-avatar :size="50" :src="avatar" />
        <el-button plain size="small" class="button">游客模式</el-button>
      </div>

      <div class="nav">
        <el-menu
          :default-active="route.path"
          text-color="gray"
          active-text-color="#fff"
          background-color="none"
          class="menu"
          router
        >
          <el-menu-item index="/" class="menu-item">
            <el-icon><Coin /></el-icon>
            <span>主页</span>
          </el-menu-item>

          <el-menu-item index="/directory" class="menu-item">
            <el-icon><FolderOpened /></el-icon>
            <span>目录</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="logo">
        学道 <br />
        科技
      </div>
    </el-aside>

    <el-main class="main">
      <!-- <Directory /> -->
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import avatar from '@renderer/assets/imgs/icon.png'

const route = useRoute()
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;

  $asideWidth: 120px;

  .aside {
    background-color: rgb(28, 29, 36);
    width: $asideWidth;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
      text-align: center;
      padding-top: 45px;
      display: inline-flex;
      align-items: center;
      flex-direction: column;

      .button {
        margin-top: 15px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0);
      }
    }

    .nav {
      height: 200px;
      margin-top: 45px;
      overflow: hidden;
      flex: 1;

      .menu {
        width: $asideWidth;
        .menu-item {
          margin-right: -2px !important;
          background-color: rgb(28, 29, 36);
          &:hover {
            background-color: rgba(52, 56, 63, 0.4);
            color: #fff;
            margin-right: -2px !important;
          }
        }
      }
    }
    .logo {
      width: 120px;
      height: 120px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  .main {
    padding: 0;
  }
}
</style>
