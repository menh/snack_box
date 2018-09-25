//index.js
//获取应用实例
const app = getApp()

Page({


  data: {

    info: {
      openid: '',
      myName: '',
      myPhone: '',
      friendName: '',
      friendPhone: '',
      friendAddress:'',
      status: 0
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
    var self = this
    wx.getStorage({
      key: 'my_name',
      success: function(res) {
        self.setData({
          ['info.myName']: res.data
        })
        console.log(res.data)
      }
    })
    wx.getStorage({
      key: 'my_phone',
      success: function(res) {
        self.setData({
          ['info.myPhone']: res.data
        })
        console.log(res.data)
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

    this.setData({
      ['info.friendName']: '',
      ['info.friendPhone']: '',
      ['info.friendAddress']: '',
    })
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
    this.setData({
      ['info.myName']: name
    })
    // this.res.myName = name;
  },
  bindMyPhoneInput: function(e) {
    var phone = parseInt(e.detail.value);
    this.setData({
      ['info.myPhone']: phone
    })
  },
  bindFriendNameInput: function(e) {
    var name = e.detail.value;
    this.setData({
      ['info.friendName']: name
    })

  },
  bindFriendPhoneInput: function(e) {
    var phone = parseInt(e.detail.value);
    this.setData({
      ['info.friendPhone']: phone
    }) 
  },

  bindFriendAddressInput: function (e) {
    var address = e.detail.value;
    this.setData({
      ['info.friendAddress']: address
    })
  },

  submit_show: function(e) {

    if (this.data.info.myName.length > 0 && this.data.info.myPhone > 10000000000 && this.data.info.myPhone < 100000000000 && this.data.info.friendName.length > 0 && this.data.info.friendPhone > 10000000000 && this.data.info.friendPhone < 100000000000) {
      this.data.info.openid = app.globalData.openid;
      wx.setStorageSync('my_name', this.data.info.myName);
      wx.setStorageSync('my_phone', this.data.info.myPhone);
      this.subUserInfo(this.data.info);
    } else {
      wx.showToast({
        title: '请正确填写信息',
        icon: 'none'
      })
    }
  },

  subUserInfo: function(info) {
    console.log(info);
    wx.showLoading({
      title: '正在提交',
    })



    wx.request({
      url: app.globalData.serverIp + 'AddCustomerFriend.do',
      data: {
        openid: info.openid,
        ownName: info.myName,
        ownPhone: info.myPhone,
        friendName: info.friendName,
        friendPhone: info.friendPhone,
        address: info.friendAddress,
        status:info.status
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res.data);
        console.log("true");
        wx.hideLoading();
        if (res.data == 1) {
          wx.navigateTo({
            url: '/pages/showSuccess/showSuccess',
          })
        }else{
          wx.showModal({
            title: '连接失败',
            content: '连接失败，请联系客服',
            showCancel:false
          })
        }
      },
      fail: function(res) {
        console.log(res.data);
        console.log("faile");
      }
    })










  },

  callMe: function(e) {
    wx.makePhoneCall({
      phoneNumber: '' + this.data.phone
    })
  }
})