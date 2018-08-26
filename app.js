//app.js
App({
  onLaunch: function () {



    // 展示本地存储能力
    const self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code);
        self.getOpenid(res.code,self.globalData.appid, self.globalData.secret);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  getOpenid: function (code,appid,secret) {
    console.log("getOpenid");
    console.log("code: "+code);
    console.log("appid: " + appid);
    console.log("secret: " + secret);
    const self = this;
    wx.request({
      url: this.globalData.serverIp + 'getWxOpenId.do',
      method: 'POST',
      data: { code: code,
              appid: appid,
              secret: secret
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {

        console.log(res.data);
        //self.globalData.openid ="o9P4b5CcgFHTMNr5DxRfnibP-WIM";
        self.globalData.openid = res.data
        wx.setStorageSync('openId', res.data)
       // self.getCustomerId();
        // self.unifiedorder(res);
      },
      fail: function (res) {
        console.log('获取商品列表失败');//？
      }
    })
  },

  globalData: {
    userInfo: null,
    //serverIp: 'http://203.195.196.254/snack_box_http/',
    serverIp:'https://www.gzfjcyd.com/snack_box_http/',
    openid: '',
    customerId: '',
    secret: 'd3d7dccc2a338fc4ca1470abe440c4cc',
    appid: 'wx03b68c995d8d5409',
    secret: "084abe624d5da0e8464c6f6e0224fd27"
  }
})