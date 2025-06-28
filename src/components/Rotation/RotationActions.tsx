import React from "react";

interface Props {
  onRotate: () => void;
  onExport: () => void;
}

export default function RotationActions({ onRotate, onExport }: Props) {
  return (
    <div className="actions">
      <button onClick={onRotate}>Rotate</button>
      <button onClick={onExport}>Export</button>
    </div>
  );
}
