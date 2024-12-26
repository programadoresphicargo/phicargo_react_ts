import { Queue, QueueCreate } from '../models';
import { QueueApi, QueueCreateApi } from '../models/api/shift-queue-model-api';

import dayjs from 'dayjs';
import { shiftSimpleToLocal } from './shift-adapter';
import { userBasicToLocal } from '../../auth/adapters';

/**
 * Mapper to convert the data of a queue from the API to the local model
 * @param queue Object with the data of the queue
 * @returns Object with the data of the queue
 */
export const shiftQueueToLocal = (queue: QueueApi): Queue => ({
  id: queue.id,
  enqueueDate: dayjs(queue.enqueue_date),
  releaseDate: dayjs(queue.release_date),
  comments: queue.comments,
  status: queue.status,
  shift: shiftSimpleToLocal(queue.shift),
  user: userBasicToLocal(queue.user),
});

/**
 * Mapper to convert the data of a queue from the local model to the API
 * @param queue Object with the data of the queue
 * @returns Object with the data of the queue
 */
export const shiftQueueCreateToApi = (queue: QueueCreate): QueueCreateApi => ({
  enqueue_date: queue.enqueueDate.format('YYYY-MM-DD HH:mm:ss'),
  release_date: queue.releaseDate.format('YYYY-MM-DD HH:mm:ss'),
  comments: queue.comments,
});

