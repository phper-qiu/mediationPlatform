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
    // 星星评价
    // stars: [0, 1, 2, 3, 4],
    // normalSrc: '/images/star-no.png',
    // selectedSrc: '/images/star-full.png',
    // halfSrc: '/images/star-half.png',
    // key: 3,
    // scores: [0, 0, 0],

    evaluate_contant: ['评价条目一'],
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/images/star-no.png',
    selectedSrc: '/images/star-full.png',
    halfSrc: '/images/star-half.png',
    score: 0,
    scores: [0],


    winHeight:"",//窗口高度
    currentTab:0, //预设当前项的值
    scrollLeft:0, //tab标题的滚动条位置
    expertList:[{ //假数据
        img:"avatar.png",
        name:"欢顔",
        tag:"知名情感博主",
        answer:134,
        listen:2234
    }],
    shop_id:1,
    shop_name:''
  },

  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo: userInfo,
        shop_id: decodeURIComponent(options.shop_id),
        shop_name: decodeURIComponent(options.shop_name)
      });
    });

    this.startAccelerometer();


    //  高度自适应
    wx.getSystemInfo( {  
      success: function( res ) {  
        var clientHeight=res.windowHeight,
              clientWidth=res.windowWidth,
              rpxR=750/clientWidth;
        var  calc=clientHeight*rpxR-180;
          console.log(calc)
          that.setData( {  
              winHeight: calc  
          });  
        }  
    });
  },
  formSubmit: function(e) {
    let that = this;
    util.request(api.postShopComment, { shop_id: that.data.shop_id,uid: wx.getStorageSync('uid'),star: that.data.scores,content: e.detail.value.content,sub_subject: e.detail.value.sub_subject},'POST').then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          // getVerifyCode: res.data
        });
        wx.navigateBack();
      }
    });
  },
  // 滚动切换标签样式
  switchTab:function(e){
    this.setData({
        currentTab:e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav:function(e){
      var cur=e.target.dataset.current;
      if(this.data.currentTaB==cur){return false;}
      else{
          this.setData({
              currentTab:cur
          })
      }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor:function(){
    if (this.data.currentTab>4){
      this.setData({
        scrollLeft:300
      })
    }else{
      this.setData({
        scrollLeft:0
      })
    }
  },

  // 提交事件
  submit_evaluate: function () {
    console.log('评价得分' + this.data.scores)
  },
  
  //点击左边,半颗星
  selectLeft: function (e) {
    var score = e.currentTarget.dataset.score
    if (this.data.score == 0.5 && e.currentTarget.dataset.score == 0.5) {
      score = 0;
    }
    
    this.data.scores[e.currentTarget.dataset.idx] = score,
      this.setData({
      scores: this.data.scores,
      score: score
      })
  
  },
  
  //点击右边,整颗星
  selectRight: function (e) {
  var score = e.currentTarget.dataset.score
  
  this.data.scores[e.currentTarget.dataset.idx] = score,
    this.setData({
    scores: this.data.scores,
    score: score
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  footerTap:app.footerTap,  
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
