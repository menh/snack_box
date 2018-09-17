//index.js
//获取应用实例
const app = getApp()

Page({
  res: {
    myName: '',
    myPhone: '',
    friendName: '',
    friendPhone: ''
  },
  data: {
    info: {
      myName: '',
      myPhone: ''
    },
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

  bindMyNameInput: function(e) {
    var name = e.detail.value;
    this.res.myName = name;
  },
  bindMyPhoneInput: function(e) {
    var phone = parseInt(e.detail.value);
    this.res.myPhone = phone;
  },
  bindFriendNameInput: function(e) {
    var name = e.detail.value;
    this.res.friendName = name;

  },
  bindFriendPhoneInput: function(e) {
    var phone = parseInt(e.detail.value);
    this.res.friendPhone = phone;
  },

  submit_show: function(e) {
    console.log(this.res);
    if (this.res.myName.length > 0 && this.res.myPhone> 10000000000 && this.res.myPhone< 100000000000 && this.res.friendName.length > 0 && this.res.friendPhone > 10000000000 && this.res.friendPhone < 100000000000) {
      wx.setStorageSync('user_name_phone', this.res);
      wx.showModal({
        title: '你的推荐已提交',
        content: '我们将会尽快联系您的好友，盒子放置成功后将转账到你们的支付宝账户。感谢支持',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        title: '请填写完所有信息',
        icon:'none'
      })
    }
  },
  callMe:function(e){
    wx.makePhoneCall({
      phoneNumber: ''+this.data.phone
    })
  }
})