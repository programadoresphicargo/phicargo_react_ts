import { utils, writeFile } from 'xlsx';

import dayjs from 'dayjs';

export interface ExportConfig<T> {
  fileName?: string;
  withDate?: boolean;
  customDate?: string;
  sheetName?: string;
  columns: ExportColConfig<T>[];
}

export interface ExportColConfig<T> {
  accessorFn: (data: T) => unknown;
  header: string;
  columnWidth?: number;
}

export class ExportToExcel<TData> {
  constructor(public config: ExportConfig<TData>) {}

  private getFileName() {
    let fileName = '';
    if (this.config.fileName && this.config.customDate) {
      fileName = `${this.config.fileName} ${this.config.customDate}.xlsx`;
    } else if (this.config.fileName && this.config.withDate) {
      fileName = `${this.config.fileName} ${dayjs().format('DD-MM-YYYY')}.xlsx`;
    } else if (this.config.fileName) {
      fileName = `${this.config.fileName}.xlsx`;
    } else {
      fileName = `Export ${dayjs().format('DD-MM-YYYY')}.xlsx`;
    }

    return fileName;
  }

  public exportData(data: TData[]) {
    if (!data) {
      throw new Error('Data is required');
    }

    const fileName = this.getFileName();

    const sheetName = this.config.sheetName || 'Sheet1';

    const headers = this.config.columns.map((col) => col.header);
    const rows = data.map((row) =>
      this.config.columns.map((col) => col.accessorFn(row) ?? ''),
    );

    const worksheet = utils.aoa_to_sheet([headers, ...rows]);

    const workbook = utils.book_new();

    const columnWidths = this.config.columns.map((col) => ({
      wpx: col.columnWidth || 200,
    }));

    worksheet['!cols'] = columnWidths;

    utils.book_append_sheet(workbook, worksheet, sheetName);

    writeFile(workbook, fileName, { compression: true });
  }
}

