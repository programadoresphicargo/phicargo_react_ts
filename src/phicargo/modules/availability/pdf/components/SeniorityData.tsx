import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { Dayjs } from 'dayjs';
import type { DriverVacationSummary } from '../../models/driver-unavailability';
import { SectionTitle } from './SectionTitle';

const styles = StyleSheet.create({
  container: {
    borderBottom: '2 solid black',
  },
  header: {
    padding: '2px',
    flexDirection: 'row',
    backgroundColor: '#16566c',
    borderBottom: '1 solid black',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 10,
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
    border: '1 solid black',
  },
  text: {
    fontSize: 10,
  },
  marginBottom: {
    marginBottom: '10px',
  },
});

interface Props {
  hireDate: Dayjs;
  vacationSummary: DriverVacationSummary;
}

export const SeniorityData = ({ hireDate, vacationSummary }: Props) => {
  return (
    <View style={styles.container}>
      <SectionTitle title="II. DATOS DE ANTIGÜEDAD" />

      <View
        style={{
          display: 'flex',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginTop: '10px',
            padding: '0 10px',
          }}
        >
          <View
            style={{
              display: 'flex',
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
              width: '30%',
            }}
          >
            <Text style={styles.text}>Periodo de vacaciones: </Text>
          </View>

          <View
            style={{
              flex: 1,
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.text}>De:</Text>
            <View
              style={{
                flex: 1,
                padding: 3,
                marginLeft: '5px',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                border: '2 solid black',
              }}
            >
              <Text style={styles.text}>
                {vacationSummary.periodStart?.format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.text}>A:</Text>
            <View
              style={{
                flex: 1,
                padding: 3,
                marginLeft: '5px',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                border: '2 solid black',
              }}
            >
              <Text style={styles.text}>
                {vacationSummary.periodEnd?.format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: '10px',
            padding: '0 10px',
          }}
        >
          <View
            style={{
              flex: 1,
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.text}>Fecha de antiguedad: </Text>
            <View
              style={{
                flex: 1,
                padding: 3,
                marginLeft: '5px',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                border: '2 solid black',
              }}
            >
              <Text style={styles.text}>{hireDate?.format('DD/MM/YYYY')}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.text}>Años laborados: </Text>
            <View
              style={{
                flex: 1,
                padding: 3,
                marginLeft: '5px',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                border: '2 solid black',
              }}
            >
              <Text style={styles.text}>{vacationSummary.yearsWorked}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                width: '100px',
              }}
            >
              Días de vacaciones correspondientes:{' '}
            </Text>
            <View
              style={{
                flex: 1,
                padding: 3,
                marginLeft: '5px',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                border: '2 solid black',
              }}
            >
              <Text style={styles.text}>{vacationSummary.entitledDays}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '0 10px',
          }}
        >
          <View
            style={{
              flex: 1,
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.text}>Días disfrutados:</Text>
            <View
              style={{
                padding: 3,
                marginLeft: '5px',
                flexDirection: 'row',
                alignItems: 'center',
                width: '50px',
                textAlign: 'center',
                justifyContent: 'center',
                border: '2 solid black',
              }}
            >
              <Text style={styles.text}>{vacationSummary.enjoyedDays}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              padding: 3,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.text}>Días pendientes por disfrutar:</Text>
            <View
              style={{
                padding: 3,
                width: '50px',
                marginLeft: '5px',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                border: '2 solid black',
              }}
            >
              <Text style={styles.text}>{vacationSummary.pendingDays}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

