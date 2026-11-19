#!/usr/bin/env node
/**
 * Translation parity check.
 *
 * Every English page must have a Vietnamese counterpart at the same slug,
 * and vice versa. Run in CI or before a release to catch drift early:
 *
 *   npm run check:parity
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsDir = fileURLToPath(new URL('../docs/', import.meta.url))
const viDir = join(docsDir, 'vi')

function markdownFiles(dir, base = dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    if (entry === '.vitepress' || entry === 'node_modules') continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...markdownFiles(full, base))
    } else if (entry.endsWith('.md')) {
      files.push(relative(base, full))
    }
  }
  return files.sort()
}

if (!existsSync(viDir)) {
  console.error(`Missing Vietnamese locale directory: ${viDir}`)
  process.exit(1)
}

const enFiles = markdownFiles(docsDir).filter((file) => file.split(sep)[0] !== 'vi')
const viFiles = markdownFiles(viDir)

const missingVi = enFiles.filter((file) => !viFiles.includes(file))
const missingEn = viFiles.filter((file) => !enFiles.includes(file))

if (!missingVi.length && !missingEn.length) {
  console.log(`Parity OK: ${enFiles.length} pages in both locales.`)
} else {
  console.error('Translation parity issues:')
  if (missingVi.length) {
    console.error('  Missing Vietnamese:')
    for (const file of missingVi) console.error(`   - docs/${file}`)
  }
  if (missingEn.length) {
    console.error('  Missing English:')
    for (const file of missingEn) console.error(`   - docs/vi/${file}`)
  }
  process.exit(1)
}
