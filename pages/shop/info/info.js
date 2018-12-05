// pages/shop/shopInfo.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var QQMapWX = require('../../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    date: '',
    category_id:'',
    region: [],
    categoryArray: [],
    categoryShow:[],
    shopInfo:[],
    shopLearnEnv: [],
    shopTeacher:[],
    shopMainPics:[],
    otherPics:[],
  },
  onLoad: function() {  
    var that = this; 
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'YIFBZ-3KY3F-BMNJ5-JH4AX-SLBQT-GNFLY'
    });

    util.request(api.getShopOrganization, {uid:wx.getStorageSync('uid')},'POST').then(function (res) {
      if (res.code == 200) {
        that.setData({
          shopInfo: res.data,
          date: res.data.reg_date,
          shop_id:res.data.shop_id,
          category_id:res.data.category_id,
        });
        util.request(api.getShopTeacher, {shop_id:that.data.shop_id},'POST').then(function (res) {
          if (res.code == 200) {
            that.setData({
              shopTeacher: res.data
            });
          }
        });
        util.request(api.getShopLearnEnv, {shop_id:that.data.shop_id},'POST').then(function (res) {
          if (res.code == 200) {
            that.setData({
              shopLearnEnv: res.data
            });
          }
        });
        util.request(api.getShopMainPics, {shop_id:that.data.shop_id},'POST').then(function (res) {
          if (res.code == 200) {
            that.setData({
              shopMainPics: res.data,
              otherPics: res.data.other,
            });
          }
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
        that.setData({
          categoryShow: categoryTmp
        });

        that.setData({
          categoryArray: res.data
        });
      }
    });


        // 调用接口
    // qqmapsdk.getDistrictByCityId({
    //       id: '350200', // 对应城市ID
    //       success: function(res) {
    //           console.log(res);
    //       },
    //       fail: function(res) {
    //           console.log(res);
    //       },
    //       complete: function(res) {
    //           console.log(res);
    //       }
    //   });
    // qqmapsdk.getCityList({
    //         success: function(res) {
    //             console.log(res);
    //         },
    //         fail: function(res) {
    //             console.log(res);
    //         },
    //         complete: function(res) {
    //             console.log(res);
    //         }
    //   });

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
 
  // 学习环境 标题输入
  inputBlur:function(e){
    var that = this//获取上下文
    var shopLearnEnv = that.data.shopLearnEnv
    var index = e.currentTarget.dataset.index
    shopLearnEnv[index].title = e.detail.value
  },

  // 教师力量 新增按钮
  usekey_addnewdata:function (){
		var self = this;
  	self.userkey_id++;
  	//要增加的数组
  	var newarray = [{
  			name:'',
  	}];
		this.data.shopTeacher = newarray.concat(this.data.shopTeacher);
  	this.setData({
  		'shopTeacher':	this.data.shopTeacher
  	});
  },
  
  
  // 保存店铺基本信息
  formSubmitShopInfo: function(e) {
    console.log(e.detail)
    let that = this;
    var formData = e.detail.value
    util.request(api.postShopBaseInfo, 
      {
        uid: wx.getStorageSync('uid'),
        shop_name: formData.shop_name,
        shop_title: formData.shop_title,
        category_id: that.data.category_id,
        reg_date: that.data.date,
        province_name: that.data.region[0],
        city_name: that.data.region[1],
        district_name: that.data.region[2],
        mobile_phone: formData.mobile_phone,
        address: formData.address,
        contact: formData.contact,
        tell_phone: formData.tell_phone,
        wx_no: formData.wx_no,
        teacher_num: formData.teacher_num,
        subject_num: formData.subject_num,
      },
      'POST').then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          // getVerifyCode: res.data
        });
        wx.navigateBack();
      }
    });
  },
  
  // 师资力量 标题输入
  inputTeacherBlur:function(e){
    var that = this//获取上下文
    var shopTeacher = that.data.shopTeacher
    var index = e.currentTarget.dataset.index
    var title = e.currentTarget.dataset.title
    shopTeacher[index][title] = e.detail.value
    
    console.log(shopTeacher)
  },
  // 保存店铺师资力量
  formSubmitShopTeacher: function(e) {
    let that = this;
    util.request(api.postShopTeacher, 
      {
        shop_id: that.data.shop_id,
        faculty: JSON.stringify(that.data.shopTeacher),
      },
      'POST').then(function (res) {
      if (res.code == 200) {
        that.setData({
          // getVerifyCode: res.data
        });
        wx.navigateBack();
      }
    });
  },
  // 保存店铺环境
  formSubmitShopEnv: function(e) {
    let that = this;
    // var formData = e.detail.value
    console.log(444444)
    console.log(e)
    util.request(api.postShopEnv, 
      {
        shop_id: that.data.shop_id,
        env: JSON.stringify(that.data.shopLearnEnv),
      },
      'POST').then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          // getVerifyCode: res.data
        });
        wx.navigateBack();
      }
    });
  },
  // 保存店铺主图
  formSubmitShopImage: function(e) {
    let that = this;
    util.request(api.postShopMainPics, 
      {
        shop_id: that.data.shop_id,
        cover_pic: that.data.shopMainPics.cover_pic,
        other: JSON.stringify(that.data.otherPics),
      },
      'POST').then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          // getVerifyCode: res.data
        });
        wx.navigateBack();
      }
    });
  },
  // 选择图片
  chooseImage: function (e) { 
    var that = this; 
    var currentImageArray = e.currentTarget.dataset.imagetype
    var index = e.currentTarget.dataset.index
    wx.chooseImage({ 
     count: 3, 
     success: function (res) { 
      //缓存下 
      wx.showToast({ 
       title: '正在上传...', 
       icon: 'loading', 
       mask: true, 
       duration: 2000, 
       success: function (ress) { 
        console.log('成功加载动画'); 
       } 
      }) 
      that.setData({ 
       imageList: res.tempFilePaths 
      }) 
      //获取第一张图片地址 
      var filep = res.tempFilePaths 
        //把选择的图片 添加到集合里
        for (var i in filep) {
          //向服务器端上传图片 
          wx.uploadFile({ 
            url: api.uploadImage, 
            filePath: filep[i], 
            name: 'file', 
            formData: { 
            'user': 'test'
            }, 
            success: function (res) { 
            var sss= JSON.parse(res.data) 
            var pic_url = sss.data.pic_url; 
            //输出图片地址 
            if(currentImageArray=='env'){
              var shopLearnEnv = that.data.shopLearnEnv
              var tempEnv = {}
              tempEnv.pic = pic_url
              shopLearnEnv.push(tempEnv)
              that.setData({ 
                shopLearnEnv: shopLearnEnv 
              })
            }
            if(currentImageArray=='teacher'){
              var shopTeacher = that.data.shopTeacher
              shopTeacher[index]['pic'] = pic_url
              that.setData({ 
                shopTeacher: shopTeacher 
              })
            }
            if(currentImageArray=='main'){
              var cover_pic = {}
              cover_pic.cover_pic = pic_url
              that.setData({ 
                shopMainPics: cover_pic 
                })
            }
            if(currentImageArray=='other'){
              var otherPic = that.data.otherPics
              otherPic.push(pic_url)
              that.setData({ 
                otherPics: otherPic 
              })
            }
            }, fail: function (err) { 
              console.log(err) 
            }  
          }); 
        }
     } 
    }) 
   }, 
   // 预览图片
   previewImage: function (e) { 
    var current = e.target.dataset.src 
    wx.previewImage({ 
     current: current, 
     urls: this.data.imageList 
    }) 
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
  
  bindCategoryChange: function(e) {
    console.log('bindCategoryChange', e.detail)
    this.setData({
      category_id: this.data.categoryArray[e.detail.value].category_id
    })
    console.log('bindCategoryChange category_id', this.data.category_id)
  },
  bindDateChange: function (e) {
    console.log('bindDateChange', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      region: e.detail.value
    })
  },
  // 删除图片 不显示那张图片 去掉数组里的对应值
  clearImg:function(e){
    console.log('clearImg，携带值为', e)
    var that = this
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.cleartype
    switch (type) {
      case 'env':
        that.data.shopLearnEnv.splice(index,1);
        that.setData({
          shopLearnEnv:that.data.shopLearnEnv
        });
        break;
      case 'teacher':
        that.data.shopTeacher.splice(index,1);
        that.setData({
          shopTeacher:that.data.shopTeacher
        });
        break;
      case 'main':
        that.setData({
          shopMainPics:[]
        });
        break;
      case 'other':
        that.data.otherPics.splice(index,1);
        that.setData({
          otherPics:that.data.otherPics
        });
        break;
    }
   
  },
  //点击上传事件
  // uploadimage: function (e) {
  //   var page = this
  //   var shopLearnEnv = page.data.shopLearnEnv
  //   //循环把图片上传到服务器 并显示进度      
  //   for (var j in shopLearnEnv) {
  //     if (shopLearnEnv[j]['upload_percent'] == 0) {
  //       this.upload_file_server(page, shopLearnEnv, j,e.detail.value)
  //     }
  //   }
  // },
  //  //选择图片方法
  // uploadpic: function (e) {
  //   var that = this//获取上下文
  //   var shopLearnEnv = that.data.shopLearnEnv
  //   console.log(e)
  //   //选择图片
  //   wx.chooseImage({
  //     count: 3, // 默认9，这里显示一次选择相册的图片数量
  //     sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有  
  //     sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFiles = res.tempFiles
  //       //把选择的图片 添加到集合里
  //       for (var i in tempFiles) {
  //         tempFiles[i]['upload_percent'] = 0
  //         tempFiles[i]['path_server'] = ''
  //         shopLearnEnv.push(tempFiles[i])
  //       }
  //       //显示
  //       that.setData({
  //         shopLearnEnv: shopLearnEnv,
  //       })
  //       console.log('shopLearnEnv start')
  //       console.log(shopLearnEnv)
  //       console.log('shopLearnEnv end')
  //     }
  //   })
  // },
  //上传方法
  // upload_file_server(that, shopLearnEnv, j) {
  //   console.log("开始上传" + j + "图片到服务器：")
  //   //上传返回值
  //   var upload_task = wx.uploadFile({
  //     url: api.uploadImage,//需要用HTTPS，同时在微信公众平台后台添加服务器地址  
  //     filePath: shopLearnEnv[j]['path'], //上传的文件本地地址    
  //     name: 'file',
  //     formData: {
  //       'num': j,
  //       // 'datetime': datetime,
  //       // 'date': date
  //     },
  //     //附近数据，这里为路径    
  //     success: function (res) {
  //       var data = JSON.parse(res.data)
  //       //字符串转化为JSON  
  //       if (data.code == 200) {
  //         console.log('OK')
  //         //var filename = "http://127.0.0.1:8095/" + data.file//存储地址 显示
  //         var filename = data.data.pic_url//存储地址 显示
  //         shopLearnEnv[j]['pic'] = filename
  //       } else {
  //         var filename = "http://127.0.0.1:8095/xx.png"//错误图片 显示
  //         shopLearnEnv[j]['path_server'] = filename
  //       }
  //       that.setData({
  //         shopLearnEnv: shopLearnEnv,
  //       })
       
  //       that.formSubmitShopEnv(JSON.stringify(shopLearnEnv))
  //     }
  //   })
  //   //上传 进度方法
  //   upload_task.onProgressUpdate((res) => {
  //     shopLearnEnv[j]['upload_percent'] = res.progress
  //     //console.log('第' + j + '个图片上传进度：' + shopLearnEnv[j]['upload_percent'])
  //     //console.log(shopLearnEnv)
  //     that.setData({ shopLearnEnv: shopLearnEnv })
  //   })
  // },
})