import { useEffect } from 'react';
import type { KeyboardOptions, RectCoords, SnapshotProps } from '../types';
import { isMatchingKey, resolveKeyBinding } from '../lib/utils';


export const useKeyboardEvents = (
    isDrawing: boolean,
    rectCoords: RectCoords,
    onCapture: (snapshot: SnapshotProps) => void,
    onCancel: (snapshot: SnapshotProps) => void,
    captureImage: () => string | null,
    clearDrawing: () => void,
    options?: Partial<KeyboardOptions>
) => {

    const captureKey = resolveKeyBinding(options?.captureKey ?? 'ENTER');
    const cancelKey = resolveKeyBinding(options?.cancelKey ?? 'ESCAPE');

    useEffect(() => {
        const handlePressKey = async (e: KeyboardEvent) => {
            e.preventDefault();

            if (isMatchingKey(e, captureKey)) {
                if (rectCoords.height === 0 || rectCoords.width === 0) return;

                const capturedImage = captureImage();
                if (!capturedImage) return;

                onCapture({
                    isCanceled: false,
                    capturedImage,
                    rectCoords
                });

                clearDrawing();
            }

            if (isMatchingKey(e, cancelKey)) {
                clearDrawing();
                onCancel({
                    isCanceled: true,
                    capturedImage: null,
                    rectCoords: null
                });
            }
        };

        document.body.addEventListener("keydown", handlePressKey, { passive: false });
        return () => {
            document.body.removeEventListener("keydown", handlePressKey);
        };
    }, [isDrawing, rectCoords, onCapture, onCancel, captureImage, clearDrawing]);
};