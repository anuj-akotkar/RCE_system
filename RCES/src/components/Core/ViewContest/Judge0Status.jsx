import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  checkJudge0Health, 
  getAvailableLanguages, 
  getJudge0Configuration,
  testJudge0Submission 
} from '../../../services/operations/codeAPI';
import toast from 'react-hot-toast';

const Judge0Status = () => {
  const { token } = useSelector((state) => state.auth);
  const [health, setHealth] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [config, setConfig] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const healthData = await checkJudge0Health(token);
      setHealth(healthData.judge0);
      
      if (healthData.judge0?.success) {
        const languagesData = await getAvailableLanguages(token);
        setLanguages(languagesData.languages);
        
        const configData = await getJudge0Configuration(token);
        setConfig(configData.configuration);
      }
    } catch (error) {
      console.error('Error checking Judge0 status:', error);
      toast.error('Failed to check Judge0 status');
    } finally {
      setLoading(false);
    }
  };

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testJudge0Submission(token);
      setTestResult(result.testResult);
      if (result.success) {
        toast.success('Judge0 test submission successful!');
      } else {
        toast.error('Judge0 test submission failed');
      }
    } catch (error) {
      console.error('Error running test:', error);
      toast.error('Failed to run test submission');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Judge0 Service Status</h3>
        <button
          onClick={checkHealth}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Health Status */}
      <div className="bg-gray-700 p-3 rounded">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            health?.success ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-white font-medium">
            Status: {health?.status || 'Unknown'}
          </span>
        </div>
        {health?.version && (
          <p className="text-gray-300 text-sm">Version: {health.version}</p>
        )}
        {health?.languagesCount && (
          <p className="text-gray-300 text-sm">Languages: {health.languagesCount}</p>
        )}
        {health?.error && (
          <p className="text-red-400 text-sm">Error: {health.error}</p>
        )}
      </div>

      {/* Configuration */}
      {config && (
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="text-white font-medium mb-2">Configuration</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Max CPU Time:</span>
              <span className="text-white ml-1">{config.maxCpuTimeLimit}s</span>
            </div>
            <div>
              <span className="text-gray-400">Max Memory:</span>
              <span className="text-white ml-1">{Math.round(config.maxMemoryLimit / 1024)}MB</span>
            </div>
            <div>
              <span className="text-gray-400">Max File Size:</span>
              <span className="text-white ml-1">{config.maxFileSize}KB</span>
            </div>
            <div>
              <span className="text-gray-400">Max Files:</span>
              <span className="text-white ml-1">{config.maxFileCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Supported Languages */}
      {languages && (
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="text-white font-medium mb-2">Supported Languages</h4>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {languages.slice(0, 10).map((lang) => (
              <div key={lang.id} className="text-gray-300">
                {lang.name} ({lang.fileExtension})
              </div>
            ))}
            {languages.length > 10 && (
              <div className="text-gray-400 text-xs">
                +{languages.length - 10} more languages
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Submission */}
      <div className="bg-gray-700 p-3 rounded">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium">Test Submission</h4>
          <button
            onClick={runTest}
            disabled={loading || !health?.success}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Run Test
          </button>
        </div>
        {testResult && (
          <div className="text-sm">
            <div className="text-gray-300">
              Output: <span className="text-green-400">{testResult.stdout}</span>
            </div>
            {testResult.stderr && (
              <div className="text-gray-300">
                Error: <span className="text-red-400">{testResult.stderr}</span>
              </div>
            )}
            <div className="text-gray-400 text-xs mt-1">
              Time: {testResult.time}s | Memory: {Math.round(testResult.memory / 1024)}MB
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Judge0Status;