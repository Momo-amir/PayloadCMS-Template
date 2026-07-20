import fs from 'fs'
import os from 'os'
import Path from 'path'
import { afterAll, describe, expect, it } from 'vitest'
import { generate } from '../../.cli/lib/generate'

const root = Path.resolve(__dirname, '../..')

// All 17 template blocks except the two customer-login ones, for a "keep everything but login" plan.
const ALL_BLOCKS_EXCEPT_LOGIN = [
  'accordionBlock',
  'archiveBlock',
  'bannerBlock',
  'callToActionBlock',
  'cardBlock',
  'cardCarouselBlock',
  'codeBlock',
  'contentBlock',
  'peopleArchiveBlock',
  'promoStripBlock',
  'formBlock',
  'columnsBlock',
  'richTextBlock',
  'twoColumnBlock',
  'mediaBlock',
]

const ALL_BLOCKS = [...ALL_BLOCKS_EXCEPT_LOGIN, 'userLoginBlock', 'accountDetailsBlock']

describe('generate() closure correctness', () => {
  it('keeping every block prunes nothing', () => {
    const plan = generate({ root, outDir: '', keepBlockSlugs: ALL_BLOCKS, dryRun: true })
    expect(plan.prunedBlocks).toEqual([])
    expect(plan.registrationEdits).toEqual([])
  })

  it('twoColumnBlock alone does not resurrect unrelated blocks via payload.config.ts', () => {
    // Regression: Archive/PeopleArchive import `@/payload.config`, which imports exports.ts (every
    // block). Without treating payload.config.ts as a closure leaf, keeping twoColumnBlock (which
    // imports Archive as a hardcoded child) used to resurrect the entire block universe.
    const plan = generate({ root, outDir: '', keepBlockSlugs: ['twoColumnBlock'], dryRun: true })
    expect(plan.keptBlocks).not.toContain('userLoginBlock')
    expect(plan.keptBlocks).not.toContain('accordionBlock')
    expect(plan.keptBlocks).not.toContain('promoStripBlock')
    expect(plan.keptBlocks).not.toContain('peopleArchiveBlock')
    // richTextBlock is a genuine TwoColumn child and is not force-pruned, so it survives.
    expect(plan.keptBlocks).toContain('richTextBlock')
    expect(plan.keptBlocks).toContain('twoColumnBlock')
  })

  it('a single RICHTEXT_INLINE_BLOCKS slug does not resurrect its siblings via the RichText hub', () => {
    // Regression: RichText/index.tsx hardcodes imports for mediaBlock/codeBlock/columnsBlock/
    // bannerBlock/callToActionBlock. Any block rendering rich text (a legitimate, common edge) used
    // to drag all five in via the hub's own outgoing imports.
    const plan = generate({
      root,
      outDir: '',
      keepBlockSlugs: ['accordionBlock', 'contentBlock', 'mediaBlock'],
      dryRun: true,
    })
    expect(plan.keptBlocks).toContain('mediaBlock')
    for (const slug of ['codeBlock', 'columnsBlock', 'bannerBlock', 'callToActionBlock']) {
      expect(plan.keptBlocks).not.toContain(slug)
    }
  })

  it('a block that genuinely renders rich text still pulls in the RichText hub file itself', () => {
    // The fix must not go too far: Media legitimately imports the RichText renderer for captions.
    // That edge should survive even though the hub's OWN outgoing edges must not.
    const plan = generate({ root, outDir: '', keepBlockSlugs: ['mediaBlock'], dryRun: true })
    expect(plan.keptBlocks).toContain('mediaBlock')
  })
})

describe('generate() requiresBlocks cascade', () => {
  it('force-prunes accountDetailsBlock when userLoginBlock is deselected, with a warning', () => {
    const plan = generate({
      root,
      outDir: '',
      keepBlockSlugs: ['accordionBlock', 'contentBlock'],
      dryRun: true,
    })
    expect(plan.prunedBlocks).toContain('userLoginBlock')
    expect(plan.prunedBlocks).toContain('accountDetailsBlock')
    expect(plan.warnings).toContain(
      'Block "accountDetailsBlock" removed — requires pruned block(s): userLoginBlock.',
    )
  })

  it('keeps accountDetailsBlock when userLoginBlock is explicitly kept', () => {
    const plan = generate({
      root,
      outDir: '',
      keepBlockSlugs: [...ALL_BLOCKS_EXCEPT_LOGIN, 'userLoginBlock', 'accountDetailsBlock'],
      dryRun: true,
    })
    expect(plan.keptBlocks).toContain('userLoginBlock')
    expect(plan.keptBlocks).toContain('accountDetailsBlock')
  })
})

