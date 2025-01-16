import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { SectionTitle } from './SectionTitle';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const styles = StyleSheet.create({
  container: {
    borderBottom: '2 solid black',
  },
});

const rows = Array(5).fill(null);

interface Props {
  startDate: string;
  endDate: string;
}

export const RequestedDaysData = ({ startDate, endDate }: Props) => {
  const totalDays = useMemo(
    () => dayjs(endDate).diff(dayjs(startDate), 'days') + 1,
    [startDate, endDate],
  );

  return (
    <View style={styles.container}>
      <SectionTitle title="III. DATOS DE DÍAS SOLICITADOS" />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '10px',
          gap: '20px',
        }}
      >
        <View
          style={{
            flex: 3,
            border: '2px solid black',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              borderBottom: '2px solid black',
            }}
          >
            <Text
              style={{
                flex: 1,
                padding: 5,
                borderRight: '2px solid black',
                fontFamily: 'Helvetica-Bold',
                fontSize: 9,
                textAlign: 'center',
              }}
            >
              De:
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 5,
                borderRight: '2px solid black',
                fontFamily: 'Helvetica-Bold',
                fontSize: 9,
                textAlign: 'center',
              }}
            >
              A:
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 5,
                fontFamily: 'Helvetica-Bold',
                fontSize: 9,
                textAlign: 'center',
              }}
            >
              Días a disfrutar
            </Text>
          </View>

          {rows.map((_, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                borderBottom:
                  index < rows.length - 1 ? '2px solid black' : 'none',
              }}
            >
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderRight: '2px solid black',
                  fontSize: 8,
                  textAlign: 'center',
                }}
              >
                {index === 0 ? dayjs(startDate).format('DD/MM/YYYY') : ''}
              </Text>
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderRight: '2px solid black',
                  fontSize: 8,
                  textAlign: 'center',
                }}
              >
                {index === 0 ? dayjs(endDate).format('DD/MM/YYYY') : ''}
              </Text>
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  fontSize: 8,
                  textAlign: 'center',
                }}
              >
                {index === 0 ? totalDays : ''}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flex: 1,
            border: '2px solid black',
          }}
        >
          <View
            style={{
              borderBottom: '2px solid black',
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: 'Helvetica-Bold',
                fontSize: 9,
                textAlign: 'center',
              }}
            >
              Total de días pendientes por disfrutar
            </Text>
          </View>

          <View
            style={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10 }}>{totalDays}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

