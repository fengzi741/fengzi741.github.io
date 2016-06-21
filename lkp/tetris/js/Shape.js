//描述所有格子对象的构造函数
function Cell(r,c,src){
	this.r=r;//格子所在的行下标
	this.c=c;//格子所在的列下标
	this.src=src;//格子使用的图片路径
}
//定义描述旋转状态的构造函数
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	this.r0=r0;
	this.c0=c0;
	this.r1=r1;
	this.c1=c1;
	this.r2=r2;
	this.c2=c2;
	this.r3=r3;
	this.c3=c3;
}
//描述所有图形的公共属性和方法的父对象
function Shape(cells,src,orgi,states){
	this.cells=cells;//初始化格子数组
	this.orgi=orgi;//初始化图形对象的参照格下标
	this.states=states;//初始化图形对象的旋转状态数组
	this.statei=0;//初始化图形对象的默认状态为0(第一个状态)
	//遍历cells中每个格子
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].src=src;//设置当前格的src为src
	}
}
//在父类型原型对象中集中定义所有图形的图片路径
Shape.prototype.IMGS={
	T:"img/T.png",I:"img/I.png",O:"img/O.png"
};
//在父类型的原型对象中，添加下移，左移，右移的方法
Shape.prototype.moveDown=function(){//this->shape
	//遍历当前图形对象中每个cell
	for(var i=0;i<this.cells.length;this.cells[i].r++,i++);
};//shape.moveDown();
Shape.prototype.moveLeft=function(){
	for(var i=0;i<this.cells.length;this.cells[i].c--,i++);
};
Shape.prototype.moveRight=function(){
	for(var i=0;i<this.cells.length;this.cells[i].c++,i++);
};
Shape.prototype.rotateR=function(){//顺时针旋转一次
	//将当前对象的statei+1
	this.statei++;
	//如果statei>=当前图形对象的states的个数,就将statei改为0
	this.statei>=this.states.length&&(this.statei=0);
	this.rotate();
};
Shape.prototype.rotate=function(){
	//从当前对象的states数组中获得statei位置的状态对象state
	var state=this.states[this.statei];
	//state中保存的是:{r0:-1,c0:0,r1:0,c1:0,r2:+1,c2:0,r3:0,c3:-1}
	//从当前对象的cells数组中获得orgi位置的参照格对象orgCell
	var orgCell=this.cells[this.orgi];
	//遍历当前对象中的每个cell
	for(var i=0;i<this.cells.length;i++){
		//将cell的r修改为:orgCell.r+state对象中的["r"+i]属性值
		this.cells[i].r=orgCell.r+state["r"+i];
		//将cell的c修改为:orgCell.c+state对象中的["c"+i]属性值
		this.cells[i].c=orgCell.c+state["c"+i];
	}
};
Shape.prototype.rotateL=function(){//逆时针旋转一次
	//将当前对象的statei-1
	this.statei--;
	//如果statei<0，就将statei改为states元素个数-1
	this.statei<0&&(this.statei=this.states.length-1);
	this.rotate();
};
//创建T类型的构造函数，同时让T类型继承Shape
function T(){//new T();
	Shape.apply(this,[
		[//cells参数: 保存4个cell对象
			new Cell(0,3),new Cell(0,4),new Cell(0,5),
			              new Cell(1,4),
		],
		this.IMGS.T,
		1,
		[
			new State(0,-1,0,0,0,+1,+1,0),
			new State(-1,0,0,0,+1,0,0,-1),
			new State(0,+1,0,0,0,-1,-1,0),
			new State(+1,0,0,0,-1,0,0,+1)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(T.prototype,Shape.prototype);
//创建O类型的构造函数，同时让O类型继承Shape
function O(){
	Shape.apply(this,[
		[
			new Cell(0,4),new Cell(0,5),
			new Cell(1,4),new Cell(1,5)
		],
		this.IMGS.O,
		0,
		[
			new State(0,0,0,+1,+1,0,+1,+1)
		]
	]);
}
Object.setPrototypeOf(O.prototype,Shape.prototype);
//创建I类型的构造函数，同时让I类型继承Shape
function I(){
	Shape.apply(this,[
		[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(0,6)],
		this.IMGS.I,
		1,
		[
			new State(0,-1,0,0,0,+1,0,+2),
			new State(-1,0,0,0,+1,0,+2,0)
		]
	]);
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
//创建S类型的构造函数，同时让S类型继承Shape
function S(){//04 05 13 14 ,orgi=3 ,2个状态
}

//创建Z类型的构造函数，同时让Z类型继承Shape
function Z(){//03 04 14 15 ,orgi=2 ,2个状态
}

//创建L类型的构造函数，同时让L类型继承Shape
function L(){//03 04 05 13 ,orgi=1 ,4个状态
}

//创建J类型的构造函数，同时让J类型继承Shape
function J(){//03 04 05 15 ,orgi=1 ,4个状态
}