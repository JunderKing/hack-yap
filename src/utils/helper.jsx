export const hideAddr = (addr) => {
  if (!addr) return ''
  return addr.slice(0, 4) + '...' + addr.slice(-4)
}

export const mulDecimal = (amount, decimal = 18) => {
  return BigInt(amount * 10 ** decimal)
}

export const divDecimal = (amount, decimal = 18, num = 2) => {
  return (Number(amount) / (10 ** decimal)).toFixed(num)
}

export async function cacheData(cacheKey, duration, callback) {
  // 获取当前时间
  const curTs = Math.floor(new Date().getTime() / 1000)
  // 读取缓存
  let cacheJson = localStorage.getItem(cacheKey)
  let cacheData = JSON.parse(cacheJson)
  if (cacheData && cacheData.expireTs > curTs) {
    return cacheData.data
  }
  // 缓存未命中，读取数据
  let data = await callback()
  cacheData = {
    data: data,
    expireTs: curTs + duration
  }
  // 缓存新数据
  cacheJson = JSON.stringify(cacheData)
  localStorage.setItem(cacheKey, cacheJson)

  return cacheData.data
}