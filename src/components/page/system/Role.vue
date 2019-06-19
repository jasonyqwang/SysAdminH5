<template>
    <section>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 系统角色</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button icon="add" @click="create">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading">
                <el-table-column prop="create_time" label="添加日期" sortable width="150" :formatter="dateFormatter">
                </el-table-column>
                <el-table-column prop="name" label="角色名" width="120">
                </el-table-column>
                <el-table-column prop="description" label="描述" width="120">
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="formatStatus">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-guide" @click="handleRule(scope.$index, scope.row)">权限</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                               layout="prev, pager, next"
                               :total="pagination.total"
                               :current-page.sync="pagination.currentPage"
                               :page-size="pagination.pageSize"
                               :page-sizes="pagination.pageSizes"
                >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="角色名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                <el-select v-model="form.status" placeholder="状态">
                    <el-option v-for="item in statusOptions" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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

        <el-dialog title="新增/修改权限" :visible.sync="editRuleVisible" width="50%">
            <el-form ref="saveForm" :model="saveForm" label-width="150px" size="small" :rules="rulesForm">
                <el-form-item label="角色名称" prop="title">
                    <el-input v-model="saveForm.label" :disabled="true" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="选择权限" prop="rules">
                    <el-tree
                            :data="rulesTree"
                            show-checkbox
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :default-expand-all="true"
                            @check-change="checkChange"
                            :default-checked-keys="saveForm.rules"
                            :check-strictly="true"
                    >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>
                            <!--菜单-->
                            <span v-if="data.type==0 && data.menu"><i :class="data.icon ? data.icon : 'el-icon-menu'" ></i> </span>
                            <span v-if="data.type==0 && !data.menu"><i :class="el-icon-document"></i> </span>
                            <!--接口-->
                            <span v-if="data.type==1"><i class="el-icon-key"></i> </span>
                            <span>{{data.label}}</span>
                        </span>
                    </span>
                    </el-tree>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button  @click="editRuleVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import { getRoleRulesTree, getRoleLists, editRole, delRole, saveRoleRules} from '@/api/modules/system'
    import moment from 'moment'

    export default {
        name: "role",
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
                form: {
                    name: '',
                    description: '',
                    status: ''
                },
                idx: -1,
                statusOptions:[{'name':'启用','value':1},{'name':'禁止','value':0}],
                rules: {
                    name: [
                        { required: true, message: '请输入角色名', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                },
                editRuleVisible:false,
                saveForm:{
                    role_id: 1,
                    label:'',
                    rules:[]
                },
                rulesTree:[],
                rulesForm:{
                    rules: [
                        { required: true, message: '请选择权限', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
        },
        methods: {
            // 添加角色
            create(){
                this.form = {
                    name: '',
                    description: '',
                    status: '',
                    id: '',
                }
                this.editVisible = true;
            },
            search() {
                this.getData()
            },
            // 分页导航
            handleCurrentChange(val) {
                this.pagination.currentPage= val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                getRoleLists({
                    key: this.key,
                    pageSize: this.pagination.pageSize,
                    currentPage: this.pagination.currentPage
                }).then(res => {
                    this.loading = false
                    this.tableData = res.data.lists
                })
            },
            dateFormatter(row, column) {
                return moment(row.create_time*1000).format('YYYY-MM-DD')
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleRule(index, row){
                this.idx = index;
                const item = this.tableData[index];
                this.saveForm.label = item.name
                this.saveForm.role_id = item.id
                this.editRuleVisible = true
                getRoleRulesTree({role_id: this.saveForm.role_id}).then(res => {
                    this.rulesTree = res.data.lists
                    this.saveForm.rules = res.data.checkedKeys
                })
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    description: item.description,
                    status: item.status,
                    id: item.id,
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        editRole({'form': this.form}).then(res => {
                            this.$message.success({
                                message: '编辑角色成功',
                                type: 'success',
                            })
                            this.editVisible = false;

                            this.getData();
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 确定删除
            deleteRow(){
                delRole({'id': this.tableData[this.idx].id}).then(res => {
                    this.$message.success({
                        message: '删除成功',
                        type: 'success',
                    })
                    this.$message.success('删除成功');
                    this.delVisible = false;

                    this.getData();
                });

            },
            formatStatus: function (row, column) {
                return row.status == 1 ? '启用' : row.status == 0 ? '禁用' : '未知';
            },
            getCheckedKeys() {
                this.saveForm.rules = this.$refs.tree.getCheckedKeys();
            },
            //节点选中状态发生变化时的回调
            checkChange(node, curIsChecked, subIsChecked){
                //如果当前节点选中
                if(curIsChecked){
                    //父节点存在的话，也默认选中
                    if(node.pid){
                        console.log('======node.pid ==='+node.pid)
                        this.$refs.tree.setChecked(node.pid, true)
                    }
                    // //如果有子节点，也需要选中
                    // if(node.children.length > 1){
                    //     node.children.forEach((v, index) => {
                    //         this.$refs.tree.setChecked(v.id, true)
                    //     })
                    // }
                }else{
                    if(node.children && node.children.length > 1){
                        node.children.forEach((v, index) => {
                            this.$refs.tree.setChecked(v.id, false)
                        })
                    }
                }
            },
            onSubmit() {
                this.getCheckedKeys();
                this.$refs['saveForm'].validate((valid) => {
                    if (valid) {
                        saveRoleRules({form: this.saveForm}).then(res => {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.editRuleVisible = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
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
    .el-icon-key{
        color: $color-danger;
    }
    .forbidden-rule{
        color: $color-danger;
    }
    .rule-name{
        margin-left: 10px;
        color: $color-gray;
    }
</style>