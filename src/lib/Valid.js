/**
 * 判断是否长时间，形如 (2003-12-05 13:04:06)
 * @param str 校验的值
 * @returns {boolean}
 */
function isDate(strValue) {
  if (isEmpty(strValue))
    return false;
  var r = strValue.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null)
    return false;
  var d = new Date(r[1], r[3] - 1, r[4]);
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
}
/**
 * 判断是否为中文
 * @param strValue 校验的值
 * @returns {boolean}
 */
function isCnAndEn(strValue) {
  if (isEmpty(strValue))
    return false;

  var pattern = /^[·\u4E00-\u9FA5]+$/;

  return executeExp(pattern, strValue);
}
/**
 * /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
 * 判断是否是正确的Email
 * @param strValue 校验的值
 * @returns {boolean}
 */
function isEmail(strValue) {
  if (isEmpty(strValue))
    return false;
  var pattern = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return executeExp(pattern, strValue);
}

function isCardID(strValue) {
  if (isEmpty(strValue)) {
    return false;
  }
  strValue = strValue.toUpperCase();
  var vcity = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  };
  //校验长度，类型,身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var pattern = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
  if (executeExp(pattern, strValue) === false) {
    return false;
  }
  //检查省份
  var province = strValue.substr(0, 2);
  if (vcity[province] == undefined) {
    return false;
  }
  //校验生日
  var len = strValue.length;
  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len == 15) {
    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    var arr_data = strValue.match(re_fifteen);
    var year = strToInt('19' + arr_data[2]);
    var month = strToInt(arr_data[3]);
    var day = strToInt(arr_data[4]);
    var birthday = new Date('19' + year + '/' + month + '/' + day);
    //var birthday = new Date();
    birthday.setFullYear(year);
    birthday.setMonth(month - 1);
    birthday.setDate(day);
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理
    if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
      //判断年份的范围（3岁到100岁之间)
      var time = now_year - year;
      if (!(time >= 3 && time <= 100)) {
        return false;
      }
    } else {
      return false;
    }
  }
  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len == 18) {
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    var arr_data = strValue.match(re_eighteen);
    var year = strToInt(arr_data[2]);
    var month = strToInt(arr_data[3]);
    var day = strToInt(arr_data[4]);
    var birthday = new Date(year + '/' + month + '/' + day);
    //var birthday = new Date();
    birthday.setFullYear(year);
    birthday.setMonth(month - 1);
    birthday.setDate(day);
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理
    if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
      //判断年份的范围（3岁到100岁之间)
      var time = now_year - year;
      if (!(time >= 3 && time <= 100)) {
        return false;
      }
    } else {
      return false;
    }
  }
  //检验位的检测
  //15位转18位
  if (strValue.length == 15) {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var cardTemp = 0,
      i;
    strValue = strValue.substr(0, 6) + '19' + strValue.substr(6, strValue.length - 6);
    for (i = 0; i < 17; i++) {
      cardTemp += strValue.substr(i, 1) * arrInt[i];
    }
    strValue += arrCh[cardTemp % 11];
  }
  if (strValue.length == 18) {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var cardTemp = 0,
      i, valnum;
    for (i = 0; i < 17; i++) {
      cardTemp += parseInt(strValue.substr(i, 1)) * arrInt[i];
    }
    valnum = arrCh[cardTemp % 11];
    if (!(valnum == strValue.substr(17, 1))) {
      return false;
    }
  }
  return true;
}
//私有方法
function executeExp(pattern, strValue) {
  return pattern.test(strValue);
}

function strToInt(strValue) {
  while (strValue.length > 1 && strValue.substring(0, 1) == "0") {
    strValue = strValue.substring(1, strValue.length);
  }
  return parseInt(strValue);
}

function isEmpty(obj) {
  if (obj == "" || obj == null || obj == undefined) {
    return true
  } else {
    return false
  }
}
export default ({
  isDate: isDate,
  isCnAndEn: isCnAndEn,
  isEmail: isEmail,
  isCardID:isCardID
})
