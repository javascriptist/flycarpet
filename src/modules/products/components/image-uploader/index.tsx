'use client'

import { useState, useRef } from "react"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void
  countryCode?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  countryCode,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isLang = countryCode === "uz"

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? 'border-[#FF6A1A] bg-orange-50'
              : 'border-gray-300 hover:border-[#FF6A1A] hover:bg-gray-50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {isLang
                ? "Xona rasmini yuklang"
                : "Загрузите фото комнаты"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isLang
                ? "Rasmni bu yerga sudrab keling yoki bosing"
                : "Перетащите изображение сюда или нажмите"}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            PNG, JPG, WEBP {isLang ? "gacha" : "до"} 10MB
          </p>
        </div>
      </div>
    </div>
  )
}
