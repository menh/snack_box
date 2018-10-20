//index.js
//获取应用实例
const app = getApp()

Page({


  data: {
    info: {
      boxNum: '',
      name: '',
      phone: '',
      openid: '',
      remark: ''
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
          ['info.name']: res.data
        })
        console.log(res.data)
      }
    })
    wx.getStorage({
      key: 'my_phone',
      success: function (res) {
        self.setData({
          ['info.phone']: res.data
        })
        console.log(res.data)
      }
    })

    wx.getStorage({
      key: 'boxNumber',
      success: function (res) {
        self.setData({
          ['info.boxNum']: res.data+'号盒子'
        })
        console.log(res.data)
      }
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
      imageUrl:'/image/logo.png',
      path: '/pages/openBox/openBox'
    }
  },

  bindNameInput: function (e) {
    var name = e.detail.value;
    this.setData({
      ['info.name']: name
    })
  },
  bindPhoneInput: function(e) {
    var phone = parseInt(e.detail.value);
    this.setData({
      ['info.phone']: phone
    }) 
  },
  bindRemarkInput: function (e) {
    var text = e.detail.value;
    this.setData({
      ['info.remark']: text
    })
  },


  submit_apply: function(e) {

    if (this.data.info.name.length > 0 && this.data.info.phone > 10000000000 && this.data.info.phone < 20000000000) {
      this.data.info.openid = app.globalData.openid;
      wx.setStorageSync('my_name', this.data.info.name);
      wx.setStorageSync('my_phone', this.data.info.phone);
      this.subApplyInfo(this.data.info);
    } else {
      wx.showToast({
        title: '请正确填写信息',
        icon: 'none'
      })
    }
  },

  subApplyInfo: function(info) {
    var self = this;
    console.log(info);
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.serverIp + 'SendMessage.do',
      data: {
        phoneNumber: "15013149789",
        param: self.data.info.boxNum + '|' + self.data.info.name + '|' + self.data.info.phone + '|' + self.data.info.remark + '|' + self.data.info.openid,
        templateId: '210019'
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
            url: '/pages/applySuccess/applySuccess',
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