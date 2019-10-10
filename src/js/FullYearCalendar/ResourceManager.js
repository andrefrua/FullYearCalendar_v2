export default class ResourceManager {

  constructor() {
    this.__resources = [];
  }

  add(resource) {
    this.__resources.push(resource);
  }

  disposeAll() {
    this.__resources.forEach(resource => {
      resource.dispose();
    });
      
    this.__resources = [];
  }

  dispose() {
    this.disposeAll();
  }
}
