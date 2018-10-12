// pages/showSuccess/showSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endTime: ''
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

    //获取截止时间
    var temp = new Date();
    var date = new Date(temp);
    date.setDate(temp.getDate() + 2);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    this.setData({
      endTime: '' + month + '月' + day + '日'
    })
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

    return {
      title: '宅宅快乐盒',
      imageUrl: '/image/logo.png',
      path: '/pages/openBox/openBox'
    }
  },

  back_show: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  back_home: function () {
    wx.reLaunch({
      url: '/pages/openBox/openBox'
    })
  }
})