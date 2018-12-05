//location.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
var app = getApp();
import testData from '../../utils/testData.json.js';
Page({
  
  data: {
    cityName: '厦门',
    lastLatitude: 0,
    lastLongitude: 0,
    latitude: 39.8965675777,
    longitude: 116.4028930664,
    urlAddress: '',
    markers: [],
    limit: 15,
    controls: [{
      id: 'move-center',
      iconPath: '/images/map-location.png',
      position: {
        left: 10,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    items: [],
    isLoading: false,
    searchResList:[]
  },
  onLoad: function (options) {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
        key: 'YIFBZ-3KY3F-BMNJ5-JH4AX-SLBQT-GNFLY'
    });

    var page = this;
   
    var app = getApp();

    page.setData({
      urlAddress: app.globalData.urlAddress,
      /*设置加载中 的状态 */
      isLoading: true,
      items: [],
      cityName: decodeURIComponent(options.cityName),
    });
    
    wx.setStorageSync('cityName', page.data.cityName);

    this.searchLocation()
    //设置地图的中心点
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        page.setData({
          latitude: latitude,
          longitude: longitude
        });

        //请求周围的数据点
        wx.request({
          url: page.data.urlAddress,
          data: {
            fdLatitude: page.data.latitude,
            fdLongitude: page.data.longitude,
            limit: page.data.limit
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {

          },
          complete: function () {
            var res = new Object();
            res.data = testData.items;
            //改变坐标时候调用
            page.changeMarks(res, page);
          }

        })

      }
    });

  },
  onShow: function () {
    this.searchLocation()
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('mapList');
    var page = this;

    //查询page  的Map 的宽高
    wx.createSelectorQuery().select('#mapList').fields({
      size: true,
    }, function (res) {

      //定义一个 地图指示针在地图的中央
      var needle = [
        {
          id: 'move-center',
          iconPath: '/images/location3.jpg',
          position: {
            left: res.width / 2 - 10,
            top: res.height / 2 - 40,
            width: 20,
            height: 40
          },
          clickable: false
        }
      ];

      //设置地图的控件
      page.setData({
        controls: page.data.controls.concat(needle)
      });
    }).exec();

  },
  // 打开城市选择页面
  bindOpenCity() {
    wx.navigateTo({
      url: '../city/index'
    });
  },

  // 搜索框输入 并把地图定位
  searchMap(e){
    let likestr = e.detail.value;
    console.log(likestr)
    var that = this;
    // 调用接口
    qqmapsdk.geocoder({
      address: likestr,
      success: function (res) {
        console.log(res);
        that.setData({
          searchResList: res.data,
          cityName: res.result.address_components.city,
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        });
      },
      fail: function (res) {
          console.log(res);
      },
      complete: function (res) {
          console.log(res);
      }
    });
  },
   // 搜索框输入 并把地图定位
   searchLocation(){
     var that = this
    let likestr = that.data.cityName;
    console.log(likestr)
    var that = this;
    // 调用接口
    qqmapsdk.geocoder({
      address: likestr,
      success: function (res) {
        that.setData({
          searchResList: res.data,
          cityName: res.result.address_components.city,
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        });
      },
      fail: function (res) {
          console.log(res);
      },
      complete: function (res) {
          console.log(res);
      }
    });
  },
  

  changeMarks: function (res, page) {//统一调用的设置坐标点的方法

    //解析后台json数据 添加 markers
    var dex = 0;
    var items = res.data;
    //保存数据
    page.items = items;
    page.setData({
      items: items,
      isLoading: false
    });
    var ary = new Array();

    for (dex; dex < items.length; dex++) {
      var base = items[dex];
      var item = {
        id: dex,
        name: base.fdName,
        latitude: base.fdLatitude,
        longitude: base.fdLongitude,
        iconPath: '/images/location2.png',//橙色的效果
        width: 35,
        height: 35
      }
      ary.push(item);
    }
    page.setData({
      markers: ary
    });
  },
  // 点击 附近的地址
  tapItem: function (event) {

    var dataset = event.currentTarget.dataset;
    app.searchLocation = {latitude: dataset.latitude,longitude:dataset.longitude}
    var url = '/pages/index/index';
    wx.switchTab({
      url: url
    })
  },
  
  //点击 瞄准的控件 地图视野回归初始的中心位置
  controltap: function (event) {
    if (event.controlId == 'move-center') {
      wx.createMapContext('mapList').moveToLocation();
    }
  },
  markertap: function (event) {

  },
  //气泡的点击事件 当前版本注释掉点击事件
  callouttap: function (event) {
    var base = this.items[parseInt(event.markerId)];

    //拼接URL 和 参数 
    wx.navigateTo({
      url: '/pages/shop/detail/detail?fdBaseThumbImg=' + base.fdBaseThumbImg + '&fdBaseName=' + base.fdName + '&fdAddress=' + base.fdAddress + '&fdHeadTeacher=' + base.fdHeadTeacher + '&fdHeadTeacherPhone=' + base.fdHeadTeacherPhone + '&paintingPhotos=' + base.paintingPhotos + '&basePhotos=' + base.basePhotos + '&fdLongitude=' + base.fdLongitude + '&fdLatitude=' + base.fdLatitude
    })
  },
  //视野发生改变调用
  regionchange: function (event) {
    var page = this;
    if (event.type == 'end') {
      var map = wx.createMapContext("mapList");
      var items = [];
      map.getCenterLocation({
        success: function (res) {

          //视野发生改变确定经纬度是否改变
          if (res.latitude != page.data.lastLatitude && res.longitude != page.data.lastLongitude) {
            //记录本次移动的经纬度
            page.setData({
              lastLatitude: res.latitude,
              lastLongitude: res.longitude,
              /* 设置加载状态*/
              isLoading: true,
              items: []
            });
            
            // 调用接口
            qqmapsdk.search({
              keyword:'培训机构',
              location: res.latitude+","+res.longitude,  //设置周边搜索中心点
              success: function (res) {
                page.setData({
                  searchResList: res.data
                });
              },
              fail: function (res) {
                console.log(res);
              },
              complete: function (res) {
                  console.log(res);
              }
              
            });
            //请求周围的基地信息
            wx.request({
              url: page.data.urlAddress,
              data: {
                fdLatitude: page.data.lastLatitude,
                fdLongitude: page.data.lastLongitude,
                limit: page.data.limit
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {

              },
              complete: function () {
                //改变坐标时候调用
                var res = new Object();
                res.data = testData.items;
                page.changeMarks(res, page);
              }
            })

          }

        },
        complete: function () {
        }
      });
    }
  }
})
