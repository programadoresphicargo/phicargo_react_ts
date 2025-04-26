import type { Complaint } from '../models';

interface Props {
  complaint: Complaint;
}

export const ComplaintInfo = ({ complaint }: Props) => {
  return (
    <section>
      <p>
        <strong>No Conformidad:</strong> {complaint.complaintDescription}
      </p>
      <p>
        <strong>Sugerencia:</strong> {complaint.complaintSuggestion}
      </p>
      <p>
        <strong>Fecha de Queja:</strong>{' '}
        {complaint.complaintDate.format('DD/MM/YYYY')}
      </p>
    </section>
  );
};

