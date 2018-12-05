//index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

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
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/star-no.png',
    selectedSrc: '../../images/star-full.png',
    halfSrc: '../../images/star-half.png',
    key: 5,
    commentList:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    util.request(api.getMyComments, { uid: wx.getStorageSync('uid') }, 'POST').then(function (res) {
      if (res.code == 200) {
        that.setData({
          commentList: res.data.comment_list
        });
      }
    });

    this.startAccelerometer();
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
