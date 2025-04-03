import { Text, View } from '@react-pdf/renderer';

interface Props {
  title: string;
}

export const SectionTitle = ({ title }: Props) => {
  return (
    <View
      style={{
        padding: '2px',
        flexDirection: 'row',
        backgroundColor: '#16566c',
        borderBottom: '2 solid black',
      }}
    >
      <Text
        style={{
          marginLeft: 10,
          fontFamily: 'Helvetica-Bold',
          fontSize: 9,
          color: '#fff',
        }}
      >
        {title}
      </Text>
    </View>
  );
};

