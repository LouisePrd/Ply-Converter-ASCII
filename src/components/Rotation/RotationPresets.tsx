import React from "react";

interface Props {
  setRotation: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
  applyRotation?: () => void;
}

export default function RotationPresets({ setRotation }: Props) {
  const handleRotation = (x: number, y: number, z: number) => {
    setRotation({ x, y, z });
  };
  return (
    <div className="preset-buttons">
      <div className="preset-button-reset">
        <button onClick={() => handleRotation(0, 0, 0)}>
          Reset Rotation
        </button>
      </div>
      <div className="basic-rotation-buttons">
        <button onClick={() => handleRotation(90, 0, 0)}>
          Rotate 90° on X
        </button>
        <button onClick={() => handleRotation(0, 90, 0)}>
          Rotate 90° on Y
        </button>
        <button onClick={() => handleRotation(0, 0, 90)}>
          Rotate 90° on Z
        </button>
      </div>
    </div>
  );
}
