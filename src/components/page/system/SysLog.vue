<template>
    <section>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 接口日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form @keyup.enter.native="search">
                <div class="handle-box">
                    <el-input v-model="key" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                    <el-date-picker
                            v-model="timeRange"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            class="mr10"
                    >
                    </el-date-picker>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            </el-form>

            <!--`sys_user_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '后台人员id',-->
            <!--`type` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '类型 1日志 2错误 3警告',-->
            <!--`ip` varchar(64) NOT NULL COMMENT 'IP地址',-->
            <!--`api_name` varchar(100) NOT NULL DEFAULT '' COMMENT '接口名称',-->
            <!--`request_method` varchar(100) DEFAULT '' COMMENT '请求方式',-->
            <!--`request_header` text,-->
            <!--`request_get` text COMMENT '请求内容',-->
            <!--`request_post` text,-->
            <!--`response_content` text COMMENT '返回内容',-->
            <!--`remark` varchar(500) NOT NULL DEFAULT '' COMMENT '备注',-->
            <!--`create_time` int(11) unsigned NOT NULL COMMENT '插入时间',-->
            <!--`update_time` int(11) DEFAULT '0' COMMENT '更新时间',-->
            <el-table :data="tableData" border class="table" ref="multipleTable" v-loading="loading">
                <el-table-column prop="api_name" label="接口名称" width="100">
                </el-table-column>
                <el-table-column prop="sys_user_id" label="后台用户" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.username }} ({{ scope.row.sys_user_id }})
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="IP" width="80">
                </el-table-column>
                <el-table-column prop="request_method" label="方法" width="100">
                </el-table-column>
                <el-table-column prop="request_get" label="GET参数">
                </el-table-column>
                <el-table-column prop="request_post" label="POST参数">
                </el-table-column>
                <el-table-column prop="response_content" label="返回内容" min-width="120" :max-height="10">
                </el-table-column>
                <el-table-column prop="create_time" label="时间" sortable width="100" :formatter="dateFormatter">
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
    </section>
</template>

<script>
    import { logSysLog } from '@/api/modules/system'
    import moment from 'moment'

    export default {
        name: "",
        data() {
            return {
                loading: true,
                tableData: [],
                key: '',
                timeRange: [],
                pagination:{
                    'total': 0,
                    'pageSize': 20,
                    'currentPage': 1,
                    'pageSizes': [20, 50, 100]
                },
                idx: -1,

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        created(){
            this.getData();
        },
        computed: {
            startTime: function(){
                return this.timeRange[0]
            },
            endTime: function(){
                return this.timeRange[1]
            }
        },
        methods: {
            search() {
                console.log(this.timeRange)
                this.getData()
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
            dateFormatter(row, column) {
                return moment(row.create_time*1000).format('YYYY-MM-DD hh:mm:ss')
            },
            // 获取数据
            getData() {
                this.loading = true
                logSysLog({
                    key: this.key,
                    startTime: this.startTime,
                    endTime: this.endTime
                }).then(res => {
                    this.loading = false
                    this.tableData = res.data.lists
                    this.resetTotalSize();
                })
            },
        }
    }
</script>

<style>
    .el-table .cell {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        max-height: 120px!important;
        overflow: auto!important;
    }
</style>
<style lang="scss" scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-input {
        width: 180px;
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