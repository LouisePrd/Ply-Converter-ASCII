import React from "react";

interface Props {
  setRotation: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
}

export default function RotationPresets({ setRotation }: Props) {
  return (
    <div className="preset-buttons">
      <div className="preset-button-reset">
        <button onClick={() => setRotation({ x: 0, y: 0, z: 0 })}>
          Reset Rotation
        </button>
      </div>
      <div className="basic-rotation-buttons">
        <button onClick={() => setRotation({ x: 90, y: 0, z: 0 })}>
          Rotate 90° on X
        </button>
        <button onClick={() => setRotation({ x: 0, y: 90, z: 0 })}>
          Rotate 90° on Y
        </button>
        <button onClick={() => setRotation({ x: 0, y: 0, z: 90 })}>
          Rotate 90° on Z
        </button>
      </div>
    </div>
  );
}
