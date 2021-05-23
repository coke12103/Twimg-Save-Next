const fs = require('fs');
const EventEmitter = require('events');
const uuid = require('uuid');

const categorys_template = {
  categorys: [
    {
      id: 0,
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

      this.values = file;
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

  sync(){
    try{
      fs.writeFileSync(this.path, JSON.stringify(this.values, null, ' '));
      this.load_categorys();
    }catch(err){
      console.log(err);
      throw err;
    }
  }
}
