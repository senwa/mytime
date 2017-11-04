//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //发起网络请求
        if(res.code){
			    
        }else{
          wx.showToast({
            title: '获取用户登录态失败！' + res.errMsg,
            icon: 'fail',
            duration: 2300
          });
        }     
      },fail:res=>{
        var title ='获取用户登录态失败！';
        if(res){
          title +=  res.errMsg;
        }
        wx.showToast({
          title: title,
          icon: 'fail',
          duration: 2300
        });
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials:true,
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },fail:function(){
              wx.showToast({
                title: '获取用户信息失败',
                icon: 'fail',
                duration: 2300
              });
            }
          })
        }else{

        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})