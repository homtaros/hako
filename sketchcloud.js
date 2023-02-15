
// プレイヤーがページのマウスダウンかXキーの押し下げでジャンプする。
// => ジャンプ:上昇しその後下降、着地する。
// => アニメーションの変更がともなう

// プレイヤーのスプライト
let bernieSp;
// プレイヤーのアニメーション
let bernieWalkAnim;
let bernieJumpAnim;

// 地面スプライト
let groundSp;
//天井スプライト
let skySp
// 雲のグループ
let cloudGroup;
// 雲を生成する頻度 => 1秒に1回
// ゲームの難易度に関係する
const spawnObstacleInterval = 1000;
// 障害物を生成した時間をメモする変数
let lastSpawnTime;

// 自由に調整できるグローバルパラメータ
const GRAVITY = 1;
const JUMP = 8;

// スコアカウンタ
let score = 0;
let endingScore = 0;

// ゲームオーバーかどうか
let gameOver = false;

// 雲のスプライト修正 ==== start 01/19 add ===
let cloudImg;
function preload() {
    cloudImg = loadImage('assets/cloud.png');
}
// 雲のスプライト修正 ==== end   01/19 add ===

function setup() {
    new Canvas(800, 400);
    // プレイヤースプライトを作成
    bernieSp = new Sprite();
    bernieSp.width = 400;
	bernieSp.height = 400;
    // アニメーションを２つ追加
    // 雲のスプライト修正 ==== start 01/19 mod ===
    // bernieSp.addAnimation('running', 'assets_jump/bernie-walk-0.png', 4);
    bernieSp.addAnimation('running', 'assets_jump/bernie-walk-0.png', 4);
    // 雲のスプライト修正 ==== end   01/19 mod ===
    bernieSp.addAnimation('jumping', 'assets_jump/bernie-jump.png');
    bernieSp.scale = 0.2;
    // 歩きのアニメーションが速いので少し間引く
    bernieSp.animation.frameDelay = 12;
    bernieSp.debug = true;
    // 地面の上、少し左に配置
    bernieSp.position.x = width / 4;
    bernieSp.position.y = height - 30;
     // 当たり判定に使用する地面スプライト(イメージは追加しない)
     groundSp = new Sprite(width / 2, height, width, 30);
     groundSp.collider = 'static';
     // 後で組み込む地面イメージの色に合わせて、溶け込むようにする
     groundSp.shapeColor = color(121, 70, 32);
     groundSp.debug = true;
    //上へ突き抜けないための天井スプライト
    skySp = new Sprite(width / 2, height/100, width, 1);
    skySp.collider = 'static';
    skySp.visible = false;
     // 雲のグループ
     cloudGroup = new Group();
     // タイマーをスタート
     lastSpawnTime = millis();
}
function draw() {
	bernieSp.debug = false;
     // 背景の青
    background(0, 153, 255);
     // ゲームオーバーなら
     if (gameOver) {
        // スコア(秒数)を表示
        fill(255, 255, 0);
        text('GAME OVER', width / 2, height / 2);
        text('あなたは' + endingScore + "秒耐えました。", width / 2, height / 2 + 20);
        // プレイヤーを落下させ、画面下に消えたら削除する
        bernieSp.velocity.y += GRAVITY;
        //if (bernieSp.position.y > height) {
           // bernieSp.remove();
            // 世界が止まる
            noLoop();
        //}
        // そうでないなら、ゲームはつづいているので、必要な処理を行う
    }
    else {
        // スコアは、死なずに耐えている秒数
        score = millis() / 1000;
        // スコアを黄色で示す
        fill(255, 255, 0);
        text("耐えている時間： " + int(score) + " 秒", 10, 15);
        update();
    }
    drawSprites();
}

function update() {
// まず落下させる
    bernieSp.velocity.y += GRAVITY;
// 地面と衝突したら、それ以上落ちない
    if (bernieSp.collide(groundSp)) {
        bernieSp.changeAnimation("running");
        bernieSp.velocity.y = 0;
    }
// Xキーか左マウスボタンの押し下げでジャンプ
    if (kb.pressing("x") || mouse.pressing(LEFT) ) {
        bernieSp.changeAnimation("jumping");
    // -JUMP分だけ上昇
        bernieSp.velocity.y = -JUMP;
    }
// 障害物を生成
    spawnObstacle();
// プレイヤースプライトがいずれかの障害物と重なったら、
    // hitObstacle()コールバック関数が呼び出される
    //bernieSp.overlap(cloudGroup, hitObstacle);
    if (bernieSp.collide(cloudGroup)) {
        hitObstacle();
    }
}

function spawnObstacle() {
    // 直近の計測時からspawnObstacleIntervalだけ経過したら
    if (millis() > lastSpawnTime + spawnObstacleInterval) {
        // 雲のスプライト修正==== start 01/19 mod ===
        // const sp = new Sprite(random(width), random(height - 30), sp.width, sp.height, "rectangle");
        // sp.addImage('assets/cloud.png')
		const sp = new Sprite(width, random(height - 30), cloudImg.width, cloudImg.height, "rectangle");
        sp.addImage(cloudImg)
        // 雲のスプライト修正 ==== end   01/19 mod ===
        // 雲のスプライト修正 ==== start 01/19 del ===
        sp.scale = 0.2;
        // 雲のスプライト修正 ==== end   01/19 del ===
        // 右から左に進むように負のスピードを与える
        sp.velocity.x = -4;
        // 雲のスプライト修正 ==== start 01/19 del ===
        //sp.debug = true;
        sp.myName = 'cloudSp' + millis();
        // 雲のスプライト修正 ==== end   01/19 del ===
    // 障害物グループに追加
        cloudGroup.add(sp);
         // タイマーは障害物を生成するたびにリセット
         lastSpawnTime = millis();
    }
} 
// プレイヤースプライトがいずれかの雲と重なったら、ゲームオーバー
function hitObstacle() {
    //print('雲に当たった!');
    // 雲を削除
    cloudGroup.remove();
    // ゲームオーバー
    gameOver = true;
    // スコアの確定
    endingScore = int(score);
}
