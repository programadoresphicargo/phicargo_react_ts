import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { SectionTitle } from './SectionTitle';

const styles = StyleSheet.create({
  container: {
    borderBottom: '2px solid black',
  },
  row: {
    flexDirection: 'row',
    marginTop: '10px',
    padding: '0 10px',
  },
  label: {
    display: 'flex',
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  value: {
    flex: 1,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    border: '2 solid black',
  },
  text: {
    fontSize: 10,
  },
  marginBottom: {
    marginBottom: '10px',
  },
});

interface DataRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const DataRow = ({ label, value, isLast }: DataRowProps) => {
  const rowStyle = isLast
    ? { ...styles.row, ...styles.marginBottom }
    : styles.row;

  return (
    <View style={rowStyle}>
      <View style={styles.label}>
        <Text style={styles.text}>{label}</Text>
      </View>
      <View style={styles.value}>
        <Text style={styles.text}>{value}</Text>
      </View>
    </View>
  );
};

interface Props {
  requisitionerName: string;
}

export const RequisitionersData = (props: Props) => {
  return (
    <View style={styles.container}>
      <SectionTitle title="I. DATOS DEL REQUISITOR" />
      <View>
        <DataRow label="Nombre:" value={props.requisitionerName} />
        <DataRow label="Puesto:" value="Operador" />
        <DataRow label="Departamento:" value="Operadores" isLast />
      </View>
    </View>
  );
};

