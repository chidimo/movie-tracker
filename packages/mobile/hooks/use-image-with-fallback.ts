import { useState } from 'react'

interface UseImageWithFallbackOptions {
  imageUrl?: string
  fallbackImage: any
}

export const useImageWithFallback = ({
  imageUrl,
  fallbackImage,
}: UseImageWithFallbackOptions) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const resetError = () => {
    setImageError(false)
  }

  // For React Native (expo-image), use { uri: imageUrl }
  // For web (img tag), imageUrl can be used directly
  const shouldUseOriginalImage = imageUrl && !imageError

  const formattedImageUrl =
    imageUrl && typeof window !== 'undefined' ? imageUrl : { uri: imageUrl }

  const imageSource = shouldUseOriginalImage ? formattedImageUrl : fallbackImage

  return {
    imageSource,
    imageError,
    handleImageError,
    resetError,
  }
}
