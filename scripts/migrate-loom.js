#!/usr/bin/env node
/**
 * LOOM Post Migration Script
 *
 * Migrates posts from the LOOM repo to the Eleventy site.
 * Run from xule-site directory: node scripts/migrate-loom.js
 *
 * Options:
 *   --dry-run    Show what would be migrated without writing files
 *   --single     Migrate a single file (provide path as argument)
 */

const fs = require('fs');
const path = require('path');

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
      path: 'organizational-futures',
      glob: '*.md',
      series: 'Organizational Futures'
    },
    {
      path: 'individual-posts',
      glob: '*.md',
      series: null // No series for standalone posts
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
  let slug = filename.replace('.md', '');

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
function migrateFile(sourcePath, source, dryRun = false) {
  const filename = path.basename(sourcePath);
  const content = fs.readFileSync(sourcePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  const slug = generateSlug(filename, source);
  const seriesName = getSeriesName(filename, source);
  const newFrontmatter = transformFrontmatter(frontmatter, seriesName);
  const newContent = `---\n${newFrontmatter}\n---\n${body}`;

  const targetPath = path.join(CONFIG.targetDir, slug);

  if (dryRun) {
    console.log(`[DRY RUN] Would migrate:`);
    console.log(`  From: ${sourcePath}`);
    console.log(`  To:   ${targetPath}`);
    console.log(`  Series: ${seriesName || '(none)'}`);
    console.log('');
  } else {
    fs.writeFileSync(targetPath, newContent);
    console.log(`Migrated: ${filename} → ${slug}`);
  }

  return { source: sourcePath, target: targetPath, series: seriesName };
}

// Main migration function
function migrate(options = {}) {
  const { dryRun = false, singleFile = null } = options;
  const results = [];

  console.log('LOOM Post Migration');
  console.log('===================');
  console.log(`Target: ${CONFIG.targetDir}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  // Ensure target directory exists
  if (!dryRun && !fs.existsSync(CONFIG.targetDir)) {
    fs.mkdirSync(CONFIG.targetDir, { recursive: true });
  }

  if (singleFile) {
    // Migrate single file - determine which source it belongs to
    for (const source of CONFIG.sources) {
      const sourceDir = path.join(CONFIG.loomRepo, source.path);
      if (singleFile.startsWith(sourceDir)) {
        results.push(migrateFile(singleFile, source, dryRun));
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
        results.push(migrateFile(sourcePath, source, dryRun));
      }
    }
  }

  console.log('\n===================');
  console.log(`Total: ${results.length} files ${dryRun ? 'would be ' : ''}migrated`);

  return results;
}

// CLI handling
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const singleIndex = args.indexOf('--single');
const singleFile = singleIndex >= 0 ? args[singleIndex + 1] : null;

migrate({ dryRun, singleFile });
