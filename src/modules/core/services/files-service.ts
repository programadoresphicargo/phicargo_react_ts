import odooApi from '@/api/odoo-api';
import { FileUploadRequest } from '../models/api';
import { AxiosError } from 'axios';

export class FilesService {
  static async uploadFiles({ files, route, table, id }: FileUploadRequest) {
    const url = `/archivos/guardar/`;
    const formData = new FormData();

    formData.append('ruta', route);
    formData.append('tabla', table);
    formData.append('id', id.toString());

    files.forEach((file) => {
      formData.append('files', file);
    });
    try {
      await odooApi.post(url, formData);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al subir los archivos',
        );
      }
      throw new Error('Error al subir los archivos');
    }
  }

  static async getFilePublicUrl(fileId: string): Promise<string> {
    const url = `/onedrive/generate_link/${fileId}`;
    try {
      const response = await odooApi.get<{ url: string }>(url);
      return response.data.url;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener la URL del archivo',
        );
      }
      throw new Error('Error al obtener la URL del archivo');
    }
  }

  static async uploadFile(
    files: File[], path?: string
  ): Promise<string[]> {
    const url = `/archivos/upload/`;
    const formData = new FormData();

    formData.append('path', path || '/');
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    try {
      const response = await odooApi.post<string[]>(url, formData);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al subir los archivos',
        );
      }
      throw new Error('Error al subir los archivos');
    }
  }
}

export async function uploadFiles(
  files: File[],
  route: string,
  table: string,
  id: number,
) {
  try {
    await FilesService.uploadFiles({
      files,
      route: route,
      table: table,
      id: id,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
  }
}

