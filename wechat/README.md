# NCAA Bracket Sweepstakes for WeChat

Native WeChat Mini Program development version of the reviewed website. Nine screens use WXML, WXSS and
JavaScript `Page` controllers. The app runs locally without a cloud environment or an npm build.

## Open in WeChat Developer Tools

1. Extract the development ZIP.
2. In [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html), choose
   **Import Project** and select the `wechat` folder containing `project.config.json`.
3. Select the IDE's test-account / tourist development option. The checked-in `touristappid` is a development
   placeholder, not a registered AppID. Choose Mini Program development, without cloud services.
4. Compile the project. `miniprogram/` is already configured as the application root.

WeChat Developer Tools is not installed in the current workspace, so native IDE compilation and a physical
WeChat device preview have not been performed. Use the IDE's actual package report when preparing a release.

## Included

- Five native tabs: Home, Explore, My picks, Crowd and Standings.
- Michigan's 2026 championship headline and eleven NCAA moment cards, each with its own detail screen.
- Six historical practice games, a three-pick mini bracket, three quiz questions, 120 one-time practice XP,
  three levels and three badges. Practice never changes real bracket points.
- All 63 editable bracket picks, round navigation, safe clearing of dependent picks, and region/player auto-fill.
- An interactive canvas region map with East labels inside the region, 64 school profiles and four player profiles.
- Complete 2023–2026 archived brackets, champion paths, actual scores and source links.
- Device-local entries, crowd predictions, tied leaderboard ranks and simulated tournament results.
- Native share handlers for the challenge, profiles, clips and archives. Sharing does not include private draft
  picks or saved fan names.
- Local PNG artwork, school logos, photographs and system fonts. No page depends on a foreign CDN.

The native source package is about 1.8 MB before WeChat's own compilation. The website and Mini Program use
separate storage. WeChat progress uses `wx.setStorageSync` under `bs-wechat-v1`.

## Video playback

The original official YouTube embeds are not embedded in the Mini Program. All eleven cards keep their local
preview, story, official source link and relevant practice path. The development version clearly labels playback
as not connected.

To activate native playback, add licensed HTTPS MP4/HLS sources to `miniprogram/utils/videos.js` by moment ID:

```js
module.exports = {
  michigan: { url: 'https://your-approved-media-domain/title.mp4' }
};
```

Configure the media domain for the registered Mini Program before release. The native `video` component is
created only after a Play tap and stopped when leaving the page. No video files or third-party players preload.

## Local preview and checks

```sh
python3 scripts/preview.py
node --test tests/*.test.js
python3 scripts/preview.py --check
```

Open `http://127.0.0.1:8766/`. This browser review adapter renders the real WXML, WXSS and page controllers,
with local substitutes for WeChat navigation and storage. It is not a substitute for native Developer Tools.
Browser preview state is separate from both the website and the WeChat app.

The tests exercise native storage validation, real-pick dependencies, one-time practice rewards, entry updates,
demo locking/scoring/reset, all years' champion paths, map label hit targets, player auto-fill and package assets.

The generated data and bracket engine come from the website. If its data changes, run `npm install` in this
folder, then `npm run sync` on macOS. The sync script uses the macOS `sips` utility for small mobile images;
Sharp renders the existing vector drawings and tab icons. These tools are not needed to open the delivered app.

## Moving beyond development

A registered Mini Program AppID and WeChat's submission/review flow are needed for publication. Shared sign-in,
cross-device entries and public crowd/standings require a backend; this version deliberately shows its local
scope. The website's Netlify URL is a separate deployment and does not publish a Mini Program.

No AppSecret or server credential belongs in this project. The prize remains a student concept, with no real
prize entry or payout in this development version.

## Platform references

- [Official WeChat quickstart source and project layout](https://github.com/wechat-miniprogram/miniprogram-quickstart)
- [Official WeChat component and API examples](https://github.com/wechat-miniprogram/miniprogram-demo)
- [Project configuration](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)
- [Native video component](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)

NCAA data and media retain the source URLs and credits recorded in the website's `docs/history-sources.md` and
`docs/team-sources.md`. Player profiles carry their official source and photo credit in the app.
