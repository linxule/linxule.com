#!/usr/bin/env node
/**
 * LOOM Post Migration Script
 *
 * Migrates posts from the LOOM repo to the Eleventy site.
 * Run from xule-site directory: node scripts/migrate-loom.cjs
 *
 * Options:
 *   --check      Report missing target files without writing anything
 *   --dry-run    Show what would be migrated without writing files
 *   --single     Migrate a single file (provide path as argument)
 *   --help       Show usage without scanning or writing files
 *
 * Existing site files are never overwritten. They contain site-specific metadata,
 * image paths, and editorial changes that are not safe to regenerate wholesale.
 */

const fs = require('fs');
const path = require('path');

// Targets written during this run — guards against same-run slug collisions
// (a second source mapping to the same target would otherwise silently clobber the first)
const writtenTargets = new Set();

// Configuration
const CONFIG = {
  loomRepo: '/Users/xulelin/Documents/GitHub/loom',
  targetDir: path.join(__dirname, '..', 'src', 'writing'),

  // Source directories and their series names
  sources: [
    {
      path: 'posts',
      glob: 'loom_post_*.md',
      seriesPrefix: 'LOOM',
      useRomanNumerals: true
    },
    {
      path: 'epistemic-voids',
      glob: '*.md',
      series: 'Epistemic Voids'
    },
    {
      path: 'research-with-ai',
      glob: '*.md',
      seriesPrefix: 'Research with AI',
      numberedPrefix: 'rwa',
      slugPrefix: 'research-with-ai',
      seriesNumberStyle: 'roman'
    },
    {
      path: 'ai-whispers',
      glob: '*.md',
      series: 'AI Whispers'
    },
    {
      path: 'organizational-futures',
      glob: '*.md',
      series: 'Organizational Futures'
    },
    {
      path: 'individual-posts',
      glob: '*.md',
      series: null // No series for standalone posts
    },
    {
      path: 'seam',
      glob: '*.md',
      seriesPrefix: 'SEAM',
      numberedPrefix: 'seam',
      slugPrefix: 'seam',
      seriesNumberStyle: 'padded'
    }
  ]
};

// Roman numeral conversion
function toRoman(num) {
  const romanNumerals = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ];
  let result = '';
  for (const [numeral, value] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

// Parse YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: content };
  return { frontmatter: match[1], body: match[2] };
}

