import { Document, Page, Text, View } from '@react-pdf/renderer';
import { Driver, DriverUnavailable, DriverVacationSummary } from '@/modules/drivers/models';

import { Header } from '../components/Header';
import { RequestedDaysData } from '../components/RequestedDaysData';
import { RequisitionersData } from '../components/RequisitionersData';
import { SeniorityData } from '../components/SeniorityData';
import { SignatureSection } from '../components/SignatureSection';
import dayjs from 'dayjs';

interface Props {
  driver: Driver;
  unavailability: DriverUnavailable;
  vacationSummary: DriverVacationSummary;
}

export const VacationsRequest = ({
  driver,
  unavailability,
  vacationSummary,
}: Props) => {
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
          <RequisitionersData requisitionerName={driver.name} />
          <SeniorityData
            hireDate={driver.hireDate!}
            vacationSummary={vacationSummary}
          />
          <RequestedDaysData
            startDate={unavailability.startDate}
            endDate={unavailability.endDate}
            pendingDays={vacationSummary.pendingDays}
          />
          <SignatureSection requisitionerName={driver.name} />
        </View>
      </Page>
    </Document>
  );
};

