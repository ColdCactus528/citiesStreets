Ext.define('CS.view.CitiesGrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'citiesgrid',

  header: false,
  border: false,
  scrollable: true,
  store: 'Cities',

  selModel: {
    type: 'rowmodel',
    mode: 'SINGLE',
    allowDeselect: true,
    toggleOnClick: true,
    deselectOnContainerClick: true
  },

  tbar: [{
    text: 'Фильтры',
    handler: function (btn) {
      var grid = btn.up('citiesgrid');

      var raisePicker = function (cb) {
        var menu   = grid.citiesFilterMenu;
        var picker = cb && cb.getPicker && cb.getPicker();
        if (menu && menu.el && picker && picker.setZIndex) {
          var baseZ = menu.el.getZIndex() || 1000;
          picker.setZIndex(baseZ + 20);
        }
      };

      if (!grid.citiesFilterMenu) {
        var applyFilters = function () {
          var form  = grid.citiesFilterMenu.down('form');
          var vals  = form.getValues();
          var store = grid.getStore();

          store.removeFilter('fCity',   false);
          store.removeFilter('fRegion', false);
          store.removeFilter('fPop',    false);

          if (!form.isValid()) { return; }

          if (vals.city) {
            var q = String(vals.city).toLowerCase();
            store.addFilter({
              id: 'fCity',
              filterFn: function (r) {
                return r.get('name').toLowerCase().includes(q);
              }
            });
          }
          if (vals.region) {
            store.addFilter({ id: 'fRegion', property: 'region', value: vals.region });
          }
          if (vals.pop) {
            var n = parseInt(vals.pop, 10);
            if (Ext.isNumber(n)) {
              store.addFilter({
                id: 'fPop',
                filterFn: function (r) { return r.get('population') >= n; }
              });
            }
          }
        };

        grid.citiesFilterMenu = Ext.create('Ext.menu.Menu', {
          width: 480,
          plain: true,
          shadow: true,
          focusOnToFront: false,
          autoHide: false,              
          defaults: { hideOnClick: false },

          items: [{
            xtype: 'form',
            bodyPadding: 10,
            buttonAlign: 'right',
            defaults: { anchor: '100%', labelAlign: 'right', labelWidth: 100, msgTarget: 'side' },

            listeners: {
              afterrender: function(form){
                form.getEl().on('keydown', function(e){
                  if (e.getKey() === Ext.event.Event.ENTER) {
                    e.preventDefault();
                    applyFilters();
                    grid.citiesFilterMenu.hide();
                  }
                  if (e.getKey() === Ext.event.Event.ESC) {
                    e.preventDefault();
                    form.getForm().reset();
                    applyFilters();
                    grid.citiesFilterMenu.hide();
                  }
                });
              }
            },

            items: [{
              xtype: 'textfield',
              name: 'city',
              fieldLabel: 'Город',
              validator: function (val) {
                return /^[А-Яа-яЁёA-Za-z\s]*$/.test(val)
                  ? true
                  : 'Можно вводить только буквы и пробелы';
              }
            },{
              xtype: 'combobox',
              name: 'region',
              fieldLabel: 'Регион',
              editable: false,
              queryMode: 'local',
              displayField: 'region',
              valueField: 'region',
              forceSelection: true,
              store: {
                fields: ['region'],
                data: Ext.Array.unique(Ext.Array.pluck(SEED.cities, 'region'))
                      .map(function (r) { return { region: r }; })
              },
              listConfig: {
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
                expand: function (cb) {
                  raisePicker(cb);
                }
              }
            },{
              xtype: 'numberfield',
              name: 'pop',
              fieldLabel: 'Население ≥',
              minValue: 0,
              allowDecimals: false
            }],
            buttons: [{
              text: 'Сбросить',
              handler: function (b) {
                var f = b.up('form');
                f.getForm().reset();
                applyFilters();
              }
            },{
              text: 'Применить',
              handler: function (b) {
                applyFilters();
                grid.citiesFilterMenu.hide();
              }
            }]
          }]
        });
      }

      grid.citiesFilterMenu.showBy(btn, 'bl-tl?'); 
    }
  }],

  columns: [{
    text: 'Город', dataIndex: 'name', flex: 1
  },{
    text: 'Регион', dataIndex: 'region', width: 120
  },{
    text: 'Население', dataIndex: 'population', width: 140,
    renderer: function (v) {
      return '~ ' + Ext.util.Format.number(v, '0,000');
    }
  }],

  bbar: { xtype: 'pagingtoolbar', displayInfo: true }
});
