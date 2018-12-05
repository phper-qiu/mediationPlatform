//index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    isMoving: false,
    currentAccelerometer: {
      x: 0,
      y: 0,
      z: 0
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getPhoneNumber (e) { 
    console.log(e.detail.errMsg) 
    console.log(e.detail.iv) 
    console.log(e.detail.encryptedData) 
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   });
    // });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('personal index index getUserInfo')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.startAccelerometer();
  },
  // 个人中心按钮获取登录授权
  getUserInfo: function (e) {
    console.log(e)
    util.login();
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  startAccelerometer(){
    const self = this;
    wx.onAccelerometerChange(function(res){
      console.log(res.x, res.y, res.z);
      const {x, y, z} = self.data.currentAccelerometer;

      if(Math.abs(res.x - x) > 0.1 || Math.abs(res.y - y) > 0.1 || Math.abs(res.z - z) > 0.1){
        self.setData({
          isMoving: true,
          currentAccelerometer: {
            x: res.x,
            y: res.y,
            z: res.z
          }
        })
      } else {
        self.setData({
          isMoving: false
        })
      }
    })
  },
  checkRegisterToNav: function(e){
    // 如果没有code 要登录失效 重新登录
    util.request(api.checkIsReg, { js_code: wx.getStorageSync('code') },'POST').then(function (res) {
      if (res.code == 200) {
        if(sub_code==301){
          var url = '/pages/personal/registerBind/index';
          wx.navigateTo({
            url: url
          });
        }else{
          wx.navigateTo({
            url: e.currentTarget.dataset.url
          })
        }
      }
    });

  }
})
