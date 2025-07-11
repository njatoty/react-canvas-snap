import { copyBase64ImageToClipboard } from '../lib/utils';

describe('copyBase64ImageToClipboard', () => {

    it('should write a valid image blob to the clipboard', async () => {
        const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
        await copyBase64ImageToClipboard(base64Image);
        expect(navigator.clipboard.write).toHaveBeenCalled();
    });

    it('should throw error on invalid base64 string', async () => {
        await expect(
            copyBase64ImageToClipboard('invalid-base64')
        ).rejects.toThrow();
    });
});
