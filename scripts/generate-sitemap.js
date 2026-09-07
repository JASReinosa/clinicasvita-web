const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://clinicasvita.com';
const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (['node_modules', '.git', '.clasp.json', 'assets'].includes(file)) continue;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file === 'index.html') {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const indexFiles = getHtmlFiles(ROOT_DIR);
const today = new Date().toISOString().split('T')[0];

const urls = indexFiles.map(file => {
    const rel = path.relative(ROOT_DIR, file);
    let urlPath = '';
    if (rel === 'index.html') {
        urlPath = '/';
    } else {
        const dirName = path.dirname(rel).replace(/\\/g, '/');
        urlPath = `/${dirName}/`;
    }
    const priority = urlPath === '/' ? '1.0' : '0.8';
    return `  <url>
    <loc>${DOMAIN}${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf-8');
console.log(`Sitemap generado con éxito con ${urls.length} URLs en ${SITEMAP_PATH}`);
