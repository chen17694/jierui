/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var now = new Date() // 当前日期
var nowDayOfWeek = now.getDay() // 今天本周的第几天
var nowDay = now.getDate() // 当前日
var nowMonth = now.getMonth() // 当前月
var nowYear = now.getYear() // 当前年
nowYear += (nowYear < 2000) ? 1900 : 0 //

var lastMonthDate = new Date() // 上月日期
lastMonthDate.setDate(1)
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
// var lastYear = lastMonthDate.getYear()
var lastMonth = lastMonthDate.getMonth()

// 格式化日期：yyyy-MM-dd
export const formatDate = (date) => {
  var myyear = date.getFullYear()
  var mymonth = date.getMonth() + 1
  var myweekday = date.getDate()

  if (mymonth < 10) {
    mymonth = '0' + mymonth
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday
  }
  return (myyear + '-' + mymonth + '-' + myweekday)
}

// 今天
// var getCurrentDate = formatDate(new Date(nowYear, nowMonth, nowDay))

// 昨天
// var getYesterdayDate = formatDate(new Date(nowYear, nowMonth, nowDay - 1))

// 获得某月的天数
export const getMonthDays = (myMonth) => {
  var monthStartDate = new Date(nowYear, myMonth, 1)
  var monthEndDate = new Date(nowYear, myMonth + 1, 1)
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
  return days
}

// 获得本季度的开始月份
export const getQuarterStartMonth = () => {
  var quarterStartMonth = 0
  if (nowMonth < 3) {
    quarterStartMonth = 0
  }
  if (nowMonth > 2 && nowMonth < 6) {
    quarterStartMonth = 3
  }
  if (nowMonth > 5 && nowMonth < 9) {
    quarterStartMonth = 6
  }
  if (nowMonth > 8) {
    quarterStartMonth = 9
  }
  return quarterStartMonth
}

// 获得本周的开始日期
export const getWeekStartDate = () => {
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
  return formatDate(weekStartDate)
}

// 获得本周的结束日期
export const getWeekEndDate = () => {
  var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
  return formatDate(weekEndDate)
}

// 获得上周的开始日期
export const getLastWeekStartDate = () => {
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7)
  return formatDate(weekStartDate)
}
// 获得上周的结束日期
export const getLastWeekEndDate = () => {
  var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1)
  return formatDate(weekEndDate)
}

// 获得本月的开始日期
export const getMonthStartDate = () => {
  var monthStartDate = new Date(nowYear, nowMonth, 1)
  return formatDate(monthStartDate)
}

// 获得本月的结束日期
export const getMonthEndDate = () => {
  var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
  return formatDate(monthEndDate)
}

// 获得上月开始时间
export const getLastMonthStartDate = () => {
  var lastMonthStartDate = new Date(nowYear, lastMonth, 1)
  return formatDate(lastMonthStartDate)
}

// 获得上月结束时间
export const getLastMonthEndDate = () => {
  var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth))
  return formatDate(lastMonthEndDate)
}

// 获得本季度的开始日期
export const getQuarterStartDate = () => {
  var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1)
  return formatDate(quarterStartDate)
}

// 或的本季度的结束日期
export const getQuarterEndDate = () => {
  var quarterEndMonth = getQuarterStartMonth() + 2
  var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth))
  return formatDate(quarterStartDate)
}

/* 获得上个季度的开始日期 */
export const getLastQuarterStartDate = () => {
  return formatDate(new Date(nowYear, getQuarterStartMonth() - 3, 1))
}

/* 获得上个季度的结束日期 */
export const getLastQuarterEndDate = () => {
  var quarterEndMonth = getQuarterStartMonth() - 1
  var now = new Date()
  now.setMonth(quarterEndMonth)
  // var nowMonth = now.getMonth()
  var nowYear = now.getFullYear()
  return formatDate(new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)))
}

// 获取本年日期
export const getCurrentYear = () => {
  // 起止日期数组
  var startStop = []

  // 本年第一天
  var currentYearFirstDate = new Date(nowYear, 0, 1)
  // 本年最后一天
  var currentYearLastDate = new Date(nowYear, 11, 31)
  // 添加至数组
  startStop.push(currentYearFirstDate)
  startStop.push(currentYearLastDate)
  // 返回
  return { startTime: formatDate(currentYearFirstDate), endTime: formatDate(currentYearLastDate) }
}

// 获取去年日期
export const getLastYear = () => {
  // 去年年第一天
  var currentYearFirstDate = new Date(nowYear - 1, 0, 1)
  // 去年最后一天
  var currentYearLastDate = new Date(nowYear - 1, 11, 31)
  // 返回
  return { startTime: formatDate(currentYearFirstDate), endTime: formatDate(currentYearLastDate) }
}
