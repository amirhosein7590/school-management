import { create } from "zustand";

const useTableStore = create((set, get) => ({
  rowState: {},
  selected: {},
  lastSelectedId: null,

  setRowState: (id, newValue) =>
    set((state) => ({
      rowState: {
        ...state.rowState,
        [id]: { ...state.rowState[id], ...newValue },
      },
    })),
  setAllRowState: (newValue) => set((state) => ({ rowState: newValue })),
  toggleRowSelected: (id) =>
    set((state) => {
      const cur = !!state.selected[id];
      return {
        selected: { ...state.selected, [id]: !cur },
        lastSelectedId: id,
      };
    }),

  setSelectionBulk: (ids = [], isSelected = true) =>
    set((state) => {
      const next = { ...state.selected };
      ids.forEach((id) => (next[id] = !!isSelected));
      return { selected: next };
    }),

  selectAll: (allIds = []) =>
    set(() => {
      const next = {};
      allIds.forEach((id) => (next[id] = true));
      return { selected: next };
    }),

  clearSelection: () => set(() => ({ selected: {}, lastSelectedId: null })),

  selectRange: (fromId, toId, allIds = []) =>
    set((state) => {
      if (!fromId) return {};
      const idxA = allIds.indexOf(fromId);
      const idxB = allIds.indexOf(toId);
      if (idxA === -1 || idxB === -1) return {};
      const [start, end] = idxA < idxB ? [idxA, idxB] : [idxB, idxA];
      const range = allIds.slice(start, end + 1);
      const next = { ...state.selected };
      range.forEach((id) => (next[id] = true));
      return { selected: next, lastSelectedId: toId };
    }),
}));

export default useTableStore;
