$(function () {
  $('#link-login').on('click', function () {
    $(this).parents('.reg-box').hide()
    $('.login-box').show()
  })
  $('#link-reg').on('click', function () {
    $(this).parents('.login-box').hide()
    $('.reg-box').show()
  })

  var form = layui.form  //疑问：这里的layui-form是什么？外部js定义的什么东西吗？看着不像页面元素
  form.verify({
    // uname: [/^[a-zA-Z][\d\w-_]{5,18}$/, '请输入以字母开头6-18位的用户名'],
    uname:[/\S{1,}/],
    pwd: [/^[\d\w]{6,12}$/, '密码必须是6-12位,且不能出现空格'], //Q1:为什么表单验证不起作用？A:因为require|pwd之间没有空格。
    /* pwd:function(value){
      const regstr=/^[\S]{6,12}$/
      if(!regstr.test(value)) return '请输入6-12位密码'
    }, */
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd != value) return '两次密码不一致'
    }
  })

  $('#form-reg').on('submit', function (e) {
    e.preventDefault()
    var data = {
      username: $('#form-reg [name=username]').val(),
      password: $('#form-reg [name=password]').val()
    }
    // const layer = layui.layer
    $.post('/api/reguser', data, function (res) {
      if (res.status != 0) return layer.msg(res.message)
      layer.msg('注册成功，请登录！')  //Q3：1.event_server.js
      // 模拟人的点击行为
      $('#link-login').click()  //Q2:为什么不跳转？A：我什么都没做啊，就正常了，奇怪。
    })
  })

  $('#form-login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'post',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) return layer.msg('登录失败')
        layer.msg('登录成功')
        // location.href='index.html'  //!!!终于有了答案，顺便还知道了href和src的区别
        // open('index.html','_self')
        // location.reload([true])  // 重新加载当前页面，true清除缓存
        location.replace('index.html')  //当前页面不会记录在历史中
        // location.assign('index.html')  //  当前页面会记录在历史中
        localStorage.setItem('token', res.token)
      }
    })

  })


})