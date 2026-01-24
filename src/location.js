// Exporting a constant object named GAME_CONFIG so other files can import it
export const GAME_CONFIG = {
  camera: {
    // [X, Y, Z] position relative to the car.
    // -20 (Left), 20 (Up), 20 (Back) creates that isometric angle.
    position: [-20, 20, 20],
    lookAt: [0, 0, 0], // The camera initially looks at the center of the world
    zoom: 30, // Since we use an Orthographic camera, 'zoom' controls how close things look, not Z position.
  },
  car: {
    initialPosition: [0, 1, 0], // x=0, y=1 (lifted up), z=0
    scale: 0.047, // Shrinking the huge Sketchfab model down to toy size
    rotation: [0, 0, 0], // Math.PI = 180 degrees. Faces the car away from the camera.
    speed: 30, // The car moves 15 units per second.
  },
  road: {
    scale: [1, 1, 1], // Default size for tiles
    gridSize: 6, // We calculated earlier that tiles are 6 units apart.
  },
};
