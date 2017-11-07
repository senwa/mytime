var app = getApp()
var step = 3 // 当前操作的step
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）
var interval = null
var hintMsg = null // 提示

var check = require("../register/check.js");
var webUtils = require("../register/registerWebUtil.js");
var step_g = 3;

var account=null,phoneNum = null, identifyCode = null, password = null, rePassword = null;

Page({
  data: {
    windowWidth: 0,
    windoeHeight: 0,
    icon_phone: "https://www.mytime.net.cn/res/icon_phone.png",
    icon_account: "https://www.mytime.net.cn/res/login_name.png",
    icon_password: "https://www.mytime.net.cn/res/login_pwd.png",
    location: "中国(+86)",
    nextButtonWidth: 0,
    step: step_g,
    time: '('+currentTime+'s)'
  },
  onLoad: function () {
    step_g = 3;
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          nextButtonWidth: res.windowWidth - 20
        })
      }
    })
  },
  onUnload: function () {
    currentTime = maxTime
    if (interval != null) {
      clearInterval(interval)
    }
  },
  nextStep: function () {
    var that = this
    if (step_g == 1) {
      if (firstStep()) {
        step_g = 2
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            time: '('+currentTime+'s)'
          })

          if (currentTime <= 0) {
            clearInterval(interval);
            currentTime = -1;
            that.setData({
              time: ''
            });
          }
        }, 1000)
      }
    } else if (step_g == 2) {
      if (secondStep()) {
        step_g = 3
        clearInterval(interval)
      }
    } else {//发送注册
       
      console.log(account + "==" + password + "===" + rePassword)
      if (!account) {
        hintMsg = "请输入登录账号";
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: hintMsg,
        });
        return false
      }

      if (!check.isContentEqual(password, rePassword)) {
        hintMsg = "两次密码不一致！"
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: hintMsg,
        });
        return false
      }

      if (webUtils.submitPassword(account, password, function(res){
        if (res.data.result == 1) {
          app.globalData.token = res.data.message;
          //存储token到本地
          try {
            wx.setStorageSync('token', res.data.message);
          } catch (e) {
            console.log(e);
          }
          // 完成注册
          wx.showToast({
            title: '注册成功',
            icon:'success'
          });
          wx.navigateTo({
            url: '/video/videorecord'
          });
        } else {
          wx.showModal({
            title: '注册失败',
            showCancel: false,
            content: res.data.message,
          });
        }
      }));
    }
    this.setData({
      step: step_g
    });
  },
  input_account:function(e){
    account = e.detail.value
  },
  input_phoneNum: function (e) {
    phoneNum = e.detail.value
  },
  input_identifyCode: function (e) {
    identifyCode = e.detail.value
  },
  input_password: function (e) {
    password = e.detail.value
  },
  input_rePassword: function (e) {
    rePassword = e.detail.value
  },
  reSendPhoneNum: function () {
    if (currentTime < 0) {
      var that = this
      currentTime = maxTime
      interval = setInterval(function () {
        currentTime--
        that.setData({
          time: currentTime
        })

        if (currentTime <= 0) {
          currentTime = -1
          clearInterval(interval)
        }
      }, 1000)
    } else {
      wx.showToast({
        title: '短信已发到您的手机，请稍后重试!',
        icon: 'loading',
        duration: 700
      })
    }
  }
})

function firstStep() { // 提交电话号码，获取［验证码］
  if (!check.checkPhoneNum(phoneNum)) {
    hintMsg = "请输入正确的电话号码!"
    return false
  }

  if (webUtils.submitPhoneNum(phoneNum)) {
    hintMsg = null
    return true
  }
  hintMsg = "提交错误，请稍后重试!"
  return false
}

function secondStep() { // 提交［验证码］
  if (!check.checkIsNotNull(identifyCode)) {
    hintMsg = "请输入验证码!"
    return false
  }

  if (webUtils.submitIdentifyCode(identifyCode)) {
    hintMsg = null
    return true
  }
  hintMsg = "提交错误，请稍后重试!"
  return false
}
