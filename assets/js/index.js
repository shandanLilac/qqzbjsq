$(function () {
  // const layer=layui.layer
  getUserInfo()  // Q：形参和实参这里是怎么配合简化代码的？A:不是这里，是renderAvatar函数哪里。
  $('.logout').on('click',function(){
    layer.confirm('确定吗?', {icon: 3, title:'提示'}, function(index){
      localStorage.removeItem('token')
      location.replace('login.html')
      layer.close(index);
    });
  })
})

function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    post: 'get',
    // headers:{Authorization:localStorage.getItem('token')},  //主要：h是小写，大写就会报错
    success: res => {
      // console.log(res);
      if (res.status != 0) return layer.msg('获取用户信息失败')
      renderAvatar(res.data)
    },
    // ??? 那个complet拿来的，写到这里为什么报错？
    // complete: function (res) {  // !!!!! 新东西：$.ajax()中，success:回调函数拿到的是服务器返回的数据，和error：回调互斥；而complete:回调拿到的是一个系统对象，不论请求到的是什么结果，都会返回这个对象，这个对象上有一个responseJSON属性，挂载着服务器返回的数据，如果返回的没有用户信息，则让它强制跳转到登录页面。
      // if (res.responseJSON.status != 0 && res.responseJSON.message == '身份认证失败'){
        // location.assign('login.html')
        // console.log(res);
      // }
    // }  // 备注：因为每次发送请求都要判断，不如把它写到ajaxPrefilter函数来得简便。
  })
}
function renderAvatar(user) {
  const name = user.nickname || user.username
  $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
  if (user.user_pic) {
    $('.layui-nav-img').prop('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first)
  }
}