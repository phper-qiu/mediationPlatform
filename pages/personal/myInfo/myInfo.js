// pages/personal/myInfo.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalInfo:[],
    birthday:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    util.request(api.getPersonalInfo, {uid: wx.getStorageSync('uid')},'POST').then(function (res) {
      if (res.code == 200) {
        that.setData({
          personalInfo: res.data,
          birthday:res.data.birthday
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindDateChange: function (e) {
    console.log('bindDateChange', e.detail)
    this.setData({
      birthday: e.detail.value
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    let that = this;
    console.log('form发生了submit事件，携带数据为：', that.data)
    util.request(api.postPersonalInfo, { 
      uid: wx.getStorageSync('uid'),
      nick_name: e.detail.value.nick_name,
      birthday:  that.data.birthday
    },'POST').then(function (res) {
      if (res.code == 200) {
        that.setData({
          // getVerifyCode: res.data
        });
        wx.navigateBack();
      }
    });
  },
  formReset: function() {
    console.log('form发生了reset事件')
  }
})