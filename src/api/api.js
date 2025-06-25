// api.js - 统一管理接口路径
export default {
  // 用户相关
  login: '/miniBOM/user/login',             // 登录
  updatePwd: '/miniBOM/user/updatePwd',     // 修改密码
  getUserInfo: '/miniBOM/user/info',        // 获取用户信息
  register: '/miniBOM/user/register',

  // 分类管理相关接口
  categoryCreate: '/category/create',        // 新增分类
  categoryList: '/category/list',            // 查询分类列表
  categoryUpdate: '/category/update',        // 修改分类
  categoryDelete: '/category/delete',        // 删除分类（需要拼接 code）

  // BOM管理相关接口
  bomCreate: '/miniBOM/BOM/create',                    // 创建 BOMLink
  bomCreatePart: '/miniBOM/BOM/createPart',      // 创建 BOMLink 并创建子 Part
  bomUpdate: '/miniBOM/BOM/update',                    // 修改 BOM 信息
  bomShow: '/miniBOM/BOM/show',                        // 展示所有子 Part
  bomShowFather: '/miniBOM/BOM/showFather',            // 展示父部件
  bomShowRoot: '/miniBOM/BOM/showRoot',                // 展示根部件完整清单
  bomDelete: '/miniBOM/BOM/delete',                    // 删除 BOMLink 或子 Part

  // 属性管理相关接口
  attributeCreate: '/attribute/create',
  attributeList: '/attribute/list',
  attributeUpdate: '/attribute/update',
  attributeDelete: '/attribute/delete',
  
  // 零件管理相关接口
  partCreate: '/part/create',
  partList: '/part/list',
  partUpdate: '/part/update',
  partDelete: '/part/delete',
  partDetail: '/part/detail'
};
