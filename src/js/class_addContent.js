/* eslint-disable no-loop-func */
import BpmnViewer from 'bpmn-js';
import API from './api';

export default class AddContent {
  constructor() {
    this.fileEl = document.querySelector('[data-id=file]'); // input file
    this.form = document.querySelector('[data-id=upload-form]');
    this.overlapEl = document.querySelector('[data-id=overlap]');
    this.contentList = document.querySelector('[data-id=canvas]');
  }

  create() {
    this.addListeners();
  }

  addImgs(files) {
    this.idCount = 0;
    this.fileEl = document.querySelector('[data-id=file]');

    for (let i = 0; i < files.length; i += 1) {
      const spanEl = document.createElement('span');
      spanEl.className = 'content';
      spanEl.id = this.idCount;

      const previewEl = document.createElement('div');
      previewEl.src = URL.createObjectURL(files[i]);
      previewEl.className = 'contentWrapper';


      const formData = new FormData(this.form);
      const xhr = new XMLHttpRequest();


      xhr.open('POST', 'https://bpmn-diagrams.herokuapp.com');
      // TODO: subscribe to response

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          URL.revokeObjectURL(`https://bpmn-diagrams.herokuapp.com${xhr.response}`);

          console.log(`На сервер загружаем ${this.fileEl.value}`);

          this.idCount += 1;

          this.fileEl.value = '';
        }
      });

      xhr.send(formData);
      console.log('Вроде, загрузка прошла успешно');
    }
  }

  addListeners() {
    // события для запуска окна выбора файлов
    this.overlapEl.addEventListener('click', () => {
      console.log('Начинаем выбирать, что открыть с ПК');
      this.fileEl.dispatchEvent(new MouseEvent('click'));
    });

    this.fileEl.addEventListener('change', (evt) => {
      const filesArr = Array.from(evt.currentTarget.files);
      this.addImgs(filesArr);
    });
  }


  // eslint-disable-next-line class-methods-use-this
  loadTasks() {
    console.log('Загружаю с сервера данные...');
    const api = new API('https://bpmn-diagrams.herokuapp.com/contentArr');

    async function a(contentList) {
      const images = await api.load();
      const data = await images.json();
      // console.log(data);
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].name !== '.gitkeep') {
          const spanEl = document.createElement('span');
          spanEl.className = 'contentWrapper';
          spanEl.id = data[i].name;

          const previewEl = document.createElement('div');
          previewEl.src = `https://bpmn-diagrams.herokuapp.com/${data[i].name}`;
          previewEl.className = 'content';


          const viewer = new BpmnViewer({
            container: '#canvas',
          });

          viewer.importXML(data[i], (err) => {
            if (!err) {
              console.log('success!');
              viewer.get('canvas').zoom('fit-viewport');
            } else {
              console.log('something went wrong:', err);
            }
          });


          contentList.appendChild(spanEl);
          spanEl.appendChild(previewEl);
        }
      }
    }

    a(this.contentList);
  }
}
