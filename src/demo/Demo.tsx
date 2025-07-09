import React, { useEffect, useRef, useState } from 'react'
import Canvas, { type CapturedImage } from '../components/Canvas'
//@ts-ignore
import emoji from './emoji.png'

type Vertice = { x: number, y: number };
type HistoryDrawing = {
    show: boolean;
    vertices: Vertice[]
}
export const Demo = () => {

    const [capturing, setCapturing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<CapturedImage>({
        src: '',
        width: 100,
        height: 100,
    });

    const [history, setHistory] = useState<HistoryDrawing>({
        show: false,
        vertices: []
    });


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw the title (Hello my dear)
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Hello my friend,', 20, 40); // x, y coordinates

        // Draw the paragraph (Lorem ipsum)
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

        const lineHeight = 20;
        const maxWidth = 460; // Maximum width for the text

        let line = '';
        let yPosition = 60; // Starting y position for the paragraph

        // Split the text into words and draw each line
        loremText.split(' ').forEach(word => {
            const testLine = line + word + ' ';
            const width = ctx.measureText(testLine).width;

            if (width > maxWidth) {
                ctx.fillText(line, 20, yPosition);
                line = word + ' ';
                yPosition += lineHeight;
            } else {
                line = testLine;
            }
        });

        // Draw the last line of text
        ctx.fillText(line, 20, yPosition);


        // Insert the image below the text
        const img = new Image(); // Create a new image element
        img.src = emoji; // Replace with your image path

        img.onload = () => {
            const imageWidth = 200; // Set desired width
            const imageHeight = 200; // Set desired height
            const imageYPosition = yPosition - 30; // Add some padding below the text
            const imageXPosition = 0; // Adjust as needed

            // Draw the image on the canvas
            ctx.drawImage(img, imageXPosition, imageYPosition, imageWidth, imageHeight);
        };
    }, []);

    useEffect(() => {

        if (capturedImage.src && canvasRef.current) {

            const rect = capturedImage.coordinates!;

            // Normalize the four vertices
            const normalize = (value: number, size: number) => value / size;
            const canvasWidth = canvasRef.current.width;
            const canvasHeight = canvasRef.current.height;

            const topLeft = { x: normalize(rect.x, canvasWidth), y: normalize(rect.y, canvasHeight) };
            const topRight = { x: normalize(rect.x + rect.width, canvasWidth), y: normalize(rect.y, canvasHeight) };
            const bottomLeft = { x: normalize(rect.x, canvasWidth), y: normalize(rect.y + rect.height, canvasHeight) };
            const bottomRight = { x: normalize(rect.x + rect.width, canvasWidth), y: normalize(rect.y + rect.height, canvasHeight) };

            // Store the normalized vertices
            const normalizedVertices = [topLeft, topRight, bottomLeft, bottomRight];

            console.log(normalizedVertices);

            setHistory(prev => ({ ...prev, vertices: normalizedVertices }));
        }

    }, [capturedImage, canvasRef]);


    // Convert the normalized coordinates to pixel coordinates
    const drawRectangle = (vertices: Vertice[]) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
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
            <button
                type='button'
                style={{ marginBottom: '1rem', marginRight: '1rem' }}
                onClick={() => setCapturing(!capturing)}
            >{capturing ? "Capture Enabled" : "Capture Disabled"}</button>

            <button
                hidden
                type='button'
                style={{ marginBottom: '1rem' }}
                onClick={() => setHistory((prev) => ({ ...prev, show: !history.show }))}
            >{history.show ? "Hide History" : "Show History"}</button>
            <Canvas
                ref={canvasRef}
                drawingEnabled={capturing}
                option={{
                    // rect: {
                    //     // borderColor: '#F14236',
                    //     // borderStyle: 'dashed',
                    //     // borderWidth: 1,
                    //     outterBackgroundColor: 'rgba(255,255,255,0.8)'
                    // },
                    // helperText: {
                    //     show: true,
                    //     // value: 'Enter: to capture or Esc: to cancel',
                    //     // padding: 3,
                    //     // fontSize: 10,
                    //     // backgroundColor: '#F14236',
                    //     // textColor: '#fff',
                    //     position: 'top-left'
                    // },
                    // imageQuality: "low",
                    // copyImageToClipBoard: false,
                    // isGrayscale: true
                }}
                onCaptureCanceled={() => setCapturing(false)}
                onImageCaptured={(img) => setCapturedImage(img)}
                width={500}
                height={300}
                style={{
                    outline: '1px dashed #989898'
                }}
            />
            <div style={{ padding: '1rem' }}>
                <p>Captured Image: </p>
                {
                    capturedImage.src &&
                    <img src={capturedImage.src} width={capturedImage.width} height={capturedImage.height} alt='captured image' style={{ outline: "2px solid lime" }} />
                }
            </div>
        </div>
    )
}
