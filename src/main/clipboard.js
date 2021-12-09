const { clipboard } = require('electron');
const EventEmitter = require('events');

module.exports = class Clipboard extends EventEmitter{
  constructor(){
    super();

    this.interval = null;
    this.prev_str = "";
  }

  enable(){
    const check_func = () => {
      const current_str = clipboard.readText();

      if(this.prev_str == current_str) return;

      this.prev_str = current_str;
      this.emit('update', current_str);
    }

    this.prev_str = clipboard.readText();
    this.interval = setInterval(check_func, 500);
  }

  disable(){
    clearInterval(this.interval);
  }
}
