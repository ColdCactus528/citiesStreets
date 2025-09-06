Ext.define('CS.model.City', {
  extend: 'Ext.data.Model',
  fields: [
    'id', 'name', 'region',
    {
      name: 'population',
      type: 'int',
      persist: false,
      convert: function (v, rec) {
        var streets = Ext.getStore('Streets');
        if (!streets) return 0; 

        var src = null, allItems = [];

        try {
          if (streets.getData && streets.getData().getSource) {
            src = streets.getData().getSource(); 
          }
        } catch (e) {}

        if (src && src.items) {
          allItems = src.items;                        
        } else if (streets.getAllRange) {
          allItems = streets.getAllRange();            
        } else if (streets.snapshot && streets.snapshot.items) {
          allItems = streets.snapshot.items;           
        } else if (streets.data && streets.data.items) {
          allItems = streets.data.items;               
        }

        var cid = rec.get('id'), houses = 0, i, r;
        for (i = 0; i < allItems.length; i++) {
          r = allItems[i];
          if (r.get('cityId') === cid) houses += r.get('houses') || 0;
        }
        return houses * 750;
      }
    }
  ],
  idProperty: 'id'
});
