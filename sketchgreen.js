var px = 200;
var py = 350;
var pw = 40;
var ph = 20;
var ow = 30;
var oh = 30;
let oy = [0,1,2,3,4,5,6,7,8,9];
let oColor = [0,1,2,3,4,5,6,7,8,9];
let oWait = [0,1,2,3,4,5,6,7,8,9];
var score;
var hp;
var gseq; //ゲームの流れを管理
var mcnt; //メッセージ用カウンタ
function setup(){
    createCanvas(400, 400);
    noStroke();
    gameInit();
}
function draw(){
    background(0);
    if( gseq == 0){
        gamePlay(); //プレイ中の処理
    } else if( gseq == 1){
        gameOver(); //ゲームオーバー後の処理
    }
}
function playerDisp(){
    fill(255);
    rect(px, py, pw, ph, 5);
}
function playerMove(){
    px = mouseX;
    if( (px+pw) > width){
        px = width - pw;
    }
}
function objDisp(){
    for( i=0; i<10;  i++){
        if( oColor[i] == 0){
            fill(255, 0, 0);
        }else{
            fill(0,255,0);    
        }
        rect(i*40+5, oy[i], ow, oh, 5);
    } 
}
function objMove(){
    for(i=0; i<10; i++){
        if( oWait[i] > 0 ){
            oWait[i]--;
        } else {
            oy[i] += 2;
        }
        if( oy[i] > height ) {
            if(oColor[i] == 1){//緑のときだけ
                hp--;
            }
            objInit(i);
        }
    }
}
function objInit(no){
    oy[no] = 40;
    oColor[no] = floor(random(2));
    oWait[no] = floor(random(60,240));
}
function hitCheck(){
    var ox;
    for(i=0; i<10; i++){
        ox = i*40+5;
        //当たり判定
        if( ((px < (ox+ow))) && ((py+ph) > oy[i]) 
            && (py < (oy[i]+oh)) && ((py+ph) > oy[i]) ){
            if( oColor[i] == 1){//緑の時だけ得点
                score += 10;            
            } else {
                hp--;//赤ならダメージ
            }
            objInit(i);
        }
    }
}
function scoreDisp(){
    textSize(24);
    fill(255);
    text("score:"+score,10,25);
    text("HP:"+hp,300,25);
}
function gamePlay(){
    objDisp();
    objMove();
    playerMove();
    playerDisp();
    hitCheck();
    scoreDisp();
    if( hp < 1){
        gseq = 1; //ゲームオーバー
    }
}
function gameOver(){
    objDisp();
    playerDisp();
    scoreDisp();
    textSize(50);
    fill(255,255,0);
    text("GAME OVER",60,200);
    mcnt++;
    if((mcnt%60)< 40){
        textSize(20);
        fill(255);
        text("Click to retry",140,260);
    }
}
function gameInit(){
    for(i=0; i<10; i++){
        objInit(i);
    }
    score = 0;
    hp = 10;
    gseq = 0;
    mcnt = 0;
}
function mousePressed(){//クリックしたとき呼ばれる
    if( gseq == 1 ){//ゲームオーバー時
       gameInit();
    }
}