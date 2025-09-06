Ext.define('CS.view.StreetForm', {
  extend: 'Ext.window.Window',
  xtype: 'streetform',
  title: 'Добавить улицу',
  modal: true,
  width: 460,
  layout: 'fit',
  defaultFocus: 'textfield[name=name]',

  raisePicker: function (combo) {
    var win    = combo.up('window'),
        picker = combo.getPicker();
    if (!picker || !picker.setZIndex) return;

    var baseZ = (win && win.getEl() && win.getEl().getZIndex && win.getEl().getZIndex()) ||
                (Ext.WindowManager.getActive() && Ext.WindowManager.getActive().getEl().getZIndex && Ext.WindowManager.getActive().getEl().getZIndex()) ||
                1000;
    picker.setZIndex(baseZ + 20);
  },

  items: [{
    xtype: 'form',
    reference: 'form',
    bodyPadding: 12,
    buttonAlign: 'right',
    defaults: {
      anchor: '100%',
      labelWidth: 130,
      allowBlank: false,
      msgTarget: 'side'
    },

    items: [{
      xtype: 'textfield',
      name: 'name',
      fieldLabel: 'Название',
      minLength: 3,
      validator: function (val) {
        return /^[А-Яа-яЁёA-Za-z\s]*$/.test(val) ? true : 'Только буквы и пробелы';
      }
    }, {
      xtype: 'combobox',
      name: 'companyId',
      fieldLabel: 'Компания',
      store: 'Companies',               
      displayField: 'name',
      valueField: 'id',
      queryMode: 'local',
      forceSelection: true,
      editable: true,
      anyMatch: true,
      minChars: 0,
      triggerAction: 'all',
      hideTrigger: false,
      typeAhead: true,
      matchFieldWidth: true,
      listConfig: {
        listeners: {
          itemmousedown: function (view, rec, item, index, e) {
            var cb = view.pickerField || view.ownerCmp; 
            if (!cb) cb = view.up('combobox');
            if (!cb) return;

            cb.setValue(rec.get(cb.valueField));
            cb.setRawValue(rec.get(cb.displayField));

            cb.fireEvent('select', cb, rec);
            cb.collapse();
            e.stopEvent(); 
          }
        }
      },
      listeners: {
        expand: function (cb) {
          delete cb.lastQuery;
          cb.doQuery('', true);
          cb.up('window').raisePicker(cb);
        }
      }
    }, {
      xtype: 'numberfield',
      name: 'houses',
      fieldLabel: 'Дома',
      minValue: 0,
      allowDecimals: false
    }, {
      xtype: 'combobox',
      name: 'cityId',
      fieldLabel: 'Город',
      store: {
        fields: ['id', 'name'],
        data: SEED.cities
      },
      displayField: 'name',
      valueField: 'id',
      queryMode: 'local',
      forceSelection: true,
      editable: true,
      anyMatch: true,
      minChars: 0,
      triggerAction: 'all',
      hideTrigger: false,
      typeAhead: true,
      matchFieldWidth: true,
      listConfig: {
        listeners: {
          itemmousedown: function (view, rec, item, index, e) {
            var cb = view.pickerField || view.ownerCmp;
            if (!cb) cb = view.up('combobox');
            if (!cb) return;

            cb.setValue(rec.get(cb.valueField));
            cb.setRawValue(rec.get(cb.displayField));

            cb.fireEvent('select', cb, rec);
            cb.collapse();
            e.stopEvent();
          }
        }
      },
      listeners: {
        expand: function (cb) {
          delete cb.lastQuery;
          cb.doQuery('', true);
          cb.up('window').raisePicker(cb);
        }
      }
    }],

    buttons: ['->', {
      text: 'Закрыть',
      handler: function(btn){ btn.up('window').close(); }
    }, {
      text: 'Создать',
      disabled: true,
      formBind: true,
      handler: function(btn){
        var win  = btn.up('window'),
            form = win.down('form');
        if (!form.isValid()) return;

        var values = form.getValues();
        values.id         = Ext.Number.randomInt(100000, 999999);
        values.houses     = parseInt(values.houses, 10) || 0;
        values.companyId  = parseInt(values.companyId, 10);
        values.cityId     = parseInt(values.cityId, 10);

        Ext.getStore('Streets').add(values);
        win.close();
      }
    }]
  }]
});
