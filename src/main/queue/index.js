const EventEmitter = require('events');

module.exports = class Queue extends EventEmitter{
  constructor(){
    super();

    // プラグインごとにキューを確保するので
    this.queues = {};
  }

  init(clay){
    this.clay = clay;

    for(var pl of this.clay.list_plugins()) this.queues[pl.id] = [];
  }

  list_queue(){
    return this.queues;
  }

  add(url, save_dir){
    var plugin = this.clay.find_source_plugin(url); // ret = id

    if(!plugin) return;

    var queue = {
      url: url,
      save_dir: save_dir,
      status: 'Queued',
      progress: 0
    };

    this.queues[plugin].push(queue);

    this.emit('update', this.queues);
  }
}
