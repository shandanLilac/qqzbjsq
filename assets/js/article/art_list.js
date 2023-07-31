$(function () {
  const layer = layui.layer
  const form = layui.form
  var laypage = layui.laypage

  // !!!!! 新东西：模板引擎：定义美化时间的过滤器.
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    var y = padZero(dt.getFullYear())
    var mon = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var h = padZero(dt.getHours())
    var m = padZero(dt.getMinutes())
    var s = padZero(dt.getSeconds())
    function padZero(n) {
      return n = n < 10 ? '0' + n : n
    }
    return `${y}-${mon}-${d}  ${h}:${m}:${s}`
  }
  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  initTable()
  // 难点：我的ev_articles里面只存储了cate_id,但看他接口文档返回的是cate_name，怎么搞？不管是新建一个专门的list数据表还是在ev_article_cate 和 ev_articles建立联系，数据库的连接操作都绕不过去了。先不管了，就把id当name吧。
  function initTable() {
    $.ajax({
      url: '/my/article/list',
      method: 'get',
      data: q,
      success: res => {
        if (res.status != 0) return layer.msg('获取文章列表失败')
        viewInPage(res.total)
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  function viewInPage(data) {
    laypage.render({
      elem: 'demo-laypage-data',
      count: data,  // 发现：服务器上一次只返回2条数据，等着点击按钮再返回按钮对应的数据（offset）；而这里的情况是我根据你返回数据的条数，生成相应数量的按钮，矛盾了。先返回所有的数据，在这里进行分页的相关处理，更加合理，得重写服务器程序。(later...)服务器用if判断，放开了数据数量限制。
      // 发现：又有1个问题，数据的数量是没问题了，但是，限制分页没法搞。思来想去，问题的关键在total那个参数。
      limit: q.pagesize,  // 根据文档写的，为啥不出效果？
      curr: q.pagenum,  // 忘了写这个属性，导致点击页码时出现异常。
      // limits:[2,3,5,10],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        // console.log(typeof obj.curr);  // Q:点击页数按钮，obj.curr的值会相应变化，可是给哪个元素添加事件、添加什么事件，来发ajax请求呢？A:点击页码时，会触发jump回调。
        // console.log(obj.limit);
        q.pagesize = obj.limit  // 这个忘了，困扰我好长时间。
        q.pagenum = obj.curr
        if (!first) initTable()
        // 触发回调的2种方式：1.first==true时，表示是调用laypage.render()方法触发的回调，此时会无限递归调用；2.first==false时，表示是点击页码触发的回调。
      }

    })
  }

  getArtCates()
  function getArtCates() {
    $.ajax({
      url: '/my/article/cates',
      method: 'get',
      success: res => {
        if (res.status != 0) return layer.msg('获取分类失败')
        var htmlStr = template('tpl-filter', res)
        // console.log($('#artcatename'));
        // $('#artcatename')[0].value=htmlStr
        // $('select[name=cate_id]').append(htmlStr)
        // $('#artcatename').append(htmlStr)
        // $('#artcatename').append('<option value="科技">科技</option>')  // Q：？A：呵呵哒，我说不出来。我写的东西没毛病，关键是少了最后一句。什么东西？
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }

  $('#form-search').on('submit', function (e) {
    // console.log(11);
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  $('tbody').on('click', '.btn-delete', function () {
    // console.log($(this).attr('data-id'));
    let len = $('.btn-delete').length
    $.ajax({
      url: '/my/article/delete/' + $(this).attr('data-id'),
      method: 'get',
      success: res => {
        if (res.status != 0) return layer.msg('删除数据失败')
        layer.msg('操作成功')
        // console.log(len);  //Q:为什么删除1个len的值是1,2个都删了，值还是1？A:你用id选择器肯定不行。
        if (len == 1) q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1  // Q:为什么q.pagenum--不行？
        // console.log(len,q.pagenum);
        initTable()
      }
    })
  })
})