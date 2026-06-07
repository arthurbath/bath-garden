# Bath Garden

Bath Garden is Art Bath's static personal homepage. This version reuses the historic Careful Life web art as the landing scene while keeping the older Careful Life name reserved for the original limited-scope piece.

## Development

- `npm install`
- `npm run dev`
- `npm run dev:local`

`npm run dev:local` runs the local dev server at `http://127.0.0.1:5173/`.

## Production Build

- `npm run build`
- `npm run preview`

Image assets are optimized automatically during `npm run build` via `vite-plugin-image-optimizer`.

## Hosting

This project is static and can be hosted on GitHub Pages. The `public/CNAME` file sets the custom domain to `bath.garden` when the built site is published through Pages.
