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
let logo_opened = null; //global variables
let logo_opened_copy1 = null;
let logo_closed_anim = null;

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load('./3D/3d_logo_opened.mtl', function(materials) {

  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./3D/3d_logo_opened.obj', function(object) {

    logo_opened = object; //accessing the global variable
    logo_opened.position.x = 110;
    logo_opened.position.y = -50;
    logo_opened.position.z = -100;
    logo_opened.scale.x = 10;
    logo_opened.scale.y = 10;
    logo_opened.scale.z = 10;
    logo_opened.rotation.x = Math.PI * 0.25;
    logo_opened.rotation.y = Math.PI * 0.25;
    //scene.add(logo_opened);

  });

});

mtlLoader.load('./3D/3d_logo_opened_teal.mtl', function(materials) {

  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./3D/3d_logo_opened_detailed.obj', function(object) {

    logo_opened_copy1 = object;
    logo_opened_copy1.position.x = 0;
    logo_opened_copy1.position.y = 30;
    logo_opened_copy1.position.z = -1000;
    logo_opened_copy1.scale.x = 50;
    logo_opened_copy1.scale.y = 200;
    logo_opened_copy1.scale.z = 50;
    logo_opened_copy1.rotation.x = Math.PI * 0.25;
    logo_opened_copy1.rotation.y = Math.PI * 0.75;

  });

});

mtlLoader.load('./3D/3d_logo_closed.mtl', function(materials) {

  materials.preload();

  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./3D/3d_logo_closed.obj', function(object) {

    logo_closed_anim = object; //accessing the global variable
    logo_closed_anim.position.y = 10;
    logo_closed_anim.position.x = 0;
    logo_closed_anim.position.z = 0;
    logo_closed_anim.scale.x = 30;
    logo_closed_anim.scale.y = 30;
    logo_closed_anim.scale.z = 30;
    logo_closed_anim.rotation.x = Math.PI * 0.25;
    logo_closed_anim.rotation.y = Math.PI * 0.75;
    //scene.add(logo_closed_anim);

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

//date
let Landing_date = new Date();
let seconds = Landing_date.getSeconds();

//clock
const clock = new THREE.Clock(); //importing the clock in order to make the animations take as much time on any refresh rate screen 

//animations
const tick = () => {

  //measuring time
  const elapsedTime = clock.getElapsedTime();

  if (seconds % 5 === 0) { //this is a fun one; depending on the division remainder we pick different animations!
    if (logo_opened !== null) {
      if (elapsedTime < 10) { //limiting the final y scale of the mesh (by using a set amount of secounds), so it doesn't render indefinately
        scene.add(logo_opened);
        logo_opened.scale.y = logo_opened.scale.y + (elapsedTime * 0.05);
      }
    }
  } else if (seconds % 3 === 0) {
    if (logo_closed_anim !== null) {
      scene.add(logo_closed_anim);
      logo_closed_anim.scale.y = (Math.cos(elapsedTime) + Math.PI) * 20;
      logo_closed_anim.rotation.y = logo_closed_anim.rotation.y + 0.005;
    }
  } else {
    if (logo_opened_copy1 !== null) {
      scene.add(logo_opened_copy1);
      logo_opened_copy1.rotation.y = logo_opened_copy1.rotation.y + 0.001;
    }
  }

  //render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick); //tick is called with every screen refresh
}
  
tick();