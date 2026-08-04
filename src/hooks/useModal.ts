import { useContext } from 'react';
import { ModalCtx } from '@/contexts/ModalContext';

export function useModal() {
  const context = useContext(ModalCtx);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}