import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useUploader } from './../src';

const App = () => {

  const [upload, { data, isUploading, progress }, cancel] = useUploader();

  console.log(progress, data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append('file-to-upload', e.target.files?.item(0) as File)

    upload('post', 'http://localhost:8080', formData)
  }

  return (
    <div>
      <input
        type="file"
        onChange={(event) => handleChange(event)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
