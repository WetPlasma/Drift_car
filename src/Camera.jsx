import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { GAME_CONFIG } from "./location"; // 👈 Update import name

export function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    // 👇 Use GAME_CONFIG here
    camera.position.set(...GAME_CONFIG.camera.position);
    camera.lookAt(...GAME_CONFIG.camera.lookAt);
  }, [camera]);

  return null;
}
