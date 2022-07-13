const got = require('got');

// TODO notification
// 本体側の実装が完了待ち
const twitter = async function(url, save_dir){
  const Clay = this.Clay;

  // mobile.twitter.comの場合があるがURLの形式変わらんので雑に変換する
  url = url.replace("mobile.", "");

  // ツイートのIDを取り出す
  const user_id_and_status_id = url.replace("https://twitter.com/", "");

  const user_id = user_id_and_status_id.match(/^(.+)(\/status\/)/)[1];
  const status_id = user_id_and_status_id.match(/(\/status\/)([0-9]+)/)[2];

  Clay.log(user_id);
  Clay.log(status_id);

  // Tweetの埋め込みの内部で叩かれてるAPIを使う(そうしないと年齢制限とかに引っ掛かるので)
  // このAPI的にはWindowsのChromeが多分違和感ない。
  const opt = {
    url: `https://cdn.syndication.twimg.com/tweet-result?id=${status_id}&lang=en`,
    encoding: 'utf-8',
    method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.34 Safari/537.36' }
  }

  let body;
  try{
    body = await got(opt).json();

    Clay.set_status_text("Get API: OK");
  }catch(e){
    Clay.log(e);
//    notification.basic_error("投稿を取得することができませんでした!");
    Clay.set_status_text("Get API: error");
    throw e;
  }

  // これ無いと画像ないけど動画だとどうなんだろ
  if(!'photos' in body){
    Clay.log("no_image_found");
//    notification.basic_error("画像がみつかりませんでした!");
    Clay.set_status_text("No image found");
    throw 'no_image_found';
  }

  let image_count = 0;
  for(const photo of body.photos){
    // origって効くのか知らないけどアクセスできるしこれで生成されるURLは旧実装系の内部で使われてるやつと同じなので気にしない
    const media_url = photo.url + ":orig";
    console.log(media_url)
    Clay.log(media_url);

    const extension = media_url.match(/(\/media\/)(.+)(\.[a-zA-Z0-9]+)(:[a-zA-Z]+)$/)[3];
    const file_name = `tw_${user_id}_${status_id}_image${image_count}${extension}`;

    try{
      await Clay.download(media_url, file_name, save_dir);
    }catch(e){
      Clay.log(e);
//      notification.basic_error("ファイルの書き込みに失敗しました!\nHint: 保存先に指定されたフォルダが消えていませんか？消えていないならそのフォルダに書き込み権限はありますか？");
      Clay.set_status_text("download error");
      throw e;
    }
    image_count++;
  }

  Clay.set_status_text('Download done.');
//  notification.end_notification(image_count, save_dir + '/' + file_name);
}

module.exports = { main: twitter };
