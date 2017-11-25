//app.js
App({
  onLaunch: function () {
    //this.globalData.basePath = 'http://localhost:8080';//https://www.mytime.net.cn
    // 展示本地存储能力
    this.globalData = {};
    var token = wx.getStorageSync('token') ;
    this.globalData.token = token;
  }
})