const form = layui.form
var layer = layui.layer
$(function () {


  initArtCateList()

  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'post',
      url: '/my/article/addcates',
      data: $('#form-add').serialize(),
      success: res => {
        if (res.status != 0) return layer.msg('新增分类失败')
        initArtCateList()
        layer.msg('新增分类成功')
        layer.close(indexAdd)  // Q:没有这么个名字的弹出层啊？A:彬哥下面又说定义的事了。我本来也查了文档，只是我没有想到定义一个全局的空对象
      }
    })
  })

  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () { // 注意：jQuery事件委托的子元素的写法，不是$('.btn-edit')。可是我试了上面的加不加$选择器都可以啊，这里不加为什么不行？
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改分类',
      content: $('#dialog-edit').html()
    })
    $.ajax({
      url: '/my/article/querycate/' + $(this).attr('data-id'), // 目前，学了3中传参方式，query、params、body，需要前后端4个地方配合实现。
      method: 'get',
      // data:{id:$(this).attr('data-id')},
      success: res => {
        // console.log($(this).attr('data-id'));
        form.val('form-edit', res.data)
      }
    })
  })

  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/my/article/editcates',
      method: 'post',
      data: $(this).serialize(),
      success: res => {
        if (res.status != 0) return layer.msg('编辑失败')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })
})

$('body').on('click', '.btn-delete', function () {  // 试过了：body必须加引号。
  layer.confirm('确定吗?', { icon: 3, title: '提示' }, (index)=> {
    $.ajax({
      url: '/my/article/deletecate?id='+$(this).siblings().attr('data-id'), 
      method: 'get',
      // data:{id:$(this).siblings().attr('data-id')},
      success: res => {
        console.log($(this));
        if (res.status != 0) return layer.msg('操作失败')
        layer.msg('操作成功')
        initArtCateList()
      }
    })
    layer.close(index);
  })
})

function initArtCateList() {
  $.ajax({
    url: '/my/article/cates',
    method: 'get',
    success: res => {
      var htmlStr = template('tpl-table', res)  // !!!!! 新东西：这样配合使用的，以前没见过啊。
      $('tbody').html(htmlStr)
    }
  })
}
