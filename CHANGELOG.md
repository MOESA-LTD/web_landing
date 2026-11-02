# Changelog

## [0.2.0](https://github.com/MOESA-LTD/web_landing/compare/moesa-website-v0.1.0...moesa-website-v0.2.0) (2026-11-02)


### Features

* add contact form with validated API route and thank-you page ([2c3e695](https://github.com/MOESA-LTD/web_landing/commit/2c3e69525b5938af3024a5cf1acfe43da1e7cf5a))
* add German locale with flagged translations ([b21c2b5](https://github.com/MOESA-LTD/web_landing/commit/b21c2b5415e81f49d40b3cf76d7abbceb17f8159))
* add how-we-work, who-we-work-with and about pages ([16272a6](https://github.com/MOESA-LTD/web_landing/commit/16272a6654fafa4c158644b15ff9d8f8c4c837dc))
* add legal draft pages, consent handling and 404 ([c2d1906](https://github.com/MOESA-LTD/web_landing/commit/c2d19068be2a8782a20f5932b753fbdb608cfa68))
* add MOESA design tokens, Manrope and test tooling ([8859303](https://github.com/MOESA-LTD/web_landing/commit/8859303c5b31a87eee05dd0c0bd8dc763201d53a))
* add SEO, security headers and deployment docs ([6939aa1](https://github.com/MOESA-LTD/web_landing/commit/6939aa1158e333959cb6184c351784baa8183516))
* add services overview and service detail pages ([85d260e](https://github.com/MOESA-LTD/web_landing/commit/85d260ee20679acac32da32a8d95ea0cb299ec6d))
* add site header, footer, language switcher and default layout ([79d57b0](https://github.com/MOESA-LTD/web_landing/commit/79d57b07a2da0a370fb07c73455c321d4b99783f))
* add typed content layer from approved package ([e9d64e9](https://github.com/MOESA-LTD/web_landing/commit/e9d64e9f993cbf43d8f5a0c79ccbdbaf70368607))
* apply canvas hero chevron placement ([b254a81](https://github.com/MOESA-LTD/web_landing/commit/b254a81e6dda21e5908d0c2e8d55e91244128998))
* apply canvas home hero panel tweaks ([1d42497](https://github.com/MOESA-LTD/web_landing/commit/1d424977e02ee37737b663d8b84d8b6872b6d2f9))
* build home page with content-fidelity checks ([1fe7faf](https://github.com/MOESA-LTD/web_landing/commit/1fe7fafee7ff94534c360e150c89f38f42902223))
* complete TR content with flagged translations ([cc6a1dd](https://github.com/MOESA-LTD/web_landing/commit/cc6a1ddc3aa4b80904309d9451893f2e25171ff4))
* **deploy:** build for Cloudflare Pages ([9f0ceba](https://github.com/MOESA-LTD/web_landing/commit/9f0cebac9cc5665494826702efd862b4748868d2))
* **deploy:** keep the Pages runtime settings in wrangler.toml ([5f4460b](https://github.com/MOESA-LTD/web_landing/commit/5f4460bcede1d797443a9c6d79d52da8e9b2f3f5))
* **deploy:** set the Turnstile site key and preview noindex in wrangler.toml ([a7f3af8](https://github.com/MOESA-LTD/web_landing/commit/a7f3af88a75c21e17e7d880d638647d5c50ba5e6))
* MOESA public website v1 (Nuxt, EN + TR) ([faa9e9a](https://github.com/MOESA-LTD/web_landing/commit/faa9e9af2e7d5778159d7debee0e85c0f0d38d97))
* move language switcher into header dropdown ([a407c89](https://github.com/MOESA-LTD/web_landing/commit/a407c8906b306238c6ede10a46a34ef8feab40de))
* port MOESA design-system components to Vue ([bd511db](https://github.com/MOESA-LTD/web_landing/commit/bd511db22c3117ec418e515f8442a6c6cf38119d))


### Bug Fixes

* blue numeral on cyan-ruled cards for text contrast ([c46b639](https://github.com/MOESA-LTD/web_landing/commit/c46b639bd5a9bfecb6334405b6fc8f50896e3741))
* compare TR provenance against whole md units, not substrings ([d3537d0](https://github.com/MOESA-LTD/web_landing/commit/d3537d05865c40471f59640c42be4339b3688a82))
* **contact:** keep form data out of logs and label the privacy acknowledgement ([823eefe](https://github.com/MOESA-LTD/web_landing/commit/823eefe249a9277ddb8e72a063c1c274f2e494c3))
* **contact:** trust cf-connecting-ip on Cloudflare and read env bindings ([0c3f3be](https://github.com/MOESA-LTD/web_landing/commit/0c3f3be7e089949c94f6dee77c265eb16b6e3875))
* **contact:** trust Vercel IP headers only on Vercel; share locale flag parsing ([e92c7bd](https://github.com/MOESA-LTD/web_landing/commit/e92c7bd409f86cc3295d697d92cf155675255c1c))
* harden contact route and form ([11034ba](https://github.com/MOESA-LTD/web_landing/commit/11034bab42cc9714f646ce849befed0d51718788))
* **i18n:** apply the TR and DE translation review ([cb21f57](https://github.com/MOESA-LTD/web_landing/commit/cb21f57fbad5922f49481d89989909fd1407a192))
* **i18n:** keep the DE product-development meta description under 160 characters ([1bd34eb](https://github.com/MOESA-LTD/web_landing/commit/1bd34eb2f1db656a4ddf0a2b7a14834af8c6af27))
* **i18n:** render the 404 page fully in EN under a disabled locale ([146b075](https://github.com/MOESA-LTD/web_landing/commit/146b075ea74645c931a67858c5ba231b2826ab3f))
* **legal:** make the legal pages describe what the site really does ([1add855](https://github.com/MOESA-LTD/web_landing/commit/1add8551de22bfbb112d90565eb51a19cca41db7))
* **legal:** name Cloudflare as the host in the privacy and cookie policies ([de41a56](https://github.com/MOESA-LTD/web_landing/commit/de41a56467a7dc333564aa42e303250c4e6047c2))
* link the favicon and wire the cookie consent banner ([8cdfed7](https://github.com/MOESA-LTD/web_landing/commit/8cdfed79c095019a62cc99e4dc59bf815dfbd2f2))
* match header Tab order to visual order ([732fcf4](https://github.com/MOESA-LTD/web_landing/commit/732fcf4e198dea06a383288c70076e07a2ca6919))
* minify server bundle so source comments do not ship ([2ce17cd](https://github.com/MOESA-LTD/web_landing/commit/2ce17cdc9681a77a8e5029561aa4fc56dfa991e5))
* polish German copy, localise the Open chip, 404 disabled locales ([d2df59d](https://github.com/MOESA-LTD/web_landing/commit/d2df59d9c99bcbc3b78a087563a59357933434ae))
* scope content fidelity to main and drop band padding on mobile ([00ecea4](https://github.com/MOESA-LTD/web_landing/commit/00ecea4553a2e67695e75dcd2d6f55ac85195b08))
* **server:** close locale-guard and rate-limit gaps from the PR review ([213c90c](https://github.com/MOESA-LTD/web_landing/commit/213c90ca62b8959e352a1601ca3ecdb04f73a1e8))
* short TR header nav labels, close language menu on focus leave ([59d8cdd](https://github.com/MOESA-LTD/web_landing/commit/59d8cdd632ec94ff7b8830cf6a46f1e599d0872f))
* show approved TR legal-notice lines, secure consent cookie on https, drop 404.html ([bb68672](https://github.com/MOESA-LTD/web_landing/commit/bb686723b3c5e28c69393dd02c8c843705af9479))
* switch header to mobile menu below 1160px ([1f25a67](https://github.com/MOESA-LTD/web_landing/commit/1f25a67b17a5490eae2eed32bc0386ae6bd578b2))
