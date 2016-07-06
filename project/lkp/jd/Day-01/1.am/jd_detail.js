//封装$函数,专门负责按选择器查找元素
//比如:
//	$("选择器") -> 在整个页面查找和选择器匹配的元素集合
//  elem.$("选择器") -> 在elem下查找和选择器匹配的元素集合
window.$=HTMLElement.prototype.$=function(selector){
	//如果在全局调$,就用document.querySelectorAll
	//否则就直接用this.querySelectorAll
var result=(this==window?document:this).querySelectorAll(selector);
	//如果仅返回一个元素，则直接取出唯一的元素返回，不再返回集合
	result.length==1&&(result=result[0]);
	return result;
}//强调: $和jQuery中的$不一样！
/*顶部菜单栏*/
function show(){//弹出一级菜单，this->.app_jd, .service
	this.$("."+this.className+'>a').className="hover";
	this.$('[id$="_items"]').style.display="block";
}
function hide(){//隐藏一级菜单，this->.app_jd, .service
	this.$("."+this.className+'>a').className="";
	this.$('[id$="_items"]').style.display="none";
}
/*全部商品分类菜单*/
function toggleL1(){//显示或隐藏一级菜单
	//找到id为cate_box的ul,获取计算后的display属性
	var display=getComputedStyle($('#cate_box')).display
	//如果display为"none",就设置id为cate_box的ul的display属性为"block",否则设置为"none"
	$("#cate_box").style.display=display=="none"?"block":"none";
}
function toggleL2(){//this->li
	//在当前li下找class为sub_cate_box的div,获取计算后的display属性
	var display=getComputedStyle(this.$('.sub_cate_box')).display;
	//如果display为none，就设置当前li下class为sub_cate_box的div的display为block,否则设置为"none"
	this.$('.sub_cate_box').style.display=
								display=="none"?"block":"none";
	//在当前li下找h3元素,如果当前li下class为sub_cate_box的div的display为none，则清除h3的class，否则设置h3的class为hover
	this.$('h3').className=
		this.$('.sub_cate_box').style.display=="none"?"":"hover";
}
function showTab(e){//this->.main_tabs
	//获取事件对象e
	//获取目标元素target: ul li a
	//如果target不是ul
		//如果target是a
		//	设置target为target的父元素
		//如果target的class不是current
			//在当前ul下查找class为current的li，保存在curr中
			//找到id为product_detail下的class为show的元素，清除class
			//curr的i不是-1
				//找到id为product_detail下的所有id以product_开头的直接子元素，保存在divs中
				//获取divs中和curr的i属性相同位置的div，设置class为show
			//清除curr的class
			//设置target的class为curr
}
/*强调: 尽量不要用变量临时存储DOM元素对象
        容易形成闭包
	闭包缺点: 占用跟多内存，且不易释放——内存泄露
	解决: 随用随查 */
window.addEventListener('load',function(){
//顶部菜单栏
	//找到class为app_id的li，为li绑定鼠标进入事件为show
	$(".app_jd").addEventListener('mouseover',show);
	//找到class为app_id的li，为li绑定鼠标移出事件为hide
	$(".app_jd").addEventListener('mouseout',hide);
	//找到class为service的li，绑定鼠标进入事件为show
	$(".service").addEventListener('mouseover',show);
	//找到class为service的li，绑定鼠标移出事件为hide
	$(".service").addEventListener('mouseout',hide);
//全部商品分类
	//找到id为category的div，绑定onmouseover为toggleL1
	$('#category').addEventListener('mouseover',toggleL1);
	//找到id为category的div，绑定onmouseout为toggleL1
	$('#category').addEventListener('mouseout',toggleL1);
	//找到id为cate_box的ul下的所有li,保存在lis中
	var lis=$("#cate_box>li");
	for(var i=0;i<lis.length;i++){//遍历lis中每个li对象
		//为当前li对象绑定onmouseover和onmouseout事件为toggleL2
		lis[i].addEventListener('mouseover',toggleL2);
		lis[i].addEventListener('mouseout',toggleL2);
	}
//商品详情的页签
	//找到id为product_detail下的class为main_tabs的ul,绑定单击事件为showTab
});