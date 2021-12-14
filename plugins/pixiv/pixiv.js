const got = require('got');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const pixiv = async function(url, save_dir){
  const Clay = this.Clay;

  // const notification = Clay.notification;

  // httpsがない場合とかwwwがない場合とか適当に捌く
  if(!url.match(/http[s]?:\/\//)){
    if(!url.match(/www\./)) url = `www.${url}`;
    url = `https://${url}`;
  }

  const opt = {
    url: url,
    method: 'GET'
  };

  const pixiv_image_id = url.match(/([0-9]+)/)[0];

  let image_data;

  try{
    const body = await got(opt);
    const dom = new JSDOM(body.body);
    image_data = JSON.parse(dom.window.document.querySelector("#meta-preload-data").content).illust[parseInt(pixiv_image_id)];
  }catch(e){
    Clay.log(e);
    Clay.set_status_text('download error');
    // notification.basic_error("ページを取得することができませんでした!\nHint: Twimg Saveは公開投稿以外の投稿の画像を取得することはできません。");
    throw e;
    // notification.error_notification("HTMLも解析に失敗しました!\n仕様変更の可能性があります。開発者に連絡してください。");
  }

  const image_url_orig = image_data.urls.original;
  const is_ugoira = (image_data.illustType == 2)

  Clay.log("Ugoira...?: " + is_ugoira);

  if(is_ugoira){
    Clay.set_status_text("Unsupported media");
    // notification.unsupported_notification("うごイラです。現在非対応です。");
    throw 'Unsupported media';
  }

  const extension = image_url_orig.match(/\.[a-zA-Z0-9]+$/);
  const image_url_base = image_url_orig.replace(/0\.[a-zA-Z0-9]+$/, '');
  const images_len = parseInt(image_data.pageCount);
  const pixiv_user_id = image_data.userId;

  Clay.log("image_url_sample: " + image_url_orig);
  Clay.log("image_url_base: " + image_url_base);
  Clay.log("extension: " + extension);
  Clay.log("images_count: " + images_len);
  Clay.log("user_id: " + pixiv_user_id);
  Clay.log("image_id: " + pixiv_image_id);

  // Pixivは複数枚投稿で形式違いの場合jpgに変換をかける。
  // そのためリトライは回数ではなくフラグにする
  // 最初jpgなら最後までjpgで最初pngなら最後までpngなので。
  let is_retry = false;
  let image_count = 0;

  Clay.set_status_text("Get page: OK");

  while(images_len > image_count){
    if(is_retry) break;

    const image_url = `${image_url_base}${image_count}${extension}`;
    const file_name = `px_${pixiv_user_id}_${pixiv_image_id}_image${image_count}${extension}`;

    Clay.log(`current request url: ${image_url}`);

    let result;

    try{
      result = await Clay.download(image_url, file_name, save_dir, url);
    }catch(e){
      Clay.log(e);
    }

    if(result){
      image_count++;
      is_retry = false;
      Clay.set_status_text("OK, Try next image.");
      await sleep(800);
    }else{
      is_retry = true;
    }

    Clay.log(`image count: ${image_count}`);

    if(image_count > 200) break;
  }

  if(image_count == 0){
    Clay.log("no image?");
    Clay.set_status_text("download error");
    // notification.basic_error("何らかの処理に失敗しました!!\n詳細: 画像枚数が0枚のまま終了処理が発生しました。\nこれは通常の処理上ではありえないため、Pixivの仕様変更の可能性があります。\n開発者に連絡してください。");
  }else{
    Clay.set_status_text("All download done!");
    // notification.end_notification(image_count, save_dir + '/' + file_name);
  }
}

module.exports = { main: pixiv };
