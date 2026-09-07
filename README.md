# ArtNova GitHub Pages Website

This is the public static website for ArtNova.

## Important architecture

GitHub Pages hosts static HTML/CSS/JavaScript. It does NOT run a Python/Flask
backend. The Raspberry Pi therefore publishes ArtNova record files into the
GitHub repository using the GitHub Contents API.

The site reads:

    data/index.json

and artwork images from:

    data/images/<record-key>/

The Pi-side uploader should use a fine-grained GitHub token with Contents:
Read and write permission on the repository.

Never put the GitHub token into HTML, JavaScript, or any public file.

## GitHub Pages

Repository:
    create a normal GitHub repository, for example ArtNova

Enable:
    Settings -> Pages -> Deploy from a branch -> main -> /(root)

The site will be available at:
    https://YOUR-USERNAME.github.io/ArtNova/

## Public data warning

Because GitHub Pages is a public static website, records and images placed
in a public repository are publicly accessible. Do not upload private artwork,
personal information, or sensitive data unless you intentionally want it
public.
