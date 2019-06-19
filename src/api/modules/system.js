import service from '../service'

export const login = params => {
    return service({
        url: 'api/system/user/login',
        method: "post",
        data: params
    });
};

// 修改用户密码
export const upUserPwd = params => {
    return service({
        url: 'api/system/user/upUserPwd',
        method: "post",
        data: params
    });
};
/**
 * 获取用户
 */
export const getUserLists = params => {
    return service({
        url: 'api/system/user/lists',
        method: "get",
        params: params
    });
};

/**
 * 创建用户
 * @param params
 * @returns {AxiosPromise}
 */
export const createUser = params => {
    return service({
        url: 'api/system/user/create',
        method: "post",
        data: params
    });
};

/**
 * 編輯用户
 * @param params
 * @returns {AxiosPromise}
 */
export const deleteUser = params => {
    return service({
        url: 'api/system/user/delete',
        method: "post",
        data: params
    });
};

/**
 * 編輯用户
 * @param params
 * @returns {AxiosPromise}
 */
export const editUser = params => {
    return service({
        url: 'api/system/user/edit',
        method: "post",
        data: params
    });
};

/**
 * 获取角色列表
 * @param params
 */
export const getRoleLists = params => {
    return service({
        url: 'api/system/role/lists',
        method: "get",
        params: params
    });
};

/**
 * 获取角色下拉
 * @param params
 */
export const getRoleDicts = params => {
    return service({
        url: 'api/system/role/dicts',
        method: "get",
        params: params
    });
};

/**
 * 编辑添加角色
 * @param params
 * @returns {AxiosPromise}
 */
export const editRole = params => {
    return service({
        url: 'api/system/role/edit',
        method: "post",
        data: params
    });
};

/**
 * 删除角色
 * @param params
 * @returns {AxiosPromise}
 */
export const delRole = params => {
    return service({
        url: 'api/system/role/delete',
        method: "post",
        data: params
    });
};

/**
 * 保存角色的权限
 * @param params
 */
export const saveRoleRules = params => {
    return service({
        url: 'api/system/role/saveRoleRules',
        method: "post",
        data: params
    });
};
/**
 * 获取角色的权限
 * @param params
 */
export const getRoleRulesTree = params => {
    return service({
        url: 'api/system/role/getRoleRulesTree',
        method: "get",
        params: params
    });
};

/**
 * 获取角色的菜单
 * @param params
 */
export const getRoleMenusTree = params => {
    return service({
        url: 'api/system/role/getRoleMenusTree',
        method: "get",
        params: params
    });
};

/**
 * 保存权限
 * @param params
 */
export const saveRule = params => {
    return service({
        url: 'api/system/rule/save',
        method: "post",
        data: params
    });
};

/**
 * 获取角色权限树
 * @param params
 */
export const getRuleTreeLists = params => {
    return service({
        url: 'api/system/rule/treeLists',
        method: "get",
        params: params
    });
};

/**
 * 删除权限
 * @param params
 * @returns {AxiosPromise}
 */
export const delRule = params => {
    return service({
        url: 'api/system/rule/delete',
        method: "post",
        data: params
    });
};

/**
 * 获取所有的路由
 * @param params
 */
export const allRoutes = params => {
    return service({
        url: 'api/system/rule/allRoutes',
        method: "get",
        params: params
    });
};

/**
 * 接口日志
 * @param params
 */
export const logLists = params => {
    return service({
        url: 'api/system/log/lists',
        method: "get",
        params: params
    });
};

/**
 * 接口日志
 * @param params
 */
export const logSysLog = params => {
    return service({
        url: 'api/system/log/sysLog',
        method: "get",
        params: params
    });
};