import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { PLYLoader, OrbitControls } from "three-stdlib";
import RotationControl from "./Rotation/RotationControl";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [loading, setLoading] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const objectRef = useRef<THREE.Object3D | null>(null);

  const applyRotation = () => {
    if (objectRef.current) {
      objectRef.current.rotation.set(
        THREE.MathUtils.degToRad(rotation.x),
        THREE.MathUtils.degToRad(rotation.y),
        THREE.MathUtils.degToRad(rotation.z)
      );
    }
  };

  const exportPLY = () => {
    const current = objectRef.current;
    if (!current) {
      alert("No object to export.");
      return;
    }

    let geometry: THREE.BufferGeometry | null = null;
    if ((current as THREE.Mesh).geometry) {
      geometry = (current as THREE.Mesh).geometry;
    } else if ((current as THREE.Points).geometry) {
      geometry = (current as THREE.Points).geometry;
    }

    if (!geometry) {
      alert("No geometry found to export.");
      return;
    }

    const position = geometry.getAttribute("position");
    const color = geometry.getAttribute("color");
    const vertexCount = position.count;

    let header = "ply\nformat ascii 1.0\n";
    header += `element vertex ${vertexCount}\n`;
    header += "property float x\nproperty float y\nproperty float z\n";
    if (color) {
      header +=
        "property uchar red\nproperty uchar green\nproperty uchar blue\n";
    }
    header += "end_header\n";

    let body = "";
    for (let i = 0; i < vertexCount; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      if (color) {
        const r = Math.round(color.getX(i) * 255);
        const g = Math.round(color.getY(i) * 255);
        const b = Math.round(color.getZ(i) * 255);
        body += `${x} ${y} ${z} ${r} ${g} ${b}\n`;
      } else {
        body += `${x} ${y} ${z}\n`;
      }
    }

    const plyContent = header + body;
    const blob = new Blob([plyContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_model_ascii.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!file || !mountRef.current) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const contents = event.target?.result;
      if (!contents || typeof contents === "string") {
      setLoading(false);
      return;
    }

      const loader = new PLYLoader();
      const geometry = loader.parse(contents as ArrayBuffer);
      geometry.computeVertexNormals();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        (mountRef.current?.clientWidth || 600) /
          (mountRef.current?.clientHeight || 400),
        0.1,
        1000
      );

      camera.position.set(0, 0, 5);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        mountRef.current?.clientWidth || 600,
        mountRef.current?.clientHeight || 400
      );

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(renderer.domElement);
      }

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const gridHelper = new THREE.GridHelper(10, 10);
      scene.add(gridHelper);

      let object3D: THREE.Object3D;
      if (geometry.index) {
        const material = new THREE.MeshStandardMaterial({ color: 0x5588ff });
        object3D = new THREE.Mesh(geometry, material);
      } else {
        const material = new THREE.PointsMaterial({
          size: 0.01,
          vertexColors: geometry.hasAttribute("color"),
          color: 0x5588ff,
        });
        object3D = new THREE.Points(geometry, material);
      }

      objectRef.current = object3D;
      scene.add(object3D);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 0, 1).normalize();
      scene.add(light);

      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);

      camera.position.z = 1.5;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div className="upload-file">
  <p>Select a PLY file to view</p>
  <input
    id="file-input"
    type="file"
    accept=".ply"
    onChange={(e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }}
  />
  {loading && <p id="load">Chargement en cours...</p>}

  <div className="viewer-container">
    <div
      className={`viewer ${!file ? "viewer-blurred" : ""}`}
      ref={mountRef}
    >
      {!file && (
        <p
          style={{
            textAlign: "center",
            paddingTop: "2rem",
            color: "#fffcef",
          }}
        >
          Aucun fichier chargé.
        </p>
      )}
    </div>

    <div className= {!file ? "viewer-blurred" : ""}>
    <RotationControl
      rotation={rotation}
      setRotation={setRotation}
      applyRotation={applyRotation}
      onExport={exportPLY}
    />
    </div>
  </div>
</div>

  );
}
