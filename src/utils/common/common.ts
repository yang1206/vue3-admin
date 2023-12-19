import dayjs from 'dayjs'

type Time = string | Date

/** 格式化时间，默认格式：YYYY-MM-DD HH:mm:ss */
export function formatDateTime(time: Time, type = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(new Date(time)).format(type)
}

/** 格式化日期，默认格式：YYYY-MM-DD */
export function formatDate(date: Time, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}
