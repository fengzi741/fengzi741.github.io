//$可直接使用
//window.onload=function(){xxx},会覆盖jd_index.js中的
//解决：
window.addEventListener('load',function(){

});
//定义全局函数getElementTop,获取任意元素距页面顶部的总距离
function gerElementTop(elem){
	var elemTop=elem.affsetTop;//获得elem距相对定位的父元素的top
	elem=elem.offsetParent;//将elem换成相对定位的父元素
	while(elem!=null){//只要还有相对定位的父元素
		//获得父元素距它父元素的top值，累加到结果中
		elemTop+=elem.offsetTop;
		//再次将elem换成它的相对定位的父元素
		elem=elem.offsetParent;
	}
	return elemTop;
}
var elevator={
	LEVELHEIGHT:0,//保存每层楼的高度：楼层高度+楼间距
	init:function(){
		var style=getComputedStyle($('#f1'));
		this.FLOORHEIGHT=parseFloat(style.height)+parseFloat(style.marginBottom);
		window.addEventListener('scroll',this.scroll.bind(this));
	},
	scroll:function(){//在页面滚动时，触发楼层亮灯的检测
		//找到所有.floor下的header下的直接子元素span保存在span中
		var span=$('.floor>header>span');
		//遍历span中的每个span
		for(var i=0;i<spans.length;i++){
			var top=getElementTop(spans[i]);
			var 
			//如果当前页面滚动的
			//scrollTop>elemTop-(innerHeight-FLOORHEIGHT)/2
				//清除当前span的class
			//否则，如果当前页面滚动的
			//scrolTop>elemTop-(innerHeight-FLOORHEIGHT)/2-FLOORHRIGHT
		}
	}
};