function $(id){ return document.getElementById(id); }
var tetris={//游戏主程序对象
	CSIZE:26,//保存每个格子的宽高
	RN:20,//总行数
	CN:10,//总列数
	OFFSET:15,//保存单元格区域距游戏界面边界的内边距

	shape:null,//保存当前正在下落的主角图形
	nextShape:null,//保存下一个备胎图形

	INTERVAL:200,//保存每次下落的速度(时间间隔)
	timer:null,//保存正在运行的动画的序号

	wall:null,//保存所有停止下落的方块的二维数据

	score:0,//保存游戏分数
	lines:0,//保存消除的总行数
	level:1,//保存当前游戏难度
	SCORES:[0,10,50,80,200],//保存消除的行数与分数的对应关系

	state:1,//保存游戏的状态
	RUNNING:1,//运行状态
	PAUSE:2,//暂停状态
	GAMEOVER:0,//游戏结束

	start:function(){//启动游戏
		this.state=this.RUNNING;//重置游戏状态为运行

		this.score=0;
		this.lines=0;
		this.level=1;

		this.shape=this.randomShape();//随机生成主角图形对象
		this.nextShape=this.randomShape();//随机生成备胎图形对象

		this.wall=[];//初始化方块墙
		//向wall中添加RN个行，每行初始化为CN个空元素
		for(var i=0;i<this.RN;i++){
			this.wall.push(new Array(this.CN));
		}
		var me=this;//留住this
		document.onkeydown=function(e){
			e=e||window.event;//获得事件对象e
			switch(e.keyCode){
				//如果按键号是37，就左移
				case 37: 
					me.state==me.RUNNING&&me.moveLeft(); 
					break;
				//如果按键号是39，就右移
				case 39: 
					me.state==me.RUNNING&&me.moveRight(); 
					break;
				//如果按键号是40，就下落一次
				case 40: 
					me.state==me.RUNNING&&me.moveDown(); 
					break;
				//如果按键号是38，就顺时针旋转
				case 38: 
					me.state==me.RUNNING&&me.rotateR(); 
					break;
				//如果按键号是90，就逆时针旋转
				case 90: 
					me.state==me.RUNNING&&me.rotateL(); 
					break;
				//如果按键号是83，就重新启动游戏
				case 83: 
					me.state==me.GAMEOVER&&me.start(); 
					break;
				case 80:
					me.state==me.RUNNING&&me.pause();
					break;
				//如果按键号是67，就从暂停状态恢复运行
				case 67:
					me.state==me.PAUSE&&me.myContinue();
					break;
				//如果按键号是81，就立刻结束游戏
				case 81:
					me.gameOver();
					break;
			}
		}
		this.timer=setInterval(//启动游戏下落动画
			this.moveDown.bind(this),this.INTERVAL);
		this.paint();//重绘一切
	},
	gameOver:function(){
		//修改游戏的状态为GAMEOVER
		this.state=this.GAMEOVER;
		clearInterval(this.timer);//停止定时器
		this.timer=null;//清空timer
		this.paint();
	},
	myContinue:function(){//从暂停状态恢复运行状态
		this.state=this.RUNNING;
	},
	pause:function(){//暂停游戏
		this.state=this.PAUSE;
		this.paint();
	},
	rotateR:function(){//让主角图形顺时针旋转
		this.shape.rotateR();
		if(!this.canRotate()){//如果不能旋转
			this.shape.rotateL();//让shape逆时针转回来
		}
	},
	canRotate:function(){//当前旋转后的图形，是否有越界和冲突
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell保存在变量cell中
			var cell=this.shape.cells[i];
			//如果cell的r<0或cell的r>=RN或cell的c<0或cell的c>=CN
			if(cell.r<0||cell.r>=this.RN
				||cell.c<0||cell.c>=this.CN){
				return false;//返回false
			}else if(cell.r<this.RN&&this.wall[cell.r][cell.c]){
				//否则，如果在wall中和cell相同位置，有格
				return false;//返回false
			}
		}//(遍历结束)返回true
		return true;
	},
	rotateL:function(){//让主角图形逆时针旋转
		this.shape.rotateL();
		if(!this.canRotate()){//如果不能旋转
			this.shape.rotateR();//让shape顺时针转回来
		}
	},
	canLeft:function(){//检查能否左移
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//现将当前格保存在变量cell中
			var cell=this.shape.cells[i];
			//如果cell的c等于0 或 在wall中cell的左侧已经有格
			if(cell.c==0||this.wall[cell.r][cell.c-1]){
				return false;//返回false
			}
		}//(遍历结束)返回true
		return true;
	},
	moveLeft:function(){//让shape左移一次
		if(this.canLeft()){
			this.shape.moveLeft();
		}
	},
	canRight:function(){//检查能否右移
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//现将当前格保存在变量cell中
			var cell=this.shape.cells[i];
			//如果cell的c等于CN-1 或 在wall中cell的右侧已经有格
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]){
				return false;//返回false
			}
		}//(遍历结束)返回true
		return true;
	},
	moveRight:function(){//让shape右移一次
		if(this.canRight()){
			this.shape.moveRight();
		}
	},
	randomShape:function(){//在7种图形中，随机生成一个新图形
		//在0~6之间生成随机整数r
		var r=parseInt(Math.random()*3);
		switch(r){
			//如果r是0，就返回一个新的O图形对象
			case 0: return new O(); break;
			//如果r是1，就返回一个新的I图形对象
			case 1: return new I(); break;
			//如果r是2，就返回一个新的T图形对象
			case 2: return new T(); break;
		}
	},
	landIntoWall:function(){//将停止下落的方块保存到wall中相同位置
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前格，保存在变量cell中
			var cell=this.shape.cells[i];
			//将cell保存在wall中和cell相同r，c位置
			this.wall[cell.r][cell.c]=cell;
		}
	},
	moveDown:function(){//将主角图形下落一次,然后重绘一起
		if(this.state==this.RUNNING){
			if(this.canDown()){//如果canDown
				this.shape.moveDown();//将主角图形下落一次
			}else{//否则(停止下落后...)
				this.landIntoWall();//先将shape中的格，搬到wall中
				var ls=this.deleteRows();//判断并消除行,返回消除行数
				this.lines+=ls;
				this.score+=this.SCORES[ls];
				if(!this.isGameOver()){//如果游戏没有结束
					//将nextShape的图形给shape
					this.shape=this.nextShape;
					//为nextShape生成新图形
					this.nextShape=this.randomShape();
				}else{//否则
					this.gameOver();
				}
			}
			this.paint();//重绘一切
		}
	},
	paintState:function(){//根据游戏状态，添加对应图片
		//如果游戏状态不是RUNNING
		if(this.state!=this.RUNNING){
			var img=new Image();//新建一个Image对象img
			//如果游戏状态为PAUSE,设置img的src属性为pause.png
			//						  否则设置为game-over.png
			img.src=this.state==this.PAUSE?
				"img/pause.png":"img/game-over.png";
			//将img对象追加到id为pg的元素下
			$("pg").appendChild(img);
		}
	},
	isGameOver:function(){//检查游戏是否结束
		//遍历备胎图形中每个cell对象
		for(var i=0;i<this.nextShape.cells.length;i++){
			//将当前cell保存在变量cell中
			var cell=this.nextShape.cells[i];
			//如果wall中存在和cell相同位置的格
			if(this.wall[cell.r][cell.c]){
				return true;//返回true
			}
		}//(遍历结束)返回false
		return false;
	},
	deleteRows:function(){//删除所有满格行
		//自低向上遍历wall中每一行,同时声明变量ls=0
		for(var r=this.RN-1,ls=0;r>=0;r--){
			//用isFullRow检测当前行，如果当前行是满格行
			if(this.isFullRow(r)){
				//用deleteRow方法删除当前行
				this.deleteRow(r);
				ls++;//将ls+1
				r++;//r留在原地
				if(ls==4){break;}//如果ls等于4，就退出循环
			}
		}//(遍历结束)返回ls
		return ls;
	},
	isFullRow:function(r){//检查当前行是否是满格行
		//如果将wall中r行，转为字符串后，其中能够找到开头的,或,,或结尾的逗号，就返回false，找不到，才返回true
	 return String(this.wall[r]).search(/^,|,,|,$/)!=-1?false:true;
	},
	deleteRow:function(delr){//删除指定行
		//从delr行向上遍历wall中剩余行
		for(var r=delr;r>0;r--){
			this.wall[r]=this.wall[r-1];//将r-1行赋值给r行
			for(var c=0;c<this.CN;c++){//遍历r行中的每个cell
				//如果当前cell有效，就将当前cell的r+1
				this.wall[r][c]&&this.wall[r][c].r++;
			}//(遍历完r行的所有cell后)
			//将r-1行初始化为CN个空元素的数组
			this.wall[r-1]=new Array(this.CN);
			//如果r-2行是空，则退出循环
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	canDown:function(){//判断主角图形是否可以继续下落
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//当前格保存在变量cell中
			var cell=this.shape.cells[i];
			//如果cell到底(cell的r==RN-1)或在cell的正下方，wall相同位置有格
			if(cell.r==this.RN-1
				||this.wall[cell.r+1][cell.c]){
				return false;//返回false
			}
		}//(遍历结束)返回true
		return true;
	},
	paintNext:function(){//在右上角绘制备胎
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历nextShape中的每个cell
		for(var i=0;i<this.nextShape.cells.length;i++){
			//将当前cell保存在变量中
			var cell=this.nextShape.cells[i];
			//创建一个Image对象img
			var img=new Image();
			//设置img的src为cell的src
			img.src=cell.src;
			//设置img的top为(r+1)*CSIZE+OFFSET
			img.style.top=(cell.r+1)*this.CSIZE+this.OFFSET+"px";
			//设置img的left为(c+10)*CSIZE+OFFSET
			img.style.left=
				(cell.c+10)*this.CSIZE+this.OFFSET+"px";
			//将img追加到frag中
			frag.appendChild(img);
		}//(遍历结束)将frag追加到id为pg的元素下
		$('pg').appendChild(frag);
	},
	paintWall:function(){//绘制墙中的所有格
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//r从RN-1开始，向上遍历wall中每个cell
		for(var r=this.RN-1;r>=0;r--){
			//如果当前行转为字符串不是""
			if(this.wall[r].join("")){
				for(var c=0;c<this.CN;c++){
					//将当前格临时保存在变量cell中
					var cell=this.wall[r][c];
					if(cell){//如果cell有效
						//创建一个Image对象img
						var img=new Image();
						//设置img的src为cell的src
						img.src=cell.src;
						//设置img的top为r*CSIZE+OFFSET
						img.style.top=
							cell.r*this.CSIZE+this.OFFSET+"px";
						//设置img的left为c*CSIZE+OFFSET
						img.style.left=
							cell.c*this.CSIZE+this.OFFSET+"px";
						//将img追加到frag中
						frag.appendChild(img);
					}
				}
			}else{//是空行，剩余的行，不再遍历
				break;
			}
		}//(遍历结束)将frag追加到id为pg的元素下
		$('pg').appendChild(frag);
	},
	paint:function(){//重绘一切
		//删除id为pg下的所有旧的img元素:/<img(.*?)>/ig
		$("pg").innerHTML=
			$("pg").innerHTML.replace(/<img(.*?)>/ig,"");
		this.paintShape();//重绘主角图形
		this.paintNext();//重绘备胎图形
		this.paintWall();//重绘方块墙
		this.paintScore();//重绘分数
		this.paintState();//重绘状态图片
	},
	paintScore:function(){//重绘分数
		//设置id为score的元素内容为score属性
		$('score').innerHTML=this.score;
		//设置id为lines的元素内容为lines属性
		$('lines').innerHTML=this.lines;
		//设置id为level的元素内容为level属性
		$('level').innerHTML=this.level;
	},
	paintShape:function(){//绘制主角图形
		//先创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历主角图形的cells数组中的每个cell对象
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前格子对象，临时保存在变量cell中
			var cell=this.shape.cells[i];
			//创建Image元素，保存在变量img中
			var img=new Image();
			//设置img的src，为cell的src
			img.src=cell.src;
			//设置img的top，为r*CSIZE+OFFSET
			img.style.top=cell.r*this.CSIZE+this.OFFSET+"px";
			//设置img的left，为?
			img.style.left=cell.c*this.CSIZE+this.OFFSET+"px";
			frag.appendChild(img);//将img追加到frag中
		}//(遍历结束)将frag追加到id为pg的元素下
		$("pg").appendChild(frag);
	}
}
window.onload=function(){tetris.start();}