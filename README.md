# Jike.Tab

Ⓙ 新标签页扩展，精选即友 UGC

![](https://user-images.githubusercontent.com/26399680/59157848-7ca6e600-8ae4-11e9-9607-c6c34d885f77.png)

## About

个人感觉 new tab page 非常适合做周边，安装简单、存在感又强、热更新加彩蛋也方便，满满社区归属感，不过一直没人做。

后来才意识到其实大部分人还是在用 [infinite](https://chrome.google.com/webstore/detail/nnnkddnnlpamobajfibfdgfnbcnkgngh) 之类的 speed dial 页，翻[掘金插件](https://chrome.google.com/webstore/detail/lecdifefmmfjnjjinhaennhdlmcaeeeb)的评论也发现有挺多人反感占用新标签页的，不像我只用 ntp 看风景看时间。

曾今用过很长一段时间 [Anyway.Tab](https://chrome.google.com/webstore/detail/jaoejhbbokpmbndhdopikidehkadhake)，虽然已经不怎么听了，官网什么时候有广告位的我都不知道。但是现在再装回插件，还是会有之前的感觉，尽管自己已经离设计方向越来越远了。

所以，不管别人用不用，我还是选择做。

## Implementation

依靠即刻 web 自身 (iframe) 来刷新 access token，通过 background.js 拦截 headers 获取 token， 因此不需要额外扫码登录，不需要常驻后台服务，仅要求登录即刻网页版 (日历和问候数据有 5 分钟缓存)

## Future

仅过滤掉了超过 100 字或超过 6 个换行的动态，还是会出现很长的动态，部分带图动态可能不适合纯文本展示

设计上有挺多问题，有很多 Anyway.Tab 的影子，暂时也没做动画，希望有专业的 UI 助攻

使用时间排序，圈子内的部分内容可能缺乏普适性 (有些比较私人的动态)，用热度排序又怕刷到过多重复的动态

关于动态重复刷动态的问题或许要维护一个已读池，也方便翻查

## Reference

- [findingsea/jikeme](https://github.com/findingsea/jikeme)
- [ryanfwy/jike-calendar](https://github.com/ryanfwy/jike-calendar)
- [Dawninest/jikeCalendar-macOS](https://github.com/Dawninest/jikeCalendar-macOS)
- [Anyway-Design/Anyway.Tab](https://github.com/Anyway-Design/Anyway.Tab)

## Credit

即刻 APP 和全体即友

## License

MIT License