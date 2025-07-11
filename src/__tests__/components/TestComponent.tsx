import React, { useRef } from "react";
import "@testing-library/jest-dom";
import { useCanvasLayer } from "../../hooks/use-canvas-layer";
import { useRectangleDrawing } from "../../hooks/use-rectangle-drawing";
import { useMouseEvents } from "../../hooks/use-mouse-events";
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

  const { isDrawing, setIsDrawing, clearDrawing, rectCoords, setRectCoords } = useRectangleDrawing(layerCanvas, options);

  useMouseEvents(layerCanvas, isDrawing, setRectCoords, setIsDrawing);

  return (
    <div data-testid="container">
      <canvas ref={canvasRef} data-testid="main-canvas" width={50} height={300} />
      <div data-testid="isDrawing">{isDrawing.toString()}</div>
      <div data-testid="rectCoords">{JSON.stringify(rectCoords)}</div>
      {layerCanvas && <div data-testid="layer-attached" />}
      <button
        data-testid="startDrawing"
        onClick={() => setIsDrawing(true)}
      >
        Start Drawing
      </button>
      <button
        data-testid="clearDrawing"
        onClick={clearDrawing}
      >
        Clear
      </button>
    </div>
  );
}
