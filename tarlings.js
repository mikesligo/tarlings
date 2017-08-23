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

            blue_networks.push(new Brainwave.Network(4, 3, 1, 5));
            green_networks.push(new Brainwave.Network(4, 3, 1, 5));

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

        //Tell the `renderer` to `render` the `stage`
        renderer.autoResize = true;
        renderer.view.style.position = "absolute";
        renderer.view.style.display = "block";
        renderer.autoResize = true;
        renderer.resize(window.innerWidth, window.innerHeight);

        //        blue_sprite.rotation = Math.radians(180);

        renderer.render(stage);

        function run_sprites() {
            requestAnimationFrame(run_sprites);

            for (var i=0; i< numSprites; i++){
                var blue_sprite = blue_sprites[i]
                var output = blue_networks[i].run([
                    Math.radians(getRandomArbitrary(0,360)),
                    Math.radians(getRandomArbitrary(0,360)),
                    Math.radians(getRandomArbitrary(0,360)),
                    Math.radians(getRandomArbitrary(0,360))
                ])
                blue_sprite.rotation = (output[0] - output[1]);
                blue_sprite.vx = output[2] - 0.5;
                blue_sprite.vy = output[2] - 0.5;
                blue_sprite.x += blue_sprite.vx;
                blue_sprite.y += blue_sprite.vy;
            }
            renderer.render(stage);
        };
        run_sprites();
    }
    PIXI.utils.sayHello(type)
};
