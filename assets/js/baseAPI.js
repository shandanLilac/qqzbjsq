//注意：每次调用jQuery中的$.get() $.post() $.ajax()的时候，
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象。

$.ajaxPrefilter(function (options) {
  // 在发起真正的ajax请求之前，统一拼接请求路径
  options.url = 'http://127.0.0.1' + options.url

  if (options.url.indexOf('/my/') != -1)
    options.headers = { Authorization: localStorage.getItem('token') || '' }

  options.complete = function (res) {
    
    const status = res.responseJSON.status, msg = res.responseJSON.message
    if (status !== 0 && msg == '身份认证失败') {
      localStorage.removeItem('token')
      open('login.html','_self')
    }
  }
})