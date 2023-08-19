import { log } from "src/tools/Logger";

export function PROTECTED_MODE_SET(state, payload) {
  state.PROTECTED_MODE = payload;
}

// PRESETS
export function PRESET_STORE(state, payload) {
  state.STORAGE.add_presets(payload);
}

export function PRESET_UPDATE(state, payload) {
  state.STORAGE.update_presets(payload);
}

export function PRESET_DELETE(state, payload) {
  state.STORAGE.delete_presets(payload);
}

export function PRESET_LOAD(state) {
  state.STORAGE.load_presets();
}

export function PRESET_CLEAR(state) {
  state.STORAGE.clear_presets();
}

export function EXPORT_CLEAR(state) {
  log({ message: "mutation: EXPORT_CLEAR" });
  state.EXPORT_DATA = [];
}

export function STORAGE_LOAD(state) {
  log({ message: "mutation: STORAGE_LOAD" });
  state.STORAGE.load();
}

export function STORAGE_ADD(state, payload) {
  log({ message: "mutation: STORAGE_ADD" });
  state.STORAGE.add(payload);
}

export function STORAGE_REMOVE(state, payload) {
  log({ message: "mutation: STORAGE_ADD" });
  state.STORAGE.remove(payload);
}

/**
 *
 * @param {*} state
 * @param {*} payload
 * @param {string} payload.field - name des Feldes
 * @param {object / integer / string} payload.value - Wert, der gespeichert werden soll
 * @example
 */
export function SETTINGS_SET(state, payload) {
  log({ message: "mutation: SETTINGS_SET", data: JSON.stringify(payload) });
  state.SETTINGS.set(payload);
}