// Generate URL-friendly slug from filename
function generateSlug(filename, source) {
  let slug = filename.replace(/\.md$/, '');

  // Handle LOOM main series: loom_post_01_Title → loom-i-title
  if (source.seriesPrefix === 'LOOM') {
    const numMatch = slug.match(/loom_post_(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      const roman = toRoman(num).toLowerCase();
      slug = slug
        .replace(/loom_post_\d+[-_]?/, `loom-${roman}-`)
        .toLowerCase()
        .replace(/[_\s]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  } else if (source.numberedPrefix) {
    const numberPattern = new RegExp(`^${source.numberedPrefix}_(\\d+)[-_]?`);
    const numMatch = slug.match(numberPattern);
    if (numMatch) {
      slug = slug.replace(numberPattern, `${source.slugPrefix}-${numMatch[1]}-`);
    }
    slug = slug
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  } else {
    // Other series: clean up the filename
    slug = slug
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  return slug + '.md';
}

// Get series name for a file
function getSeriesName(filename, source) {
  if (source.series === null) return null;
  if (source.series) return source.series;

  // LOOM main series: extract number and convert to Roman
  if (source.seriesPrefix === 'LOOM') {
    const numMatch = filename.match(/loom_post_(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      return `LOOM · ${toRoman(num)}`;
    }
  }

  if (source.numberedPrefix) {
    const numMatch = filename.match(new RegExp(`^${source.numberedPrefix}_(\\d+)`));
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      const formatted = source.seriesNumberStyle === 'roman'
        ? toRoman(num)
        : String(num).padStart(2, '0');
      return `${source.seriesPrefix} · ${formatted}`;
    }
  }

  return source.seriesPrefix || null;
}

// Add layout and series to frontmatter
function transformFrontmatter(frontmatter, seriesName) {
  const lines = frontmatter.split('\n');
  const newLines = ['layout: layouts/writing.njk'];

  if (seriesName) {
    newLines.push(`series: "${seriesName}"`);
  }

  // Add existing frontmatter, skipping any existing layout/series
  for (const line of lines) {
    if (!line.startsWith('layout:') && !line.startsWith('series:')) {
      newLines.push(line);
    }
  }

  return newLines.join('\n');
}

// Migrate a single file
function migrateFile(sourcePath, source, { dryRun = false, check = false } = {}) {
  const filename = path.basename(sourcePath);
  const content = fs.readFileSync(sourcePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  const slug = generateSlug(filename, source);
  const seriesName = getSeriesName(filename, source);
  const newFrontmatter = transformFrontmatter(frontmatter, seriesName);
  const newContent = `---\n${newFrontmatter}\n---\n${body}`;

  const targetPath = path.join(CONFIG.targetDir, slug);

  if (check) {
    const exists = fs.existsSync(targetPath);
    console.log(`${exists ? 'OK' : 'MISSING'}: ${source.path}/${filename} → ${slug}`);
    return { source: sourcePath, target: targetPath, slug, series: seriesName, status: exists ? 'ok' : 'missing' };
  } else if (dryRun) {
    console.log(`[DRY RUN] Would migrate:`);
    console.log(`  From: ${sourcePath}`);
    console.log(`  To:   ${targetPath}`);
    console.log(`  Series: ${seriesName || '(none)'}`);
    console.log('');
    return { source: sourcePath, target: targetPath, slug, series: seriesName, status: 'dry-run' };
  } else {
    if (writtenTargets.has(targetPath)) {
      console.warn(`WARNING: slug collision — ${slug} already written this run; skipping ${filename}`);
      return { source: sourcePath, target: targetPath, slug, series: seriesName, status: 'skipped' };
    }
    if (fs.existsSync(targetPath)) {
      console.warn(`SKIP: ${slug} already exists; preserving site-specific content`);
      return { source: sourcePath, target: targetPath, slug, series: seriesName, status: 'skipped' };
    }
    fs.writeFileSync(targetPath, newContent);
    writtenTargets.add(targetPath);
    console.log(`Migrated: ${filename} → ${slug}`);
    return { source: sourcePath, target: targetPath, slug, series: seriesName, status: 'migrated' };
  }
}

// Main migration function
function migrate(options = {}) {
  const { dryRun = false, check = false, singleFile = null } = options;
  const results = [];

  console.log('LOOM Post Migration');
  console.log('===================');
  console.log(`Target: ${CONFIG.targetDir}`);
  console.log(`Mode: ${check ? 'CHECK' : dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  // Ensure target directory exists
  if (!dryRun && !check && !fs.existsSync(CONFIG.targetDir)) {
    fs.mkdirSync(CONFIG.targetDir, { recursive: true });
  }

  if (singleFile) {
    // Migrate single file - determine which source it belongs to
    const resolvedSingle = path.resolve(singleFile);
    for (const source of CONFIG.sources) {
      const sourceDir = path.join(CONFIG.loomRepo, source.path);
      const rel = path.relative(sourceDir, resolvedSingle);
      if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) {
        results.push(migrateFile(resolvedSingle, source, { dryRun, check }));
        break;
      }
    }
    if (results.length === 0) {
      console.error(`Could not determine source for: ${singleFile}`);
    }
  } else {
    // Migrate all files
    for (const source of CONFIG.sources) {
      const sourceDir = path.join(CONFIG.loomRepo, source.path);

      if (!fs.existsSync(sourceDir)) {
        console.log(`Skipping ${source.path} (directory not found)`);
        continue;
      }

      console.log(`\nProcessing: ${source.path}/`);
      console.log('-'.repeat(40));

      const files = fs.readdirSync(sourceDir)
        .filter(f => f.endsWith('.md'))
        .sort();

      for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        results.push(migrateFile(sourcePath, source, { dryRun, check }));
      }
    }
  }

  console.log('\n===================');
  const counts = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {});
  console.log(`Checked: ${results.length}`);
  for (const status of ['migrated', 'skipped', 'ok', 'missing', 'dry-run']) {
    if (counts[status]) console.log(`${status}: ${counts[status]}`);
  }

  // Surface slug collisions (multiple sources mapping to the same target)
  const slugSources = {};
  for (const r of results) {
    (slugSources[r.slug] = slugSources[r.slug] || []).push(r.source);
  }
  for (const [slug, srcs] of Object.entries(slugSources)) {
    if (srcs.length > 1) {
      console.warn(`WARNING: slug collision on ${slug} from:\n  ${srcs.join('\n  ')}`);
    }
  }

  return results;
}

// CLI handling
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node scripts/migrate-loom.cjs [options]\n\nOptions:\n  --check          Report missing target files without writing\n  --dry-run        Preview target paths without writing\n  --single <path>  Process one Loom Markdown file\n  --help, -h       Show this help\n\nExisting site files are always preserved.`);
  process.exit(0);
}
if (args.includes('--force')) {
  console.error('Refusing --force: existing site files contain site-specific metadata and edits.');
  process.exit(2);
}
const dryRun = args.includes('--dry-run');
const check = args.includes('--check');
const singleIndex = args.indexOf('--single');
const singleFile = singleIndex >= 0 ? args[singleIndex + 1] : null;
if (singleIndex >= 0 && (!singleFile || singleFile.startsWith('--'))) {
  console.error('--single requires a Markdown file path.');
  process.exit(2);
}

const results = migrate({ dryRun, check, singleFile });
if (check && results.some(result => result.status === 'missing')) {
  process.exitCode = 1;
}
