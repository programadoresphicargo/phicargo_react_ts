export const colors = [
  { colorName: 'Teal', color: 'rgba(75, 192, 192, 0.6)' },
  { colorName: 'Dark Green', color: 'rgba(40, 159, 64, 0.6)' },
  { colorName: 'Red', color: 'rgba(255, 99, 132, 0.6)' },
  { colorName: 'Blue', color: 'rgba(54, 162, 235, 0.6)' },
  { colorName: 'Yellow', color: 'rgba(255, 206, 86, 0.6)' },
  { colorName: 'Purple', color: 'rgba(153, 102, 255, 0.6)' },
  { colorName: 'Orange', color: 'rgba(255, 159, 64, 0.6)' },
  { colorName: 'Gray', color: 'rgba(199, 199, 199, 0.6)' },
  { colorName: 'Dark Blue', color: 'rgba(83, 102, 255, 0.6)' },
  { colorName: 'Pink', color: 'rgba(210, 99, 132, 0.6)' },
];

export const getBackgroundColors = (range: number) => {
  return colors.slice(0, range).map((color) => color.color);
}

export const getBorderColors = (range: number) => {
  return colors.slice(0, range).map((color) => color.color.replace('0.6', '1'));
}
