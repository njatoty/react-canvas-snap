
export function useClipboard(copy: boolean, customHandler?: (data: string) => void) {
    const copyToClipboard = async (dataUrl: string) => {
        if (!copy) return;
        if (customHandler) return customHandler(dataUrl);

        try {
            const blob = await (await fetch(dataUrl)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
        } catch (err) {
            console.error('Clipboard copy failed', err);
        }
    };

    return { copyToClipboard };
}