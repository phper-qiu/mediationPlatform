const ApiRootUrl = 'http://qimiaoadmintest.com:8888';
// const ApiRootUrl = 'https://www.qmxqedu.com';

module.exports = {
  // 首页
  getShopList: ApiRootUrl + '/api/shop/getShops',//获取商铺列表
  getSwiperImage: ApiRootUrl + '/api/adv/getAdvs',//获取首页轮播图

  // 个人信息页
  getPersonalInfo: ApiRootUrl + '/api/user/getPersonalInfo',//获取个人信息 
  postPersonalInfo: ApiRootUrl + '/miniApi/User/postPersonalInfo',//上传个人信息
  getVerifyCode: ApiRootUrl + '/api/msg/sendCode',//获取验证码
  getMyComments: ApiRootUrl + '/miniApi/User/getMyComments',//获取我的评论
  modifyPhone: ApiRootUrl + '/miniApi/User/modifyPhone',//更换手机号接口
  checkIsReg: ApiRootUrl + '/miniApi/User/checkUserIsReg',//用户是否注册
  userLogin: ApiRootUrl + '/miniApi/User/login',//用户登录注册
  

  getShopOrganization: ApiRootUrl + '/api/shop/getShopOrganization',//获取店铺详情
  getShopTeacher: ApiRootUrl + '/api/shop/getShopFaculty',//获取师资力量
  getShopLearnEnv: ApiRootUrl + '/api/shop/getShopEnv',//获取教学环境
  getShopComments: ApiRootUrl + '/api/shop/getShopEvaluates',//获取店铺全部评论
  getShopMainPics: ApiRootUrl + '/api/shop/getShopPics',//获取店铺主图
  getShopCategory: ApiRootUrl + '/api/shop/getShopCategory',//获取全部类目
  postShopComment: ApiRootUrl + '/api/shop/postShopComment',//上传评论


  uploadImage: ApiRootUrl + '/api/Img/uploadImg',//上传图片

  
  postShopBaseInfo: ApiRootUrl + '/api/shop/postShopOrganization',//上传机构信息
  postShopEnv: ApiRootUrl + '/api/shop/postShopEnv',//上传学习环境
  postShopTeacher: ApiRootUrl + '/api/shop/postShopFaculty',//上传师资力量
  postShopMainPics: ApiRootUrl + '/api/shop/postShopPic',//上传店铺主图
  
  delShopLearnEnv: ApiRootUrl + '/api/shop/delShopEnv',//删除学习环境
  delTeacher: ApiRootUrl + '/api/shop/delFaculty',//删除师资力量
};