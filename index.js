//添加网格线
var container = $('.container')
var width = container.width()
var height = container.height()
var gap = 40
var domain = [-width/2/gap,width/2/gap]
var range = [-height/2/gap,height/2/gap]

///添加网格线
function addGrid(){
  var grid_v_htmlStr = ''
  for(var i = 1; i <= parseInt(width/2/gap);i++){
    grid_v_htmlStr += `
      <div class="grid-v-item" style="left:${i*gap}px;"></div>
      <div class="grid-v-item" style="left:-${i*gap}px;"></div>
    `
  }
  var grid_h_htmlStr = ''
  for(var i = 1; i <= parseInt(height/2/gap);i++){
      grid_h_htmlStr += `
      <div class="grid-h-item" style="bottom:${i*gap}px;"></div>
      <div class="grid-h-item" style="bottom:-${i*gap}px;"></div>
    `
  }
  $('.axis-h').html(grid_h_htmlStr)
  $('.axis-v').html(grid_v_htmlStr)
}
//将点映射到图形
function xValueToYvalue(x){
  return Math.pow(x,2)
}
function getValidDomainAndRange(){
  //到0.1
  rangeMappedDomain_max = Math.log2(range[1])
  if(rangeMappedDomain_max > domain[1]){
    range = [-xValueToYvalue(domain(1)),xValueToYvalue(domain(1))]

  }else{
    domain = [-rangeMappedDomain_max,rangeMappedDomain_max]
  }
}
function fromPostionToStyle(x,y){
  return `left:${x*gap}px;bottom:${y*gap}px;`
}
function renderChart(){
  var xValue = domain[0]
  var timer = setInterval(()=>{
    xValue += 0.005;
    if(xValue > domain[1]){
      clearInterval(timer);
      return;
    }
    var yValue = xValueToYvalue(xValue);
    if(yValue >= range[0] && yValue <= range[1]){
      var dotStyleStr = fromPostionToStyle(xValue,yValue)
      addDot(dotStyleStr)
    }
  },20)
  function addDot(dotStyleStr){
    $('.dot-box').append(`<div style="${dotStyleStr}" class="dot-item"></div>`)
  }
}
addGrid()
getValidDomainAndRange()
// 
//执行动画:画坐标轴
function renderAxis(callback){
  $('.axis-h').animate({
    width:'100%'
  },4000,
  'linear',function(){
    $(this).addClass('final');
    $('.axis-v').animate({
      height:'100%'
    },4000,
    'linear',function(){
      $(this).addClass('final');
      callback()
    })
  })
}
//执行动画：画网格线
function singleRender($node,type){
  //type可为横向h或纵向v
  return new Promise((res,rej)=>{
    if(type === 'h'){
      $node.animate({
        width:'100%'
      },2000,'linear',()=>{
        res()
      })
    }else{
      $node.animate({
        height:'100%'
      },2000,'linear',()=>{
        res()
      })
    }
  })
}
async function renderGrid($node,type){
  //一条一条地画
  if(!$node || $node.length == 0) {
    return Promise.resolve();
    // $node = $('.grid-v-item:eq(0)')
  }
  await singleRender($node,type)
  return renderGrid($node.next(),type)
}
async function renderAllGrid(){
  await renderGrid($('.grid-h-item:eq(0)'),'h')
  await renderGrid($('.grid-v-item:eq(0)'),'v')
  //执行空间变换
  $('.container').addClass('change1')
  setTimeout(()=>{
    $('.container').removeClass('change1')
    $('.container').addClass('change2')
  },5000)
  setTimeout(()=>{
    $('.container').removeClass('change2')
    $('.container').addClass('change3')
  },10000)
  setTimeout(()=>{
    $('.container').removeClass('change3')
    $('.container').addClass('change4')
  },15000)
  setTimeout(()=>{
    $('.container').removeClass('change4')
  },15000)
  //绘制点形状
  renderChart()
}
renderAxis(()=>{
  renderAllGrid()
});

