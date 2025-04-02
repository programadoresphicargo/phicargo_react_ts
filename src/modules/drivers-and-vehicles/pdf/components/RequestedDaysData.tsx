import { StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs, { Dayjs } from 'dayjs';

import { SectionTitle } from './SectionTitle';
import { useMemo } from 'react';

const styles = StyleSheet.create({
  container: {
    borderBottom: '2 solid black',
  },
});

const rows = Array(5).fill(null);

interface Props {
  startDate: Dayjs;
  endDate: Dayjs;
  pendingDays: number;
}

export const RequestedDaysData = ({ startDate, endDate, pendingDays }: Props) => {
  const totalDays = useMemo(() => {
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    let count = 0;

    while (current.isBefore(end) || current.isSame(end, 'day')) {
      if (current.day() !== 0) {
        count++;
      }
      current = current.add(1, 'day');
    }

    return count;
  }, [startDate, endDate]);

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
                {index === 0 ? startDate.format('DD/MM/YYYY') : ''}
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
                {index === 0 ? endDate.format('DD/MM/YYYY') : ''}
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
            <Text style={{ fontSize: 10 }}>{pendingDays}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

