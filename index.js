//this portion of the code fetches the div width and height. It's necessary to get this data in order to render correct scene dimensions for the site (and the 3D scene) to be responsive

//variables need to be defined globally, so the code can access the values assigned to them later on. They get the original div size assigned to them, because not everyone resizes their window (especially on mobile)
let animationDivHeight = document.getElementsByClassName("animation")[0].clientHeight;
let animationDivWidth = document.getElementsByClassName("animation")[0].clientWidth;

//this function is defined in order to access it when the window changes its dimensions
let animationDimensions = () => {
    animationDivHeight = document.getElementsByClassName("animation")[0].clientHeight;
    animationDivWidth = document.getElementsByClassName("animation")[0].clientWidth;
}

//this portion of the code listens to events tied with resizing the window. This is what makes the site responsive.
window.addEventListener("resize", animationDimensions);

//Sizes are set with every refresh, making the site responsive
const sizes = {
    width: animationDivWidth,
    height: animationDivHeight
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 1, 2000);
camera.position.z = 250;
camera.lookAt(scene.position);

const directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1).normalize();
scene.add(directionalLight);

// model
let mesh = null; //global variable

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load('./3D/opened_no_modifier.mtl', function(materials) {

  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./3D/opened_no_modifier.obj', function(object) {

    mesh = object; //accessing the global variable
    mesh.position.y = 0;
    mesh.scale.x = 10;
    mesh.scale.y = 10;
    mesh.scale.z = 10;
    scene.add(mesh);

  });

});

//background color
scene.background = new THREE.Color( 0xff0000 );

//renderer
let canvas = document.getElementsByClassName("webgl")[0];
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setClearColor(0x000000);
renderer.setSize(sizes.width, sizes.height);

//clock
const clock = new THREE.Clock(); //importing the clock in order to make the animations take as much time on any refresh rate screen 

//animations
const tick = () => {

  //measuring time
  const elapsedTime = clock.getElapsedTime();
 
  if (mesh !== null) {
    mesh.rotation.x = Math.sin(elapsedTime) * 1;
    mesh.rotation.y = Math.cos(elapsedTime) * 0.5;
  }

  //render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick); //tick is called with every screen refresh
}
  
tick();