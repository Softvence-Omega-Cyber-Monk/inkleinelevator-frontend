export function timeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
    const intervals: [number, string][] = [
      [60, "second"],
      [60, "minute"],
      [24, "hour"],
      [7, "day"],
      [4.34524, "week"], // approx 1 month = 4.34524 weeks
      [12, "month"],
    ]
  
    let counter = seconds
    for (let i = 0; i < intervals.length; i++) {
      const [limit, unit] = intervals[i]
      if (counter < limit) {
        return `${Math.floor(counter)} ${unit}${Math.floor(counter) !== 1 ? "s" : ""} ago`
      }
      counter /= limit
    }
    return `${Math.floor(counter)} year${Math.floor(counter) !== 1 ? "s" : ""} ago`
  }
  