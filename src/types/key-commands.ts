import { KEY_COMMANDS } from "../lib/key";

export interface BaseKeyBinding {
  key: string; // or use AllowedKey if limited
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export type KeyCommandName = keyof typeof KEY_COMMANDS;

const COMMANDS = KEY_COMMANDS as Record<KeyCommandName, BaseKeyBinding>;

export type KeyBinding = typeof COMMANDS[KeyCommandName];
