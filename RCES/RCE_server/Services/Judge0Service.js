const axios = require('axios');

class Judge0Service {
    constructor() {
        this.baseURL = process.env.JUDGE0_URL || 'http://localhost:2358';
        this.apiKey = process.env.JUDGE0_API_KEY || null;
        this.timeout = 10000; // 10 seconds for health checks
    }

    async makeRequest(method, endpoint, data = null) {
        const config = {
            method,
            url: `${this.baseURL}${endpoint}`,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.apiKey) {
            config.headers['X-RapidAPI-Key'] = this.apiKey;
        }

        if (data) {
            config.data = data;
        }

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`Judge0 Service Error (${method} ${endpoint}):`, error.message);
            throw error;
        }
    }

    // Check if Judge0 service is healthy
    async checkHealth() {
        try {
            const about = await this.makeRequest('GET', '/about');
            const languages = await this.makeRequest('GET', '/languages');
            
            return {
                success: true,
                status: 'healthy',
                version: about.version,
                languagesCount: languages.length,
                supportedLanguages: languages.map(lang => ({
                    id: lang.id,
                    name: lang.name,
                    fileExtension: lang.file_extension
                }))
            };
        } catch (error) {
            return {
                success: false,
                status: 'unhealthy',
                error: error.message
            };
        }
    }

    // Get available languages from Judge0
    async getAvailableLanguages() {
        try {
            const languages = await this.makeRequest('GET', '/languages');
            return {
                success: true,
                languages: languages.map(lang => ({
                    id: lang.id,
                    name: lang.name,
                    fileExtension: lang.file_extension
                }))
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Validate if a language ID is supported
    async validateLanguageId(languageId) {
        try {
            const languages = await this.makeRequest('GET', '/languages');
            const language = languages.find(lang => lang.id === languageId);
            
            return {
                success: true,
                isValid: !!language,
                language: language ? {
                    id: language.id,
                    name: language.name,
                    fileExtension: language.file_extension
                } : null
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get Judge0 configuration
    async getConfiguration() {
        try {
            const about = await this.makeRequest('GET', '/about');
            const languages = await this.makeRequest('GET', '/languages');
            
            return {
                success: true,
                configuration: {
                    version: about.version,
                    maxCpuTimeLimit: about.config?.max_cpu_time_limit || 15,
                    maxMemoryLimit: about.config?.max_memory_limit || 512000,
                    maxFileSize: about.config?.max_file_size || 1024,
                    maxFileCount: about.config?.max_file_count || 64,
                    languagesCount: languages.length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Test a simple submission to verify Judge0 is working
    async testSubmission() {
        try {
            const testCode = 'print("Hello, Judge0!")';
            const testSubmission = await this.makeRequest('POST', '/submissions/?base64_encoded=false&wait=true', {
                language_id: 71, // Python
                source_code: testCode,
                stdin: '',
                cpu_time_limit: 1,
                memory_limit: 128000
            });

            return {
                success: true,
                testResult: {
                    stdout: testSubmission.stdout,
                    stderr: testSubmission.stderr,
                    status: testSubmission.status,
                    time: testSubmission.time,
                    memory: testSubmission.memory
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new Judge0Service();