describe('generate() dual-registered inline block cleanup', () => {
  it('computes Posts BlocksFeature removals for page-builder-registered inline blocks', () => {
    // mediaBlock/columnsBlock/callToActionBlock are registered in exports.ts (page-builder) AND
    // directly imported into Posts' BlocksFeature list. Discovery records only the exports.ts site,
    // so this must be computed independently or Posts/index.ts is left with a dangling import when
    // they are pruned. bannerBlock/codeBlock are inlineOnly (registeredIn: 'blocksFeature'), so they
    // are covered by the ordinary registrationEdits path instead — see the next test.
    const plan = generate({
      root,
      outDir: '',
      keepBlockSlugs: ['accordionBlock', 'contentBlock'],
      dryRun: true,
    })
    expect(plan.postsInlineSymbols).toEqual(
      expect.arrayContaining(['MediaBlock', 'ColumnsBlock', 'CallToActionBlock']),
    )
    expect(plan.postsInlineSymbols).not.toContain('BannerBlock')
    expect(plan.postsInlineSymbols).not.toContain('CodeBlock')
  })

  it('does not duplicate symbols already covered by registrationEdits (blocksFeature-only blocks)', () => {
    const plan = generate({
      root,
      outDir: '',
      keepBlockSlugs: ['accordionBlock', 'contentBlock'],
      dryRun: true,
    })
    const postsRegistrationEdit = plan.registrationEdits.find((e) =>
      e.file.endsWith('cms/collections/Posts/index.ts'),
    )
    const inlineOnlySymbols = postsRegistrationEdit?.symbols ?? []
    for (const symbol of inlineOnlySymbols) {
      expect(plan.postsInlineSymbols).not.toContain(symbol)
    }
  })
})

describe('generate() real filesystem output', () => {
  const outDirs: string[] = []
  afterAll(() => {
    for (const dir of outDirs) fs.rmSync(dir, { recursive: true, force: true })
  })

  function makeOutDir(): string {
    const dir = fs.mkdtempSync(Path.join(os.tmpdir(), 'kollab-generate-test-'))
    outDirs.push(dir)
    return dir
  }

  it('cleans the RichText hub NodeTypes union down to `never` when all inline blocks are pruned', () => {
    const outDir = makeOutDir()
    generate({ root, outDir, keepBlockSlugs: ['accordionBlock', 'contentBlock'], dryRun: false })
    const richTextHub = fs.readFileSync(
      Path.join(outDir, 'src/website/components/RichText/index.tsx'),
      'utf8',
    )
    expect(richTextHub).toContain('SerializedBlockNode<\n      never\n    >')
    expect(richTextHub).not.toMatch(/CodeBlockProps|MediaBlockProps|ColumnsBlockProps|BannerBlockProps|CTABlockProps/)
  })

  it('leaves a single-member NodeTypes union as a bare type reference, not wrapped in `never`', () => {
    const outDir = makeOutDir()
    generate({
      root,
      outDir,
      keepBlockSlugs: ['accordionBlock', 'contentBlock', 'mediaBlock'],
      dryRun: false,
    })
    const richTextHub = fs.readFileSync(
      Path.join(outDir, 'src/website/components/RichText/index.tsx'),
      'utf8',
    )
    expect(richTextHub).toContain('MediaBlockProps')
    expect(richTextHub).not.toContain('never')
  })

  it('removes MediaBlock/ColumnsBlock from Posts BlocksFeature with no dangling import', () => {
    const outDir = makeOutDir()
    generate({ root, outDir, keepBlockSlugs: ['accordionBlock', 'contentBlock'], dryRun: false })
    const postsIndex = fs.readFileSync(
      Path.join(outDir, 'src/cms/collections/Posts/index.ts'),
      'utf8',
    )
    expect(postsIndex).toContain('blocks: []')
    expect(postsIndex).not.toMatch(/import \{ .*Block.* \} from '.*website\/blocks/)
  })

  it('removes the login flow ownedFiles/patches when userLoginBlock is pruned', () => {
    const outDir = makeOutDir()
    generate({ root, outDir, keepBlockSlugs: ['accordionBlock', 'contentBlock'], dryRun: false })

    expect(fs.existsSync(Path.join(outDir, 'src/providers/Auth'))).toBe(false)
    expect(fs.existsSync(Path.join(outDir, 'src/website/components/auth'))).toBe(false)
    expect(fs.existsSync(Path.join(outDir, 'src/cms/globals/LoginConfig'))).toBe(false)

    const providersIndex = fs.readFileSync(Path.join(outDir, 'src/providers/index.tsx'), 'utf8')
    expect(providersIndex).not.toContain("from './Auth'")
    expect(providersIndex).not.toContain('<AuthProvider>')

    const payloadConfig = fs.readFileSync(Path.join(outDir, 'src/payload.config.ts'), 'utf8')
    expect(payloadConfig).not.toContain('LoginConfig')

    const headerClient = fs.readFileSync(
      Path.join(outDir, 'src/website/layout/Header/Component.client.tsx'),
      'utf8',
    )
    expect(headerClient).not.toContain("from '@/website/components/auth/AccountLink.client'")
    expect(headerClient).not.toContain('<AccountLink')
  })
})
