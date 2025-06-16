import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { SectionTitle } from './SectionTitle';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: '40px',
    marginTop: '35px',
  },
  signatureName: {
    fontSize: 9,
    textAlign: 'center',
  },
  signatureTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textAlign: 'center',
  },
  signatureLine: {
    borderBottom: '1px solid black',
    width: '100%',
    marginBottom: '5px',
  },
  signatureContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

const signatures: { title: string, name?: string }[] = [
  { title: 'Requisitor'},
  { title: 'Jefe Directo', name: 'Miriam del Carmen González Quevedo' },
  { title: 'Gerente de Operaciones', name: 'Rivera Reyes, Josefina' },
  { title: 'Analista de Nominas,', name: 'Flores Morales Esthela' },
];

interface Props {
  requisitionerName: string;
}

export const SignatureSection = (props: Props) => {
  return (
    <View>
      <SectionTitle title="IV. FIRMAS DE CONFIRMACIÓN Y AUTORIZACIÓN" />

      <View
        style={{
          display: 'flex',
          padding: '20px',
          gap: '30px',
        }}
      >
        <View style={styles.row}>
          {signatures.slice(0, 2).map((sig, index) => (
            <View key={index} style={styles.signatureContainer}>
              <Text style={styles.signatureName}>
                {sig.title === 'Requisitor' ? props.requisitionerName : sig.name}
              </Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureTitle}>{sig.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.row}>
          {signatures.slice(2, 4).map((sig, index) => (
            <View key={index} style={styles.signatureContainer}>
              <Text style={styles.signatureName}>{sig.title}</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureTitle}>{sig.title}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

