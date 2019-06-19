<template>
    <section>
        <!-- 编辑弹出框 -->
        <el-dialog title="修改用户" :visible.sync="editVisible" :before-close="closeEditDialog" width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="角色" prop="role_id">
                    <el-select v-model="roleSelect" placeholder="请选角色" :clearable="true" >
                        <el-option  v-for="(name, index) in roles"
                                    :key="index"
                                    :label="name "
                                    :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :label=1>正常</el-radio>
                        <el-radio :label=0>禁止</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import { editUser, getRoleDicts } from '@/api/modules/system'

    export default {
        name: "UserEditDialog",
        props: [
            'editVisible',
            'form'
        ],
        computed: {
            roleSelect: {
                get: function () {
                    return this.roles[this.form.role_id]
                },
                set: function (newValue) {
                    this.form.role_id = newValue
                }
            }
        },
        watch: {
            editVisible: function (newVal, oldVal) {
                if(newVal == true){
                    getRoleDicts({}).then(res => {
                        this.roles = res.data.lists
                    })
                }
            }
        },
        data(){
            return {
                roles: {},
                rules: {
                    role_id: [
                        { required: true, message: '请选择角色', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    realname: [
                        { required: true, message: '请输入真实姓名', trigger: 'blur' }
                    ],
                    mobile: [
                        {
                            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                            message: '手机号格式不对',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            closeEditDialog(){
                this.$emit('closeEditDialog')
            },
            submitForm(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        editUser({'form': this.form}).then(res => {
                            this.$message.success({
                                message: '修改用户成功',
                                type: 'success',
                            })
                            this.closeEditDialog();

                            this.$emit('refreshList')
                        });
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

</style>