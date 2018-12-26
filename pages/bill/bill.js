// pages/bill/bill.js
var app = getApp()
var self = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxId: '',
    box: {},
    boxNum: '',
    orders: [],
    ordersType: 0
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
    wx.startPullDownRefresh({});

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var boxNum = '';
    boxNum = wx.getStorageSync('boxNumber');
    if (app.globalData.boxNum != boxNum) {
      wx.startPullDownRefresh({});
    }
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
    //将导航设置为“盒子编号：？”
    var boxNum = '';
    boxNum = wx.getStorageSync('boxNumber');
    app.globalData.boxNum = boxNum;

    this.searchOneBox(boxNum);
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

  searchOneBox: function(boxId) {
    console.log(boxId);
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'GetOneBox.do',
      data: {
        boxId: boxId,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var box = res.data;
        if (box.boxId == null || box.boxId.length < 1) {
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '该盒子不存在',
            icon: 'none',
          })
        } else {
          box = self.processBox(box);
          console.log(box);
          self.setData({
            box: box
          })

          var now = self.date2String(new Date());
          self.getOneBoxOrders(box.boxId, box.lastSuppleDate, now)
        }


      },
      fail: function(res) {
        console.log("faile");
      }
    })

  },

  date2String: function(date) {
    var year = this.formatNumber(date.getFullYear()); //获取完整的年份(4位,1970-????)
    var month = this.formatNumber(date.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    var day = this.formatNumber(date.getDate()); //获取当前日(1-31)
    var hour = this.formatNumber(date.getHours()); //获取当前小时数(0-23)
    var minutes = this.formatNumber(date.getMinutes()); //获取当前分钟数(0-59)
    var seconds = this.formatNumber(date.getSeconds()); //获取当前秒数(0-59)
    return year + month + day + hour + minutes + seconds;
  },


  formatNumber: function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  getOneBoxOrders: function(boxId, beginDate, endDate) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'GetBoxSnackOrderBetweenDate.do',
      data: {
        boxId: boxId,
        beginDate: beginDate,
        endDate: endDate
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var orders = self.processOrders(res.data.reverse());
        self.setData({
          orders: orders,
          ordersType:orders[0].length == 0? 1:0
        })
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },

  getDayFromDate: function(date) {
    var day = '';
    if (date.length < 8) {
      return day;
    }
    day += date.substr(4, 2);
    day += '月';
    day += date.substr(6, 2);
    day += '日'
    return day;
  },
  getTimeFromDate: function(date) {
    var time = '';
    if (date.length < 14) {
      return time;
    }
    time += date.substr(8, 2);
    time += ':'
    time += date.substr(10, 2);
    time += ':'
    time += date.substr(12, 2);
    return time;
  },

  processBox: function(box) {
    var self = this;
    var temp = box;
    temp.attendDateDay = self.getDayFromDate(temp.attendDate);
    temp.attendDateTime = self.getTimeFromDate(temp.attendDate);
    temp.lastSuppleDateDay = self.getDayFromDate(temp.lastSuppleDate);
    temp.lastSuppleDateTime = self.getTimeFromDate(temp.lastSuppleDate);
    temp.lastPurchaseDateDay = self.getDayFromDate(temp.lastPurchaseDate);
    temp.lastPurchaseDateTime = self.getTimeFromDate(temp.lastPurchaseDate);
    return temp;
  },

  processOrders: function(orders) {
    var myOpenid = app.globalData.openid;
    // var myOpenid = 'ok0xo5JMY-qnCfzEtahPQTmpm7gE';
    console.log('myOpenid:' + myOpenid);

    var self = this;
    var temp = orders;

    var myOrders = [];
    var allOrders = [];
    var res = [];

    for (var i = 0; i < temp.length; i++) {
      temp[i].orderDateDay = self.getDayFromDate(temp[i].orderTime);
      temp[i].orderDateTime = self.getTimeFromDate(temp[i].orderTime).substr(0, 5);
      
      //当数组长度超过60可能会引发setData报错
      if (i > 50) {
        temp[i].goodPic = '/image/snack/food.png';
      }

      if (temp[i].openid == myOpenid) {
        temp[i].openid = '**' + temp[i].openid.substr(temp[i].openid.length - 6);
        allOrders.push(temp[i]);
        myOrders.push(temp[i]);
      } else {
        temp[i].openid = '**' + temp[i].openid.substr(temp[i].openid.length - 6);
        allOrders.push(temp[i]);
      }
    }

    res[0] = myOrders;
    res[1] = allOrders;
    return res;
  },

  setOrdersType: function(e) {
    var self = this;
    var ordersType = parseInt(e.currentTarget.dataset.type)
    console.log(ordersType);
    this.setData({
      ordersType: ordersType
    });
  }

})