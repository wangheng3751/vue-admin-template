<template>
  <div class="app-container">

     <div class="filter-container">
      <el-cascader placeholder="所属分类" class="filter-item" style="width: 200px" :options="categoryList" v-model="category_ids" :show-all-levels="false"  :props="columnProps" filterable></el-cascader>
      <el-input placeholder="标题" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="文章标题" width="280">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" label="作者">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" label="所属分类">
          新闻动态 / 公司新闻
      </el-table-column>

      <el-table-column width="180px" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="220px" label="简介">
        <template slot-scope="scope">
          <span>{{scope.row.content_short}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          </router-link>
          <el-button  size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>

import { fetchList,deleteArticle,fetchCategoryList } from '@/api/article'
import Pagination from '@/components/Pagination'
import { getParentsFromTree } from '@/utils/index'

export default {
  name: 'ArticleList',
  components: { Pagination },
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
      columnProps:{ value:"id",label:"title" },
      list: null,
      total: 0,
      listLoading: true,
      categoryList:[],
      category_ids:[],
      listQuery: {
        page: 1,
        limit: 20,
        title:"",
        category_id:null,
        spec:""
      }
    }
  },
  created() {
    this.getList();
    this.fetchCategoryList();
  },
  methods: {
    getList() {
      this.listLoading = true
      if(this.category_ids.length>0) this.listQuery.category_id=this.category_ids[0];
      fetchList(this.listQuery).then(response => {
       this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDelete(id) {
      deleteArticle(id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        });
        this.getList();
      })
    },
    handleUpdate(){

    },
    fetchCategoryList() {
      fetchCategoryList().then(response => {
        this.categoryList = response.data.items;  
      })
    },
    getCategory(category_id){
      var arrRes=getParentsFromTree(this.categoryList, category_id);
      var list=[];
      for(var i in arrRes){
        list.push(arrRes[i].title);
      }
      return list.join('/');
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>