import { useState, useMemo, useCallback } from 'react';
export interface UploaderState<DataType = any> {
  isUploading: boolean;
  isError: boolean;
  isSuccess: boolean;
  progress: number;
  data: DataType | null
}

type UploadMethodType<DataType = any> = (method: string, url: string, data: FormData, config?: {
  headers?: Record<string, string>
}) => Promise<DataType>;

export function useUploader<U = any>(): [UploadMethodType<U>, UploaderState<U>, () => void] {

  const xhr = useMemo(() => new XMLHttpRequest(), []);

  const initialState: UploaderState<U> = useMemo(() => {
    return {
      data: null,
      isUploading: false,
      isError: false,
      isSuccess: false,
      progress: 0,
    };
  }, []);

  const [uploaderState, setUploaderState] = useState<UploaderState<U>>(initialState);

  const upload: UploadMethodType<U> = useCallback(async (method, url, data, config) => {

    console.log('here')
    return new Promise<U>((resolve, reject) => {
      // listen for `upload.load` event
      xhr.upload.onload = () => {
        console.log(xhr)
        console.log(`The upload is completed: ${xhr.status} ${xhr.response}`);
        setUploaderState(prev => ({ ...prev, isUploading: false, isSuccess: true, data: xhr.response, progress: 100 }));
        resolve(xhr.response);
      };

      // listen for `upload.error` event
      xhr.upload.onerror = () => {
        console.error('Upload failed.');
        setUploaderState(prev => ({ ...prev, isUploading: false, isError: true, progress: 0 }));
        reject(xhr.response);
      }

      // listen for `upload.abort` event
      xhr.upload.onabort = () => {
        setUploaderState(prev => ({ ...prev, isUploading: false, progress: 0 }));
        console.error('Upload cancelled.');
      }

      // listen for `progress` event
      xhr.upload.onprogress = (event) => {
        setUploaderState(prev => ({ ...prev, isUploading: true, progress: Math.round((event.loaded * 100) / event.total) }));
      }

      xhr.open(method, url, true);
      if (config && config.headers) {
        for (const key in config.headers) {
          if (Object.prototype.hasOwnProperty.call(config.headers, key)) {
            xhr.setRequestHeader(key, config.headers[key])
          }
        }
      }
      xhr.send(data);
    })

  }, [])

  const cancel = () => {
    xhr.abort();
  }

  return [upload, uploaderState, cancel];
}

