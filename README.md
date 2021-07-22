# Twimg Save Next
[Twimg Save](https://github.com/coke12103/Twimg-Save)をElectron + Vueで1から書き直したやつ。    
シンプルでプラグイン式のダウンローダー。

## Features
### プラグイン式
Twimg Save Nextは画像や動画を探すことができません。それはユーザーやTwimg Save Nextの仕事ではなく、プラグインの仕事です。    
プラグインはURLと保存先を受け取り、そこから適切な方法で画像や動画を探し、Twimg Save Nextへ渡します。それを受け取ったTwimg Save Nextはそれをダウンロードします。保存先を受け取っているのでプラグイン側で特殊な保存処理を書くこともできます。    
そして、プラグインは簡単に作ることができます。    
### カテゴリ
保存先、細かく分けたいですよね。カテゴリはそれを簡単に、そしてわかりやすくします。
### キュー
連続で保存をする時には必須のキュー、プラグインごとにあります。    
全体では並列に動きますが、個々のプラグインでは直列に動きます。    
### デフォルトプラグイン
プラグインを書かなくてもデフォルトでTwitter, Pixivのダウンロードプラグインが付いています。    
箱を開けてすぐ使える!

## Required
- Node.js
- npm

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### License
Apache License 2.0
