// pages/box/box.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    toView: 'category_0',
    navActive: 0,
    category: [],
    flag: false
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
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    //将导航设置为“盒子编号：？”
    var boxNum = '';
    boxNum = wx.getStorageSync('boxNumber');
    if (boxNum != '') {
      wx.setNavigationBarTitle({
        title: '盒子编号：' + boxNum
      })
    };

    //显示list
    this.setData({
      category: app.globalData.category
    });

    this.updateCateHeight();
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '宅宅快乐盒',
      path: '/pages/openBox/openBox'
    }
  },

  wxPay: function(e) {
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '',
      icon: "loading",
      duration: 5000
    })
    const self = this;
    const id = e.target.dataset.id;
    const price = e.target.dataset.price;
    const goodName = e.target.dataset.goodname;
    const body = wx.getStorageSync('boxNumber') + ":" + goodName;

    // console.log(app.globalData.openid);
    wx.request({
      url: app.globalData.serverIp + 'getPayParamers.do',
      data: {
        // totalFee: price,
        totalFee: price * 100,
        openId: app.globalData.openid,
        appId: app.globalData.appid,
        mchId: app.globalData.mchId,
        body: body
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        wx.hideNavigationBarLoading();
        wx.hideToast();
        // console.log(res.data);
        // console.log(id);
        self.toPay(res.data, id);
      },
      fail: function(res) {
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      }
    });
  },

  toPay: function(args, goodId) {
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
        self.placeSnackOrder(goodId, boxNum);
        wx.showToast({
          title: '购买成功',
          icon: "success",
          duration: 1500
        })
      },
      'fail': function(res) {},
      'complete': function(res) {}
    })
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
    // console.log(this.flag);
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
})