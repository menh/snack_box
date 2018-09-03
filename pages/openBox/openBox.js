// pages/openBox/openBox.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag:false,//用来表示用户列表的获取情况
    boxNumber: ''
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
    //设置input里面的编号
    var boxNum = wx.getStorageSync('boxNumber');
    if (boxNum != '') {
      // console.log(boxNum);
      this.data.boxNumber = boxNum;
      this.setData({
        boxNumber: boxNum
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGoodList();
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


  openBox: function() {
    // wx.navigateTo({
    //   url: '../box/box',
    // })
    // return ;
    var self = this;
    var boxNum = this.data.boxNumber;
    if (boxNum != '' && boxNum.length == 6) {
      // console.log(boxNum.length);
      
      var interVal = setInterval(function() {
        if (self.flag) {
          wx.hideToast();
          wx.navigateTo({
            url: '../box/box',
          })
          clearInterval(interVal);
        }else{
          wx.showToast({
            title: '获取商品列表',
            icon: "loading",
            duration: 30000
          })
        }
      }, 150);

    } else if (boxNum != '') {
      wx.showToast({
        title: '请输入6位正确编号',
        icon: "none"
      })
    } else {
      wx.showToast({
        title: '请输入盒子编号',
        icon: "none"
      })
    }
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

  getGoodList: function() {

    this.flag = false;
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
        // wx.hideToast();
        console.log(res.data);
        wx.setStorageSync('snack', res.data);
        app.globalData.category = res.data;
        self.flag = true;
        // self.setData({
        //   flag: true
        // })
        // self.updateCateHeight();
      },
      fail: function(res) {
        // console.log(res);
        wx.showToast({
          title: '连接失败',
          duration: 30000
        })
      }
    })
  },


})