Ext.define('CS.view.StreetsGrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'streetsgrid',

  header: false,
  border: false,
  scrollable: true,
  store: 'Streets',

  selModel: {
    type: 'rowmodel',
    mode: 'SINGLE',
    allowDeselect: true,
    toggleOnClick: true,
    deselectOnContainerClick: true
  },

  plugins: [{
    ptype: 'cellediting',
    clicksToEdit: 1,
    autoCancel: false,
    listeners: {
      beforeedit: function () {
        var s = Ext.data.StoreManager.lookup('Companies');
        if (s && s.load && Ext.isFunction(s.isLoaded) && !s.isLoaded()) s.load();
      },
      editorshow: function (plugin, editor) {
        var grid = plugin.grid;
        var f = editor && editor.field;
        if (f && f.isXType('combobox')) {
          if (f.doQuery) f.doQuery('', true);
          if (f.expand)  f.expand();
          var picker = f.getPicker && f.getPicker();
          if (picker && picker.setZIndex) {
            var baseZ = (grid.el && grid.el.getZIndex && grid.el.getZIndex()) || 1000;
            picker.setZIndex(baseZ + 20);
          }
        }
      }
    }
  }],

  tbar: [{
    text: 'Фильтры',
    handler: function (btn) {
      var grid = btn.up('streetsgrid');

      var raisePicker = function (cb, baseEl) {
        var picker = cb && cb.getPicker && cb.getPicker();
        var base = baseEl || (grid.streetsFilterMenu && grid.streetsFilterMenu.el) || grid.el;
        if (picker && picker.setZIndex) {
          var baseZ = (base && base.getZIndex && base.getZIndex()) || 1000;
          picker.setZIndex(baseZ + 20);
        }
      };

      if (!grid.streetsFilterMenu) {
        var applyFilters = function () {
          var form = grid.streetsFilterMenu.down('form');
          var v = form.getValues();
          var s = grid.getStore();

          s.removeFilter('fName',     false);
          s.removeFilter('fCompany',  false);
          s.removeFilter('fHouses',   false);
          s.removeFilter('fPopRange', false);

          if (!form.isValid()) { return; }

          if (v.name) {
            var q = String(v.name).toLowerCase();
            s.addFilter({
              id: 'fName',
              filterFn: function (r) {
                return (r.get('name') || '').toLowerCase().includes(q);
              }
            });
          }

          if (v.company) {
            var asNum = parseInt(v.company, 10);
            if (!isNaN(asNum) && String(v.company) === String(asNum)) {
              s.addFilter({ id: 'fCompany', property: 'companyId', value: asNum });
            } else {
              var q2 = String(v.company).toLowerCase();
              s.addFilter({
                id: 'fCompany',
                filterFn: function (r) {
                  var name = r.get('company') || '';
                  return name.toLowerCase().includes(q2);
                }
              });
            }
          }

          if (v.houses !== '' && v.houses !== null && v.houses !== undefined) {
            var h = parseInt(v.houses, 10);
            if (!isNaN(h)) {
              s.addFilter({ id: 'fHouses', property: 'houses', value: h });
            }
          }

          var from = v.popFrom ? parseInt(v.popFrom, 10) : NaN;
          var to = v.popTo   ? parseInt(v.popTo, 10)   : NaN;
          if (!isNaN(from) || !isNaN(to)) {
            s.addFilter({
              id: 'fPopRange',
              filterFn: function (r) {
                var pop = (r.get('houses') || 0) * 750;
                if (!isNaN(from) && pop < from) return false;
                if (!isNaN(to)   && pop > to)   return false;
                return true;
              }
            });
          }
        };

        grid.streetsFilterMenu = Ext.create('Ext.menu.Menu', {
          width: 560,
          plain: true,
          shadow: true,
          focusOnToFront: false,
          autoHide: false,            
          defaults: { hideOnClick: false },

          items: [{
            xtype: 'form',
            bodyPadding: 10,
            buttonAlign: 'right',
            defaults: { anchor: '100%', labelAlign: 'right', labelWidth: 120, msgTarget: 'side' },

            listeners: {
              afterrender: function(form){
                form.getEl().on('keydown', function(e){
                  if (e.getKey() === Ext.event.Event.ENTER) {
                    e.preventDefault();
                    applyFilters();
                    grid.streetsFilterMenu.hide();
                  }
                  if (e.getKey() === Ext.event.Event.ESC) {
                    e.preventDefault();
                    form.getForm().reset();
                    applyFilters();
                    grid.streetsFilterMenu.hide();
                  }
                });
              }
            },

            items: [{
              xtype: 'textfield',
              name: 'name',
              fieldLabel: 'Название',
              validator: function (val) {
                return /^[А-Яа-яЁёA-Za-z\s]*$/.test(val || '')
                  ? true
                  : 'Можно вводить только буквы и пробелы';
              }
            },{
              xtype: 'combobox',
              name: 'company',
              fieldLabel: 'Компания',
              store: 'Companies',
              displayField: 'name',
              valueField: 'id',
              editable: true,          
              queryMode: 'local',
              anyMatch: true,
              forceSelection: false,
              minChars: 0,
              triggerAction: 'all',
              matchFieldWidth: false,
              listConfig: {
                minWidth: 220,
                maxHeight: 260,
                listeners: {
                  itemmousedown: function (view, rec, item, idx, e) {
                    var cb = view.pickerField || view.ownerCmp || view.up('combobox');
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
                beforequery: function (qe) { qe.query = ''; }, 
                expand: function (cb) { raisePicker(cb, grid.streetsFilterMenu.el); }
              }
            },{
              xtype: 'numberfield',
              name: 'houses',
              fieldLabel: 'Дома =',
              minValue: 0,
              allowDecimals: false
            },{
              xtype: 'fieldcontainer',
              fieldLabel: 'Население',
              layout: 'hbox',
              items: [{
                xtype: 'numberfield',
                name: 'popFrom',
                emptyText: 'от',
                minValue: 0,
                allowDecimals: false,
                flex: 1,
                margin: '0 6 0 0'
              },{
                xtype: 'numberfield',
                name: 'popTo',
                emptyText: 'до',
                minValue: 0,
                allowDecimals: false,
                flex: 1
              }]
            }],
            buttons: [{
              text: 'Сбросить',
              handler: function (b) {
                var f = b.up('form');
                f.getForm().reset();
                applyFilters();
              }
            }, {
              text: 'Применить',
              handler: function () {
                applyFilters();
                grid.streetsFilterMenu.hide();
              }
            }]
          }]
        });
      }

      grid.streetsFilterMenu.showBy(btn, 'bl-tl?'); 
    }
  }, '->', {
    text: 'Добавить улицу',
    handler: function () {
      Ext.create('CS.view.StreetForm').show();
    }
  }],

  columns: [{
    text: 'Улица',
    dataIndex: 'name',
    flex: 1,
    editor: { xtype: 'textfield', allowBlank: false },
    renderer: Ext.String.htmlEncode
  },{
    text: 'Компания',
    dataIndex: 'companyId',
    width: 220,
    renderer: function (v) {
      var s = Ext.data.StoreManager.lookup('Companies');
      var r = s && s.getById(v);
      return r ? r.get('name') : '';
    },
    editor: {
      xtype: 'combobox',
      store: 'Companies',
      displayField: 'name',
      valueField: 'id',
      queryMode: 'local',
      editable: true,
      forceSelection: false,
      anyMatch: true,
      minChars: 0,
      triggerAction: 'all',
      hideTrigger: false,
      matchFieldWidth: false,
      listConfig: {
        minWidth: 220,
        maxHeight: 260,
        listeners: {
          itemmousedown: function (view, rec, item, idx, e) {
            var cb = view.pickerField || view.ownerCmp || view.up('combobox');
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
        beforequery: function (qe) { qe.query = ''; }, 
        expand: function (cb) {
          var grid = cb.up('streetsgrid');
          var picker = cb.getPicker && cb.getPicker();
          if (grid && picker && picker.setZIndex) {
            var baseZ = (grid.el && grid.el.getZIndex && grid.el.getZIndex()) || 1000;
            picker.setZIndex(baseZ + 20);
          }
        }
      }
    }
  },{
    text: 'Дома',
    dataIndex: 'houses',
    width: 110,
    editor: { xtype: 'numberfield', minValue: 0, allowDecimals: false }
  },{
    text: 'Население (≈)',
    width: 160,
    renderer: function (v, m, r) {
      return '~ ' + ((r.get('houses') || 0) * 750).toLocaleString('ru-RU');
    }
  },{
    xtype: 'widgetcolumn',
    text: 'Действие',
    width: 130,
    widget: {
      xtype: 'button',
      text: 'Удалить',
      handler: function (btn) {
        var rec   = btn.getWidgetRecord();
        var grid  = btn.up('grid');
        var store = grid.getStore();

        Ext.Msg.confirm(
          'Подтверждение',
          'Удалить улицу «' + Ext.String.htmlEncode(rec.get('name')) + '»?',
          function (choice) {
            if (choice === 'yes') {
              store.remove(rec);
            }
          }
        );
      }
    }
  }],

  listeners: {
    edit: function (plugin, ctx) {
      if (ctx.value !== ctx.originalValue) {
        Ext.Msg.confirm('Подтверждение', 'Сохранить новое значение?', function (btn) {
          if (btn !== 'yes') ctx.record.set(ctx.field, ctx.originalValue);
        });
      }
    }
  },

  bbar: { xtype: 'pagingtoolbar', displayInfo: true }
});
