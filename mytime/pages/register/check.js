// 检测是否有输入
function checkIsNotNull(content) {
  return (content && content != null)
}

// 检测输入内容
function checkPhoneNum(phoneNum) {
  if (!checkIsNotNull(phoneNum)) {
    return false
  }
  var validateReg = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
  return validateReg.test(phoneNum);
}

// 比较两个内容是否相等
function isContentEqual(content_1, content_2) {
  if (!checkIsNotNull(content_1)) {
    return false
  }

  if (content_1 === content_2) {
    return true
  }

  return false
}

module.exports = {
  checkIsNotNull: checkIsNotNull,
  checkPhoneNum: checkPhoneNum,
  isContentEqual: isContentEqual
}