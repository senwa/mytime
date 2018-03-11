
//提交［验证码］
function submitIdentifyCode(identifyCode) {
  // 此处调用wx中的网络请求的API，完成短信验证码的提交
  return true
}

// 提交［密码］,前一步保证两次密码输入相同
function submitPassword(account,password,phoneNum,identify,callback) {
  //此处调用wx中的网络请求的API，完成密码的提交/auth/register
  wx.request({
    method: 'POST',
    url: 'https://www.mytime.net.cn/auth/register',
    data: { account: account, pwd: password, phone: phoneNum, unionId: identify},
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res => {
      callback(res);
    },
    fail: function (res) {
      console.log(res);
    }
  });

  return true;
}

// 提交［密码］,前一步保证两次密码输入相同
function resetPassword(account, password, phoneNum, identify, callback) {
  //此处调用wx中的网络请求的API，完成密码的提交/auth/register
  wx.request({
    method: 'POST',
    url: 'https://www.mytime.net.cn/auth/resetpwd',
    data: { account: account, pwd: password, phone: phoneNum, unionId: identify },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res => {
      callback(res);
    },
    fail: function (res) {
      console.log(res);
    }
  });

  return true;
}


module.exports = {
  submitIdentifyCode: submitIdentifyCode,
  submitPassword: submitPassword,
  resetPassword: resetPassword
}

