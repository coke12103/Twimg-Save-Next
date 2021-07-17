const download = require('./download.js');

module.exports = class Clay{
  constructor(clay_core){
    this._core = clay_core;
  }

  trap(data){
    var is_followed = false;

    console.log(`start trap!\n  code: ${data.code}`);

    for(var spell of this._core.spells){
      if(!(spell.type && spell.type.follow) || spell.type.follow.code != data.code) continue;

      var follow = spell.type.follow;

      console.log('follow');

      this._core._set_target_sns(follow.target_text);

      this._core.follow[spell.id][follow.exec](data);
      is_followed = true;
      break;
    }

    if(is_followed) return;

    // 通知系の処理
  }

  set_status_text(text){
    this._core.emit('status_text_update', text);
  }

  log(...arg){
    for(var a of arg) this._core.logger.log(`plugin: ${a}`);
  }

  download(url, filename, save_dir, ref){
    return download.bind({Clay: this}, url, filename, save_dir, ref)();
  }
}
