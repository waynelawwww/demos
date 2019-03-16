var easy = document.getElementsByClassName('easy')[0];
var usual = document.getElementsByClassName('usual')[0];
var hard = document.getElementsByClassName('hard')[0];
var slide = document.getElementsByClassName('slide')[0];
var fields = slide.getElementsByTagName('ul');
var clockm = document.getElementById('clockm'),
    clocks = document.getElementById('clocks');
var lock =1;
var endlock = 0;
var timer = null;


initGame();
chooseDegree();
gameStart();
function initGame(){
    easy.coor = coordinate(produce(easy,9,9));
    usual.coor = coordinate(produce(usual,16,16));
    hard.coor = coordinate(produce(hard,16,30));
    slide.addEventListener("contextmenu",function(e){
        e.preventDefault();
        return false;
    });
}

function produce(ele,x,y){
        ele.xlen = x;
        ele.ylen = y;
    var fragment = document.createDocumentFragment(),
        li;
    for(var i=0; i<x*y; i++){
        li = document.createElement('li');
        fragment.appendChild(li);
    }
    ele.appendChild(fragment);
    return ele;
}

function produceMine(ele,mineNumber){
    var _child = ele.children;
    var len = _child.length;
    var mx = [];
    var random = null;
    for(var i = 0; i < mineNumber; i++){
        do{
            random = Math.floor(Math.random()*len);
        }while( mx.indexOf(random) !== -1 );
        mx.push(random);
        _child[random].mine = 1;
    }
}


function coordinate(ele){
    var coor = [];
    var _child = ele.children;
    var len = _child.length;
    var k = 0;
    for(var i = 0; i < ele.xlen; i++){
            coor[i] = [];
            for(var j = 0; j< ele.ylen; j++){
                coor[i].push(_child[k]);
                coor[i][j].x = i;
                coor[i][j].y = j;
                if(k<len) k++;
            }
        }
    return coor;
}

function gameStart(){
    var reset = document.getElementsByClassName('reset')[0];
    for(var i = 0; i < fields.length; i++){
        (function(n){
            fields[n].addEventListener('mouseup',function(e){
                if(lock){
                    var _self = this;
                    var xlen = _self.xlen;
                    var ylen = _self.ylen;
                    scaner();
                    clock(e);
                    n!==1? _self.mineNum = 10+n*40:_self.mineNum = 40;
                    produceMine(_self,_self.mineNum);
                    reset.addEventListener('click',function(e){
                        clock(e);
                        lock = 1;
                        endlock = 0;
                        _self.innerHTML = "";
                        _self.coor = coordinate(produce(_self,xlen,ylen));
                        minenum.value = _self.mineNum;
                    })
                }
            })
        })(i)
    }
}

function chooseDegree(){
    var gamebutton = document.getElementsByClassName('gamebutton')[0],
        button = gamebutton.children,
        minenum = document.getElementById('minenum');
    for(var i = 0; i < button.length-1; i++){
        (function(n){
            button[n].addEventListener('click',function(e){
                if(lock){
                    n===1 ? minenum.value =40 : minenum.value = 10+n*40;
                    moveSlide(e,n)
                }
            });
        }(i));
    }
    function moveSlide(e,num){
        startMove(slide,{"top":-500*num});
        gamebutton.getElementsByClassName('on')[0].className=' ';
        e.target.className = 'on';
    }
}


function clock(e){
    clearInterval(timer);
    clockm.value = 0;
    clocks.value = 0;
    if(e.target.className === "reset") return;
    timer = setInterval(function(){
        if(clocks.value<60){
            clocks.value++
        }else{
            clocks.value = 0;
            clockm.value++ ;
        }
    },1000);
    lock = 0;
}

function scaner() {
    slide.addEventListener('mouseup',slideHandle);
}
function slideHandle(e) {
    target = e.target;
    minenum = document.getElementById('minenum');
    if (target.nodeName === 'LI') {
        if(e.which === 1){
            isWine(target);
            e.stopPropagation();
            console.log(2);
        }else if(target.className!=="safe"&& minenum.value >=0){
            if(target.className === "flag"){
                target.className = " ";
                minenum.value = parseInt(minenum.value)+1
            }else if(minenum.value !== "0"){
                target.className = "flag";
                minenum.value = minenum.value-1
            }
        }
    }
}

function isWine(ele) {
    if (ele.mine && !endlock) {
        gameover(ele);
    } else if(!endlock){
        ele.className = 'safe';
        safeExtend(ele);
        isWin(ele);
    }
}

function safeExtend(element) {
    var _parent = element.parentNode;
    var coor = element.parentNode.coor;
    var x = element.x - 1;
    var y = element.y - 1;
    var slock = 1;
    mineNum = 0;
    for (var i = x; i < x + 3; i++) {
        if (i < 0 || i > _parent.xlen -1) continue;
        for (var j = y; j < y + 3; j++) {
            if (j >=0 &&j < _parent.ylen&&coor[i][j].mine){
                slock = 0;
                mineNum++;
            }
        }
    }
    if(slock){
        for (var k = x; k < x + 3; k++) {
            if (k < 0 || k > _parent.xlen -1) continue;
            for (var l = y; l < y + 3; l++) {
                if (l >=0 &&l < _parent.ylen&&coor[k][l].className !== "safe") {
                    coor[k][l].className = "safe";
                    safeExtend(coor[k][l]);
                }
            }
        }
     }else{
        element.innerHTML = mineNum;
    }
}

function gameover(ele){
    var _parent = ele.parentNode;
    var _child = _parent.children;
    var arr = Array.prototype.slice.call(_child);
    arr.forEach(function(ele,index,array){
        ele.mine ? ele.className = "mine": ele.className="safe";
    });
    alert('YOU LOSE!');
    slide.removeEventListener('click',slideHandle);
    clearInterval(timer);
    endlock = 1;
}

function isWin(ele){
    var _parent =  ele.parentNode;
    var eles = _parent.getElementsByTagName('li');
    var safe = _parent.getElementsByClassName('safe');
    if(eles.length - safe.length ===_parent.mineNum){
        alert("YOU WIN! "+"only: "+(clockm.value*60+Number(clocks.value))+" seconds");
        slide.removeEventListener('click',slideHandle);
        clearInterval(timer);
        endlock = 1;
    }
}

