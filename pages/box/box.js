// pages/box/box.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    toView: 'category-1',
    navActive: 0,
    category: [{
      categoryName: "早餐面包",
      categoryItem: [{
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }]
    }, {
      categoryName: "开胃零食",
      categoryItem: [{
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }]
    }, {
      categoryName: "差不多了",
      categoryItem: [{
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }]
    }, {
      categoryName: "就这样吧",
      categoryItem: [{
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }, {
        goodName: '亲嘴烧',
        img: '../../image/snack/food.png',
        price: 18.8,
        unit: "份"
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var boxNum = '';
    boxNum = wx.getStorageSync('boxNumber');
    if (boxNum != '') {
      wx.setNavigationBarTitle({
        title: '盒子编号：' + boxNum
      })
    }
    this.getGoodList();
    this.updateCateHeight();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getGoodList: function() {
    console.log("?")
    const self = this;
    wx.request({
      url: app.globalData.serverIp + 'getGoodList.do',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res.data);
        wx.setStorageSync('snack', res.data)
        self.setData({
          snack: res.data
        })
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },

  wxPay: function(e) {
    const self = this;
    const id = e.target.dataset.id;
    const price = self.data.snack[id].price;
    wx.request({
      url: app.globalData.serverIp + 'getPayParamers.do',
      data: {
        totalFee: price,
        openId: app.globalData.openid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.toPay(res.data);
      },
      fail: function(res) {

      }
    });
  },

  toPay: function(args) {
    const self = this;
    console.log(args);
    wx.requestPayment({
      'timeStamp': args.timeStamp,
      'nonceStr': args.nonceStr,
      'package': args.package,
      'signType': 'MD5',
      'paySign': args.paySign,
      'success': function(res) {
        setTimeout(function() {
          wx.navigateTo({
            url: '../openBox/openBox',
          })
        }, 100)
      },
      'fail': function(res) {},
      'complete': function(res) {}
    })
  },

  wxPay1: function(e) {
    const self = this;
    console.log(e);
    console.log(e.target.dataset.id);
  },

  chooseType: function(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    console.log(index);
    this.setData({
      toView: id,
      navActive: index
    })
  },

  updateCateHeight: function() {
    let heightArr = [];
    let s = 0;

    var query = wx.createSelectorQuery().in(this);

    query.selectAll('.box_cate').boundingClientRect(function(res) {
      // console.log(res);
      res.forEach((react) => {
        // console.log(react);
        s += react.height;
        heightArr.push(s);
      });
      console.log(heightArr);
      getApp().globalData.heightArr = heightArr;
    }).exec();
  },

  onScroll: function(e) {
    let scrollTop = e.detail.scrollTop;
    let heightArr = getApp().globalData.heightArr;
    var index = 0;
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
  }
})