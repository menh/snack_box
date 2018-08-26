// pages/box/box.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  category: [
    {categoryName: "分类1", categorySign: "1"},
    {categoryName: "分类2", categorySign: "2" },
    {categoryName: "分类3", categorySign: "3" },
    {categoryName: "分类4", categorySign: "4" }
  ],
  data: {
    snack1: [
    { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 },
    { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 },
    { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 }
    ],

    snack2: [
      { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 },
      { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 },
      { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 }
    ],
    snack3: [
      { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 },
      { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 },
      { goodName: '亲嘴烧', img: '../../image/snack/food.png', price: 18.8 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    return ;
    self.getGoodList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  getGoodList: function () {
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
        console.log(res.data);
        wx.setStorageSync('snack', res.data)
        self.setData({
          snack: res.data
        })
      },
      fail: function (res) {

      }
    })
  },

  wxPay: function (e) {
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
      success: function (res) {
        self.toPay(res.data);
      },
      fail: function (res) {

      }
    });
  },

  toPay: function (args) {
    const self = this;
    console.log(args);
    wx.requestPayment(
      {
        'timeStamp': args.timeStamp,
        'nonceStr': args.nonceStr,
        'package': args.package,
        'signType': 'MD5',
        'paySign': args.paySign,
        'success': function (res) {
          setTimeout(function () {
            wx.navigateTo({
              url: '../openBox/openBox',
            })
          }, 100)
        },
        'fail': function (res) { },
        'complete': function (res) { }
      })
  },
  
  wxPay1: function(e) {
    const self = this;
    console.log(e);
    console.log(e.target.dataset.id);
  },
})