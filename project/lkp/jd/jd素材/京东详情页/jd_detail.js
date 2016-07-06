//封装$函数，专门按选择器查找元素
//比如：$("选择器")->在整个页面查找和选择器匹配的元素的集合
//		elem.$("选择器")->在elem下查找和选择器匹配的元素的集合
window.$=HTMLElement.prototype.$=function(selector){
	//如果在全局调$，就用documen.querySelectorAll
	//否则就直接用this.querySelectorAll
	var result=(this==window?document:this).querySelectorAll(selector);
	result.length==1&&(result=result[0]);
	return result;
}//强调：$和jQuery中的$不一样

/*顶部菜单栏*/
function show(){//弹出一级菜单
	//this->.app_jd,.service
	this.$("."+this.className+'>a').className="hover";
	this.$('[id$="_items"]').style.display="block";
}
function hide(){//隐藏一级菜单
	//this->.app_jd,.service
	this.$("."+this.className+'>a').className="";
	this.$('[id$="_items"]').style.display="none";
}
/*全部商品分类菜单*/
function toggleL1(){//显示或隐藏一级菜单
	//找到id为cate_box的ul，获取计算后的display属性
	var display=getComputedStyle($('#cate_box')).display;
	//如果display为"none"，就设置id为cate_box的ul的display属性为"block",
	//					   否则设置为"none"
	$('#cate_box').style.display=display=="none"?"block":"none";
}
function toggleL2(){//this->li
	//在当前li下找class为sub_cate_box的div，获取计算后的display属性
	//如果display为none，就设置当前li下class为sub_cate_box的div的display为block，否则设置为"none"
	//在当前li下找h3元素,如果当前li下class为sub_cate_box的div的display为none，则清除h3的class，否则设置h3的class为hover
	var display=getComputedStyle(this.$('.sub_cate_box')).display;
	this.$('.sub_cate_box').style.display=display=="none"?"block":"none";
	this.$('h3').className=this.$('.sub_cate_box').style.display=="none"?"":"hover";
}
function showTab(e){//this->.main_tabs
	//获取事件对象e
	//获取目标元素target：ul li a
	//如果target不是ul
			//如果target是a
			//  设置target为target的父元素
			//如果target的class不是current
				//在当前ul下查找class为current的li，保存在curr中
				//找到id为product_detail下的class为show元素，清除class
				//target的i不是-1
					//找到id为product_detail下的所有id以product_开头的直接子元素，保存在divs中
					//获取divs中和target的i属性相同位置的div，设置class为show
				//清除curr的class
				//设置target的class为curr
	e=e||window.event;
	var target=e.srcElement||e.target;
	if(target.nodeName!="UL"){
		target.nodeName=="A"&&(target=target.parentNode);
		if(target.className!="current"){
			this.$('.current').className="";
			target.className='current';
			$('#product_detail>.show').className="";
			if(target.getAttribute('i')!=-1){
				var divs=$('#product_detail>[id^="product_"]');
				divs[target.getAttribute('i')].className="show";
			}
		}
	}
}
/*
	强调：尽量不要用变量临时存储DOM元素对象
		  容易形成闭包
		闭包缺点：占用更多内存，且不易释放--内存泄露
		解决：随用随查
*/
window.addEventListener('load',function(){
  //顶部菜单栏
	//找到class为app_jd的li，为li绑定鼠标进入事件为show
	$(".app_jd").addEventListener('mouseover',show);
	//找到class为app_jd的li，为li绑定鼠标移出事件为hide
	$(".app_jd").addEventListener('mouseout',hide);
	//找到class为service的li，为li绑定鼠标进入事件为show
	$(".service").addEventListener('mouseover',show);
	//找到class为service的li，为li绑定鼠标移出事件为hide
	$(".service").addEventListener('mouseout',hide);
  //全部商品分类
	  //找到id为category的div，绑定onmouseover为toggleL1
	  $('#category').addEventListener('mouseover',toggleL1);
	  //找到id为category的div，绑定onmouseout为toggleL1
	  $('#category').addEventListener('mouseout',toggleL1);
	  //找到id为cate_box的ul下的所有li，保存在lis中
	  var lis=$('#cate_box>ul>li');
	  //遍历lis中每个li对象
		//为当前对象的li绑定onmouseover和onmouseout事件为toggleL2
	  for (i=0;i<lis.length;i++){
		lis[i].addEventListener('mouseover',toggleL2);
		lis[i].addEventListener('mouseout',toggleL2);
	  }
  //商品详情的页签
	  //找到id为product_detail下的class为main——tabs的ul，绑定单击事件为showTab
	  $('#product_detail>.main_tabs').addEventListener('click',showTab);
  //放大图初始化
	   preview.init();
});
var preview={
	LICOUNT:0,//保存li的总数
	moved:0,//保存已经左移的li个数，左移一次+1，右移一次就-1
	LIWIDTH:0,//每个li的宽度
	STARTLEFT:0,//ul开始时的left值
	ul:null,//整个iconlist元素
	aLeft:null,//左边的按钮（其实是右移）
	aRight:null,//右边的按钮（其实是左移）

	MSIZE:0,//mask的宽和高
	SMSIZE:0,//supermask的宽和高
	MAX:0,//mask可用的最大top和left值
	mask:null,//保存mask元素
	smask:null,//保存superMask元素

	init:function(){
//icon_list的移动和图片切换
		//找到id为icon_list的ul，保存在当前对象的ul属性中
		//获得ul计算后的left值，转为浮点数，保存在当前对象的STARTLEFT中
		//找到id为icon_list下的所有li，获得长度，保存在当前对象的LICOUNT中
		//找到id为icon_list下的第一个子元素li，获得其计算后的width属性，转为浮点数，保存在当前对象的LIWIDTH中
		//找到id为preview下的h1下的class以backward开头的a，保存在aLeft中
		//找到id为preview下的h1下的class以forward开头的a，保存在aRight中
		//为两个a绑定click事件为move,同时为move方法提前绑定this为当前对象
		this.STARTLEFT=parseFloat(getComputedStyle($('#icon_list')).left);
		this.LICOUNT=$('#icon_list>li').length;
		this.LIWIDTH=parseFloat(getComputedStyle($('#icon_list>li:first-child')).width);
		this.aLeft=$('[class^="backward"]');
		this.aRight=$('[class^="forward"]');
		this.aLeft.addEventListener('click',move.bind(this));
		this.aRight.addEventListener('click',move.bind(this));
		//为ul绑定onmouseover事件为changeMImg
		this.ul.addEventListener('mouseover',changeMImg);
//mask随鼠标移动
	//获得id为mask的div，保存在mask中
	//获得mask计算后的width，转为浮点数，保存在MSIZE中
	//获得id为superMask的div，
	//获得smask计算后的width，转为浮点数，保存在SMSIZE中
	//为smask绑定鼠标进入事件为maskToggle
	//为smask绑定鼠标移出事件为maskToggle
	this.mask=$('#mask');
	this.MSIZE=parseFloat(getComputedStyle(this.mask).width);
	this.SMSIZE=parseFloat(getComputedStyle(this.smask).width);
	this.smask.addEventListener('mouseover',maskToggle);
	this.smask.addEventListener('mouseout',maskToggle);
	//计算MAX：SMSIZE-MSIZE
	this.MAX=this.SMSIZE-this.MSIZE;
	//为smask绑定鼠标移动事件为maskMove,同时提前绑定this为当前对象
	this.smask.addEventListener('mousemove',maskMove.bind(this));
	}
}
//放大图

