function start_tarlings() {
    var type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
        type = "canvas"
    }
    var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

    var renderer = autoDetectRenderer(window.innerWidth, window.innerHeight);


    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view);

    //Create a container object called the `stage`
    var stage = new Container();

    loader
    .add("blue", "./blue.png")
    .add("green", "./green.png")
    .on("progress", loadProgressHandler)
    .load(setup);

    function loadProgressHandler() {
        console.log("loading"); 
    }
    function setup() {
        var blue_sprite = new Sprite(resources.blue.texture);
        var green_sprite = new Sprite(resources.green.texture);
        renderer.backgroundColor = 0x061639;

        //Tell the `renderer` to `render` the `stage`
        renderer.autoResize = true;
        renderer.view.style.position = "absolute";
        renderer.view.style.display = "block";
        renderer.autoResize = true;
        renderer.resize(window.innerWidth, window.innerHeight);

        stage.addChild(blue_sprite);
        stage.addChild(green_sprite);

        renderer.render(stage);
    }
    PIXI.utils.sayHello(type)
};
