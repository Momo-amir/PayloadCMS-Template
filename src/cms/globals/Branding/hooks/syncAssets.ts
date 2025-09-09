import type { GlobalAfterChangeHook, Payload } from 'payload'
import type { Media } from '@/payload-types'
import fs from 'fs/promises'
import path from 'path'

type MediaRef = number | { id?: number; filename?: string } | null | undefined

const resolveMedia = async (
  payload: Payload,
  media: MediaRef,
): Promise<{ filename: string; mimeType?: string } | null> => {
  if (!media) return null
  if (typeof media === 'number') {
    const doc = (await payload.findByID({ collection: 'media', id: media })) as Media
    return doc?.filename ? { filename: doc.filename, mimeType: doc?.mimeType ?? undefined } : null
  }
  if (typeof media === 'object') {
    if (media.filename) return { filename: media.filename }
    if (media.id) {
      const doc = (await payload.findByID({ collection: 'media', id: media.id })) as Media
      return doc?.filename ? { filename: doc.filename, mimeType: doc?.mimeType ?? undefined } : null
    }
  }
  return null
}

const safeUnlink = async (p: string) => {
  try {
    await fs.unlink(p)
  } catch {}
}

const emitSVGWrapperForPNG = async (pngPath: string, svgOutPath: string) => {
  const pngBuffer = await fs.readFile(pngPath)
  const base64 = pngBuffer.toString('base64')
  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">` +
    `<image href="data:image/png;base64,${base64}" width="100%" height="100%" /></svg>`
  await fs.writeFile(svgOutPath, svg)
}

const copyToAssetPreserveExt = async (fromFilename: string, outBase: string) => {
  const cwd = process.cwd()
  const src = path.join(cwd, 'public', 'media', fromFilename)
  const ext = path.extname(fromFilename).toLowerCase()
  const assetsDir = path.join(cwd, 'public', 'assets')

  // Clean stale counterparts to avoid mismatched leftovers
  const svgPath = path.join(assetsDir, `${outBase}.svg`)
  const pngPath = path.join(assetsDir, `${outBase}.png`)
  await Promise.all([safeUnlink(svgPath), safeUnlink(pngPath)])

  // Only support .svg and .png for now
  const dest = path.join(assetsDir, `${outBase}${ext === '.svg' || ext === '.png' ? ext : ext}`)
  await fs.copyFile(src, dest)
}

export const syncBrandingAssets: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  // Copy selected media into the fixed public/assets filenames to mimic current behavior
  const tasks: Array<Promise<void>> = []

  // Process logos (SVG only) into fixed .svg filenames to keep existing imports working
  const logoMap: Array<[MediaRef, string]> = [
    [doc.logoLight, 'logo-on-light.svg'],
    [doc.logoDark, 'logo-on-dark.svg'],
  ]

  for (const [ref, outName] of logoMap) {
    const resolved = await resolveMedia(payload, ref)
    if (resolved?.filename) {
      const ext = path.extname(resolved.filename).toLowerCase()
      const cwd = process.cwd()
      const src = path.join(cwd, 'public', 'media', resolved.filename)
      const dest = path.join(cwd, 'public', 'assets', outName)
      if (ext === '.svg') {
        tasks.push(fs.copyFile(src, dest))
      } else if (ext === '.png') {
        tasks.push(emitSVGWrapperForPNG(src, dest))
      } else {
        payload.logger.warn(
          `Branding logo "${resolved.filename}" has unsupported extension ${ext}. Skipping.`,
        )
      }
    }
  }

  // Process favicons (SVG or PNG) preserving extension and updating fixed basenames
  const faviconMap: Array<[MediaRef, string]> = [
    [doc.faviconLight, 'favicon-lightmode'],
    [doc.faviconDark, 'favicon-darkmode'],
  ]

  for (const [ref, outBase] of faviconMap) {
    const resolved = await resolveMedia(payload, ref)
    if (resolved?.filename) {
      tasks.push(copyToAssetPreserveExt(resolved.filename, outBase))
    }
  }

  try {
    await Promise.all(tasks)
    payload.logger.info('Branding assets synced to public/assets')
  } catch (e) {
    payload.logger.error(`Failed syncing branding assets: ${String(e)}`)
  }
}
