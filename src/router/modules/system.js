/**
 *  后台系统管理相关
 */
import User from '@/components/page/system/User.vue'
import Rule from '@/components/page/system/Rule.vue'
import Role from '@/components/page/system/Role.vue'
import SysLog from '@/components/page/system/SysLog.vue'

const route = [
    {
        name: 'system-user',
        path: '/system/user',
        component:  User,
        meta: { title: '系统用户' },
    },
    {
        name: 'system-rules',
        path: '/system/rules',
        component: Rule,
        meta: {title: '系统权限'},
    },
    {
        name: 'system-role',
        path: '/system/role',
        component:  Role,
        meta: { title: '系统角色' }
    },{
        name: 'system-log',
        path: '/system/sysLog',
        component:  SysLog,
        meta: { title: '后台日志' }
    }
]

export default route;
