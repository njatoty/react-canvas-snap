import { useEffect } from 'react';
import type { RectCoords, SnapshotProps } from '../types';
import { ALLOWED_KEYS, type KeyBinding, type KeyboardOptions } from '../types/keyboard';
import { isMatchingKey, normalizeBinding } from '../lib/utils';

const defaultCaptureKey: KeyBinding = { key: ALLOWED_KEYS.ENTER };
const defaultCancelKey: KeyBinding = { key: ALLOWED_KEYS.ESCAPE };

export const useKeyboardEvents = (
    isDrawing: boolean,
    rectCoords: RectCoords,
    onCapture: (snapshot: SnapshotProps) => void,
    onCancel: (snapshot: SnapshotProps) => void,
    captureImage: () => string | null,
    clearDrawing: () => void,
    options?: Partial<KeyboardOptions>
) => {

    const captureKey = options?.captureKey ?? defaultCaptureKey;
    const cancelKey = options?.cancelKey ?? defaultCancelKey;

    useEffect(() => {
        const handlePressKey = async (e: KeyboardEvent) => {
            e.preventDefault();

            if (isMatchingKey(e, normalizeBinding(captureKey))) {
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

            if (isMatchingKey(e, normalizeBinding(cancelKey))) {
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