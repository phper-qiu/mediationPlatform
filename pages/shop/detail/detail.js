// pages/detail/detail.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fdHeadTeacherPhone: '',
    basePhotos: [],
    paintingPhotos: [],
    fdLongitude:0,
    fdLatitude:0,
    urlAddress:'',
    marginValue:0,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/images/star-no.png',
    selectedSrc: '/images/star-full.png',
    halfSrc: '/images/star-half.png',
    key: 5,
    scrollLeft: 0,
    id: "",
    menuid:"",
    typeList: [
      {
        categoryId: 1,
        categoryName: "基础信息",
        menuid:"shopInfoBase"
      },
      {
        categoryId: 2,
        categoryName: "师资介绍",
        menuid:"teacherInfo"
      },
      {
        categoryId: 3,
        categoryName: "学习环境",
        menuid:"learnInfo"
      },
      {
        categoryId: 4,
        categoryName: "学员评价",
        menuid:"shopScoreInfo"
      }
    ],
    shopInfo:[],
    shopTeacher:[],
    shopLearnEnv:[],
    shopComments:[],
    shopMainPics:[],
    categoryArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    page.setData({
      user_latitude: decodeURIComponent(options.latitude),
      user_longitude: decodeURIComponent(options.longitude),
    });
    

    util.request(api.getShopOrganization, {shop_id:decodeURIComponent(options.shopid),user_lat:page.data.user_latitude,user_lng:page.data.user_longitude},'POST').then(function (res) {
      if (res.code == 200) {
        page.setData({
          shopInfo: res.data
        });
      }
    });
    util.request(api.getShopTeacher, {shop_id:decodeURIComponent(options.shopid),user_lat:page.data.user_latitude,user_lng:page.data.user_longitude},'POST').then(function (res) {
      if (res.code == 200) {
        page.setData({
          shopTeacher: res.data
        });
      }
    });
    util.request(api.getShopLearnEnv, {shop_id:decodeURIComponent(options.shopid),user_lat:page.data.user_latitude,user_lng:page.data.user_longitude},'POST').then(function (res) {
      if (res.code == 200) {
        page.setData({
          shopLearnEnv: res.data
        });
      }
    });
    util.request(api.getShopComments, {shop_id:decodeURIComponent(options.shopid),user_lat:page.data.user_latitude,user_lng:page.data.user_longitude},'POST').then(function (res) {
      if (res.code == 200) {
        page.setData({
          shopComments: res.data
        });
      }
    });
    util.request(api.getShopMainPics, {shop_id:decodeURIComponent(options.shopid)},'POST').then(function (res) {
      if (res.code == 200) {
        page.setData({
          shopMainPics: res.data
        });
      }
    });
    util.request(api.getShopCategory, {},'POST').then(function (res) {
      if (res.code == 200) {
        var categoryArrayTmp =  res.data
        var categoryTmp = []
        for(var i in categoryArrayTmp){
          categoryTmp[categoryArrayTmp[i].category_id] = categoryArrayTmp[i]
        }
        page.setData({
          categoryArray: categoryTmp
        });
      }
    });
   

    var query = wx.createSelectorQuery()
    query.select('#img').boundingClientRect(function(rect){
      var r = 1242/rect.width;
      var h = 520/r;
      page.setData({
        marginValue:h
      });
      
    }).exec();

    //动态的设置页面的标题
    // wx.setNavigationBarTitle({
    //   title: decodeURIComponent(options.fdBaseName)//页面标题为基地的名称
    // })
    

    var app = getApp();
    this.setData({
      urlAddress: app.globalData.urlAddress
    });

    this.setData({
      shopid: decodeURIComponent(options.shopid),
      fdAddress: decodeURIComponent(options.fdAddress),
      fdLongitude: parseFloat(options.fdLongitude),
      fdLatitude: parseFloat(options.fdLatitude),
      fdBaseThumbImg: decodeURIComponent(options.fdBaseThumbImg),
      fdHeadTeacherPhone:options.fdHeadTeacherPhone,
      fdHeadTeacher: decodeURIComponent(options.fdHeadTeacher),
      basePhotos: options.basePhotos ? decodeURIComponent(options.basePhotos).split(',') : new Array(),
      paintingPhotos:options.paintingPhotos ? decodeURIComponent(options.paintingPhotos).split(',') : new Array()

    });
  },
  
  //点击跳转到全部评论页面
  tapAllComments: function (event) {
    var dataset = event.currentTarget.dataset;
    var url = '/pages/shop/comment/index?';
    var ary = new Array();
    if (dataset.shopid != null) {
      ary.push("shopid=" + dataset.shopid);
    }

    ary.forEach(function (val, index, ary) {
      url += val + '&';
    });
    url = url.substring(0, url.lastIndexOf('&'));
    wx.navigateTo({
      url: url
    })
  },
 
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  /**
   * 点击图片 进行展示
   */
  clickImg: function (event) {
    //获取图片 的url 
    var imgId = event.currentTarget.id;
    var imgSrc = '';
    var srcAry = [];
    var ary = imgId.split('-');

    if (imgId.indexOf('paintingPhotos') > -1) {
      //作品照片 获取照片的url
      srcAry = this.data.paintingPhotos;
    } else {
      //基地照片 获取照片的url
      srcAry = this.data.basePhotos;
    }
    var dex = parseInt(ary[ary.length - 1]);

    imgSrc = srcAry[dex];

    //console.log(imgSrc);

    wx.previewImage({
      current: imgSrc, // 当前显示图片的http链接
      urls: srcAry
    })
  },
  /*设置分享页面的信息 */
  onShareAppMessage: function () {
    return {
      title: this.data.fdBaseName
    };
  },
  // /**
  //  * 点击位置 显示地图的信息
  //  */
  // showLocation: function (event) {
  //   var page = this;
  //   console.log(page.data)
  //   wx.openLocation({
  //     latitude: parseFloat(page.data.shopInfo.latitude),
  //     longitude: parseFloat(page.data.longitude),
  //     name: page.data.shopInfo.shop_name,
  //     address: page.data.shopInfo.address,
  //     scale: 15,
  //     complete: function () {
  //       wx.hideLoading();
  //     }
  //   });
  // },
  /**
   * 点击电话 调用电话
   */
  callPhone: function (event) {
    var fdHeadTeacherPhone = this.data.fdHeadTeacherPhone;
    
    //判断电话是否可用
    if (fdHeadTeacherPhone != null){
      wx.makePhoneCall({
        phoneNumber: fdHeadTeacherPhone
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('#tab-con').boundingClientRect(function (res) {
      that.setData({
        tabScrollTop: res.top+10   //什么时候显示头部菜单栏 根据实际需求加减值
      })
    }).exec()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    if (e.detail.scrollTop > this.data.tabScrollTop) {
      this.setData({
        tabFixed: true
      })
    } else {
      this.setData({
        tabFixed: false
      })
    }
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop > this.data.tabScrollTop) {
      this.setData({
        tabFixed: true
      })
    } else {
      this.setData({
        tabFixed: false
      })
    }
  },
  //切换产品类别
  switchNav: function (e) {
    const { offsetLeft } = e.currentTarget;
    const { id, index, menuid } = e.currentTarget.dataset;
    var clientX = e.detail.x;
    if (this.data.id == e.currentTarget.dataset.id) {
      return false;
    }
    if (clientX < 60) {
      this.setData({
        scrollLeft: offsetLeft - 60
      });
    } else if (clientX > 330) {
      this.setData({
        scrollLeft: offsetLeft
      });
    }
    this.setData({
      id: id,
      menuid: menuid,
    });
    console.log(this)
  },
  //快速拨打电话号码
  quickCall: function (event) {
    var phone = event.currentTarget.dataset.phone;
    util.request(api.checkIsReg, { js_code: wx.getStorageSync('code') },'POST').then(function (res) {
      if (res.code == 200) {
        if(sub_code==301){
          var url = '/pages/personal/registerBind/index';
          wx.navigateTo({
            url: url
          });
        }else{
          //判断电话号码是否可用
          if (phone != null) {
            wx.makePhoneCall({
              phoneNumber: phone
            })
          }
        }
      }
    });
  },
})