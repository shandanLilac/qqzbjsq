//注意：每次调用jQuery中的$.get() $.post() $.ajax()的时候，
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象。
$.ajaxPrefilter(function(options){
  // 在发起真正的ajax请求之前，统一拼接请求路径
  options.url='http://127.0.0.1'+options.url
})