import React, { useRef } from "react";
import "@testing-library/jest-dom";
import { useCanvasLayer } from "../../hooks/use-canvas-layer";
import { useRectangleDrawing } from "../../hooks/use-rectangle-drawing";
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

  const { isDrawing, setIsDrawing, clearDrawing } = useRectangleDrawing(layerCanvas, options);

  return (
    <div data-testid="container">
      <canvas ref={canvasRef} data-testid="main-canvas" />
      <div data-testid="isDrawing">{isDrawing.toString()}</div>
      {layerCanvas && <div data-testid="layer-attached" />}
      <button onClick={() => setIsDrawing(true)} data-testid="startDrawing">
        Start Drawing
      </button>
      <button onClick={clearDrawing} data-testid="clearDrawing">
        Clear
      </button>
    </div>
  );
}
