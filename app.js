Ext.application({
  name: 'CS',
  launch: function () {

    Ext.create('CS.store.Companies'); // storeId: 'Companies'
    Ext.create('CS.store.Streets');   // storeId: 'Streets'
    Ext.create('CS.store.Cities');    // storeId: 'Cities'

    Ext.create({
      xtype: 'viewport',
      layout: 'fit',
      items: [{ xtype: 'mainview' }]
    });

    Ext.getStore('Cities').loadPage(1);
    Ext.getStore('Streets').loadPage(1);
  }
});
