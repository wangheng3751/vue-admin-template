<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="分类名称" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate(null)">新建</el-button>
    </div>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.title }}</span>
        <span>
          <el-button type="primary" size="mini" @click="handleUpdate(data)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleCreate(data.id)">添加下级</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(data.id)">删除</el-button>
        </span>
      </span>
    </el-tree>
   
    <el-dialog :title="textMap[dialogStatus]" width="550px" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分类名称">
          <el-input v-model="temp.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createArticleCategory, updateArticleCategory,deleteArticleCategory } from '@/api/articleCategory'
import treeTable from '@/components/TreeTable'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleColumn',
  components: { Pagination,treeTable },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: "",
        sort: '+id'
      },
      temp: {
        parent_id: 0,
        title: "",
        id:0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: "修改分类",
        create: "创建分类"
      },
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      expandAll: false,
      data: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        parent_id: 0,
        title: ''
      }
    },
    handleCreate(id) {
      this.resetTemp()
      this.temp.parent_id=id;
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log(this.temp.parent_id)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticleCategory(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList();
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({id:row.id}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticleCategory(tempData).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id) {
      deleteArticleCategory(id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        });
        this.getList();
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-checkbox {
    margin-right: 30px;
    margin-left: 0 !important
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree-node__content{
      height: 46px;
  }
</style>

