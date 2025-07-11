import { render, screen, fireEvent } from '@testing-library/react';
import TestComponent from './components/TestComponent';
import type { CanvasSnapOptions } from '../types';

describe('useRectangleDrawing with useMouseEvents', () => {
    const mockOptions: CanvasSnapOptions = {
        drawingEnabled: true,
        rect: {
            borderColor: '#000000',
            borderWidth: 2,
            borderStyle: 'solid',
            outterBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        helperText: {
            show: false,
        },
    };

    it('should initialize with default values', () => {
        render(<TestComponent drawingEnabled options={mockOptions} />);

        expect(screen.getByTestId('isDrawing').textContent).toBe('false');
        expect(screen.getByTestId('rectCoords').textContent).toBe(
            JSON.stringify({ width: 0, height: 0, x: 0, y: 0 })
        );
    });


    it('should update isDrawing state', () => {
        render(<TestComponent drawingEnabled options={mockOptions} />);

        const startDrawingButton = screen.getByTestId('startDrawing');
        fireEvent.click(startDrawingButton);

        expect(screen.getByTestId('isDrawing').textContent).toBe('true');
    });

    it('should clear the drawing', () => {
        render(<TestComponent drawingEnabled options={mockOptions} />);

        const clearDrawingButton = screen.getByTestId('clearDrawing');
        fireEvent.click(clearDrawingButton);

        expect(screen.getByTestId('isDrawing').textContent).toBe('false');
    });

    it('should not draw when drawing is disabled', () => {
        render(<TestComponent drawingEnabled={false} options={mockOptions} />);

        const startDrawingButton = screen.getByTestId('startDrawing');
        fireEvent.click(startDrawingButton);

        // Verify canvas methods weren't called
        const canvas = screen.getByTestId('main-canvas');
        const ctx = (canvas as HTMLCanvasElement).getContext('2d');
        expect(ctx?.clearRect).not.toHaveBeenCalled();
    });

    it('should handle rectCoords updates during drawing', () => {
        render(<TestComponent drawingEnabled options={mockOptions} />);
        const canvas = screen.getByTestId('main-canvas');

        // expect layer canvas to exist
        const layerCanvas = screen.getByRole('img', { name: 'Canvas Layer' });
        expect(layerCanvas).toBeInTheDocument();

        // Mock getBoundingClientRect
        Object.defineProperty(layerCanvas, 'getBoundingClientRect', {
            value: () => ({
                left: 0,
                top: 0,
                width: canvas.getAttribute('width'),
                height: canvas.getAttribute('height'),
                right: 0,
                bottom: 0,
                x: 0,
                y: 0,
                toJSON: () => { }
            }),
        });

        // Initial state
        expect(
            JSON.parse(screen.getByTestId('rectCoords').textContent!)
        ).toEqual({
            width: 0, height: 0, x: 0, y: 0
        });

        // Start drawing (mouse down)
        fireEvent.mouseDown(layerCanvas, { clientX: 10, clientY: 20 });

        // expect isDrawing to be true
        expect(screen.getByTestId('isDrawing').textContent).toBe('true');

        // Verify initial coordinates
        expect(
            JSON.parse(screen.getByTestId('rectCoords').textContent!)
        ).toEqual({
            width: 0, height: 0, x: 10, y: 20
        });

        // isDrawing should be true
        expect(screen.getByTestId('isDrawing').textContent).toBe('true');

        // Move mouse (drawing)
        fireEvent.mouseMove(layerCanvas, { clientX: 50, clientY: 60 });

        // Verify updated dimensions
        expect(
            JSON.parse(screen.getByTestId('rectCoords').textContent!)
        ).toEqual({
            width: 40, height: 40, x: 10, y: 20
        });

        // Finish drawing (mouse up)
        fireEvent.mouseUp(layerCanvas);

        // Verify drawing state is false but coordinates remain
        expect(screen.getByTestId('isDrawing').textContent).toBe('false');
        expect(
            JSON.parse(screen.getByTestId('rectCoords').textContent!)
        ).toEqual({
            width: 40, height: 40, x: 10, y: 20
        });
    });

    it('should clear rectCoords when clearDrawing is called', () => {
        render(<TestComponent drawingEnabled options={mockOptions} />);
        const clearButton = screen.getByTestId('clearDrawing');

        // expect layer canvas to exist
        const layerCanvas = screen.getByRole('img', { name: 'Canvas Layer' });
        expect(layerCanvas).toBeInTheDocument();

        // Draw something
        fireEvent.mouseDown(layerCanvas, { clientX: 10, clientY: 20 });
        fireEvent.mouseMove(layerCanvas, { clientX: 50, clientY: 60 });
        fireEvent.mouseUp(layerCanvas);

        // Verify we have coordinates different from default
        expect(
            JSON.parse(screen.getByTestId('rectCoords').textContent!)
        ).not.toEqual({
            width: 0, height: 0, x: 0, y: 0
        });

        // Clear drawing
        fireEvent.click(clearButton);

        // Verify coordinates are reset
        expect(
            JSON.parse(screen.getByTestId('rectCoords').textContent!)
        ).toEqual({
            width: 0, height: 0, x: 0, y: 0
        });
    });
});