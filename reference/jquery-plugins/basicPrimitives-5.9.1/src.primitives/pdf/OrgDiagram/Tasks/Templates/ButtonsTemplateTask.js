primitives.pdf.orgdiagram.ButtonsTemplateTask = function (itemsSizesOptionTask) {
  var _data = {
    template: null
  };

  function process() {
    return false;
  }

  function getTemplate() {
    if (_data.template == null) {
      _data.template = new primitives.pdf.DummyTemplate();
    }
    return _data.template;
  }

  return {
    process: process,
    getTemplate: getTemplate
  };
};