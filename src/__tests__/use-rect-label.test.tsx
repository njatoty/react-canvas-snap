import { renderHook } from "@testing-library/react";
import { useRectLabels } from "../hooks/use-rect-labels";

const mockCtx = {
    measureText: jest.fn().mockReturnValue({ width: 50 }),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    font: '',
    textBaseline: '',
    fillStyle: '',
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    rect: jest.fn(),
    stroke: jest.fn(),
    lineWidth: 1,
    strokeStyle: '',
    closePath: jest.fn()
} as unknown as CanvasRenderingContext2D;

const rectCoords = { x: 10, y: 20, width: 100, height: 50 };

describe('useRectLabels', () => {
    it('should call drawHelperText without error', () => {
        const { result } = renderHook(() => useRectLabels());

        result.current.drawHelperText(
            mockCtx,
            rectCoords,
            500, // canvasWidth
            300, // canvasHeight
            {
                show: true,
                value: 'Hello World',
                position: 'auto',
                style: {
                    fontSize: 12,
                    fontFamily: 'Arial',
                    backgroundColor: 'red',
                    textColor: 'white',
                    padding: 2
                }
            }
        );

        expect(mockCtx.fillText).toHaveBeenCalled();
    });

    it('should skip drawing helper text if show is false', () => {
        const { result } = renderHook(() => useRectLabels());

        result.current.drawHelperText(
            mockCtx,
            rectCoords,
            500, // canvasWidth
            300, // canvasHeight
            { show: false }
        );

        expect(mockCtx.fillText).not.toHaveBeenCalled();
    });

    it('should call drawMeasurementLabels when show is true and dimensions are shown', () => {
        const { result } = renderHook(() => useRectLabels());

        result.current.drawMeasurementLabels(
            mockCtx,
            rectCoords,
            {
                show: true,
                showWidth: true,
                showHeight: true,
                positionWidth: 'bottom-center',
                positionHeight: 'right-center',
                style: {
                    fontSize: 12,
                    fontFamily: 'Arial',
                    backgroundColor: 'black',
                    padding: 2
                }
            }
        );

        expect(mockCtx.fillText).toHaveBeenCalledTimes(2);
    });

    it('should skip drawing if show is false', () => {
        const { result } = renderHook(() => useRectLabels());

        result.current.drawHelperText(
            mockCtx,
            rectCoords,
            500,
            300,
            { show: false }
        );

        expect(mockCtx.fillText).not.toHaveBeenCalled();
    });

    it('should skip drawMeasurementLabels if show is false', () => {
        const { result } = renderHook(() => useRectLabels());

        result.current.drawMeasurementLabels(
            mockCtx,
            rectCoords,
            {
                show: false,
            }
        );

        expect(mockCtx.fillText).not.toHaveBeenCalled();
    });
});
