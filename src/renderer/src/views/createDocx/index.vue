<template>
  <div :class="['drag_area', { top20: list.length }]">
    <template v-if="!list.length">
      <h1 class="title">学道科技</h1>
      <div ref="holderEl" class="holder" @click="handleClick">
        <el-icon class="el-icon--upload" size="60" color="#529b2e">
          <upload-filled />
        </el-icon>

        <el-text class="mt-20" type="primary"> 拖动题库源文件到此 </el-text>
      </div>
    </template>

    <template v-else>
      <el-card>
        <el-row justify="center">
          <el-col :span="6"> <el-statistic title="总题量" :value="list.length" /></el-col>

          <el-col :span="6">
            <el-statistic title="选中" :value="result.all.length" value-style="color:red"
          /></el-col>
        </el-row>
        <br />

        <el-form label-width="120px">
          <el-form-item label="科目名称">
            <el-input v-model="filters.name" placeholder="请输入科目名称" clearable />
            <p v-show="filters.name">数量：<el-text type="success">122</el-text></p>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="考试分类">
                <el-select v-model="filters.kind" placeholder="请选择考试分类" clearable>
                  <el-option
                    v-for="item in formData.kinds"
                    :key="item"
                    :label="item == '' ? '空' : item"
                    :value="item"
                  />
                </el-select>
                <p v-show="filters.kind">数量：<el-text type="success">122</el-text></p>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="数量" label-width="40px">
                <el-input-number :model-value="10" :min="1" clearable />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="题型" prop="type">
                <el-select v-model="filters.type" placeholder="请选择题型" clearable>
                  <el-option
                    v-for="item in formData.types"
                    :key="item"
                    :label="item == '' ? '空' : item"
                    :value="item"
                  />
                </el-select>
                <p v-show="filters.type">数量：<el-text type="success">122</el-text></p>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="数量" label-width="40px">
                <el-input-number :model-value="10" :min="1" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary">Create</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import lodash from 'lodash'
import { ElLoading } from 'element-plus'
import { type } from 'os'

interface IList {
  name: string
  type: string
  answer: string
  kind: string
  explain: string
  qzone: string
  school: string
  title: string
  time1: string
  time2: string
  grade: string
  class1: string
  class2: string
  option: string[]
}

const list = ref<IList[]>([])

interface RuleForm {
  types: string[]
  kinds: string[]
}

const formData = reactive<RuleForm>({
  types: [],
  kinds: []
})

const filters = reactive({ type: '', kind: '', name: '' })

const result = reactive<{ all: IList[]; kind: number; type: number; name: number }>({
  all: [],
  kind: 0,
  type: 0,
  name: 0
})

watch([filters, list], ([nFilters]) => {
  const { pickBy, toPairs, isEmpty } = lodash
  const selected = pickBy(nFilters, (value) => value.length)

  result.all = isEmpty(selected)
    ? []
    : list.value.filter((item) => toPairs(selected).every(([k, v]) => item[k]?.includes(v)))

  lodash.keys(selected).forEach((k) => {})
})

const handleClick = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  window.api
    .selectFile()
    .then((res) => {
      console.log('AT-[ res &&&&&********** ]', res)
      list.value = res

      const r = res.reduce((p, c) => {
        Array.from(Object.entries(c)).forEach(([k, v]) => {
          p[k + 's'] = p[k + 's'] ? lodash.union([...p[k + 's'], v || '-']) : [v || '-']
        })
        return p
      }, {}) as RuleForm

      const { types, kinds } = r

      formData.types = types.sort().reverse()
      formData.kinds = kinds.sort().reverse()
    })
    .finally(() => {
      loading.close()
    })
}
</script>

<style scoped lang="scss">
.top20 {
  width: 60% !important;
  top: 25% !important;
  transform: translate(-50%, -25%) !important;
}
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
