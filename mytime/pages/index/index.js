//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: '每天记录生命中的一点点,在未来的日子里慢慢品味',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  startRecordVideo:function(){
    wx.navigateTo({
      url: '../video/videorecord'
    })
  },
  onLoad: function () { 
   /* if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    }*/ 
  },
  register:function(){
    //注册,跳转到注册页面
    wx.navigateTo({
      url: "../register/register"
    })
  },login:function(){
      //点击登录
      
  }
})
