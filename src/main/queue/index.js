const EventEmitter = require('events');
const uuid = require('uuid');

const Queue = require('./queue.js');

module.exports = class QueueManager extends EventEmitter{
  constructor(){
    super();

    // プラグインごとにキューを確保するので
    this.queues = {};
  }

  init(clay){
    this.clay = clay;

    for(const pl of this.clay.list_plugins()){
      this.queues[pl.id] = new Queue(pl.id, this.clay);

      this.queues[pl.id].on('update', () => this.onUpdate());
      this.queues[pl.id].on('done', (id) => this.onDone(id));
    }
  }

  list_queue(){
    const result = {};

    for(var queue in this.queues){
      result[this.queues[queue].id] = this.queues[queue].queue;
    }

    return result;
  }

  add(url, save_dir){
    const plugin_id = this.clay.find_source_plugin(url); // ret = id

    if(!plugin_id) return;

    var queue = {
      url: url,
      save_dir: save_dir,
      queue_id: uuid.v4().split('-').join(''),
      status: 'Queued',
      progress: 0
    };

    this.queues[plugin_id].add(queue);
  }

  onUpdate(){
    this.emit('update', this.list_queue());
  }

  onDone(id){
    this.emit('done', id);
  }
}
