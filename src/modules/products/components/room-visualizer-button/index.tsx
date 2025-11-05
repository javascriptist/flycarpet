'use client'

import { Button } from "@medusajs/ui"
import { useState } from "react"
import { ImageUploader } from "../image-uploader"
import { CarpetPlacer } from "../carpet-placer"

interface RoomVisualizerButtonProps {
  productImage: string
  productTitle: string
  countryCode?: string
}

export const RoomVisualizerButton: React.FC<RoomVisualizerButtonProps> = ({
  productImage,
  productTitle,
  countryCode,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [roomImage, setRoomImage] = useState<string | null>(null)
  const isLang = countryCode === "uz"

  const handleImageUpload = (imageUrl: string) => {
    setRoomImage(imageUrl)
  }

  const handleClose = () => {
    setIsOpen(false)
    setRoomImage(null)
  }

  const handleBack = () => {
    setRoomImage(null)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full h-10 rounded-3xl bg-white border-2 border-[#FF6A1A] text-[#FF6A1A] hover:bg-[#FF6A1A] hover:text-white transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        {isLang ? "Xonangizda ko'ring" : "Посмотрите в вашей комнате"}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                {roomImage && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isLang ? "Xonangizda ko'ring" : "Визуализация в комнате"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {roomImage
                      ? isLang
                        ? "Gilamni joylashtiring"
                        : "Разместите ковер"
                      : isLang
                      ? "Xona rasmini yuklang"
                      : "Загрузите фото комнаты"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {!roomImage ? (
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  countryCode={countryCode}
                />
              ) : (
                <CarpetPlacer
                  roomImage={roomImage}
                  carpetImage={productImage}
                  countryCode={countryCode}
                  onClose={handleClose}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
