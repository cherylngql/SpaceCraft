import React, {Component} from 'react'
import {default as THREE} from 'three'
import {default as dragControls} from './controls/DragControls'
import {constructSelectedBox} from './controls/selectedBox'

//container for all 3d objects that will be affected by event
let objects = []

//renders the scene, camera, and cubes using webGL
const renderer = new THREE.WebGLRenderer()
const color = new THREE.Color('rgb(186, 218, 85)')
//sets the world background color
renderer.setClearColor(color)
//sets the resolution of the view
renderer.setSize(window.innerWidth, window.innerHeight)

//create a perspective camera (field-of-view, aspect ratio, min distance, max distance)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.y = 3
camera.position.z = 5
//This is hopefuly to enable the ghost perspective
// const controls = new THREE.FirstPersonControls(camera)
// controls.movementSpeed = 1000
// controls.lookSpeed = 0.125
// controls.lookVertical = true

//create a new scene
const scene = new THREE.Scene()
//allows for adding, deleting, and moving 3d objects with mouse drag
const controls = new dragControls(objects, camera, renderer.domElement, scene)

const light = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(light)
const pointLight = new THREE.PointLight(0xffffff, 0.8)
pointLight.position.set(0, 8, 2)
scene.add(pointLight)

const previewBox = constructSelectedBox(renderer.domElement, camera)
scene.add(previewBox)

document.body.appendChild(renderer.domElement)

for (let z = -10; z < 10; z += 1) {
  for (let x = -10; x <= 10; x += 1) {
    const y = 1
    let cube = makeUnitCube(x, y, z, 0xa52a2a)
    scene.add(cube)
    objects.push(cube)
  }
}

window.addEventListener('keydown', event => {
  //add movement
  switch (event.which) {
    case 87: //W
      camera.position.z -= 1
      break
    case 83: // S
      camera.position.z += 1
      break
    case 65: //A
      camera.position.x -= 1
      break
    case 68: //D
      camera.position.x += 1
      break
    case 69: //Q
      camera.position.y += 1
      break
    case 81: //E
      camera.position.y -= 1
      break
  }
})

// const clock = new THREE.Clock() //needed for controls
function render() {
  //   controls.update(clock.getDelta()) // needed for First Person Controls to work
  renderer.render(scene, camera)
}
function animate() {
  requestAnimationFrame(animate)
  render()
}

class Plane extends Component {
  componentDidMount() {
    animate()
  }
  render() {
    return null
  }
}

//helper function to create a cube but does not add to scene
function makeUnitCube(x, y, z, color = 0x0) {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshLambertMaterial({color}) //Lambert is so that the material can be affected by light
  const mesh = new THREE.Mesh(geometry, material)
  var geo = new THREE.EdgesGeometry(mesh.geometry)
  var mat = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2})
  var wireframe = new THREE.LineSegments(geo, mat)
  wireframe.renderOrder = 1
  mesh.add(wireframe)
  mesh.position.set(x, y, z)
  return mesh
}

//water flow by doing BFS from source
export default Plane