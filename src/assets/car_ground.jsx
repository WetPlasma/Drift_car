import React from "react";
// Import hook to load the GLTF file
import { useGLTF } from "@react-three/drei";

// This component represents ONE single block of the road.
export function CarGround(props) {
  // Load the mesh data (geometry) and colors (materials)
  const { nodes, materials } = useGLTF("/car_ground.glb");

  return (
    // <group> allows us to treat the whole block as one object.
    // {...props} passes the 'position' and 'scale' from Scene.jsx directly to this group.
    <group {...props} dispose={null}>
      <group name="Scene">
        <group name="Plane">
          {/* MESH 1: The Top Face (Checkerboard pattern) */}
          <mesh
            name="Plane_1"
            geometry={nodes.Plane_1.geometry} // The flat square shape
            material={materials.checkered} // The white/green texture
          />

          {/* MESH 2: The Side Walls (3D thickness) */}
          <mesh
            name="Plane_2"
            geometry={nodes.Plane_2.geometry} // The sides
            material={materials["Material.001"]} // The solid green color
          />
        </group>
      </group>
    </group>
  );
}

// Preload to prevent loading lag
useGLTF.preload("/car_ground.glb");
