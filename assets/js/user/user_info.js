var form = layui.form  // 发现：全局变量的申明和赋值写到入口函数中还不行，否则，下面的form.val（）会提示form未定义
$(function () {
  form.verify({
    nickname: function (value) {
      if (value.length > 6) return "昵称的长度必须在1~6个字符之间"
    }
  })

  initUserInfo()

  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    /* $('input[name=nickname]').val('')
    $('input[name=email]').val('') */
    initUserInfo()  // 我怎么没想到
  })

  $('form').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/my/userinfo',
      method: 'post',
      data:$(this).serialize(),
      success: res => {
        if(res.status!=0)return layer.msg('更新用户信息失败')
        layer.msg(res.message)
        // !!!!!新东西:iframe子页面，调用父页面的方法，使用window.parent.getUserInfo()
        window.parent.getUserInfo()
      }
    })
  })

})
function initUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'get',
    success: res => {
      if (res.status != 0) return layer.msg('获取用户信息失败')
      // $('input[name=username]').val(res.data.username)
      form.val('formUserInfo', res.data)
    }
  })
}