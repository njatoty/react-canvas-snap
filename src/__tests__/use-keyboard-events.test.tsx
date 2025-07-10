import { useKeyboardEvents } from '../hooks/use-keyboard-events';
import { act, renderHook } from '@testing-library/react';
import { KeyboardOptions } from '../types';
import { KEY_COMMANDS } from '../lib/key';

describe('useKeyboardEvents', () => {
    const mockRectCoords = {
        x: 100,
        y: 100,
        width: 200,
        height: 200
    };

    const mockCaptureImage = jest.fn(() => 'data:image/png;base64,mock-image');
    const mockClearDrawing = jest.fn();
    const mockOnCapture = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderKeyboardHook = (isDrawing = true, options?: Partial<KeyboardOptions>) => {
        return renderHook(
            ({ isDrawing }) => useKeyboardEvents(
                isDrawing,
                mockRectCoords,
                mockOnCapture,
                mockOnCancel,
                mockCaptureImage,
                mockClearDrawing,
                options
            ),
            { initialProps: { isDrawing } }
        );
    };


    it('should call onCapture when Enter is pressed with valid rect', () => {
        renderKeyboardHook();

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            document.body.dispatchEvent(enterEvent);
        });

        expect(mockOnCapture).toHaveBeenCalledWith({
            isCanceled: false,
            capturedImage: 'data:image/png;base64,mock-image',
            rectCoords: mockRectCoords
        });
        expect(mockClearDrawing).toHaveBeenCalled();
    });

    it('should not call onCapture when Enter is pressed with invalid rect', () => {
        // Render with empty rect
        const { rerender } = renderHook(
            ({ rectCoords }) => useKeyboardEvents(
                true,
                rectCoords,
                mockOnCapture,
                mockOnCancel,
                mockCaptureImage,
                mockClearDrawing
            ),
            { initialProps: { rectCoords: { x: 0, y: 0, width: 0, height: 0 } } }
        );

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            document.body.dispatchEvent(enterEvent);
        });

        expect(mockOnCapture).not.toHaveBeenCalled();
        expect(mockClearDrawing).not.toHaveBeenCalled();

        // Test with only width = 0
        rerender({ rectCoords: { x: 0, y: 0, width: 0, height: 100 } });

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            document.body.dispatchEvent(enterEvent);
        });

        expect(mockOnCapture).not.toHaveBeenCalled();

        // Test with only height = 0
        rerender({ rectCoords: { x: 0, y: 0, width: 100, height: 0 } });

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            document.body.dispatchEvent(enterEvent);
        });

        expect(mockOnCapture).not.toHaveBeenCalled();
    });

    it('should call onCancel when Escape is pressed', () => {
        renderKeyboardHook();

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.body.dispatchEvent(enterEvent);
        });

        expect(mockOnCancel).toHaveBeenCalledWith({
            isCanceled: true,
            capturedImage: null,
            rectCoords: null
        });
        expect(mockClearDrawing).toHaveBeenCalled();
    });

    it('should not handle keys when not drawing', () => {
        // isDrawing = false
        renderKeyboardHook(false);

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            document.body.dispatchEvent(enterEvent);
        });

        act(() => {
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.body.dispatchEvent(escapeEvent);
        });

        expect(mockOnCapture).not.toHaveBeenCalled();
        expect(mockOnCancel).not.toHaveBeenCalled();
        expect(mockClearDrawing).not.toHaveBeenCalled();
    });

    it('should change capture key to Ctrl+Enter', () => {
        renderKeyboardHook(true, { captureKey: KEY_COMMANDS.CTRL_ENTER });

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true });
            document.body.dispatchEvent(enterEvent);
        });

        expect(mockOnCapture).toHaveBeenCalledWith({
            isCanceled: false,
            capturedImage: 'data:image/png;base64,mock-image',
            rectCoords: mockRectCoords
        });
        expect(mockClearDrawing).toHaveBeenCalled();
    });

    it('should change capture key to Backspace', () => {
        renderKeyboardHook(true, { cancelKey: KEY_COMMANDS.BACKSPACE });

        act(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
            document.body.dispatchEvent(enterEvent);
        });

        expect(mockOnCancel).toHaveBeenCalledWith({
            isCanceled: true,
            capturedImage: null,
            rectCoords: null
        });
        expect(mockClearDrawing).toHaveBeenCalled();
    });

});