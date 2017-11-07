//index.js
//获取应用实例
const app = getApp();
var account,pwd;
Page({
  data: {
    motto: '每天记录生命中的一点点,在未来的日子里慢慢品味',
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
    wx.request({
      method: 'POST',
      url: 'https://www.mytime.net.cn/auth/getToken',
      data: { account: account, pwd: pwd },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if(res.data.result==1){
          app.globalData.token = res.data.extData;
          //存储token到本地
          try {
            wx.setStorageSync('token', res.data.extData);
          } catch (e) {
            console.log(e);
          }
          // 完成注册
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
          wx.navigateTo({
            url: '../video/videorecord'
          });
        }else{
          wx.showModal({
            title: '登录失败',
            showCancel: false,
            content: res.data.message+',请核对账号密码信息后重新登录',
          });
        }     
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  accountInput: function (e) {
    account = e.detail.value
  },
  pwdInput: function (e) {
    pwd = e.detail.value
  },
})
