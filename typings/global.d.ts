interface Window {
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  $dialog?: import('naive-ui').DialogProviderInst;
  $message?: import('naive-ui').MessageProviderInst;
  $notification?: import('naive-ui').NotificationProviderInst;
}
/** mock的响应option */
interface MockOption {
  url: Record<string, any>;
  body: Record<string, any>;
  query: Record<string, any>;
  headers: Record<string, any>;
}
