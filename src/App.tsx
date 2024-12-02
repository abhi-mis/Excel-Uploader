import { FileUpload } from './components/FileUpload';
import { Database } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Candidate Database Upload
            </h1>
          </div>
          <p className="text-gray-600">
            Upload your Excel file containing candidate information
          </p>
        </div>
        
        <div className="flex justify-center">
          <FileUpload />
        </div>
      </div>
    </div>
  );
}

export default App;