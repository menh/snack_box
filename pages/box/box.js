// pages/box/box.js
const app = getApp()
var self = this
Page({

  /**
   * 页面的初始数据
   */

  data: {
    toView: 'category_0',
    navActive: 0,
    category: [],
    boxNum: '',
    flag: false, //防止因为延迟导致左边栏跳动
    box_focus: false,
    goodCartMap: new Map(),
    goodCartData: {
      num: 0,
      price: 0
    },
    goodCartFlag: true

    // bottom_nav: [{
    //   text: '商城',
    //   image: '../../image/snack/food.png'
    // }, {
    //   text: '账单',
    //   image: '../../image/snack/food.png'
    // }, ],
  },
  // category: [{
  //   categoryName: "早餐面包",
  //   categoryItem: [{
  //     goodName: '亲嘴烧',
  //     img: '../../image/snack/food.png',
  //     price: 18.8,
  //     unit: "份"
  //   }]
  // }]

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene) {
      var boxId = decodeURIComponent(options.scene);
      console.log('boxId:' + boxId)
      if (boxId != undefined && boxId != null && boxId != '' && boxId.length == 6) {
        wx.setStorageSync('boxNumber', boxId);
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() { 


    var boxNum = '';
    boxNum = wx.getStorageSync('boxNumber');
    this.setData({
      boxNum: boxNum
    })

    this.data.goodCartMap = new Map();
    var category = [];
    category = wx.getStorageSync('snack');
    if (category != undefined && category.length > 0) {
      category = this.priceAdjustment(category);
      this.setData({
        category: category,
        goodCartData: {
          num: 0,
          price: 0
        }
      })
      console.log(category);
    } else {
      wx.startPullDownRefresh({});
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getGoodList();

    // //将导航设置为“盒子编号：？”
    // var boxNum = '';
    // boxNum = wx.getStorageSync('boxNumber');
    // if (boxNum != '') {
    //   wx.setNavigationBarTitle({
    //     title: '盒子编号：' + boxNum
    //   })
    // };

    // this.getGoodList();
    // //显示list
    // this.setData({
    //   category: app.globalData.category
    // });

    // this.updateCateHeight();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getGoodList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  wxPay: function(e) {
    const self = this;
    //盒子编号有误
    if (!this.checkBoxNum()) {
      wx.showModal({
        title: '盒子编号有误',
        content: '盒子编号有误，请重新检查后输入。(示例：000023)',
        showCancel: false,
        confirmColor: "#267BD9",
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.setData({
              box_focus: true
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      if (this.data.goodCartData.price <= 0) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none'

        })
      } else if (this.data.goodCartData.price > 0) {
        wx.showModal({
          title: '请确认订单信息',
          content: '商品数量:' + this.data.goodCartData.num + '\n应付金额:￥' + this.data.goodCartData.price / 100,
          cancelText: "取消支付",
          confirmText: "确认支付",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.showNavigationBarLoading();
              wx.showToast({
                title: '',
                icon: "loading",
                duration: 5000
              })

              const price = e.target.dataset.price;
              const goodName = e.target.dataset.goodname;
              const body = wx.getStorageSync('boxNumber');
              var boxNum = wx.getStorageSync('boxNumber');
              var orderDetail = self.getDetailByCategory(self.data.category);
              wx.request({
                url: app.globalData.serverIp + 'getPayParamers.do',
                data: {
                  openId: app.globalData.openid,
                  appId: app.globalData.appid,
                  mchId: app.globalData.mchId,
                  body: body,
                  boxBsn: boxNum,
                  orderDetail: orderDetail
                },
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                  console.log(res);
                  if (res.statusCode == 200) {

                    wx.hideNavigationBarLoading();
                    wx.hideToast();
                    // console.log(res.data);
                    // console.log(id);
                    self.toPay(res.data);
                  } else {
                    wx.hideNavigationBarLoading()
                    wx.showToast({
                      title: '连接失败',
                      icon: 'none'
                    })
                  }
                },
                fail: function(res) {
                  wx.hideNavigationBarLoading()
                  wx.showToast({
                    title: '连接失败',
                    icon: 'none'
                  })
                }
              });


            } else if (res.cancel) {}
          }
        })
      }
    }


  },

  toPay: function(args) {
    const self = this;
    var boxNum = wx.getStorageSync('boxNumber');
    // console.log(args);
    wx.requestPayment({
      'timeStamp': args.timeStamp,
      'nonceStr': args.nonceStr,
      'package': args.package,
      'signType': 'MD5',
      'paySign': args.paySign,
      'success': function(res) {
        wx.showToast({
          title: '购买成功',
          icon: "success",
          duration: 1500
        })
        self.initialCategoryGoodCart(self);
      },
      'fail': function(res) {},
      'complete': function(res) {}
    })
  },

  getDetailByCategory: function(category) {
    var tempCategory = category;
    var detail = '';
    for (var i = 0; i < tempCategory.length; i++) {
      var item = tempCategory[i].categoryItem;
      for (var j = 0; j < item.length; j++) {
        var good = item[j];
        if (good.purchaseQuantity > 0) {
          detail += 'goodId:' + good.goodId + '&num:' + good.purchaseQuantity + '|'
        }
      }
    }
    detail = detail.substr(0, detail.length - 1);
    console.log(detail);
    return detail;
  },


  initialCategoryGoodCart:function(self){
    var tempCategory = self.data.category;
    for (var i = 0; i < tempCategory.length; i++) {
      var item = tempCategory[i].categoryItem;
      for (var j = 0; j < item.length; j++) {
        var good = item[j];
        good.purchaseQuantity = 0;
      }
    }
    self.data.goodCartMap.clear();
    self.setData({
      category: tempCategory,
      goodCartData: {
        num: 0,
        price: 0
      }
    })
  },

  applyRestocking: function(e) {
    var self = this;
    if (!this.checkBoxNum()) {
      wx.showModal({
        title: '盒子编号有误',
        content: '盒子编号有误，请重新检查后输入。(示例：000023)',
        showCancel: false,
        confirmColor: "#267BD9",
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.setData({
              box_focus: true
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../applyRestocking/applyRestocking',
      })
    }
  },

  chooseType: function(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    // console.log(index);
    this.flag = true;
    this.setData({
      toView: id,
      navActive: index
    })
  },

  updateCateHeight: function() {
    let heightArr = [];
    let s = 0;
    var self = this;

    var query = wx.createSelectorQuery().in(this);

    query.selectAll('.box_cate').boundingClientRect(function(res) {
      // console.log(res);
      res.forEach((react) => {
        // console.log(react);
        s += react.height;
        heightArr.push(s);
      });
      // console.log(heightArr);
      getApp().globalData.heightArr = heightArr;
    }).exec();
  },

  onScroll: function(e) {
    let scrollTop = e.detail.scrollTop;
    let heightArr = getApp().globalData.heightArr;
    var index = 0;
    // console.log(this.flag);
    if (this.flag) {
      this.flag = false;
      return;
    }
    for (var i = 0; i < heightArr.length; i++) {
      if (heightArr[i] > scrollTop) {
        index = i;
        // console.log(index);
        break;
      }
    }
    this.setData({
      navActive: index
    });
  },

  placeSnackOrder: function(goodId, boxNum) {
    var data = new Date();
    var orderTime = this.formatTime(data);
    var openid = app.globalData.openid;
    console.log(openid);
    wx.request({
      url: app.globalData.serverIp + 'placeSnackOrder.do',
      data: {
        openid: openid,
        goodId: goodId,
        boxBsn: boxNum,
        orderTime: orderTime
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log("下单成功");
      },
      fail: function(res) {
        console.log("下单失败");
      }
    });
  },

  formatTime: function(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },

  formatNumber: function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  getGoodList: function() {
    const self = this;
    wx.request({
      url: app.globalData.serverIp + 'getGoodList.do',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        self.getGoodListCallback(self, res.data);
        // self.updateCateHeight();
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      }
    })
  },

  getGoodListCallback:function(self,category){
    // category = self.changeGoodPic(category);//图片更改
    wx.setStorageSync('snack', category); //保存初始snack到缓存
    console.log(category);
    //更新category与goodCartData
    var goodCartMap = self.data.goodCartMap;
    category = self.processCategory(category, goodCartMap);//恢复购物车情况
    category = self.priceAdjustment(category);//价格*100
    var goodCartData = self.getGoodCartDataByCategory(category);//得到购物车数据
    app.globalData.category = category;
    console.log(goodCartData);
    self.setData({
      category: category,
      goodCartData: goodCartData
    })
  },

  processCategory: function(category, goodCartMap) {
    var tempCategory = category;
    for (var i = 0; i < tempCategory.length; i++) {
      var item = tempCategory[i].categoryItem;
      for (var j = 0; j < item.length; j++) {
        var good = item[j];
        if (goodCartMap.has(good.goodId)) {
          good.purchaseQuantity = goodCartMap.get(good.goodId);
        } else {
          good.purchaseQuantity = 0;
        }
      }
    }
    return tempCategory;
  },

  changeGoodPic: function (category) {
    var tempCategory = category;
    for (var i = 0; i < tempCategory.length; i++) {
      var item = tempCategory[i].categoryItem;
      for (var j = 0; j < item.length; j++) {
        item[j].goodPic = 'http://www.gzfjcyd.com/snack_box_http/getGoodPic.do?goodId=' + item[j].goodId;
        // item[j].goodPic= "http://img1.3lian.com/2015/w7/85/d/101.jpg"
      }
    }
    return tempCategory;
  },

  priceAdjustment: function (category) {
    var tempCategory = category;
    for (var i = 0; i < tempCategory.length; i++) {
      var item = tempCategory[i].categoryItem;
      for (var j = 0; j < item.length; j++) {
        item[j].price *= 100;
      }
    }
    return tempCategory;
  },

  getGoodCartDataByCategory: function(category) {
    var tempCategory = category;
    var goodCartData = {
      num: 0,
      price: 0
    };
    for (var i = 0; i < tempCategory.length; i++) {
      var item = tempCategory[i].categoryItem;
      for (var j = 0; j < item.length; j++) {
        var good = item[j];
        goodCartData.num += good.purchaseQuantity;
        goodCartData.price += good.purchaseQuantity * good.price;
      }
    }
    return goodCartData;
  },
  callMe: function(e) {
    var phone = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  boxNumberInput: function(e) {
    this.setData({
      boxNumber: e.detail.value
    })
    var boxNum = this.data.boxNumber;
    wx.setStorageSync('boxNumber', boxNum);

    if (boxNum.length == 6) {
      // 收起键盘
      wx.hideKeyboard()
    }
  },

  checkBoxNum: function() {
    if (wx.getStorageSync('boxNumber') == undefined || wx.getStorageSync('boxNumber') == '' || wx.getStorageSync('boxNumber').length != 6) {
      return false;
    }
    return true;
  },

  subtractGood: function(e) {
    var goodId = e.target.dataset.id;
    var goodCartMap = this.data.goodCartMap; //用来同步购物车数据
    var goodCartData = this.data.goodCartData;
    var goodItem = this.getGoodById(this.data.category, goodId);
    if (goodItem.purchaseQuantity > 0) {
      goodItem.purchaseQuantity--;
      goodCartData.num--;
      goodCartData.price -= (goodItem.price);
      if (goodItem.purchaseQuantity == 0) { //删除map表中的key
        if (goodCartMap.has(goodId)) {
          goodCartMap.delete(goodId);
        }
      } else {
        goodCartMap.set(goodId, goodItem.purchaseQuantity);
      }
    }
    this.setData({
      category: this.data.category,
      goodCartData: goodCartData
    })
  },

  addGood: function(e) {
    var goodId = e.target.dataset.id;
    // var goodCartMap = new Map(); //用来同步购物车数据
    var goodCartMap = this.data.goodCartMap; //用来同步购物车数据
    var goodCartData = this.data.goodCartData;
    var goodItem = this.getGoodById(this.data.category, goodId);
    if (goodItem.purchaseQuantity >= 0) {
      goodItem.purchaseQuantity++;
      goodCartData.num++;
      goodCartData.price += (goodItem.price);
    } else {
      goodItem.purchaseQuantity = 1;
      goodCartData.num++;
      goodCartData.price += (goodItem.price);
    }
    goodCartMap.set(goodId, goodItem.purchaseQuantity);
    this.setData({
      category: this.data.category,
      goodCartData: goodCartData
    })
  },

  getGoodById: function(category, goodId) {
    var tempCategory = category;
    for (var i = 0; i < tempCategory.length; i++) {
      var item = tempCategory[i].categoryItem;
      for (var j = 0; j < item.length; j++) {
        if (item[j].goodId == goodId) {
          return item[j];
        }
      }
    }
    return '';
  },
  hideGoodCart: function(e) {
    this.setData({
      goodCartFlag: true
    })
  },
  showGoodCart: function(e) {
    this.setData({
      goodCartFlag: false
    })
  },

  bindgetuserinfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var avatarUrl = e.detail.userInfo.avatarUrl;
      var nickName = e.detail.userInfo.nickName;
      var gender = e.detail.userInfo.gender;
      var openid = app.globalData.openid
      console.log(avatarUrl, nickName, gender);
    }
  }

})