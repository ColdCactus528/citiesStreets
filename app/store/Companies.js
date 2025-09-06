Ext.define('CS.store.Companies', {
  extend: 'Ext.data.Store',
  storeId: 'Companies',
  fields: ['id','name'],
  data: SEED.companies,
  proxy: { type: 'memory', enablePaging: false }
});
