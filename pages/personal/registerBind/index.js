//index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
//获取应用实例
var app = getApp()

// 倒计时60秒
var countdown = 60;
var settime = function (that) {
 if (countdown == 0) {
  that.setData({
   is_show: true
  })
  countdown = 60;
  return;
 } else {
  that.setData({
   is_show:false,
   last_time:countdown
  })
 
  countdown--;
 }
 setTimeout(function () {
  settime(that)
 }
  , 1000)
}

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
    last_time:'',
    is_show:true
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      uid: decodeURIComponent(options.uid),
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });

    this.startAccelerometer();
  },
   
  // 获取验证码
  getVerifyCodeInput: function (e) {
    this.setData({
      phone: e.detail.value
    });
    // this.getVerifyCode();
  },



  getVerifyCode: function (e) {
    let that = this;
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show)  //false
    })
    settime(that);
    util.request(api.getVerifyCode, { phone: that.data.phone },'POST').then(function (res) {
      if (res.code == 200) {
        that.setData({
          getVerifyCode: res.data
        });
      }
    });
  },
  // 注册绑定
  formSubmit: function(e) {
    let that = this;
    util.request(api.userLogin, { 
      phone: e.detail.value.phone,
      verifyCode: e.detail.value.verifyCode,
      tuid: wx.getStorageSync('tuid'),
      nick_name: that.data.userInfo.nickName,
      avatar: that.data.userInfo.avatarUrl,
      gender: that.data.userInfo.gender,
      is_login: 0
    },'POST').then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          // getVerifyCode: res.data
        });
        wx.navigateBack();
      }
    });
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
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
  }
})
