import fs from 'fs/promises';
import path from 'path';

// Files are stored on local disk when no S3 bucket is configured (AWS_BUCKET_NAME unset).
// In Docker this directory is a named volume, so uploads survive restarts and redeploys.
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.resolve('uploads');

export const useLocalStorage = () => !process.env.AWS_BUCKET_NAME;

// Only allow plain file names, so a crafted name can't escape the uploads directory.
function resolveSafe(name) {
    if (typeof name !== 'string' || name !== path.basename(name) || name.startsWith('.')) {
        throw new Error(`Invalid file name: ${name}`);
    }
    return path.join(UPLOADS_DIR, name);
}

export async function localPut(buffer, name) {
    await fs.mkdir(UPLOADS_DIR, {recursive: true});
    await fs.writeFile(resolveSafe(name), buffer);
}

// Same shape as the S3 getObject result the callers already expect: { Body: Buffer }
export async function localGet(name) {
    return {Body: await fs.readFile(resolveSafe(name))};
}

export async function localDelete(name) {
    if (!name || name.startsWith('default')) return; // never delete the built-in default images
    await fs.rm(resolveSafe(name), {force: true});
}
