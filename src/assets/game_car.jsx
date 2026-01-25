import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GAME_CONFIG } from "../location";

// Below function  formulates all the car materials and its logic.
export function GameCar(props) {
  const { scene } = useGLTF("/game_car.glb"); // destructing scene from full dictionary of mats, textures, scene etc.
  const carRef = useRef(); // reference object which will modify the real dom directly rather than reacts rendered virtual dom.

  // Track inputs
  const [direction, setDirection] = useState("northwest"); // Hook with -z as starting direction. hook used here so only car can update in full dom.

  // Shadows : traversing all mats ans placing shadows is removed for render optimiztion purposes.

  // Input Handling (Hold Space to Drift) :  Use effect is used as react updates everytime new occurs. so use effect code will run when certain conditions are met  in passing array is passed
  // 1. no array passed : code runs every render
  // 2. empty array passed [] : code runs first render
  // 3. () function : code works on unmount
  // 4. normal array with a prop : when prop value altered code will run.

  // This updates when array [props.gameState] changes.
  useEffect(() => {
    // key down will occur when space is hold and vice versa for keyup
    const handleKeyDown = (e) => {
      if (e.code === "Space" && props.gameState === "playing") {
        setDirection("northeast");
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space" && props.gameState === "playing") {
        setDirection("northwest");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [props.gameState]);

  // --- GAME LOOP ---

  // use Frame updates at each frame. It will render 60 times per second for 60fps monitor and so on for diff fps monitors.
  // so this is hardware based closure.
  //delta is part of r3f which gives time difference between current frame and last frame in seconds.
  useFrame((state, delta) => {
    if (!carRef.current) return; // This code is safety so useFrame will work only when car is in the scene and attached to reference. current is inbuilt dict obj of ref. rn it is undefinned.

    //Game over logic:
    // this will create dummy animation when game over occurs. rot of car and falling down.
    if (props.gameState === "gameover") {
      carRef.current.position.y -= 10 * delta;
      carRef.current.rotation.x += 5 * delta;
      carRef.current.rotation.z += 2 * delta;
      return;
    }

    // B. Driving Logic
    if (props.gameState === "playing") {
      const speed = GAME_CONFIG.car.speed * delta;

      // 1. ROTATION (The Leader)
      // Determine target angle
      const targetRotation = direction === "northwest" ? 0 : -Math.PI / 2; // expression ? value if true : value if false

      // Smoothly rotate the car body
      // 0.15 is the "Grip" factor. Higher = sharper turns. Lower = wider drift.
      // lerp heere is util function which will do linear interpolation between current rotation and target rotation.
      carRef.current.rotation.y = THREE.MathUtils.lerp(
        carRef.current.rotation.y,
        targetRotation,
        0.15
      );

      // 2. MOVEMENT . the car has now rotated towards target angle so we can move it forward in that direction.
      // Now we calculate velocity based on the CURRENT rotation of the car.
      // We use standard Trigonometry:
      // Sin(angle) gives us the X component (Right/Left)
      // Cos(angle) gives us the Z component (Forward/Back)
      const currentAngle = carRef.current.rotation.y;

      const velocityX = -Math.sin(currentAngle) * speed;
      const velocityZ = -Math.cos(currentAngle) * speed;

      // Apply velocity
      carRef.current.position.x += velocityX;
      carRef.current.position.z += velocityZ;

      // C. Collision Check. if car goes off road game over triggered.
      const currentPos = carRef.current.position;
      let isSafe = false;

      for (let i = 0; i < props.roadPositions.length; i++) {
        const tile = props.roadPositions[i];
        // below we find distance between car and tile using pythagorean theorem on x and z diff of tile and car.
        const dist = Math.sqrt(
          Math.pow(currentPos.x - tile[0], 2) +
            Math.pow(currentPos.z - tile[2], 2)
        );

        if (dist < 4.5) {
          isSafe = true;
          props.onScoreUpdate(i);
          break;
        }
      }
      if (!isSafe) props.onGameOver(); // isSafe remains false(as if wont work to make it true) means car is off road.
    } // playing mode ends here

    // D. Camera Follow
    if (props.gameState !== "gameover") {
      // vector 3 is three js class for 3d vectors and points. it has its own function of add so it becomes easier.
      // also now we calculate current ideal pos of camera based on car pos and config offset.
      const idealPos = new THREE.Vector3(
        carRef.current.position.x + GAME_CONFIG.camera.position[0],
        carRef.current.position.y + GAME_CONFIG.camera.position[1],
        carRef.current.position.z + GAME_CONFIG.camera.position[2]
      );
      state.camera.position.lerp(idealPos, 0.1); // remember lerp uses vectors so ideal pos is vector3 object.
      state.camera.lookAt(carRef.current.position); // lookAT is builtin funtion to look at car position.
    }
  });

  // --- RENDER THE CAR ---
  return (
    <group ref={carRef} position={props.position} scale={props.scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/game_car.glb");
