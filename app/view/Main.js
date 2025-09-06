Ext.define('CS.view.Main', {
  extend: 'Ext.container.Container',
  xtype: 'mainview',

  layout: { type: 'hbox', align: 'stretch' },
  padding: 16,

  items: [{
    xtype: 'panel',
    cls: 'soft-card',
    title: 'Города',
    layout: 'fit',
    bodyPadding: 8,
    flex: 1,                   
    minWidth: 320,
    margin: '0 12 0 0',

    items: [{
      xtype: 'citiesgrid',
      border: false,
      scrollable: true,

      listeners: {
        selectionchange: function (selModel, selected) {
          var grid = selModel.view ? selModel.view.grid : selModel.getView().ownerGrid;

          var streetsGrid = grid.up('mainview').down('streetsgrid'),
              s = streetsGrid.getStore();

          s.removeFilter('fCityLink', false);   

          if (selected && selected.length) {
            var cityId = selected[0].get('id');
            s.addFilter({ id: 'fCityLink', property: 'cityId', value: cityId });
          }
        }
      }
    }]
  },{
    xtype: 'panel',
    cls: 'soft-card',
    title: 'Улицы',
    layout: 'fit',
    bodyPadding: 8,
    flex: 3,                   
    minWidth: 640,
    items: [{
      xtype: 'streetsgrid',
      border: false,
      scrollable: true
    }]
  }]
});
