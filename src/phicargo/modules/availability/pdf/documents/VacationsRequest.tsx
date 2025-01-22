import { Document, Page, Text, View } from '@react-pdf/renderer';

import { Header } from '../components/Header';
import { RequestedDaysData } from '../components/RequestedDaysData';
import { RequisitionersData } from '../components/RequisitionersData';
import { SeniorityData } from '../components/SeniorityData';
import { SignatureSection } from '../components/SignatureSection';
import dayjs from 'dayjs';

interface Props {
  requisitionerName: string;
  periodStart: string;
  periodEnd: string;
}

export const VacationsRequest = (props: Props) => {
  return (
    <Document>
      <Page
        size={'A4'}
        style={{
          paddingTop: '20px',
          paddingHorizontal: '20px',
        }}
      >
        <Text
          style={{
            textAlign: 'right',
            fontSize: 8,
            marginBottom: 2,
          }}
        >
          {dayjs().format('dddd, D [de] MMMM [de] YYYY')}
        </Text>
        <View
          style={{
            border: '2 solid black',
          }}
        >
          <Header />
          <RequisitionersData requisitionerName={props.requisitionerName} />
          <SeniorityData />
          <RequestedDaysData
            startDate={props.periodStart}
            endDate={props.periodEnd}
          />
          <SignatureSection requisitionerName={props.requisitionerName} />
        </View>
      </Page>
    </Document>
  );
};

