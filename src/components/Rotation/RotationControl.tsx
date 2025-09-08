import React from "react";
import RotationPresets from "./RotationPresets";
import RotationInputs from "./RotationInputs";
import RotationActions from "./RotationActions";

type Rotation = { x: number; y: number; z: number };

interface Props {
  rotation: Rotation;
  setRotation: React.Dispatch<React.SetStateAction<Rotation>>;
  applyRotation: () => void;
  onExport: () => void;
}

export default function RotationControl({
  rotation,
  setRotation,
  applyRotation,
  onExport,
}: Props) {
  return (
    <div className="viewer-input">
      <p>Rotate your model by input</p>
      <RotationPresets
        setRotation={setRotation}
        applyRotation={applyRotation}
      />
      <RotationInputs
        rotation={rotation}
        setRotation={setRotation}
        onEnter={applyRotation}
      />
      <RotationActions onRotate={applyRotation} onExport={onExport} />
    </div>
  );
}
