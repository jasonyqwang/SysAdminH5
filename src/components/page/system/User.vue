<template>
    <section>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 系统用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button icon="add" @click="handleCreate">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading">
                <el-table-column prop="username" label="用户名" width="120">
                </el-table-column>
                <el-table-column prop="role_name" label="角色" width="120">
                </el-table-column>
                <el-table-column prop="realname" label="真实姓名" width="120">
                </el-table-column>
                <el-table-column  label="用户头像" width="120">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.avatar" v-if="scope.row.avatar">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱地址" width="120">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号">
                </el-table-column>
                <el-table-column prop="create_time" label="日期" sortable width="100" :formatter="dateFormatter">
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handlePwd(scope.$index, scope.row)">密码</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               layout="sizes, prev, pager, next"
                               :total="pagination.total"
                               :current-page.sync="pagination.currentPage"
                               :page-size="pagination.pageSize"
                               :page-sizes="pagination.pageSizes"
                >
                </el-pagination>
            </div>
        </div>

        <!-- 创建弹出框 -->
        <user-create-dialog
                :createVisible="createVisible"
                @closeCreateDialog="closeCreateDialog"
                @refreshList="getData"
        >
        </user-create-dialog>

        <!-- 编辑弹出框 -->
        <user-edit-dialog
                :editVisible="editVisible"
                :form="editForm"
                @closeEditDialog="closeEditDialog"
                @refreshList="getData"
        >
        </user-edit-dialog>

        <!--  修改密码 -->
        <el-dialog title="修改密码" :visible.sync="upPwdVisible" width="300px" center>
            <el-form ref="upPwdForm" :model="upPwdForm" :rules="upPwdFormRules">
                <el-form-item label="新密码">
                    <el-input v-model="upPwdForm.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upPwdVisible = false">取 消</el-button>
                <el-button type="primary" @click="upUserPwd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import { deleteUser, getUserLists, upUserPwd } from '@/api/modules/system'
    import moment from 'moment'
    import UserCreateDialog from './user/CreateDialog'
    import UserEditDialog from './user/EditDialog'

    export default {
        name: "user",
        components: {
            UserCreateDialog,
            UserEditDialog
        },
        data() {
            return {
                loading: true,
                tableData: [],
                key: '',
                pagination:{
                    'total': 0,
                    'pageSize': 10,
                    'currentPage': 1,
                    'pageSizes': [10, 20, 30]
                },
                createVisible: false,
                editVisible: false,
                delVisible: false,
                upPwdVisible: false,
                editForm: {
                    id: '',
                    status: 1,
                    username: '',
                    role_id: '',
                    realname: '',
                    email: '',
                    mobile: ''
                },
                upPwdForm: {
                    id: '',
                    password: ''
                },
                upPwdFormRules: {
                    'password': [
                        {required: true,  message: '请输入密码',trigger: 'blur' }
                    ]
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
        },
        methods: {
            // 添加用户
            handleCreate(){
                this.createVisible = true
            },
            closeCreateDialog(){
              this.createVisible = false
            },
            closeEditDialog(){
                this.editVisible = false
            },
            search() {
                this.getData()
            },
            upUserPwd() {
                //修改密码
                upUserPwd(this.upPwdForm).then(res => {
                    if(res.code == this.$_GLOBAL.API_CODE.SUCCESS){
                        this.$message.success(res.msg)
                    }
                    this.upPwdVisible = false
                })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.pagination.currentPage= val;
                this.getData();
            },
            handleSizeChange(val){
                this.pagination.pageSize= val;
                this.getData();
            },
            // 分页，不需要后台传总数
            resetTotalSize(){
                let size = this.pagination.pageSize * this.pagination.currentPage;
                let tableLen = this.tableData.length;
                if(tableLen == 0){
                    this.pagination.total = size
                }else if(tableLen > 0 && tableLen < this.pagination.pageSize){
                    this.pagination.total = size - 1;
                }else{
                    this.pagination.total = size + 1;
                }
            },
            // 获取数据
            getData() {
                this.loading = true
                getUserLists({
                    key: this.key,
                    pageSize: this.pagination.pageSize,
                    currentPage: this.pagination.currentPage
                }).then(res => {
                    this.loading = false
                    this.tableData = res.data.lists
                    this.resetTotalSize();
                })
            },
            dateFormatter(row, column) {
                return moment(row.create_time*1000).format('YYYY-MM-DD')
            },
            handlePwd(index, row) {
                this.idx = index;
                let item = this.tableData[index];
                this.upPwdForm.id = item.id
                this.upPwdVisible = true;
            },
            handleEdit(index, row) {
                this.idx = index;
                let item = this.tableData[index];
                this.editForm = {
                    id: item.id,
                    status: item.status,
                    username: item.username,
                    role_id: item.role_id ? item.role_id : '',
                    realname: item.realname,
                    email: item.email,
                    mobile: item.mobile,
                };
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
                let item = this.tableData[this.idx];
                deleteUser({
                    id: item.id
                }).then(res => {
                    if(res.code == this.$_GLOBAL.API_CODE.SUCCESS){
                        this.$message.success(res.msg)
                    }
                    this.delVisible = false;
                    this.tableData.splice(this.idx, 1);
                    this.getData();
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>