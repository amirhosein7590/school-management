"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ModalContainer } from "@/components/modules/modal";
const ModalContext = createContext(null);

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [stack, setStack] = useState([]);
  const idRef = useRef(1);

  const closeModal = useCallback((id, result) => {
    setStack((prev) => {
      const closing = prev.find((m) => m.id === id);
      if (closing?.onClose) closing.onClose(result);
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const updateData = useCallback((id, newData) => {
    setStack((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;

        if (Array.isArray(m.data) && Array.isArray(newData)) {
          return { ...m, data: [...m.data, newData] };
        }

        if (
          m.data !== null &&
          typeof m.data === "object" &&
          !Array.isArray(m.data) &&
          newData !== null &&
          typeof newData === "object" &&
          !Array.isArray(newData)
        ) {
          return { ...m, data: { ...m.data, ...newData } };
        }

        return { ...m, data: newData };
      })
    );
  }, []);

  const showModal = useCallback((config) => {
    const id = idRef.current++;

    const modal = {
      id,
      parentId: config.parentId || null,
      title: config.title || "",
      size: config.size || "md",
      data: config.data ?? {},
      content: config.content,
      header: config.header,
      onClose: config.onClose,
      showModal,
      closeModal,
      updateData,
    };

    setStack((prev) => [...prev, modal]);
    return id;
  }, []);

  const value = useMemo(
    () => ({
      showModal,
      closeModal,
      updateData,
    }),
    [showModal, closeModal, updateData]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {stack.map((modal) => (
        <ModalContainer
          key={modal.id}
          modal={modal}
          update={(maybeId, maybeData) => {
            if (typeof maybeData === "undefined") {
              // فقط یک آرگومان فرستاده شده: update(newData)
              return updateData(modal.id, maybeId);
            } else {
              return updateData(maybeId, maybeData);
            }
          }}
          close={(result) => closeModal(modal.id, result)}
        />
      ))}
    </ModalContext.Provider>
  );
}
