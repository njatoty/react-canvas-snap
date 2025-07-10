// types/keyboard.ts
export const ALLOWED_KEYS = {
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    SPACE: ' ',
} as const;

export type AllowedKey = (typeof ALLOWED_KEYS)[keyof typeof ALLOWED_KEYS];

export interface KeyBinding {
    key: AllowedKey;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
}

export interface KeyboardOptions {
    captureKey?: KeyBinding;
    cancelKey?: KeyBinding;
}