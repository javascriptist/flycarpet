"use client"

import { Trash } from "@medusajs/icons"
import { deleteLineItem } from "@lib/data/cart"
import { useState } from "react"
import Spinner from "@modules/common/icons/spinner"

type Props = {
  id: string
  className?: string
  "data-testid"?: string
}

export default function DeleteButton({ id, className = "", "data-testid": testId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteLineItem(id)
    } catch (error) {
      console.error("Failed to delete item:", error)
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`flex items-center justify-center text-ui-fg-subtle hover:text-ui-fg-base transition-colors ${className}`}
      data-testid={testId}
      aria-label="Delete item"
    >
      {isDeleting ? <Spinner /> : <Trash />}
    </button>
  )
}
