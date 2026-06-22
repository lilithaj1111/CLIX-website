Discovery (Fontshok) — licensed font files go here
===================================================

Put your LICENSED Discovery weight files in this folder, named exactly:

    discovery-200.woff2   (Ultra-Light / קל מאוד)
    discovery-400.woff2   (Regular / רגיל)
    discovery-500.woff2   (Medium / בינוני)
    discovery-700.woff2   (Bold / מודגש)
    discovery-800.woff2   (Black / שחור)

Once these files are present, the site uses Discovery automatically
(@font-face is already wired up in src/app/globals.css). Until then it
falls back to Rubik, so the layout never breaks.

Notes:
- .woff2 is preferred (smallest). If you only have .ttf or .otf, drop those
  in instead and tell me — I'll update the format()/extension in globals.css.
- You can ship fewer weights; missing ones just fall back to Rubik.
- Source / license: https://fontshok.co.il/font/discovery/
