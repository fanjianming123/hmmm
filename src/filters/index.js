function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function parseTimeByString(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/* 数字 格式化 */
export function nFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      )
    }
  }
  return num.toString()
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

//题型分类
export const questionTypeFilter = (val) => {
  if (val === '1') {
    return '单选'
  } else if (val === '2') {
    return '多选'
  } else if (val === '3') {
    return '简答'
  } else {
    return '未知'
  }
}

//过滤html标签
export const questionFilter = (val) => {
  return val.match(
    /(?<=((<[a-zA-Z-]+?){0,1}>))([\s\S]+)(?=([\s]{0,1}<\/[a-zA-Z-]+(>{0,1})))/g
  )[0]
}

//过滤时间符号
export const addDateFilter = (val) => {
  return val.replace('T', ' ').split('.')[0]
}

//难度分类
export const difficultyFilter = (val) => {
  if (val === '1') {
    return '简单'
  } else if (val === '2') {
    return '一般'
  } else if (val === '3') {
    return '困难'
  } else {
    return '未知'
  }
}

//审核状态
export const chkStateFilter = (val) => {
  if (val === 0) {
    return '待审核'
  } else if (val === 1) {
    return '通过'
  } else if (val === 2) {
    return '拒绝'
  } else {
    return '未知'
  }
}

//发布状态
export const publishStateFilter = (val) => {
  // log(val)
  if (val.publishState === 1) {
    if (val.chkState === 0 || val.chkState === 2) {
      return '待发布'
    } else if (val.chkState === 1) {
      return '已发布'
    }
  } else if (val.publishState === 0) {
    return '已下架'
  }
}

//上下架
export const publishFilter = (val) => {
  // log(val)
  if (val === 0) {
    return '下架'
  } else if (val === 1) {
    return '上架'
  }
}
