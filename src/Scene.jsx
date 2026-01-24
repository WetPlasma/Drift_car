import React, { useRef, useState, useEffect } from "react";
import { GameCar } from "./assets/game_car";
import { CarGround } from "./assets/car_ground";
import { GAME_CONFIG } from "./location";

// --- LEVEL DESIGN ---
// 1 = Straight, 0 = Turn
const FIXED_SEED = "1111110111111011111011110111111011111";

export function Scene(props) {
  // We accept 'props' (gameState, onGameOver, etc) from App.jsx

  const [roadPositions, setRoadPositions] = useState([]);

  // This runs ONE time when the game starts to build the road
  useEffect(() => {
    const road = [];
    let currentPos = [0, 0, 0]; // Start at 0,0,0
    road.push([...currentPos]);

    let isMovingX = false; // Start moving Forward (-Z)

    // Create a really long level string (Manual + Random)
    let fullLevel = FIXED_SEED;

    // Add 200 random blocks to the end so it never runs out
    for (let i = 0; i < 200; i++) {
      // 80% chance for '1' (Straight), 20% chance for '0' (Turn)
      if (Math.random() > 0.8) {
        fullLevel += "0";
      } else {
        fullLevel += "1";
      }
    }

    // Loop through every character in the string '11011...'
    for (let i = 0; i < fullLevel.length; i++) {
      const char = fullLevel[i];

      if (char === "0") {
        // If we see a 0, we switch direction
        isMovingX = !isMovingX;
      }

      // Now we move one step in the current direction
      if (isMovingX) {
        currentPos[0] += 6; // Move X
      } else {
        currentPos[2] -= 6; // Move Z (Forward is negative)
      }

      // Save this block location
      road.push([...currentPos]);
    }

    setRoadPositions(road);
  }, []); // Empty brackets [] means "Run once on load"

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        shadow-normalBias={0.05}
      />

      {/* Pass the functions we got from App down to the Car */}
      <GameCar
        roadPositions={roadPositions}
        gameState={props.gameState}
        onGameOver={props.onGameOver}
        onScoreUpdate={props.onScoreUpdate}
        // Config stuff
        position={GAME_CONFIG.car.initialPosition}
        scale={GAME_CONFIG.car.scale}
      />

      {/* Draw the Road */}
      <group>
        {roadPositions.map((pos, index) => (
          <CarGround
            key={index}
            position={pos}
            scale={GAME_CONFIG.road.scale}
          />
        ))}
      </group>

      {/* The Floor Void */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </>
  );
}
