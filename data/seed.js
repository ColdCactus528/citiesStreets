window.SEED = {
  companies: [
    { id: 1, name: 'КомСервис' },
    { id: 2, name: 'ГорИнфра' },
    { id: 3, name: 'СтройДом' },
    { id: 4, name: 'ЭкоСити' }
  ],

  cities: [
    { id: 1, name: 'Москва', region: 'ЦФО' },
    { id: 2, name: 'Санкт-Петербург', region: 'СЗФО' },
    { id: 3, name: 'Казань', region: 'ПФО' },
    { id: 4, name: 'Новосибирск', region: 'СФО' }
  ],

  streets: [
    { id: 1,  cityId: 1, name: 'Тверская',      companyId: 1, houses: 120 },
    { id: 2,  cityId: 1, name: 'Арбат',         companyId: 2, houses: 80  },
    { id: 3,  cityId: 2, name: 'Невский пр.',   companyId: 1, houses: 150 },
    { id: 4,  cityId: 2, name: 'Гороховая',     companyId: 3, houses: 60  },
    { id: 5,  cityId: 3, name: 'Баумана',       companyId: 2, houses: 70  },
    { id: 6,  cityId: 4, name: 'Красный просп.',companyId: 4, houses: 90  }
  ]
};