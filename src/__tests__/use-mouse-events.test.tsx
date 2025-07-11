import { render, screen, fireEvent } from '@testing-library/react';
import TestComponent from './components/TestComponent';
import type { CanvasSnapOptions } from '../types';

describe('useMouseEvents', () => {
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

        // Move mouse (drawing)
        fireEvent.mouseMove(layerCanvas, { clientX: 50, clientY: 60 });

        // isDrawing should be true
        expect(screen.getByTestId('isDrawing').textContent).toBe('true');

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
});