import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';

import phicargoLogo from '../../../../../assets/img/phicargo-vertical.png';

const styles = StyleSheet.create({
  container: {
    borderBottom: '2 solid black',
  },
});

export const Header = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          maxHeight: '40px',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            marginLeft: '8px',
            width: '70px',
          }}
        >
          <Image
            src={phicargoLogo}
            style={{
              height: 'auto',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            padding: 3,
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Helvetica-Bold',
            }}
          >
            SOLICITUD DE VACACIONES
          </Text>
        </View>
        <View
          style={{
            padding: 3,
            textAlign: 'center',
            justifyContent: 'center',
            width: '70px',
          }}
        >
          <Text
            style={{
              fontSize: 6,
            }}
          >
            Código: TB-FO-TH-25 Elaborado: 02/10/2023 Versión: 1
          </Text>
        </View>
      </View>
    </View>
  );
};

