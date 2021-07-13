const EventEmitter = require('events');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = class Queue extends EventEmitter{
  constructor(id, clay){
    super();

    this.queue = [];
    this.is_downloading = false;

    this.id = id;
    this.clay = clay;
  }

  add(queue_data){
    this.queue.push(queue_data);
    this.emit('update');

    this._download();
  }

  async _download(){
    if(this.is_downloading || this.queue.length == 0) return;

    this.is_downloading = true;

    var queue = this.queue[0];

    try{
      // 実行開始時のみこちらで書き換えてやる。
      // 実行後はClay側でやる。
      this.queue[0].status = '0%';
      // Promiseを返してるプラグインなら完了まで待機する
      // awaitはPromiseじゃなきゃ完了したPromiseとして処理してくれるのでプラグインの実装には左右されない
      await this.clay.exec(this.id, queue.url, queue.save_dir, queue.queue_id);
    }catch(err){
      this.clay.logger.log(`plugin_error: ${err}`);
      console.log(err);
    }

    await sleep(500);

    this.queue.shift();
    this.emit('done', queue.queue_id);
    this.emit('update');
    this.is_downloading = false;
    this._download();
  }
}
