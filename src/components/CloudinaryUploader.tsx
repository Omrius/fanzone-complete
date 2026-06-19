import React, { useState, useRef } from 'react'
import { uploadToCloudinary } from '../lib/cloudinary'
import { Upload, X, Image } from 'lucide-react'

interface CloudinaryUploaderProps {
  onUpload: (url: string, publicId: string) => void
  folder?: string
  uploadPreset?: string
  maxFiles?: number
  accept?: string
  className?: string
}

export default function CloudinaryUploader({
  onUpload,
  folder = 'fanzone/uploads',
  uploadPreset = '',
  maxFiles = 5,
  accept = 'image/*,video/*',
  className = '',
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<{ url: string; publicId: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (!uploadPreset) {
      // Fallback: use object URL for local preview only
      const localPreviews = files.map((f) => ({ url: URL.createObjectURL(f), publicId: '' }))
      setPreviews((prev) => [...prev, ...localPreviews].slice(0, maxFiles))
      files.forEach((f) => onUpload(URL.createObjectURL(f), ''))
      return
    }

    setUploading(true)
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const data = await uploadToCloudinary(file, uploadPreset, folder)
          return { url: data.secure_url, publicId: data.public_id }
        })
      )
      setPreviews((prev) => [...prev, ...uploaded].slice(0, maxFiles))
      uploaded.forEach((u) => onUpload(u.url, u.publicId))
    } catch (err: any) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading || previews.length >= maxFiles}
      />

      <div className="flex flex-wrap gap-3">
        {previews.map((p, i) => (
          <div key={i} className="relative group">
            <img
              src={p.url}
              alt="preview"
              className="w-24 h-24 object-cover rounded-xl border border-white/10"
            />
            <button
              onClick={() => removePreview(i)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {previews.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-fanzone-accent hover:bg-fanzone-accent/5 transition-all"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-400">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      {!uploadPreset && (
        <p className="text-xs text-yellow-400 mt-2">
          <Image className="w-3 h-3 inline mr-1" />
          Mode preview local — créez un upload preset "unsigned" dans Cloudinary pour activer l'upload.
        </p>
      )}
    </div>
  )
}
