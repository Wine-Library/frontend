export type FilterValue =
  | 'Popular'
  | 'Price: Low to High'
  | 'Price: High to Low';

  export const filterValues = [
    'Popular',
    'Price: Low to High',
    'Price: High to Low',
] as const;
  
  export const filterMainWineTypes = [
    'All',
    'Red wines',
    'White wines',
    'Sparkling',
    'Dessert/fortified',
    'Rosé',
  ] as const;

export type FilterMainWineTypes =
  | 'Red wines'
  | 'White wines'
  | 'Sparkling'
  | 'Dessert/fortified'
  | 'Rosé';

export type FilterWineRed =
  | 'Cabernet Sauvignon'
  | 'Merlot'
  | 'Pinot Noir'
  | 'Syrah/Shiraz'
  | 'Malbec'
  | 'Sangiovese'
  | 'Zinfandel';

export type FilterWineWhite =
  | 'Cabernet Sauvignon'
  | 'Merlot'
  | 'Pinot Noir'
  | 'Syrah/Shiraz'
  | 'Malbec'
  | 'Sangiovese'
  | 'Zinfandel';

export type FilterWineSparkling =
  | 'Cabernet Sauvignon'
  | 'Merlot'
  | 'Pinot Noir'
  | 'Syrah/Shiraz'
  | 'Malbec'
  | 'Sangiovese'
  | 'Zinfandel';

export type FilterWineRose =
  'Rosé';

export type FilterWineDessert =
  | 'Cabernet Sauvignon'
  | 'Merlot'
  | 'Pinot Noir'
  | 'Syrah/Shiraz'
  | 'Malbec'
  | 'Sangiovese'
  | 'Zinfandel';
