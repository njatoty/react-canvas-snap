import React, { useRef } from "react";
import "@testing-library/jest-dom";
import { useCanvasLayer } from "../../hooks/use-canvas-layer";
import type { CanvasSnapOptions } from "../../types";

export default function TestCanvasLayer({
  drawingEnabled,
  options,
}: {
  drawingEnabled: boolean;
  options: CanvasSnapOptions;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { layerCanvas } = useCanvasLayer(canvasRef, drawingEnabled, options);

  return (
    <div data-testid="container">
      <canvas ref={canvasRef} data-testid="main-canvas" />
      {layerCanvas && <div data-testid="layer-attached" />}
    </div>
  );
}
