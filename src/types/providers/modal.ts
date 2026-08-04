export type closeModal =  (id : string | number , data ?: unknown)=> void
export type updateData = (id : string | number , newData : object)=> void
export type showModal = (config : Modal)=> string | number
import {FC} from "react"

export type Size = "sm" | "lg" | "xl" | "2xl"

type ContentProps = {
  id : string | number,
  title ?: string
  size ?: Size,
  data ?: object,
  closeModal : closeModal,
  updateData : updateData,
  openNested ?: (config : Modal)=> string | number
}

export type Modal = {
    id ?: string | number,
    parentId ?: string | number
      title ?: string
      size ?: Size,
      data ?: object
      content : FC<ContentProps> | string,
      header ?: React.FC | string,
      onClose ?: ()=> void,
      showModal ?: showModal ,
      closeModal ?: closeModal,
      updateData ?: updateData,
}