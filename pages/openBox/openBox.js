// pages/openBox/openBox.js
Page({  
  /**
   * 页面的初始数据
   */
  data: {
    boxNumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
  

  openBox: function () {
    wx.navigateTo({
      url: '../box/box',
    })
    return ;
    var boxNum = this.data.boxNumber;
    if (boxNum != '' && boxNum.length == 6){
      // console.log(boxNum.length);
      wx.navigateTo({
        url: '../box/box',
      })
    }else if(boxNum != ''){
      wx.showToast({
        title: '请输入6位正确编号',
        icon:"none"
      })
    } else {
      wx.showToast({
        title: '请输入盒子编号',
        icon: "none"
      })
    }
  },

  boxNumberInput : function (e) {
    this.setData({
      boxNumber: e.detail.value
    })
    var boxNum = this.data.boxNumber;
    wx.setStorageSync('boxNumber', boxNum);
    // wx.setStorageSync('boxNumber', 123);
  }

})