import { StateCreator } from "zustand";
import { create as actualCreate } from 'zustand';

// handles store creation and resets stores to the initial state
const storeResetFns = new Set<() => void>();

export const resetAllStores = () => {
  console.log('Reseted stores: ',storeResetFns.size);
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
}

// carefull when calling this create in stores!! create<T>()(stateFn) — the extra parentheses are required.
export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    storeResetFns.add(() => {
      store.setState(store.getInitialState(), true);
    });
    return store;
  };
}) as typeof actualCreate;