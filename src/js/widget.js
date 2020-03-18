import AddContent from './class_addContent';

export default class Widget {
  constructor(parent) {
    this.parent = parent;
    this.openFromPC = document.querySelector('[data-id=overlap_open_pc]');
    this.fileEl = document.querySelector('[data-id=file]');
    this.justOpen = document.querySelector('[data-id=justOpen]');
  }

  create() {
    const addContent = new AddContent();
    addContent.create();

    this.addEventListeners();
  }

  addEventListeners() {
    this.justOpen.addEventListener('click', () => {
      console.log('Пытаемся посмотреть, что есть в БД');
      const addContent = new AddContent();
      addContent.loadTasks();
    });
  }
}
