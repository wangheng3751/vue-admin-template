<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="搜索" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
export default {

  data() {
    return {
      filterText: '',
      data2: [{
        id: 0,
        label: '首页',
        },{
        id: 1,
        label: '系统配置',
        children: [{
            id: 9,
            label: '角色管理'
          }, {
            id: 10,
            label: '用户管理'
          }, {
            id: 10,
            label: '权限管理'
        }]
      }, {
        id: 2,
        label: '文章管理',
        children: [{
          id: 5,
          label: '新建文章'
        }, {
          id: 6,
          label: '文章列表'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

