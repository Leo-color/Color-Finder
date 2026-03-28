#!/usr/bin/env node
/**
 * Converte tutte le guide Markdown in PDF stilizzati.
 * Richiede: pandoc + xelatex (installati dal sistema)
 * Uso: node scripts/build-pdf-guides.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PDF_DIR = path.join(__dirname, '..', 'docs', 'pdf');

const GUIDES = [
  'GUIDA-01-Setup-Ambiente.md',
  'GUIDA-02-Installazione-App.md',
  'GUIDA-03-Build-APK.md',
  'GUIDA-04-Google-Play.md',
  'GUIDA-05-Aggiornamenti-Virali.md',
];

// Pandoc metadata / LaTeX config
const PANDOC_VARS = [
  '--pdf-engine=xelatex',
  '-V geometry:margin=2.5cm',
  '-V geometry:a4paper',
  '-V fontsize=11pt',
  '-V mainfont="DejaVu Sans"',
  '-V monofont="DejaVu Sans Mono"',
  '-V linkcolor=blue',
  '-V urlcolor=blue',
  '-V colorlinks=true',
  '--highlight-style=tango',
  '--toc',
  '--toc-depth=2',
  '-V toc-title="Indice"',
].join(' ');

if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

let ok = 0;
let fail = 0;

for (const file of GUIDES) {
  const input = path.join(DOCS_DIR, file);
  const output = path.join(PDF_DIR, file.replace('.md', '.pdf'));

  if (!fs.existsSync(input)) {
    console.warn(`  ⚠️  Non trovato: ${file}`);
    fail++;
    continue;
  }

  try {
    execSync(`pandoc "${input}" ${PANDOC_VARS} -o "${output}"`, { stdio: 'pipe' });
    const size = (fs.statSync(output).size / 1024).toFixed(1);
    console.log(`  ✅  ${file.replace('.md', '.pdf')}  (${size} KB)`);
    ok++;
  } catch (err) {
    console.error(`  ❌  ${file}: ${err.stderr?.toString().trim() || err.message}`);
    fail++;
  }
}

console.log(`\n${ok} PDF generati in docs/pdf/  |  ${fail} errori`);
if (ok > 0) {
  console.log('\nFile generati:');
  fs.readdirSync(PDF_DIR).forEach(f => {
    const s = (fs.statSync(path.join(PDF_DIR, f)).size / 1024).toFixed(1);
    console.log(`  📄  docs/pdf/${f}  (${s} KB)`);
  });
}
