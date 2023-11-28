export function showRequestError({
  hasPrefix = true,
  message,
  response,
  error,
  type = 'message',
}: {
  hasPrefix?: boolean
  message?: string
  response?: IAxiosResponse
  error?: IAxiosError
  type?: IAxiosShowErrorType
} = {}) {
  // method
  const method
    = error?.config?.method
    ?? error?.request?.method
    // @ts-expect-error no types
    ?? error?.method
    ?? response?.config?.method
    ?? response?.request?.method
    // @ts-expect-error no types
    ?? response?.method
    ?? ''
  const methodText = method ? `请求方法：${method}` : ''

  // url
  const url
    = error?.config?.url
    ?? error?.request?.url
    // @ts-expect-error no types
    ?? error?.url
    ?? response?.config?.url
    ?? response?.request?.url
    // @ts-expect-error no types
    ?? response?.url
    ?? ''
  const urlText = url ? `请求地址：${url}` : ''

  // statusCode
  const statusCode
    = error?.status
    // @ts-expect-error no types
    ?? error?.statusCode
    // @ts-expect-error no types
    ?? error?.data?.status
    // @ts-expect-error no types
    ?? error?.data?.statusCode
    ?? response?.status
    // @ts-expect-error no types
    ?? response?.statusCode
    ?? response?.data?.status
    // @ts-expect-error no types
    ?? response?.data?.statusCode
    ?? 0
  const statusCodeText = statusCode ? `状态代码：${statusCode}` : ''

  // errorCode
  const errorCode
    = error?.code
    // @ts-expect-error no types
    ?? error?.errno
    // @ts-expect-error no types
    ?? error?.data?.code
    // @ts-expect-error no types
    ?? error?.data?.errno
    // @ts-expect-error no types
    ?? response?.code
    // @ts-expect-error no types
    ?? response?.errno
    ?? response?.data?.code
    // @ts-expect-error no types
    ?? response?.data?.errno
    ?? ''
  const errorCodeText = errorCode ? `错误代码：${errorCode}` : ''

  // errorMessage
  const errorMessage
    // @ts-expect-error no types
    = error?.data?.errMsg
    // @ts-expect-error no types
    ?? error?.data?.message
    // @ts-expect-error no types
    ?? error?.data?.msg
    // @ts-expect-error no types
    ?? error?.errMsg
    ?? error?.message
    // @ts-expect-error no types
    ?? error?.msg
    // @ts-expect-error no types
    ?? response?.data?.errMsg
    // @ts-expect-error no types
    ?? response?.data?.message
    ?? response?.data?.msg
    // @ts-expect-error no types
    ?? response?.errMsg
    // @ts-expect-error no types
    ?? response?.message
    // @ts-expect-error no types
    ?? response?.msg
    ?? message
    ?? ''
  const errorMessageText = errorMessage ? `错误信息：${errorMessage}` : ''

  const items = [
    hasPrefix ? '发生了错误。' : '',
    errorMessageText,
    errorCodeText,
    methodText,
    urlText,
    statusCodeText,
  ].filter(item => !!item)
  const content = () =>
    h(
      'div',
      null,
      items.map(item => h('p', null, item)),
    )
  switch (type) {
    case 'dialog': {
      window.$dialog?.error({ title: '错误', content, positiveText: '确定' })
      break
    }
    case 'notification': {
      window.$notification?.error({ title: '错误', content })
      return
    }
    case 'message': {
      window.$message?.error(content)
      break
    }
    // No default
  }
}
