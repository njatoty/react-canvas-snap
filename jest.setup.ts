import '@testing-library/jest-dom';

beforeAll(() => {
    // Mock navigator.clipboard
    global.ClipboardItem = class {
        constructor(public data: Record<string, Blob>) { }
    } as unknown as typeof ClipboardItem;

    Object.defineProperty(navigator, 'clipboard', {
        value: {
            write: jest.fn().mockResolvedValue(undefined),
        },
        writable: true,
    });
});