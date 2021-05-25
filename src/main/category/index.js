const fs = require('fs');
const EventEmitter = require('events');
const uuid = require('uuid');

const categorys_template = {
  categorys: [
    {
      id: uuid.v4().split('-').join(''),
      name: 'デフォルト',
      save_dir: './'
    }
  ]
};

module.exports = class CategoryManager extends EventEmitter{
  constructor(){
    super();

    this.values = { categorys: [] };
  }

  init(path = './categorys.json'){
    this.path = path;

    try{
      if(!fs.existsSync(path)) this.create_default_categorys();

      this.load_categorys();
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  create_default_categorys(){
    try{
      fs.writeFileSync(this.path, JSON.stringify(categorys_template, null, ' '));
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  load_categorys(){
    try{
      var file = JSON.parse(fs.readFileSync(this.path, 'utf8'));

      // 旧Twimg SaveのIDが数字なのに対してNextはUUIDから生成した文字列なので数字のIDがあるならIDを再生成する
      if(file.categorys.some((el) => typeof(el.id) === 'number')){
        var result = { categorys: [] };

        for(var cat of file.categorys){
          if(typeof(cat.id) === 'number') cat.id = uuid.v4().split('-').join('');

          result.categorys.push(cat);
        }

        this.values = result;
        this.sync();
      }else{
        this.values = file;
      }
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  all(){
    return this.values.categorys;
  }

  get(id){
    var result = this.values.categorys.find(el => el.id === id);

    if(typeof(result) === 'undefined') throw "指定された値がありません";

    return result;
  }

  add(name, save_dir){
    if(!fs.existsSync(save_dir)) throw '指定されたディレクトリがありません';

    var id = uuid.v4().split('-').join('');

    var cat = {
      id: id,
      name: name,
      save_dir: save_dir
    };

    this.values.categorys.push(cat);

    try{
      this.sync();
      this.emit('update');

      return id;
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  edit(id, name, save_dir){
    if(!fs.existsSync(save_dir)) throw '指定されたディレクトリがありません';
    if(!this.values.categorys.some(el => el.id === id)) throw "指定された値がありません";

    var result = { categorys: [] };

    for(var el of this.values.categorys){
      if(el.id === id){
        el.name = name;
        el.save_dir = save_dir;
      }

      result.categorys.push(el);
    }

    this.values = result;

    try{
      this.sync();
      this.emit('update');

      return id;
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  del(id){
    if(!this.values.categorys.some(el => el.id === id)) throw "指定された値がありません";

    var result = this.values.categorys.filter(el => el.id !== id);

    this.values.categorys = result;

    try{
      this.sync();
      this.emit('update');

      return id;
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  sync(){
    try{
      fs.writeFileSync(this.path, JSON.stringify(this.values, null, ' '));
      // 要らない説ある
      //this.load_categorys();
    }catch(err){
      console.log(err);
      throw err;
    }
  }
}
