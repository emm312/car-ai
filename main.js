const carCanvas = document.getElementById('carCanvas');
carCanvas.width=200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width=300;
localStorage.setItem("bestBrain",'{"levels":[{"inputs":[0.23775003268019457,0.04768170801262894,0,0,0,0,0,0,0,0.06947936565739354],"outputs":[1,0,0,0,0,1],"biases":[-0.18725768129584433,0.19492650928760205,0.22413561232851126,0.2823426258202689,0.6028018735364837,-0.08565676373404853,0.0912186938719348,-0.4069940285290873,-0.1675815655898351,-0.8522340568935685],"weights":[[-0.2467108106714001,0.294061170731794,-0.10364856862186377,-0.4865405127119221,-0.2911751055123828,0.539592731532418],[-0.023893462184035708,-0.4553479266221349,-0.40589316832654276,0.09557498387279652,0.13075218634933822,0.5697770545307007],[0.03060010873318604,-0.20334143994082593,-0.6938034827963865,-0.4522941870677718,0.6409249845069085,0.6053032827789976],[-0.46951322829640807,-0.16643054634642862,0.34314121386903734,-0.6407440275522716,0.26267446025316665,0.6045379686657403],[-0.4880835287672058,-0.13907916637027362,-0.029259682195702488,-0.17636119529285488,0.5032606113131931,-0.5185706259550192],[-0.35920986860484305,-0.0035018677154437933,-0.6004032783022701,-0.24215505801153536,0.07529900412591889,0.08999627960683891],[-0.3573394236117377,0.19787154114653577,0.05579421548634807,0.24539753349449794,0.026960476229630475,0.2848003035458913],[-0.27958227521460544,-0.12630849252427367,-0.7556373653333459,-0.47564694325274265,-0.3749025555011265,-0.8033726214617661],[0.6738435387717521,0.5140581159651585,0.628512007671619,-0.09601272996449513,0.5229639836684742,-0.5917539892136059],[0.5572554566365232,-0.5332651367511131,-0.2774266943282224,0.2842989481892655,-0.5153916473672822,0.35411184504721926]]},{"inputs":[1,0,0,0,0,1],"outputs":[1,1,1,0],"biases":[-0.44489218779443784,0.0955654827916585,0.483684940079692,0.6799200279573934,0.5946765575983739,-0.08300748390344977],"weights":[[-0.05484172200272262,0.2833076278283752,0.341143545736601,-0.26189031694849607],[0.4983446549726352,0.027964647539335034,-0.6070485982257446,-0.39437572292047124],[-0.5580738964247142,-0.39697102718410743,-0.01993240154591156,-0.07444931457988432],[-0.3708131826810599,0.07369706766197014,-0.0415208683366676,-0.368262733202989],[-0.07555692813069047,-0.42860816581689243,-0.4423083492348653,0.4164760648607373],[-0.25892328430810807,-0.05109839634552378,0.511798940049839,-0.4451397766962214]]}]}');
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
const cars=generateCars(1)
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
];

animate();

function save() {
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}
function discard() {
    localStorage.removeItem("bestBrain")
}


function generateCars(n) {
    const cars = [];
    for (let i = 1; i<=n;i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50,"AI"));
    }
    return cars;
}

//setInterval(() => {
//    save();
//    location.reload();
//},30000);

function animate(time) {
    for (let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for (let i = 0;i<cars.length;i++) {
        cars[i].update(road.borders,traffic);
    }
    bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)))
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for (let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha = 0.1;
    for (let i = 0;i<cars.length;i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue",true)

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}