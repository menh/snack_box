//index.js
//获取应用实例
const app = getApp()

Page({


  data: {
    phone: 13556026934,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var self = this
    // wx.getStorage({
    //   key: 'my_name',
    //   success: function(res) {
    //     self.setData({
    //       ['info.myName']: res.data
    //     })
    //     console.log(res.data)
    //   }
    // })
    // wx.getStorage({
    //   key: 'my_phone',
    //   success: function(res) {
    //     self.setData({
    //       ['info.myPhone']: res.data
    //     })
    //     console.log(res.data)
    //   }
    // })

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
  onShareAppMessage: function () {

    return {
      title: '宅宅快乐盒',
      imageUrl: '/image/logo.png',
      path: '/pages/openBox/openBox'
    }
  },

  check_job: function (e) {
    let index = e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: "/pages/job/checkJob/checkJob?index=" + index,
    })
  },

  callMe: function(e) {
    wx.makePhoneCall({
      phoneNumber: '' + this.data.phone
    })
  }
})