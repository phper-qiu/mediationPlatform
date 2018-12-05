// var api = require('../../config/api.js');
import testData from '../../utils/testData.json.js';
var util = require('../../utils/util.js');
var api = require('../../config/api.js');


var app = getApp()
Page({
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: ['托儿所/兴趣班','小学辅导','初中辅导','高中辅导','职业素养','教育','杭州'],
    historyKeyword: ['托儿所/兴趣班','小学辅导','初中辅导','高中辅导','职业素养','教育','杭州'],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: '0',
    currentSortOrder: 'desc',
    categoryId: 0,
    items: [],
    latitude:'',
    longitude:'',
  },
  onLoad: function (options) {
    var page = this;
    var res = new Object();
    res.data = testData;
    page.setData({
      items: res.data.items,
      latitude: decodeURIComponent(options.latitude),
      longitude: decodeURIComponent(options.longitude)
      // items: app.globalData.urlAddress
    });
    // this.getSearchKeyword();
  },
  // 获取店铺列表
  getGoodsList: function () {
    let that = this;
    util.request(api.getShopList, { user_lng:that.data.longitude,user_lat:that.data.latitude,search_name: that.data.keyword, arrange_id	: that.data.currentSortType, sort: that.data.currentSortOrder, category_id: that.data.categoryId },'POST').then(function (res) {
      if (res.code == 200) {
        that.setData({
          searchStatus: true,
          categoryFilter: false,
          goodsList: res.data.shop_list,
          filterCategory: res.data.filterCategory,
        });
      }else{
        that.setData({
          searchStatus: true,
          goodsList: [],
        });
      }
      console.log(that.data.searchStatus)
      console.log(that.data.goodsList)
      //重新获取关键词
      // that.getSearchKeyword();
    });
  },
  // 点击排序
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    let tmpSortOrder = '0';
    //0降序desc，1升序asc
    switch (currentId) {
      case 'distanceFilter':
        // 距离
        if (this.data.currentSortOrder == '0') {
          tmpSortOrder = '1';
        }
        this.setData({
          'currentSortType': '1',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      case 'popularSort':
        // 人气
        if (this.data.currentSortOrder == '0') {
          tmpSortOrder = '1';
        }
        this.setData({
          'currentSortType': '2',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      case 'starFilter':
        // 口碑
        if (this.data.currentSortOrder == '0') {
          tmpSortOrder = '1';
        }
        this.setData({
          'currentSortType': '3',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false,
        });
        this.getGoodsList();
        break;
      default:
        //综合排序
        if (this.data.currentSortOrder == '0') {
          tmpSortOrder = '1';
        }
        this.setData({
          'currentSortType': '0',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
 

  getSearchKeyword() {
    let that = this;
    util.request(api.SearchIndex).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          historyKeyword: res.data.historyKeywordList,
          defaultKeyword: res.data.defaultKeyword,
          hotKeyword: res.data.hotKeywordList
        });
      }
    });
  },

  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    this.getHelpKeyword();
  },
  getHelpKeyword: function () {
    let that = this;
    util.request(api.SearchHelper, { keyword: that.data.keyword }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          helpKeyword: res.data
        });
      }
    });
  },
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword();
    }
  },
  clearHistory: function () {
    this.setData({
      historyKeyword: []
    })

    util.request(api.SearchClearHistory, {}, 'POST')
      .then(function (res) {
        console.log('清除成功');
      });
  },
  
  onKeywordTap: function (event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
  getSearchResult(keyword) {
    console.log(keyword)
    console.log(333333)
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },
  
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    console.log(2222)
    console.log(filterCategory)
    console.log(2222)
    // return
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.id,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  },
  //点击跳转到详细页面
  tapItem: function (event) {

    var dataset = event.currentTarget.dataset;
    var url = '/pages/shop/detail/detail?';
    var ary = new Array();
    if (dataset.fdname != null) {
      ary.push("fdBaseName=" + dataset.fdname);
    }

    ary.forEach(function (val, index, ary) {
      url += val + '&';
    });
    url = url.substring(0, url.lastIndexOf('&'));

    wx.navigateTo({
      url: url
    })
  },
})