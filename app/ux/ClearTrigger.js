Ext.define('CS.ux.ClearTrigger', {
  extend: 'Ext.form.trigger.Trigger',
  alias: 'trigger.clear',

  cls: 'x-form-clear-trigger',
  weight: -1,

  onClick: function () {
    var f = this.field;

    if (f.isXType('combo')) {
      f.clearValue();
    } else {
      f.reset();
    }

    if (typeof f.fireEvent === 'function') {
      f.fireEvent('change', f, f.getValue());
    }
  }
});
