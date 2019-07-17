<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky class-name="sub-navbar draft">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm(1)">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm(0)">保存</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title"  :maxlength="100" name="name" required>
                文章标题
              </MDinput>
            </el-form-item>

             <el-form-item style="margin-bottom: 40px;" label-width="45px" label="简介:">
                <el-input :rows="5" v-model="postForm.desc" type="textarea" class="article-textarea" placeholder="请输入内容"/>
                <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
            </el-form-item>

            <div class="postInfo-container">
              <el-row :gutter="30">
                <el-col :span="12">
                  <el-form-item label-width="45px" label="分类:" class="postInfo-container-item">
                    <el-cascader placeholder="选择分类" :options="categoryList" v-model="category_ids" :show-all-levels="false"  :props="columnProps" filterable style="width: 100%"></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            
          </el-col>
        </el-row>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" :height="400" v-model="postForm.body" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { getParentsFromTree } from '@/utils/index'
import { fetchArticle,fetchCategoryList,createArticle,updateArticle } from '@/api/article'
import { mapGetters } from 'vuex'

const defaultForm = {
  title: '', // 文章题目
  body: '', // 文章内容
  desc: '', // 文章摘要  
  thumbnail_base_url:"",
  thumbnail_path:"",
  id: undefined
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateColumn = (rule, value, callback) => {
      if (value.length==0) {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      columnProps:{ value:"id",label:"title" },
      postForm: Object.assign({  }, defaultForm),
      category_ids:[],
      loading: false,
      categoryList: [
        
      ],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        category_ids :[{ validator: validateColumn }]
      },
      tempRoute: {}
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    contentShortLength() {
      return this.postForm.desc.length
    },
    lang() {
      return this.$store.getters.language
    },
    imageUrl(){
      return this.postForm.thumbnail_base_url+this.postForm.thumbnail_path
    }
  },
  created() {
    if (this.isEdit) {
      
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route);
    this.fetchCategoryList();
  },
  methods: {
    rmImage() {
      this.postForm.thumbnail_base_url="";
      this.postForm.thumbnail_path="";
    },
    handleImageSuccess(response) {
      this.postForm.thumbnail_base_url=response.data.avatar_base_url;
      this.postForm.thumbnail_path=response.data.avatar_path;
    },
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data.data
        this.category_ids=this.getCategoryRouter(this.categoryList,response.data.data.category_id);
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    getCategoryRouter(data2, nodeId2){
          var arrRes = getParentsFromTree(data2, nodeId2);
          var list=[];
          for(var i in arrRes){
            list.push(arrRes[i].id);
          }
          return list;
    },
    setTagsViewTitle() {
      const title =  '编辑文章';
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm(status) {      
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$set(this.postForm,"status",status);
          this.$set(this.postForm,"category_id",this.category_ids[this.category_ids.length-1])
          if (this.isEdit){
            updateArticle(this.postForm).then(()=>{
              this.$notify({ title: '成功', message:"修改成功",type: 'success',duration: 2000})
              this.loading = false
            })
          }else{
            createArticle(this.postForm).then(()=>{
              this.$notify({ title: '成功', message:(status==1?'发布':'保存')+'成功',type: 'success',duration: 2000})
              this.loading = false
            })
          }         
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    fetchCategoryList() {
      fetchCategoryList().then(response => {
        this.categoryList = response.data.items;
        if (this.isEdit){
          const id = this.$route.params && this.$route.params.id
          this.fetchData(id)
        }  
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 10px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
