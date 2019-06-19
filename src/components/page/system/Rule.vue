<template>
    <section>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row class="container">
            <el-col :span="9" class="rule-form">
                <el-form ref="saveForm" :model="saveForm" label-width="100px" size="small" :rules="rulesForm">
                    <el-form-item label="名称" prop="label">
                        <el-input v-model="saveForm.label"></el-input>
                    </el-form-item>
                    <el-form-item label="类型"  prop="type">
                        <el-radio-group v-model="saveForm.type">
                            <el-radio  label="0">页面</el-radio>
                            <el-radio  label="1" >接口</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="权限级别">
                        <el-radio-group v-model="saveForm.level">
                            <el-radio v-for="(label, value) in optionsLevel" :label="value" :value="value">
                                {{label}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="路径" prop="name">
                        <el-autocomplete
                                class="inline-input"
                                v-model="saveForm.name"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入路径"
                                :trigger-on-focus="false"
                        ></el-autocomplete>
                        <div class="el-form-item__content">
                            H5页面路由、接口(接口以 api/** 开头)
                        </div>
                    </el-form-item>
                    <el-form-item label="是否菜单"  prop="menu" v-show="saveForm.type == 0">
                        <el-radio-group v-model="saveForm.menu">
                            <el-radio  label="1">是</el-radio>
                            <el-radio  label="0" >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" >
                        <el-switch v-model="saveForm.status" active-text="开启" inactive-text="关闭"></el-switch>
                    </el-form-item>
                    <el-form-item label="父级菜单" prop="pid">
                        <tree-select v-model="saveForm.pid" :multiple="false"
                                     placeholder="请选择父级菜单"
                                     :options="menusTree"
                                     :default-expand-level="2"
                        ></tree-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="saveForm.remark" ></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标" prop="icon" v-if="saveForm.menu == 1" >
                        <el-input v-model="saveForm.icon" placeholder="请输入i标签html代码"></el-input>
                        <div class="el-form-item__content">
                            图标查看 <a target="_blank" href="https://element.eleme.cn/#/zh-CN/component/icon">Element</a>
                        </div>
                    </el-form-item>
                    <el-form-item label="菜单排序" prop="sort">
                        <el-input v-model="saveForm.sort" ></el-input>
                        <div class="el-form-item__content">
                            由大到小，倒序排序
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">新增/保存</el-button>
                        <el-button  @click="resetFields">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <el-col :span="15" class="rule-tree" >
                <el-row >
                    <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterNodeText" style="width: 250px;" size="small">
                    </el-input>
                </el-row>
                <el-row style="padding-top: 10px;">
                    <el-tree
                            :data="rulesTree"
                            :default-expanded-keys = "expandKeys"
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :filter-node-method="filterNode"
                            :expand-on-click-node="false"
                            :default-expand-all="false"
                    >
                    <span class="custom-tree-node" slot-scope="{ node, data }" @click="editRule(data)" >
                        <span :class="data.status == 0 ? 'forbidden-rule' : ''">
                            <!--菜单-->
                            <span v-if="data.type==0 && data.menu"><i :class="data.icon ? data.icon : 'el-icon-menu'" ></i> </span>
                            <span v-if="data.type==0 && !data.menu"><i :class="el-icon-document"></i> </span>
                            <!--接口-->
                            <span v-if="data.type==1"><i class="el-icon-key"></i> </span>
                            <span>{{data.label}}</span>
                            <span class="rule-name">({{data.name}})</span>
                            <span class="rule-name">{{data.sort}}</span>
                        </span>
                        <span>
                            <el-button type="text" icon="el-icon-delete"   size="mini"  @click.stop="deleteRule(data)"></el-button>
                        </span>
                    </span>
                    </el-tree>
                </el-row>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import TreeSelect from '@riophae/vue-treeselect'
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { allRoutes, delRule, saveRule, getRuleTreeLists } from '@/api/modules/system'

    export default {
        name: "",
        components: {
            TreeSelect
        },
        watch: {
            filterNodeText (newValue) {
                this.$refs.tree.filter(newValue);
            }
        },
        mounted() {
            // this.getMenusTree();
            this.getRulesTree();
            this.getAllRoutes();
        },
        data() {
            return {
                routes: [],
                filterNodeText:'',
                form:{},
                optionsLevel: {
                    0 : '不需验证',
                    1 : '需要登录',
                    2 : '需要赋权'
                },
                saveForm:{
                    id: 0,
                    pid: undefined,
                    type: "0",
                    level: '2',
                    label:'',
                    name:'',
                    status: true,
                    menu:"0",
                    icon: '',
                    sort: 0
                },
                menusTree:[],
                rulesTree:[],
                auth:{},
                rulesForm:{
                    label: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入路径', trigger: 'blur' }
                    ],
                    remark:[],
                    icon:[],
                    pid:[
                        {validator: this.checkPid, trigger: 'blur'}
                    ]
                },
                expandKeys:[]
            }
        },
        methods:{
            // 选择父级
            checkPid(rule, value, callback) {
                if(value && this.saveForm.id == value){
                    callback(new Error('不能选择自己作为父级!'));
                }
                callback()
            },
            onSubmit() {
                this.$refs['saveForm'].validate((valid) => {
                    if (valid) {
                        saveRule({'form': this.saveForm}).then(res => {
                            if(res.code === 0) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.getRulesTree()
                                // this.getMenusTree()
                                this.resetFields()
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            querySearch(queryString, cb) {
                let restaurants = this.routes;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            getAllRoutes() {
                allRoutes({}).then(res => {
                    let lists = res.data.lists;
                    this.routes = lists.map(function (item) {
                        return {value:item};
                    });
                })
            },
            getMenusTree() {
                getRuleTreeLists({}).then(res => {
                    this.menusTree = res.data.lists
                })
            },
            getRulesTree() {
                getRuleTreeLists({}).then(res => {
                    this.menusTree = res.data.lists
                    this.rulesTree = res.data.lists

                    this.rulesTree.map(row => {
                        this.expandKeys.push(row.id);
                        for(let index in row.children) {
                            this.expandKeys.push(row.children[index].id);
                        }
                        return row;
                    });
                })
            },
            resetFields() {
                if(typeof(this.$refs['saveForm']) !== 'undefined') this.$refs['saveForm'].resetFields();
                this.saveForm.id = 0;
            },
            editRule(node) {
                if(typeof(this.$refs['saveForm']) !== 'undefined')
                    this.$refs['saveForm'].resetFields();

                this.saveForm.id = node.id;
                this.saveForm.type = node.type + "";
                this.saveForm.level = node.level + "";
                this.saveForm.label = node.label;
                this.saveForm.name = node.name;
                this.saveForm.status = node.status ? true : false;
                this.saveForm.menu = node.menu ? '1' : '0';
                this.saveForm.icon = node.icon;
                this.saveForm.pid = node.pid ? node.pid : undefined;
                this.saveForm.sort = node.sort;
            },
            deleteRule(node) {
                this.$confirm('你确定删除这条记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delRule({id:node.id}).then(res => {
                        this.getRulesTree();
                        this.getMenusTree();
                    })
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .rule-form{
        border-right: 1px solid #ccc;
        padding: 20px;
        min-height:800px
    }
    .rule-tree{
        padding: 20px;
        max-height: 800px;
        overflow-y: scroll
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
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