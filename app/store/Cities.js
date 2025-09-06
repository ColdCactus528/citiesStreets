Ext.define('CS.store.Cities', {
  extend: 'Ext.data.Store',
  storeId: 'Cities',
  model: 'CS.model.City',
  pageSize: 10,
  data: SEED.cities,
  proxy: { type: 'memory', enablePaging: true },
  listeners: {
    refreshPopulation: function(){
      this.each(function(r){ r.set('population', r.get('population')); });
    }
  }
});
