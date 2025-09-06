Ext.define('CS.model.Street', {
  extend: 'Ext.data.Model',
  fields: [
    'id',
    { name: 'cityId', type: 'int' },
    'name',
    { name: 'companyId', type: 'int' },
    { name: 'houses', type: 'int', defaultValue: 0 },
    { name: 'company', persist: false, convert: function(v, rec){
        var store = Ext.getStore('Companies');
        var r = store && store.getById(rec.get('companyId'));
        return r ? r.get('name') : '';
    }}
  ],
  idProperty: 'id'
});