//控制mask随鼠标移动
function maskMove(e){//this->preview
	//获得事件对象e
	//获得target
	//分别获得相对于当前父元素的鼠标的x和y坐标
	//计算mask的Top值：y-MSIZE/2
	//计算mask的Left值：x-MSIZE/2
	//如果如果top>MAX,就设置top为MAX，否则，如果top<0,就设置为0，否则不变
	//如果如果left>MAX,就设置left为MAX，否则，如果left<0,就设置为0，否则不变
	//设置mask的top等于top，设置mask的left等于left
	e=e||window.event;
	var target=e.srcElement||e.target;
	var x=e.offsetX;
	var y=e.offsety;
	var top=y-this.MSIZE/2;
	var left=x-this.MSIZE/2;
	top=top>this.MAX?this.MAX:(top<0?0:top);
	left=left>this.MAX?this.MAX:left<0?0:left;
	this.mask.style.top=top+"px";
	this.mask.style.left=left+"px";
	//修改largeDiv的背景位置为-2top和-2left
  $('#largeDiv').style.backgroundPosition=
						-16/7*left+"px "+-16/7*top+"px";
}
//控制mask的显示
function maskToggle(){
	//找到id为mask的div
	//如果div的className为"block",就改为none，否则改为"block"
	$('#mask').style.display=
		$('#mask').style.display=="block"?"none":"block";
	//找到id为largeDiv的元素，设置其display和mask的display一致
	$('#largeDiv').style.display=$('#mask').style.display;
	//获取id为mImg的元素的src属性: xxxxxx-m.jpg -> xxxxx-l.jpg
	var src=$('#mImg').src;
	//查找src中最后一个.的位置i
	var i=src.lastIndexOf('.');
	//截取0~i-1之间的子字符串，拼上l，再拼上src中i到结尾的剩余子字符串
	src=src.slice(0,i-1)+"l"+src.slice(i);
	//设置largeDiv的backgroundImage属性为url(src)
	$('#largeDiv').style.backgroundImage="url("+src+")";
}

//小图片的左右移动
function move(e){//this->preview对象
	//获得事件对象e
	//获得目标元素target
	//如果target的className中不包含_disabled
	//  如果target的className中包含forward
	//		当前对象的moved+1
	//		将当前对象的ul的left设置为：-LIWIDTH*moved+20
	e=e||window.event;
	var target=e.srcElement||e.target;
	if(target.className.indexOf('_disabled')==-1){
		this.moved+=target.className.indexOf('_disabled')!=-1?1:-1;
			this.ul.style.left=-this.LIWIDTH*this.moved+20+"px";
		//如果LICOUNT-moved==5
		//  在aRight的className后，追加_disabled
		//否则，如果moved==0
		//  在aLeft的className后，追加_disabled
		//否则
		//  设置aLeft的class为backward
		//  设置aRight的class为forward
		if (this.LICOUNT-this.moved==5){
			this.aRight.className="forward_disabled";
		}else if(this.moved==0){
			this.aLeft.className="backward_disabled";
		}else{
			this.aLeft.className="backward";
			this.aRight.className="forward";
		}
		
	}
}
//进入小图片，切换上方的中图片
function changeMImg(e){//this->ul
	e=e||window.event;//获得事件对象e
	var target=e.srcElement||e.target;//获得target
	if(target.nodeName=="IMG"){//如果target是IMG
		//获取target的src,保存在变量src中
		var src=target.src;
		//找到src中最后一个.的位置i
		var i=src.lastIndexOf('.');
		//截取0~i之前的子字符串，拼接上-m，再拼接上src中i到结尾的剩余子字符串，将拼接的结果保存回src中
		src=src.slice(0,i)+'-m'+src.slice(i);
		//找到id为mImg的img元素，直接设置src属性为src
		$('#mImg').src=src;
	}
}