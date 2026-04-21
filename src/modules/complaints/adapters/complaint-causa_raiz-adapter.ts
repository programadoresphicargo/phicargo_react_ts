
import { CausaRaizBaseApi } from '../models/api/causa_raiz-models-api';
import { CausaRaizBase } from '../models/causa_raiz';

export class ComplaintCausaRaizAdapter {
  static toComplaintCausaRaiz(
    item: CausaRaizBaseApi,
  ): CausaRaizBase {
    return {
      complaintId: item.complaint_id,
      descripcion: item.descripcion,
      porques: item.porques
    };
  }
}

