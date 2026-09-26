# Arkum Digital — Interactive Invitations

Arkum Digital's interactive digital invitations, published with GitHub Pages.

Each invitation is a self-contained static site (HTML, CSS and vanilla JavaScript). There is no
build step, framework or shared runtime.

## Structure

```text
invites/
└── <invitation-id>/          e.g. caylin-cole-baby-shower-2026
    ├── index.html
    ├── css/
    ├── js/
    └── assets/               images, fonts, link-preview image, icons
```

- Every invitation lives in its own folder under `invites/`. Folders do not share files.
- All paths inside an invitation are **relative** (`assets/…`, `css/…`). Never start a path with
  `/`, because the site is served from a subdirectory.
- Add a new invitation by creating a new folder. Existing ones stay untouched.

## Hosting (GitHub Pages)

The repository is served straight from the `main` branch root. There is no CI pipeline.
`.nojekyll` tells Pages to serve the files exactly as they are.

An invitation is published at:

```
https://anonc0d3rb.github.io/arkum-interactive-invites/invites/<invitation-id>/
```

Link-preview tags (`og:url`, `og:image`, `twitter:image`, `canonical`) must use that absolute
URL. Messaging apps ignore relative preview images.

## Local testing

Serve the repository root, then open the invitation's path:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/invites/<invitation-id>/`.

Test at phone widths (375 / 390 px), tablet (768 px) and desktop. Also test with
reduced motion switched on.

## Security

This repository is **public**. Only the finished invitation files are committed.
