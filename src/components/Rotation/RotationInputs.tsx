import React from "react";

type Rotation = { x: number; y: number; z: number };

interface Props {
  rotation: Rotation;
  setRotation: React.Dispatch<React.SetStateAction<Rotation>>;
  onEnter: () => void;
}

export default function RotationInputs({ rotation, setRotation, onEnter }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onEnter();
  };

  return (
    <ul>
      <li>
        <input
          type="number"
          placeholder="X rotation"
          value={rotation.x}
          onChange={(e) =>
            setRotation((prev) => ({
              ...prev,
              x: parseFloat(e.target.value) || 0,
            }))
          }
          onKeyDown={handleKeyDown}
        />
      </li>
      <li>
        <input
          type="number"
          placeholder="Y rotation"
          value={rotation.y}
          onChange={(e) =>
            setRotation((prev) => ({
              ...prev,
              y: parseFloat(e.target.value) || 0,
            }))
          }
          onKeyDown={handleKeyDown}
        />
      </li>
      <li>
        <input
          type="number"
          placeholder="Z rotation"
          value={rotation.z}
          onChange={(e) =>
            setRotation((prev) => ({
              ...prev,
              z: parseFloat(e.target.value) || 0,
            }))
          }
          onKeyDown={handleKeyDown}
        />
      </li>
    </ul>
  );
}
