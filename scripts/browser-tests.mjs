import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// También el navegador de prueba queda dentro de node_modules/, sin caché global.
const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: fileURLToPath(new URL('../', import.meta.url)),
  stdio: 'inherit',
  env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: '0', ASTRO_TELEMETRY_DISABLED: '1' },
});
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
