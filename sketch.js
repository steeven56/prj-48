var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var b1, b2, b3;
var t1, t2;
var bottomObs, bottomObsGroup;
var topObs, topObsGroup;
var c1, c2, c3;
var collect, collectGroup;
var score = 0;
var gamestate = "play";

var lose, jump, collectsound;

var reset, resetImg;



function preload() {
    bgImg = loadImage("assets/bg.png")

    balloonImg = loadAnimation("assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png")

    b1 = loadImage("assets/obsBottom1.png");
    b2 = loadImage("assets/obsBottom2.png");
    b3 = loadImage("assets/obsBottom3.png");

    t1 = loadImage("assets/obsTop1.png");
    t2 = loadImage("assets/obsTop2.png");

    c1 = loadImage("assets/coin.png");
    c2 = loadImage("assets/chips.png");
    c3 = loadImage("assets/water.png");

    resetImg = loadImage("assets/reset.png");

    lose = loadSound("assets/lose.wav");
    jump = loadSound("assets/air.wav");
    collectsound = loadSound("assets/collect.mp3")
}



function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20)
    balloon = createSprite(80, height / 2)
    balloon.addAnimation("flying", balloonImg)
    balloon.scale = 0.2

    bottomGround = createSprite(width / 2, height - 5, width, 10)

    topGround = createSprite(width / 2, 5, width, 10)

    reset = createSprite(width / 2 + 15, height / 2 + 80)
    reset.addImage(resetImg);
    reset.scale = 0.4;
    reset.visible = false;

    if (localStorage['highScore'] === undefined) {
        localStorage['highScore'] = int(0)
    }

    bottomObsGroup = new Group();
    topObsGroup = new Group();
    collectGroup = new Group();
}
function draw() {
    background(bgImg)
    if (gamestate === "play") {
        if (score > localStorage['highScore']) {
            localStorage['highScore'] = int(score)
        }

        if (keyDown("space")) {
            balloon.velocityY = -6
            jump.play()
            jump.setVolume(0.07)
        }

        if(keyDown(57)){
            localStorage['highScore'] =int(localStorage['highScore'])+1000
        }
        balloon.velocityY = balloon.velocityY + 0.8;

        for (var i = 0; i < collectGroup.length; i++) {
            if (collectGroup.get(i).isTouching(balloon)) {
                collectGroup.get(i).destroy()
                score = score + 1
                collectsound.play()
            }
        }
        if (bottomObsGroup.isTouching(balloon) || topObsGroup.isTouching(balloon) || balloon.isTouching(topGround) || balloon.isTouching(bottomGround)) {
            gamestate = "end"
            lose.play()
        }
        spawnBottomObstacles();
        spawnTopObstacles();
        spawnCollectables();
        balloon.collide(bottomGround);
        balloon.collide(topGround);

        stroke("red");
        fill("black")
        strokeWeight(2);
        textSize(30)
        text("score: " + score, width - 200, 100)
        text("High score: " + localStorage['highScore'], width - 450, 100)
    }
    if (gamestate === "end") {
        reset.visible = true;
        score = 0;

        collectGroup.destroyEach();
        topObsGroup.destroyEach();
        bottomObsGroup.destroyEach();
        balloon.x = 80;
        balloon.y = height / 2;
        balloon.velocityY = 0;
      
        fill("black")
        textSize(50);
        reset.depth = balloon.depth + 1
        text("GameOver", width / 2 - 110, height / 2);
        if (mousePressedOver(reset)) {
            restart()
        }
    }
    drawSprites();
}



function spawnBottomObstacles() {
    if (frameCount % 80 === 0) {
        bottomObs = createSprite(width, height - 135);
        var x = Math.round(random(1, 3));
        switch (x) {
            case 1: bottomObs.addImage(b1);
                bottomObs.y = bottomObs.y - 10;
                break;
            case 2: bottomObs.addImage(b2);
                break;
            case 3: bottomObs.addImage(b3);
                bottomObs.y = bottomObs.y - 10;
                break;
        }
        bottomObs.scale = 0.15;
        bottomObs.velocityX = -6;
        bottomObs.lifetime = 800;
        bottomObsGroup.add(bottomObs)
    }

}
function spawnTopObstacles() {
    if (frameCount % 60 === 0) {
        topObs = createSprite(width, 135);
        var x = Math.round(random(1, 2));
        switch (x) {
            case 1: topObs.addImage(t1);
                topObs.y = topObs.y + 10;
                break;
            case 2: topObs.addImage(t2);
                break;

        }
        topObs.y = Math.round(random(80, 200))
        topObs.scale = 0.15;
        topObs.velocityX = -6;
        topObs.lifetime = 800;
        topObsGroup.add(topObs)
    }
}

function spawnCollectables() {
    if (frameCount % 50 === 0) {
        collect = createSprite(width, height - 135);
        var x = Math.round(random(1, 3));
        switch (x) {
            case 1: collect.addImage(c1);
                collect.scale = 0.10;
                break;
            case 2: collect.addImage(c2);
                collect.scale = 0.15;
                break;
            case 3: collect.addImage(c3);
                collect.scale = 0.15;
                break;
        }

        collect.y = Math.round(random(200, height / 2 + 50));
        collect.velocityX = -6;
        collect.lifetime = 800;
        balloon.depth = collect.depth + 1
        collectGroup.add(collect)
    }

}

function restart() {
    reset.visible = false;
    gamestate = "play";
    score = 0;
    collectGroup.destroyEach();
    topObsGroup.destroyEach();
    bottomObsGroup.destroyEach();
    balloon.x = 80;
    balloon.y = height / 2;

}
