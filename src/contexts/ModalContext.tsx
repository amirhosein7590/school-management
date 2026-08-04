'use client'

import  { PropsWithChildren, useMemo, useRef, useState } from 'react'
import { createContext } from 'react';
import { ModalContainer } from '@/components/modules/modal';
import type { closeModal, Modal, showModal, updateData } from '@/types/providers/modal';

export type CtxValue = {
  closeModal : closeModal,
  showModal : showModal,
  updateData : updateData
}
export const ModalCtx = createContext<CtxValue | null>(null);

function ModalContext({children} : PropsWithChildren) {
  const [stack , setStack] = useState<Modal[]>([])
  const id = useRef(1);

  const closeModal : closeModal = (id)=>{
    setStack(prev => prev.filter(m => m.id != id));

  }

  const updateData : updateData = (id,newData)=>{
    setStack(prev => prev.map(m => m.id == id ? {...m , data : newData} : m))
  }

  const showModal : showModal = (config)=>{
    id.current++
    const newModal : Modal = {
      id : id.current,
      closeModal,
      updateData,
      content : config.content,
      onClose : config.onClose,
      showModal,
      data : config.data,
      header : config.header,
      parentId : config.parentId,
      size : config.size || "md",
      title : config.title
    }
    setStack(prev => [...prev , newModal]);
    return id.current
  }

  const value = useMemo(()=>({
    showModal,
    closeModal,
    updateData
  }),[closeModal , updateData , showModal])
  return (
    <ModalCtx.Provider value={value}>
      {children}
      {stack.map(modal => (
        <ModalContainer key={modal.id} close={closeModal} update={updateData} modal={modal} />
      ))}
    </ModalCtx.Provider>
  )
}


export default ModalContext