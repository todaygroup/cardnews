import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export interface ImageProcessingOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export async function processImage(
  buffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<Buffer> {
  const {
    width = 1200,
    height = 630,
    quality = 80,
    format = 'webp'
  } = options

  return sharp(buffer)
    .resize(width, height, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toFormat(format, { quality })
    .toBuffer()
}

export function generateImagePath(originalName: string): string {
  const ext = path.extname(originalName)
  const filename = `${uuidv4()}${ext}`
  return `uploads/${filename}`
}

export async function validateImage(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata()
    return metadata.width !== undefined && metadata.height !== undefined
  } catch {
    return false
  }
} 