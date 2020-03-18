import Widget from './widget';

const parent = document.querySelector('[data-id=canvas]');
const widget = new Widget(parent);
widget.create();
