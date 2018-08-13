import * as THREE from 'three'
import {makeUnitCube} from '../meshes'

THREE.DragControls = function(_objects, _camera, _domElement, _scene) {
  if (_objects instanceof THREE.Camera) {
    console.warn(
      'THREE.DragControls: Constructor now expects ( objects, camera, domElement )'
    )
    var temp = _objects
    _objects = _camera
    _camera = temp
  }
  var _shiftIsDown = false
  var _commandIsDown = false
  var _plane = new THREE.Plane()
  var _raycaster = new THREE.Raycaster()

  var _mouse = new THREE.Vector2()
  var _offset = new THREE.Vector3()
  var _intersection = new THREE.Vector3()

  var _selected = null,
    _hovered = null

  var scope = this

  function activate() {
    _domElement.addEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.addEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.addEventListener('mouseup', onDocumentMouseCancel, false) //able to release
    _domElement.addEventListener('mouseleave', onDocumentMouseCancel, false)

    window.addEventListener('keydown', onDocumentOptionDown, false)
    window.addEventListener('keyup', onDocumentOptionUp, false)
  }
  function onDocumentOptionDown(event) {
    if (event.which === 16) {
      _shiftIsDown = true
    }
    if (event.which === 91) {
      _commandIsDown = true
    }
  }
  function onDocumentOptionUp(event) {
    if (event.which === 16) {
      _shiftIsDown = false
    }
    if (event.which === 91) {
      _commandIsDown = false
    }
  }
  function deactivate() {
    _domElement.removeEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.removeEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false)
    _domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false)
    window.removeEventListener('keydown', onDocumentOptionDown, false)
    window.removeEventListener('keyup', onDocumentOptionUp, false)
  }

  function dispose() {
    deactivate()
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()

    var rect = _domElement.getBoundingClientRect()
    _mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    _raycaster.setFromCamera(_mouse, _camera)

    if (_selected && scope.enabled) {
      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _selected.position.copy(_intersection.sub(_offset))
        _selected.position.round()
      }

      return
    }

    var intersects = _raycaster.intersectObjects(_objects)

    if (intersects.length > 0) {
      var object = intersects[0].object

      _plane.setFromNormalAndCoplanarPoint(
        _camera.getWorldDirection(_plane.normal),
        object.position
      )

      if (_hovered !== object) {
        _domElement.style.cursor = 'pointer'
        _hovered = object
      }
    } else if (_hovered !== null) {
      _domElement.style.cursor = 'auto'
      _hovered = null
    }
    // _camera.rotation.
    _camera.rotation.y = -1 * _mouse.x * Math.PI // left or counterclockwise
    // _camera.rotation.z =0; // world tilt right
  }

  function onDocumentKeyDown(event) {
    if (event.which === 87) {
      _selected.position.z -= 1
      // _intersection.z -= 1;
      _offset.z += 1
    } else if (event.which === 83) {
      _selected.position.z += 1
      // _intersection.z += 1;
      _offset.z -= 1
    }
  }

  function onDocumentMouseDown(event) {
    event.preventDefault()
    _raycaster.setFromCamera(_mouse, _camera)

    var intersects = _raycaster.intersectObjects(_objects)

    if (intersects.length > 0) {
      _selected = intersects[0].object
      window.addEventListener('keydown', onDocumentKeyDown, false)
      if (_commandIsDown) {
        _scene.remove(_selected)
        _selected.geometry.dispose()
        _selected.material.dispose()
        _selected = undefined
        _objects = _scene.children
      }

      _domElement.style.cursor = 'move'
    }
    if (_shiftIsDown) {
      _domElement.style.cursor = _hovered ? 'pointer' : 'auto'
      const cubeColor = 0xb9c4c0
      const cube = makeUnitCube(
        _raycaster.ray.direction.x * 4 + _camera.position.x,
        _raycaster.ray.direction.y * 4 + _camera.position.y,
        _raycaster.ray.direction.z * 4 + _camera.position.z,
        cubeColor
      )
      cube.position.round()
      _scene.add(cube)
      _objects.push(cube)
    }
  }

  function onDocumentMouseCancel(event) {
    event.preventDefault()

    if (_selected) {
      window.removeEventListener('keydown', onDocumentKeyDown, false)
      _selected = null
    }

    _domElement.style.cursor = _hovered ? 'pointer' : 'auto'
  }

  activate()

  // API

  this.enabled = true

  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose

  // Backward compatibility

  this.setObjects = function() {
    console.error('THREE.DragControls: setObjects() has been removed.')
  }

  this.on = function(type, listener) {
    console.warn(
      'THREE.DragControls: on() has been deprecated. Use addEventListener() instead.'
    )
    scope.addEventListener(type, listener)
  }

  this.off = function(type, listener) {
    console.warn(
      'THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.'
    )
    scope.removeEventListener(type, listener)
  }

  this.notify = function(type) {
    console.error(
      'THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.'
    )
    scope.dispatchEvent({type: type})
  }
}

THREE.DragControls.prototype = Object.create(THREE.EventDispatcher.prototype)
THREE.DragControls.prototype.constructor = THREE.DragControls

export default THREE.DragControls