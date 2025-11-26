import { components } from '@repo/api-client';

export type BillLine = components['schemas']['BillLineResponse'];
export type BillSummary = components['schemas']['BillSummaryResponse'];

export type BillOpenedEvent = components['schemas']['BillOpenedEvent'];
export type BillAddLinesEvent = components['schemas']['BillAddLinesEvent'];
export type BillRemoveLinesEvent = components['schemas']['BillRemoveLinesEvent'];
export type BillClosedEvent = components['schemas']['BillClosedEvent'];
export type BillInitialDataEvent = components['schemas']['BillInitialDataEvent'];

export const BillEventType = {
  INITIAL_DATA: 'INITIAL_DATA',
  OPENED: 'OPENED',
  LINES_ADDED: 'LINES_ADDED',
  LINES_REMOVED: 'LINES_REMOVED',
  CLOSED: 'CLOSED',
} as const;

export type BillWebsocketMessage =
  | { type: typeof BillEventType.INITIAL_DATA; data: BillInitialDataEvent[] }
  | { type: typeof BillEventType.OPENED; data: BillOpenedEvent }
  | { type: typeof BillEventType.LINES_ADDED; data: BillAddLinesEvent }
  | { type: typeof BillEventType.LINES_REMOVED; data: BillRemoveLinesEvent }
  | { type: typeof BillEventType.CLOSED; data: BillClosedEvent };
