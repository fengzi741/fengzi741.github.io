/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems==null?null:elems.length==1?elems[0]:elems;
}
/*广告图片数组*/
var imgs=[
    {"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];
var slider={
	LIWIDTH:0,//保存每个li的宽度，其实就是slider div的宽度
	DURATION:2000,//每次滚动的总时长
	STEPS:50,//保存每次滚动的总步数
	INTERVAL:0,//保存每次移动的时间间隔
	moved:0,//记录本次动画已经移动的步数
	WAIT:3000,//每次自动轮播之间的等待时间间隔
	timer:null,//
	canAuto:true,//标识是否可以自动轮播
	init:function(){
		//获得id为slider的div计算后的width，转为浮点数后保存在LIWIDTH中
		//计算INTERVSL：DURATION/STEPS
		//初始化id为imgs的width为：LIWIDTH*imgs数组的元素个数
		this.LIWIDTH=parseFloat(getComputedStyle($('#slider')).width);
		this.INTERVAL=this.DURATION/this.STEPS;
		$('#imgs').style.width=this.LIWIDTH*imgs.length+"px";
		//根据imgs中数组的元素个数，向indexs中添加li
		for(var i=1,html="";i<=imgs.length;html+='<li>'+i+'</li>',i++);
		$('#indexs').innerHTML=html;
		this.updateView();
		//为id为indexs的ul绑定nomouseover事件，同时添加参数n
		$('#indexs').addEventListener('mouseover',function(e){//
			//获得事件对象
			e=e||window.event;
			var target=e.srcElement||e.target;
			//如果target是LI，且target的class不是hover
			if(target.nodeName=="LI"&&target.className!="hover"){
				this.move(
					target.innerHTML-$('#indexs>li.hover').innerHTML	
				);
			}
				
		}.bind(this));
		this.autoMove();//启动自动轮播
		//为id为slider的div绑定鼠标进入和移出事件
		$('#slider').addEventListener('mouseover',changecanAuto.bind(this));
		$('#slider').addEventListener('mouseout',changecanAuto.bind(this));
	},
	changeCanAuto:function(){
		this.canAuto=this.canAuto?false:true;
	},
	autoMove:function(){
		if(this.canAuto){//如果可以自动轮播
			this.timer=setTimeout(this.move.bind(this,1),this.WAIT);
		}else{//如果暂时不能自动轮播，就每隔WAIT秒询问一次
			this.timer=setTimeout(this.autoMove.bind(this,1),this.WAIT);
		}	
	},
	move:function(n){//启动移动动画
		clearTimeout(this.timer);//每次启动新动画之前都要停止当前动画，防止动画叠加
		this.timer=null;
		if(n<0){//如果n<0
			//从数组结尾删除-n个元素，拼接带数组开头
			imgs=imgs.splice(imgs.length-(-n),-n).concat(imgs);
			this.updateView();//更新页面
			//获得id为imgs的ul计算后的left
			var left=parseFloat(getComputedStyle($('#imgs')).left);
			//设置id为imgs的ul的left为left-(-n)*LIWIDTH
			$('#imgs').style.left=left-(-n)*this.LIWIDTH+"px";
		}
		this.moveStep(n);
	},
	moveStep:function(n){//移动动画的每一步
		//计算本次移动的总距离
		var distance=n*this.LIWIDTH;
		//计算每步步长
		var step=distance/this.STEPS;
		//获得id为imgs的ul计算后的left值，转为浮点数，保存在left中
		var left=parseFloat(getComputedStyle($('#imgs')).left);
		//将id为imgs的ul的left设置为left-step
		$('#imgs').style.left=left-step+"px";
		this.moved++;//当前对象的moved++
		if(this.moved<this.STEPS){//如果moved<STEPS
			setTimeout(this.moveStep.bind(this,n),this.interval);//启动下一次移动
		}else{//移动完了
			if(n>0){
				//删除数组开头的n个元素，再拼接到数组结尾
				imgs=imgs.concat(imgs.splice(0,n));
				//根据数组的新内容，更新页面
				this.updateView();
			}	
			//清除id为imgs的left属性
			$('#imgs').style.left="";
			//moved归零
			this.moved=0;
			this.autoMove();//只要当前动画轮播结束
		}
	},
	updateView:function(){//将数组的内容，更新到slider中
		//遍历imgs数组中每个对象
			//获取当前对象的imgs属性,保存在变量src中
			//将img属性拼接为:<li><img src="src"></li>
			//将src追加到html中
			
		//遍历结束
		//设置
		for(var i=0,html="";i<imgs.length;i++){
			html+='<li><img src="'+imgs[i].img+'"></li>';
		}
		$('#imgs').innerHTML=html;//设置id为imgs的内容为html
		//在id为indexs下找到现在class为hover的li，清除class
		$('indexs>li.hover').className="";
		//找到id为indexs下所有li，将位置和imgs数组中第一个元素的i值相同的li的class设置为hover
		$('#indexs>li')[imgs[0].i].className="hover";
	}
}
window.addEventListener('load',function(){

});