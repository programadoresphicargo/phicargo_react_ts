type ColorKey =
  | 'Teal'
  | 'Dark Green'
  | 'Red'
  | 'Blue'
  | 'Yellow'
  | 'Purple'
  | 'Orange'
  | 'Gray'
  | 'Dark Blue'
  | 'Pink';

type Color = {
  colorName: ColorKey;
  color: string;
  border: string;
}

export const colors: Color[]  = [
  {
    colorName: 'Teal',
    color: 'rgba(75, 192, 192, 0.6)',
    border: 'rgba(75, 192, 192, 1)',
  },
  {
    colorName: 'Dark Green',
    color: 'rgba(40, 159, 64, 0.6)',
    border: 'rgba(40, 159, 64, 1)',
  },
  {
    colorName: 'Red',
    color: 'rgba(255, 99, 132, 0.6)',
    border: 'rgba(255, 99, 132, 1)',
  },
  {
    colorName: 'Blue',
    color: 'rgba(54, 162, 235, 0.6)',
    border: 'rgba(54, 162, 235, 1)',
  },
  {
    colorName: 'Yellow',
    color: 'rgba(255, 206, 86, 0.6)',
    border: 'rgba(255, 206, 86, 1)',
  },
  {
    colorName: 'Purple',
    color: 'rgba(153, 102, 255, 0.6)',
    border: 'rgba(153, 102, 255, 1)',
  },
  {
    colorName: 'Orange',
    color: 'rgba(255, 159, 64, 0.6)',
    border: 'rgba(255, 159, 64, 1)',
  },
  {
    colorName: 'Gray',
    color: 'rgba(199, 199, 199, 0.6)',
    border: 'rgba(199, 199, 199, 1)',
  },
  {
    colorName: 'Dark Blue',
    color: 'rgba(83, 102, 255, 0.6)',
    border: 'rgba(83, 102, 255, 1)',
  },
  {
    colorName: 'Pink',
    color: 'rgba(210, 99, 132, 0.6)',
    border: 'rgba(210, 99, 132, 1)',
  },
];

export const getBackgroundColors = (range: number) => {
  return colors.slice(0, range).map((color) => color.color);
};

export const getBorderColors = (range: number) => {
  return colors.slice(0, range).map((color) => color.color.replace('0.6', '1'));
};

