// 实现基本的剪裁效果
var $image = $('#image')
const options = {
  aspectRatio: 1,
  preview: '.img-preview'
}
$image.cropper(options)
// 裁剪区域图片替换 step: >>>
// step1: >>> 模拟文件上传表单的点击事件；
$('#btnChooseImg').on('click', function () {
  $('#file').click()
})
$('#file').on('change', function (e) {
  // step2: >>> 当文件上传表单发生变化时，获取用户选择的图片；
  var filelist = e.target.files
  if (filelist.length == 0) return layer.msg('请选择图片')
  // step3: >>> 拿到用户选择的文件；
  var file = e.target.files[0]
  // step4: >>> 将文件转化为路径；
  var imgURL = URL.createObjectURL(file)
  // step5: >>> 重新初始化裁剪区域；
  /* $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', imgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域 */

  $image
    .cropper('destroy')  // 销毁旧的裁剪区域
    .attr('src', imgURL)
    .cropper(options)
})

$('#btnUpload').on('click', function () {
  // 1. 拿到用户裁剪之后的头像
  // var dataURL=$image
  // .cropper('getCropperCanvas',{
  //   // 创建1个Canvas 画布
  //   width:100,
  //   height:100,
  // })
  // .toDataURL('image/png')  // 将Canvas画布上的内容，转化为base64格式的字符串
  var dataURL = $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 100,
      height: 100
    })
    .toDataURL('image/png')

  // 2. 调用接口，把头像上传到服务器
  $.ajax({
    url: '/my/update/avatar',
    method: 'post',
    data: {
      avatar: dataURL
    },
    success: res => {
      if (res.status != 0) return layer.msg('更换头像失败')
      layer.msg('更换头像成功')
      window.parent.getUserInfo()
    }

  })
})