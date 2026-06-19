// Cloudinary public helper — only cloud name is needed in frontend
// For uploads, create an UNSIGNED upload preset in your Cloudinary dashboard first

const CLOUD_NAME = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || ''

export interface CloudinaryImageOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'crop'
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  gravity?: 'face' | 'center' | 'auto'
  radius?: number | 'max'
  effect?: string
}

export function getCloudinaryUrl(
  publicId: string,
  opts: CloudinaryImageOptions = {}
): string {
  if (!CLOUD_NAME || !publicId) return ''

  const params: string[] = []

  if (opts.quality) params.push(`q_${opts.quality}`)
  if (opts.format) params.push(`f_${opts.format}`)
  if (opts.crop) {
    const cropParams = [`c_${opts.crop}`]
    if (opts.width) cropParams.push(`w_${opts.width}`)
    if (opts.height) cropParams.push(`h_${opts.height}`)
    if (opts.gravity) cropParams.push(`g_${opts.gravity}`)
    params.push(cropParams.join(','))
  } else {
    if (opts.width) params.push(`w_${opts.width}`)
    if (opts.height) params.push(`h_${opts.height}`)
  }
  if (opts.radius) params.push(`r_${opts.radius}`)
  if (opts.effect) params.push(`e_${opts.effect}`)

  const transformations = params.length ? params.join(',') + '/' : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}${publicId}`
}

export async function uploadToCloudinary(
  file: File,
  uploadPreset: string,
  folder?: string
): Promise<{ public_id: string; secure_url: string }> {
  if (!CLOUD_NAME) throw new Error('Cloudinary cloud name not configured')
  if (!uploadPreset) throw new Error('Upload preset required')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (folder) formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Cloudinary upload failed')
  }

  return res.json()
}

export function getAvatarUrl(userId: string, fallback?: string) {
  if (fallback) return getCloudinaryUrl(fallback, { width: 128, height: 128, crop: 'thumb', gravity: 'face', radius: 'max', quality: 'auto', format: 'auto' })
  return `https://ui-avatars.com/api/?name=${userId}&background=random&color=fff&size=128`
}

export function getCoverUrl(publicId?: string) {
  if (!publicId) return ''
  return getCloudinaryUrl(publicId, { width: 1200, height: 400, crop: 'fill', quality: 'auto', format: 'auto' })
}

export function getPostMediaUrl(publicId: string) {
  return getCloudinaryUrl(publicId, { width: 800, quality: 'auto', format: 'auto' })
}
