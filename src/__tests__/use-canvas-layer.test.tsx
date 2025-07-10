import React from "react";
import { render } from "@testing-library/react";
import TestComponent from "./components/TestComponent";
import type { CanvasSnapOptions } from "../types";

describe("useCanvasLayer", () => {
  it("adds a cloned canvas layer when drawing is enabled", async () => {
    const options: CanvasSnapOptions = {
      cursor: "crosshair",
      rect: { outterBackgroundColor: "rgba(0,0,0,0.5)" },
      drawingEnabled: true,
    };

    const { container } = render(
      <TestComponent drawingEnabled={true} options={options} />
    );
    const mainCanvas = container.querySelector(
      'canvas[data-testid="main-canvas"]'
    );
    const layerCanvas = container.querySelector("canvas.rcs__drawer-layer");

    expect(mainCanvas).toBeInTheDocument();
    expect(layerCanvas).toBeInTheDocument();
    expect(layerCanvas).toHaveStyle({
      position: "absolute",
      cursor: "crosshair",
    });
  });

  it("does not add a layer if drawingEnabled is false", () => {
    const options: CanvasSnapOptions = {
      cursor: "crosshair",
      rect: { outterBackgroundColor: "rgba(0,0,0,0.5)" },
      drawingEnabled: true,
    };

    const { container } = render(
      <TestComponent drawingEnabled={false} options={options} />
    );
    const layerCanvas = container.querySelector("canvas.rcs__drawer-layer");

    expect(layerCanvas).not.toBeInTheDocument();
  });

  it("removes any existing layer before adding new one", () => {
    const options: CanvasSnapOptions = {
      cursor: "crosshair",
      rect: { outterBackgroundColor: "rgba(0,0,0,0.5)" },
      drawingEnabled: true,
    };

    const { rerender, container } = render(
      <TestComponent drawingEnabled={true} options={options} />
    );
    expect(container.querySelectorAll("canvas.rcs__drawer-layer")).toHaveLength(
      1
    );

    rerender(<TestComponent drawingEnabled={true} options={options} />);
    expect(container.querySelectorAll("canvas.rcs__drawer-layer")).toHaveLength(
      1
    ); // Still only one layer
  });
});
