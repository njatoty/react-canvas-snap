import React, { useEffect, useRef, useState } from "react";
import Canvas, { type CapturedImage } from "../components/Canvas";
//@ts-ignore
import emoji from "./emoji.png";
//@ts-ignore
import qrcode from "./qrcode.png";

type Vertice = { x: number; y: number };
type HistoryDrawing = {
  show: boolean;
  vertices: Vertice[];
};
const initialCapturedImage: CapturedImage = {
  src: "",
  width: 0,
  height: 0,
  coordinates: undefined,
};
export const Demo = () => {
  const [capturing, setCapturing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] =
    useState<CapturedImage>(initialCapturedImage);

  const [history, setHistory] = useState<HistoryDrawing>({
    show: false,
    vertices: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the title (Hello my dear)
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Hello my friend,", 20, 40); // x, y coordinates

    // Draw the paragraph (Lorem ipsum)
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    const loremText = `This feature enables interactive canvas snapping in a React application.\nIt allows users to draw, select, or highlight specific regions on a canvas layer by capturing mouse input.\nThe snapping layer is positioned above the base canvas and styled for full-screen overlay.\nIt supports custom cursors and background fill for visual feedback during interactions.\nThis is ideal for use cases like cropping tools, annotation layers, or visual document validation.`;

    const lineHeight = 20;
    const maxWidth = 460; // Maximum width for the text

    let line = "";
    let yPosition = 70; // Starting y position for the paragraph

    // Split the text into words and draw each line
    loremText.split(" ").forEach((word) => {
      const testLine = line + word + " ";
      const width = ctx.measureText(testLine).width;

      if (width > maxWidth) {
        ctx.fillText(line, 20, yPosition);
        line = word + " ";
        yPosition += lineHeight;
      } else {
        line = testLine;
      }
    });

    // Draw the last line of text
    ctx.fillText(line, 20, yPosition);
    // Insert the image below the text
    const emojiImg = new Image();
    emojiImg.src = emoji;
    const qrImg = new Image();
    qrImg.src = qrcode;

    emojiImg.onload = () => {
      qrImg.onload = () => {
        const imageWidth = 180;
        const imageHeight = 180;
        const imageYPosition = yPosition - 0;

        // Position emoji on the left
        const emojiX = 0;

        // Position QR code to the right of emoji
        const qrX = emojiX + imageWidth + 150; // 20px spacing between them

        // Draw emoji
        ctx.drawImage(
          emojiImg,
          emojiX,
          imageYPosition,
          imageWidth,
          imageHeight
        );

        // Draw QR code
        ctx.drawImage(qrImg, qrX, imageYPosition, imageWidth, imageHeight);
      };
    };
  }, []);

  useEffect(() => {
    if (capturedImage.src && canvasRef.current) {
      const rect = capturedImage.coordinates!;

      // Normalize the four vertices
      const normalize = (value: number, size: number) => value / size;
      const canvasWidth = canvasRef.current.width;
      const canvasHeight = canvasRef.current.height;

      const topLeft = {
        x: normalize(rect.x, canvasWidth),
        y: normalize(rect.y, canvasHeight),
      };
      const topRight = {
        x: normalize(rect.x + rect.width, canvasWidth),
        y: normalize(rect.y, canvasHeight),
      };
      const bottomLeft = {
        x: normalize(rect.x, canvasWidth),
        y: normalize(rect.y + rect.height, canvasHeight),
      };
      const bottomRight = {
        x: normalize(rect.x + rect.width, canvasWidth),
        y: normalize(rect.y + rect.height, canvasHeight),
      };

      // Store the normalized vertices
      const normalizedVertices = [topLeft, topRight, bottomLeft, bottomRight];

      console.log(normalizedVertices);

      setHistory((prev) => ({ ...prev, vertices: normalizedVertices }));
    }
  }, [capturedImage, canvasRef]);

  // Convert the normalized coordinates to pixel coordinates
  const drawRectangle = (vertices: Vertice[]) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Convert normalized coordinates to pixel coordinates
        const topLeft = {
          x: vertices[0].x * canvasWidth,
          y: vertices[0].y * canvasHeight,
        };
        const topRight = {
          x: vertices[1].x * canvasWidth,
          y: vertices[1].y * canvasHeight,
        };
        const bottomLeft = {
          x: vertices[2].x * canvasWidth,
          y: vertices[2].y * canvasHeight,
        };
        const bottomRight = {
          x: vertices[3].x * canvasWidth,
          y: vertices[3].y * canvasHeight,
        };

        // Clear the canvas before drawing
        // ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw the rectangle
        ctx.beginPath();
        ctx.moveTo(topLeft.x, topLeft.y); // Move to the top-left corner
        ctx.lineTo(topRight.x, topRight.y); // Draw line to the top-right corner
        ctx.lineTo(bottomRight.x, bottomRight.y); // Draw line to the bottom-right corner
        ctx.lineTo(bottomLeft.x, bottomLeft.y); // Draw line to the bottom-left corner
        ctx.closePath(); // Close the path
        ctx.stroke(); // Stroke the path to draw the rectangle
      }
    }
  };

  useEffect(() => {
    // Draw the rectangle when the component is mounted
    if (history.show) {
      setCapturing(false);
      drawRectangle(history.vertices);
    }
  }, [history]);

  return (
    <div>
      {/* Guide */}
      <div style={{ marginTop: "2rem" }}>
        <h3>How to use:</h3>
        <ol>
          <li>Click "Start capture" to enable drawing mode.</li>
          <li>
            Click and drag on the canvas to draw a rectangle around the area you
            want to capture.
          </li>
          <li>
            Hit <kbd>Enter</kbd> key to capture the image.
          </li>
          <li>
            The captured image will be displayed on the right side with its
            coordinates.
          </li>
        </ol>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          style={{ marginRight: "1rem" }}
          onClick={() => setCapturing(!capturing)}
        >
          {!capturing ? "Start capture" : "Stop capture"}
        </button>
        {capturedImage.src && (
          <button
            type="button"
            onClick={() => setCapturedImage(initialCapturedImage)}
          >
            Clear captured image
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
        <Canvas
          ref={canvasRef}
          drawingEnabled={capturing}
          onCaptureCanceled={() => setCapturing(false)}
          onImageCaptured={(img) => setCapturedImage(img)}
          width={600}
          height={400}
          style={{
            outline: "1px dashed #989898",
          }}
        />
        <div
          style={{
            width: "100%",
            paddingInline: "1rem",
            height: "400px",
            border: "1px solid #ccc",
            overflowY: "auto",
          }}
        >
          <p>Captured Image: </p>
          {capturedImage.src ? (
            <>
              <img
                src={capturedImage.src}
                width={capturedImage.width}
                height={capturedImage.height}
                alt="captured image"
                style={{ objectFit: "contain" }}
              />
              <p>
                Coordinates:{" "}
                {capturedImage.coordinates
                  ? JSON.stringify(capturedImage.coordinates)
                  : "N/A"}
              </p>
            </>
          ) : (
            <p style={{ opacity: 0.6 }}>No image captured yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
