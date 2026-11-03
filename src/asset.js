/** Resuelve un archivo de public/assets respetando la base de despliegue (p. ej. GitHub Pages). */
export const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`;
