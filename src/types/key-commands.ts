
export interface BaseKeyBinding {
  key: string; // or use AllowedKey if limited
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export const KEY_COMMANDS: Record<string, BaseKeyBinding> = {
  // Capture actions
  ENTER: { key: 'Enter' },
  CTRL_ENTER: { key: 'Enter', ctrl: true },
  SHIFT_ENTER: { key: 'Enter', shift: true },
  CMD_ENTER: { key: 'Enter', meta: true },
  SPACE: { key: ' ', ctrl: true },

  // Cancel actions
  ESCAPE: { key: 'Escape' },
  CTRL_ESCAPE: { key: 'Escape', ctrl: true },
  CMD_ESCAPE: { key: 'Escape', meta: true },
  BACKSPACE: { key: 'Backspace' },
  CTRL_Z: { key: 'z', ctrl: true },
  CMD_Z: { key: 'z', meta: true },

  // Extra (common productivity bindings)
  ALT_LEFT: { key: 'ArrowLeft', alt: true },
  ALT_RIGHT: { key: 'ArrowRight', alt: true },
  CTRL_SHIFT_S: { key: 's', ctrl: true, shift: true },
} as const;

export type KeyCommandName = keyof typeof KEY_COMMANDS;

export type KeyBinding = typeof KEY_COMMANDS[KeyCommandName];
