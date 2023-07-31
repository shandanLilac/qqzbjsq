$(function(){
  const layer=layui.layer,form=layui.form

  function initCate(){
    $.ajax({
      url:'/my/article/cates',
      method:'get',
      success:res=>{
        if(res.status!=0)return layer.msg('获取文章分类失败')
        let htmlStr=template('tpl-option',res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }
  initCate()

  initEditor()

  var $image=$('#image')
  var options={
    aspectRatio:400/280,
    preview:'.img-preview'
  }
  $image.cropper(options)

  $('#btnChooseImage').on('click',function(){  // Q:为什么点上传文件表单，可以更换图片，点这个按钮就不行？1天了，找不出原因？A：button标签内少了个东西，这个东西是type="button"!!!
    $('#coverFile').click()
  })
  $('#coverFile').on('change',function(e){
    var files=e.target.files
    if(files.length==0) return
    var newImgURL = URL.createObjectURL(files[0])
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  var art_state='已发布'
  $('#btnSave2').on('click',function(){
    art_state='草稿'
  })

  $('#form-pub').on('submit',function(e){
    e.preventDefault()

    // !!!!! 新东西：同formData的格式提交数据，step: >>> 
    // step1: >>> 基于form表单，快速创建一个formData对象；
    var fd=new FormData($(this)[0])
    // step2: >>> 将文章的发布状态存到fd中
    fd.append('state',art_state)  //append的新用法，原来是给ul父元素追加li子元素。
    // step3: >>> 将裁剪好的图片，输出为1个文件对象，存到fd中；
    $image
    .cropper('getCroppedCanvas',{width:400,height:280})  // 谁又能想到他是cropped?
    .toBlob(function(blob){
      fd.append('cover_img',blob)
      publishArticle(fd)
    })
  })
  function publishArticle(fd){
    $.ajax({
      url:'/my/article/add',
      method:'post',
      data:fd,
      // step4: >>> 条件formData数据，必须添加一下2项配置。
      contentType:false,
      processData:false,
      success:res=>{
        if(res.status!=0)return layer.msg(res.message)
        layer.msg(res.message)
        open('/article/art_list.html','_self')  // Q：为什么打开的不是指定的路径，难道和fm有关？
      }
    })
  }
  

})