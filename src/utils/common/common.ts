import { format } from 'date-fns'

type Time = string | Date

/** 格式化时间，默认格式：YYYY-MM-DD HH:mm:ss */
export function formatDateTime(time: Time, type = 'yyyy-MM-dd HH:mm:ss'): string {
  return format(new Date(time), type)
}

/** 格式化日期，默认格式：YYYY-MM-DD */
export function formatDate(date: Time, format = 'yyyy-MM-dd') {
  return formatDateTime(date, format)
}
