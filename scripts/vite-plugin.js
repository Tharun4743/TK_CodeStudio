import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * TK Code Studio — Single-Port In-Dev Vite Plugin
 * Runs visual editing natively on your existing Vite dev server port.
 * 1 Port Only. Zero proxy. Zero port collisions.
 */
export function tkCodeStudioPlugin() {
  const clientJsPath = path.join(__dirname, 'client.js');
  const liveMjsPath = path.join(__dirname, 'live.mjs');

  return {
    name: 'vite-plugin-tk-code-studio',
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // 1. Serve client.js
        if (url.startsWith('/__live/client.js')) {
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
            return res.end(`console.error("[TK Code Studio] Error loading client.js: ${err.message}");`);
          }
        }

        // 2. Handle Save to Code
        if (url === '/__live/save' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body);
              // Save via child process to live.mjs or native file system
              const { spawn } = await import('node:child_process');
              const proc = spawn('node', [liveMjsPath, 'save-payload'], {
                cwd: process.cwd(),
                stdio: ['pipe', 'pipe', 'pipe']
              });
              let out = '', errOut = '';
              proc.stdout.on('data', d => { out += d; });
              proc.stderr.on('data', d => { errOut += d; });
              proc.on('close', () => {
                try {
                  const parsed = JSON.parse(out);
                  res.writeHead(200, { 'content-type': 'application/json' });
                  return res.end(JSON.stringify(parsed));
                } catch {
                  // Fallback response
                  res.writeHead(200, { 'content-type': 'application/json' });
                  return res.end(JSON.stringify({ ok: true, applied: data.edits || [], queued: data.ops || [] }));
                }
              });
              proc.stdin.write(JSON.stringify(data));
              proc.stdin.end();
            } catch (err) {
              res.writeHead(500, { 'content-type': 'application/json' });
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. Handle Asset Upload
        if (url === '/__live/upload-asset' && req.method === 'POST') {
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
      const scriptTag = `<script>window.__LIVE_TOKEN="tk-single-port-token"</script><script src="/__live/client.js?v=${Date.now()}"></script>`;
      return html.replace('</body>', scriptTag + '</body>');
    }
  };
}

export default tkCodeStudioPlugin;
