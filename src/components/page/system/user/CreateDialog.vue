<template>
    <section>
        <!-- 添加弹出框 -->
        <el-dialog title="添加用户" :visible.sync="createVisible" :before-close="closeCreateDialog" width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="请选角色" >
                        <el-option  v-for="(name, index) in roles" :key="index" :label="name" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repeat_password">
                    <el-input v-model="form.repeat_password" type="password"></el-input>
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
                <el-button @click="closeCreateDialog">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import { createUser, getRoleDicts } from '@/api/modules/system'

    export default {
        name: "UserCreateDialog",
        props: [
            'createVisible'
        ],
        watch: {
            createVisible: function (newVal, oldVal) {
                if(newVal == true){
                    getRoleDicts({}).then(res => {
                        this.roles = res.data.lists
                    })
                }
            }
        },
        data() {
            return {
                roles: {},
                form: {
                    status: 1,
                    username: '',
                    role_id: '',
                    password: '',
                    repeat_password: '',
                    realname: '',
                    email: '',
                    mobile: ''
                },
                rules: {
                    role_id: [
                        { required: true, message: '请选择角色', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                    ],
                    repeat_password: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: this.checkPass, trigger: 'blur' }
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
        methods:{
            closeCreateDialog(){
              this.$emit('closeCreateDialog')
            },
            submitForm(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        createUser({'form': this.form}).then(res => {
                            this.$message.success({
                                message: '添加用户成功',
                                type: 'success',
                            })
                            this.closeCreateDialog();

                            this.$emit('refreshList')
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            checkPass(rule, value, callback) {
                if (value === '') {
                    callback(new Error('请输入确认密码'));
                } else {
                    if (this.form.repeat_password !== this.form.password) {
                        callback(new Error('两次密码不一致'));
                    }
                    callback();
                }
            }
        }
    }
</script>

<style scoped>

</style>