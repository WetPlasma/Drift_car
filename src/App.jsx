import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { GAME_CONFIG } from "./location";

function App() {
  // states to track game status and score
  const [gameState, setGameState] = useState("menu"); // Options: "menu", "playing", "gameover"
  const [score, setScore] = useState(0);

  // --- FUNCTIONS (What the App can do) ---

  // 1. Start the game
  function startGame() {
    setScore(0);
    setGameState("playing");
  }

  // 2. Restart the game (Simple page reload)
  function restartGame() {
    window.location.reload(); // Simple way to reset everything
  }

  // 3. Update Score (We pass this function down to the car!)
  function updateScore(newScore) {
    if (newScore > score) {
      setScore(newScore);
    }
  }

  // 4. Trigger Game Over (We pass this down too!)
  function triggerGameOver() {
    setGameState("gameover");
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Load the nice font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');`}</style>

      <Canvas
        dpr={[1, 1.5]}
        orthographic
        camera={{
          zoom: GAME_CONFIG.camera.zoom,
          position: GAME_CONFIG.camera.position,
        }}
      >
        {/* We pass our functions DOWN into the Scene, so the Car can use them */}
        <Scene
          gameState={gameState} // this prop tells Scene what state the game is in
          onGameOver={triggerGameOver} // this prop lets Scene tell App when the game is over and will run over animation
          onScoreUpdate={updateScore}
        />
      </Canvas>

      {/* --- UI (Top Left Score) --- */}
      {gameState !== "menu" && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "50px",
            pointerEvents: "none",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              color: "white",
              margin: 0,
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            {score}
          </h1>
        </div>
      )}

      {/* --- UI (Bottom Right Card) --- */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          right: "50px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          fontFamily: "'Quicksand', sans-serif",
          pointerEvents: "auto",
        }}
      >
        {/* MENU SCREEN */}
        {gameState === "menu" && (
          <div>
            <h1>Drift Boss</h1>
            <p>Press SPACE to turn.</p>
            <button onClick={startGame} style={buttonStyle}>
              Start Game
            </button>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState === "gameover" && (
          <div>
            <h1 style={{ color: "red" }}>Game Over</h1>
            <p>You fell!</p>
            <button onClick={restartGame} style={buttonStyle}>
              Try Again
            </button>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === "playing" && (
          <p style={{ fontWeight: "bold" }}>Playing...</p>
        )}
      </div>
    </div>
  );
}

// Simple styling for buttons to keep the JSX clean
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "1.2rem",
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

export default App;
