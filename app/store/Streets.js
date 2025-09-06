Ext.define('CS.store.Streets', {
  extend: 'Ext.data.Store',
  storeId: 'Streets',
  model: 'CS.model.Street',
  pageSize: 10,
  data: SEED.streets,
  proxy: { type: 'memory', enablePaging: true },
  listeners: {
    datachanged: function() {
      var cities = Ext.getStore('Cities');
      if (cities && cities.fireEvent) cities.fireEvent('refreshPopulation');
    },
    update: function() {
      var cities = Ext.getStore('Cities');
      if (cities && cities.fireEvent) cities.fireEvent('refreshPopulation');
    }
  }
});
