//this portion of the code fetches the div width and height. It's necessary to get this data in order to render correct scene dimensions for the site (and the 3D scene) to be responsive

//variables need to be defined globally, so the code can access the values assigned to them later on. They get the original div size assigned to them, because not everyone resizes their window (especially on mobile)
let animationDivHeight = document.getElementsByClassName("deform_landing_animation")[0].clientHeight;
let animationDivWidth = document.getElementsByClassName("deform_landing_animation")[0].clientWidth;

//this function is defined in order to access it when the window changes its dimensions
let animationDimensions = () => {
    animationDivHeight = document.getElementsByClassName("deform_landing_animation")[0].clientHeight;
    animationDivWidth = document.getElementsByClassName("deform_landing_animation")[0].clientWidth;
}

//this portion of the code listens to events tied with resizing the window. This is what makes the site responsive.
window.addEventListener("resize", animationDimensions);

//Sizes are set with every refresh, making the site responsive
const sizes = {
    width: animationDivWidth,
    height: animationDivHeight
}

//this part of the file is dedidated to THREE.js

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.OrthographicCamera( animationDivWidth / - 5, animationDivWidth / 5, animationDivHeight / 5, animationDivHeight / - 5, 0, 5000 );
camera.position.z = 300;
camera.lookAt(scene.position);

//light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 5).normalize();
scene.add(directionalLight);

// model
let mesh = null; //global variables
let mesh2 = null;
let logo_closed_anim = null;

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load('./3D/opened_no_modifier.mtl', function(materials) {

  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./3D/opened_no_modifier.obj', function(object) {

    mesh = object; //accessing the global variable
    mesh.position.x = 100;
    mesh.position.y = 100;
    mesh.position.z = -100;
    mesh.scale.x = 10;
    mesh.scale.y = 10;
    mesh.scale.z = 10;
    mesh.rotation.x = Math.PI * 0.25;
    mesh.rotation.y = Math.PI * 0.25;
    scene.add(mesh);

  });

});

mtlLoader.load('./3D/opened_no_modifier_orange.mtl', function(materials) {

  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./3D/opened_no_modifier_orange.obj', function(object) {

    logo = object; //accessing the global variable
    mesh2.position.y = 60;
    mesh2.position.x = 50;
    mesh2.position.z = -90;
    mesh2.scale.x = 5;
    mesh2.scale.y = 5;
    mesh2.scale.z = 5;
    mesh2.rotation.x = Math.PI * 0.25;
    mesh2.rotation.y = Math.PI * -0.25;
    scene.add(mesh2);

  });

});

mtlLoader.load('./3D/3d_logo_closed.mtl', function(materials) {

  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./3D/3d_logo_closed.obj', function(object) {

    logo_closed_anim = object; //accessing the global variable
    logo_closed_anim.position.y = 60;
    logo_closed_anim.position.x = 0;
    logo_closed_anim.position.z = 0;
    logo_closed_anim.scale.x = 30;
    logo_closed_anim.scale.y = 30;
    logo_closed_anim.scale.z = 30;
    logo_closed_anim.rotation.x = Math.PI * 0.25;
    logo_closed_anim.rotation.y = Math.PI * 0.75;
    scene.add(logo_closed_anim);

  });

});

//background color
scene.background = new THREE.Color( 0x93FAA5 );

//renderer
let canvas = document.getElementsByClassName("deform_landing_webgl")[0];
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
    mesh.scale.y = mesh.scale.y + 0.05;
  }

  if (mesh2 !== null) {
    mesh2.scale.y = mesh2.scale.y + 0.2;
  }

  if (logo_closed_anim !== null) {
    logo_closed_anim.scale.y = (Math.cos(elapsedTime) + Math.PI) * 40;
    logo_closed_anim.rotation.y = logo_closed_anim.rotation.y + 0.005;
  }

  //render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick); //tick is called with every screen refresh
}
  
tick();