"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Lightweight Three.js background with a softly rotating low-poly icosahedron
// Runs client-side only; keeps pointer events disabled so UI remains interactive.
export default function ThreeBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<() => void>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1020, 10, 60);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x060912, 1);

    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x88aaff, 0.4);
    const key = new THREE.DirectionalLight(0x88ccff, 1.0);
    key.position.set(2, 2, 3);
    const rim = new THREE.PointLight(0x3355ff, 0.8);
    rim.position.set(-3, -1, -2);
    scene.add(ambient, key, rim);

    // Geometry: low-poly icosahedron with toon-like gradient
    const geometry = new THREE.IcosahedronGeometry(3, 1);
    // Slight vertex jitter to get low-poly facets
    const position = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const nx = (Math.random() - 0.5) * 0.05;
      const ny = (Math.random() - 0.5) * 0.05;
      const nz = (Math.random() - 0.5) * 0.05;
      position.setXYZ(i, position.getX(i) + nx, position.getY(i) + ny, position.getZ(i) + nz);
    }
    position.needsUpdate = true;

    const material = new THREE.MeshStandardMaterial({
      color: 0x5aa2ff,
      roughness: 0.35,
      metalness: 0.25,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Subtle floating particles
    const particles = new THREE.BufferGeometry();
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      particles,
      new THREE.PointsMaterial({ size: 0.05, color: 0x89aaff, transparent: true, opacity: 0.45 })
    );
    scene.add(points);

    let frame = 0;
    let raf = 0 as number | undefined as unknown as number;

    const onResize = () => {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    const animate = () => {
      frame += 0.01;
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.0025;
      mesh.position.y = Math.sin(frame) * 0.2;
      points.rotation.y -= 0.0008;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", onResize);
    onResize();
    animate();

    cleanupRef.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      particles.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };

    return cleanupRef.current;
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.9 }}
    />
  );
}
