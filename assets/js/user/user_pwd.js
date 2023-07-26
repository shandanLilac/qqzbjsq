$(function(){
  const form=layui.form
  form.verify({
    pwd:[/^\S{6,}$/,'请输入6位以上非空字符的密码'],
    newpwd:function(value){
      if($('[name=oldpwd]').val()==value) return '不能与原密码一致'
    },
    repwd:function(value){
      if($('[name=newpwd]').val()!=value) return '两次输入的密码不一致'
    }
  })

  $('form').submit(e=>{
    e.preventDefault()
    $.ajax({
      url:'/my/updatepwd',
      method:'post',
      // data:$(this).serialize(),  // Q:为什么$(this)不行？A:箭头函数没有this。
      data:$('form').serialize(),
      success:(res)=>{
        layer.msg(res.message)
      }
    })
    // console.log($('form')[0].serialize());
    // console.log($('form')==$(this));
    $('form')[0].reset()
    // 发现：重置按钮不用添加事件，本身就具有重置功能。那上面那句有必要写吗？
  })

})