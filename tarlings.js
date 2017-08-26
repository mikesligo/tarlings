function start_tarlings() {
    var type = "WebGL"
    Math.radians = function(degrees) {
        return degrees * Math.PI / 180;
    };
    if(!PIXI.utils.isWebGLSupported()){
        type = "canvas"
    }
    var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

    var renderer = autoDetectRenderer(window.innerWidth, window.innerHeight);
    renderer.backgroundColor = 0x061639;

    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view);

    b = new Bump(PIXI);
    //Create a container object called the `stage`
    var stage = new Container();

    // 1. Friend
    // 2. Cousin
    // 3. Predator
    // 4. Food
    var numSprites = 10;
    loader
    .add("blue", "./blue.png")
    .add("green", "./green.png")
    .on("progress", loadProgressHandler)
    .load(setup);


    function loadProgressHandler() {
        console.log("progress: " + loader.progress + "%"); 
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomLocation() {
        var x = getRandomArbitrary(0, window.innerWidth);
        var y = getRandomArbitrary(0, window.innerHeight);
        return {
            'x':x,
            'y':y
        };
    }

    function setup() {
        var blue_sprites = [];
        var green_sprites = [];
        var blue_networks = [];
        var green_networks = [];
        for (var i=0; i< numSprites; i++){

            // 1. sprite x
            // 2. sprite y
            // 3. enemy x
            // 4. enemy y
            blue_networks.push(new Brainwave.Network(4, 2, 1, 5));
            green_networks.push(new Brainwave.Network(4, 2, 1, 5));

            var blue_sprite = new Sprite(resources.blue.texture);
            blue_sprite.anchor.x = 0.5
            blue_sprite.anchor.y = 0.5
            var locBlue = getRandomLocation();
            blue_sprite.position.set(locBlue.x, locBlue.y)
            stage.addChild(blue_sprite);
            var green_sprite = new Sprite(resources.green.texture);
            green_sprite.anchor.x = 0.5
            green_sprite.anchor.y = 0.5
            var locGreen = getRandomLocation();
            green_sprite.position.set(locGreen.x, locGreen.y)
            stage.addChild(green_sprite);
            blue_sprites.push(blue_sprite);
            green_sprites.push(green_sprite);
        }

        renderer.view.style.position = "absolute";
        renderer.view.style.display = "block";
        renderer.autoResize = true;
        renderer.render(stage);

        function set_sprite_pos(sprite, sprite_network, closestOther) {
            var output = sprite_network.run([
                sprite.x,
                sprite.y,
                closestOther.x,
                closestOther.y
            ])
            sprite.vx = (output[0] - 0.5) * 2;
            sprite.vy = (output[1] - 0.5) * 2;
            sprite.y += sprite.vy; 
            sprite.x += sprite.vx;
            if (sprite.x < 0) {
                sprite.x = 0;
            }
            else if (sprite.x > window.innerWidth) {
                sprite.x = window.innerWidth;
            }
            if (sprite.y < 0) {
                sprite.y = 0;
            }
            else if (sprite.y > window.innerHeight) {
                sprite.y = window.innerHeight;
            }
        }
        function run_sprites() {
            renderer.resize(window.innerWidth, window.innerHeight);
            var maxDistance = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
            requestAnimationFrame(run_sprites);

            var closestPairs = [];

            for (var i=0; i< numSprites; i++){
                var blue_sprite = blue_sprites[i]
                var closestDistance = 0;
                for (var j=0; j< numSprites; j++) {
                    var green_sprite = green_sprites[j];
                    var distance = Math.sqrt(Math.pow(green_sprite.x, 2) + Math.pow(green_sprite.y, 2));
                    if (closestDistance == 0 || distance < closestDistance) {
                        var closest = green_sprite;
                    }
                }
                closestPairs.push({'blue': blue_sprite, 'green': closest})
            }

            for (var i=0; i< numSprites; i++){
                set_sprite_pos(blue_sprites[i], blue_networks[i], closestPairs[i].green);
                set_sprite_pos(green_sprites[i], green_networks[i], closestPairs[i].green);
            }
            renderer.render(stage);
        };
        run_sprites();
    }
    PIXI.utils.sayHello(type)
};
