import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { save } from './live.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * TK Code Studio — Official Single-Port Vite Plugin
 * Enables visual in-browser live editing directly on your Vite dev server port.
 * Zero proxy servers. Zero extra ports. Zero port conflicts.
 */
export function tkCodeStudioPlugin() {
  const clientJsPath = path.join(__dirname, 'client.js');

  return {
    name: 'vite-plugin-tk-code-studio',
    apply: 'serve', // Active only during local dev, stripped from production builds

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 1. Serve latest client overlay script (cache-busted)
        if (req.url && req.url.startsWith('/__live/client.js')) {
          res.writeHead(200, {
            'content-type': 'text/javascript',
            'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
            'pragma': 'no-cache',
            'expires': '0'
          });
          try {
            const clientJs = fs.readFileSync(clientJsPath, 'utf8');
            return res.end(clientJs);
          } catch (err) {
            return res.end(`console.error("[TK Code Studio] Failed to read client.js: ${err.message}");`);
          }
        }

        // 2. Handle Save to Code requests directly inside Vite
        if (req.url === '/__live/save' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const result = save(data);
              res.writeHead(200, { 'content-type': 'application/json' });
              return res.end(JSON.stringify(result));
            } catch (err) {
              res.writeHead(500, { 'content-type': 'application/json' });
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. Handle Drag & Drop Asset Uploads directly inside Vite
        if (req.url === '/__live/upload-asset' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const raw = JSON.parse(body);
              const root = process.cwd();
              const name = (raw.name || 'uploaded_image.png').replace(/[^a-zA-Z0-9._-]/g, '_');
              const ext = path.extname(name) || '.png';
              const baseName = path.basename(name, ext);
              const finalName = `${baseName}_${Date.now().toString(36)}${ext}`;

              let destDir = path.join(root, 'public', 'images');
              let publicUrl = `/images/${finalName}`;
              if (!fs.existsSync(path.join(root, 'public'))) {
                destDir = path.join(root, 'src', 'assets');
                publicUrl = `/src/assets/${finalName}`;
              }
              fs.mkdirSync(destDir, { recursive: true });
              const filePath = path.join(destDir, finalName);
              const buf = Buffer.from((raw.data || '').replace(/^data:[^;]+;base64,/, ''), 'base64');
              fs.writeFileSync(filePath, buf);
              console.log(`  ✓ Asset uploaded: ${path.relative(root, filePath)} -> ${publicUrl}`);
              res.writeHead(200, { 'content-type': 'application/json' });
              return res.end(JSON.stringify({ ok: true, url: publicUrl, file: path.relative(root, filePath) }));
            } catch (err) {
              res.writeHead(500, { 'content-type': 'application/json' });
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },

    transformIndexHtml(html) {
      const token = 'tk-single-port-token';
      const scriptTag = `<script>window.__LIVE_TOKEN=${JSON.stringify(token)}</script><script src="/__live/client.js?v=${Date.now()}"></script>`;
      return /<\/body>/i.test(html)
        ? html.replace(/<\/body>/i, () => scriptTag + '</body>')
        : html + scriptTag;
    }
  };
}

export default tkCodeStudioPlugin;
