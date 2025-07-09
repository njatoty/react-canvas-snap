import type { CanvasSnapOptions, RectCoords } from "../types";

/**
 * Copies an image in Base64 format to the clipboard.
 *
 * This function decodes the provided Base64 string, converts it into a `Blob` object, 
 * and writes it to the clipboard as an image. The default MIME type is set to `image/png`, 
 * but it can be customized if needed.
 *
 * @param {string} base64String - The Base64 encoded string representing the image.
 * @param {string} [mimeType='image/png'] - The MIME type of the image. Defaults to 'image/png'.
 * @returns {Promise<void>} - A promise that resolves when the image is successfully copied to the clipboard.
 * 
 * @throws Will throw an error if the clipboard API is not supported or if the copying operation fails.
 */
export const copyBase64ImageToClipboard = async (base64String: string, mimeType = 'image/png') => {
    try {

        // Remove data URL scheme if present
        const base64Data = base64String.replace(/^data:.+;base64,/, '');
        const byteCharacters = atob(base64Data); // Decode Base64 string
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        // Create a ClipboardItem and copy it to the clipboard
        const clipboardItem = new ClipboardItem({ [mimeType]: blob });
        await navigator.clipboard.write([clipboardItem]);

        console.log('Base64 image copied to clipboard!');

    } catch (err) {
        console.error('Failed to copy Base64 image to clipboard:', err);
    }
}

/**
 * Merges two CanvasSnapOptions objects, combining nested objects recursively while 
 * keeping other values unchanged. The merge is performed such that properties 
 * from the `source` object overwrite those in the `target` object, but only 
 * for the provided keys in the `source`.
 *
 * - Nested objects are merged recursively.
 * - Primitive values and arrays are directly overwritten.
 * - The function does not mutate the original `target` object and returns a new merged object.
 *
 * @param {CanvasSnapOptions} target - The base object to merge into.
 * @param {CanvasSnapOptions} source - The object containing properties to merge into the target.
 * @returns {CanvasSnapOptions} - A new object resulting from merging `source` into `target`.
 */
export const mergeSnapOptions = (
    target: CanvasSnapOptions,
    source: CanvasSnapOptions
): CanvasSnapOptions => {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {

            const typedKey = key as keyof CanvasSnapOptions;

            // Check if the value is an object and not an array
            if (
                source[typedKey] &&
                typeof source[typedKey] === 'object' &&
                !Array.isArray(source[typedKey])
            ) {
                // Recursively merge objects
                target[typedKey] = mergeSnapOptions(
                    target[typedKey] as CanvasSnapOptions,
                    source[typedKey] as CanvasSnapOptions
                ) as never;
            } else {
                // For primitives or arrays, directly assign the value
                target[typedKey] = source[typedKey] as never;
            }
        }
    }
    return target;
};


/**
 * Normalizes a rectangle's dimensions by ensuring its width and height are positive.
 * If the width or height is negative, the `x` or `y` coordinate is adjusted accordingly
 * to maintain the rectangle's position relative to the top-left corner.
 *
 * @param {RectCoords} rect - The rectangle object with properties x, y, width, and height.
 * @param {number} rect.x - The x-coordinate of the rectangle.
 * @param {number} rect.y - The y-coordinate of the rectangle.
 * @param {number} rect.width - The width of the rectangle (can be negative).
 * @param {number} rect.height - The height of the rectangle (can be negative).
 * @returns {Object} - A normalized rectangle object with positive width and height.
 */
export const normalizeRectangle = (rect: RectCoords): RectCoords => {
    let { x, y, width, height } = rect;

    if (width < 0) {
        x += width; // Shift x to the left
        width = -width; // Make width positive
    }

    if (height < 0) {
        y += height; // Shift y upwards
        height = -height; // Make height positive
    }

    return { x, y, width, height };
}
