// boilerplate-generator/src/index.js
const fs = require('fs').promises;
const path = require('path');
const FullProblemDefinitionGenerator = require('./FullProblemDefinitionGenerator');
const ProblemDefinitionGenerator = require('./ProblemDefinitionGenerator');

class BoilerplateGeneratorService {
    constructor() {
        this.supportedLanguages = ['cpp', 'java', 'python'];
        this.templatesPath = path.join(__dirname, '../templates');
    }

    async generateBoilerplateForProblem(contestName, problemName, structureFile, testCases) {
        try {
            console.log(`Generating boilerplate for problem: ${problemName} in contest: ${contestName}`);
            
            // Create contest directory structure
            const contestPath = await this.createContestStructure(contestName, problemName);
            
            // Parse structure.md file
            const problemStructure = await this.parseStructureFile(structureFile);
            
            // Generate boilerplate files
            await this.generateBoilerplateFiles(contestPath, problemStructure);
            
            // Generate full problem files (with main function)
            await this.generateFullProblemFiles(contestPath, problemStructure);
            
            // Create test case files
            await this.createTestCaseFiles(contestPath, testCases);
            
            console.log(`Boilerplate generation completed for ${problemName}`);
            return {
                success: true,
                message: `Boilerplate generated successfully for ${problemName}`,
                contestPath
            };
            
        } catch (error) {
            console.error('Error generating boilerplate:', error);
            throw error;
        }
    }

    async createContestStructure(contestName, problemName) {
        const basePath = path.join(process.cwd(), '..', 'Contests', contestName);
// This will resolve to /RCE_system/RCES/RCE_server/Contests/<contestName>
        const problemPath = path.join(basePath, 'problems', problemName);
        
        // Create all necessary directories
        const directories = [
            basePath,
            path.join(basePath, 'boilerplate-generator'),
            path.join(basePath, 'leaderboard-generator'),
            path.join(basePath, 'problems'),
            problemPath,
            path.join(problemPath, 'boilerplate'),
            path.join(problemPath, 'boilerplate-full'),
            path.join(problemPath, 'testcases'),
            path.join(problemPath, 'testcases', 'inputs'),
            path.join(problemPath, 'testcases', 'outputs')
        ];

        for (const dir of directories) {
            await fs.mkdir(dir, { recursive: true });
        }

        return problemPath;
    }

    async parseStructureFile(structureContent) {
        const lines = structureContent.split('\n');
        const structure = {
            problemName: '',
            functionName: '',
            inputFields: [],
            outputFields: [],
            inputTypes: {},
            outputTypes: {}
        };

        let currentSection = '';
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('Problem Name:')) {
                structure.problemName = trimmedLine.split(':')[1].trim().replace(/"/g, '');
            } else if (trimmedLine.startsWith('Function Name:')) {
                structure.functionName = trimmedLine.split(':')[1].trim();
            } else if (trimmedLine === 'Input Structure:') {
                currentSection = 'input';
            } else if (trimmedLine === 'Output Structure:') {
                currentSection = 'output';
            } else if (trimmedLine.startsWith('Input Field:')) {
                const fieldInfo = this.parseFieldInfo(trimmedLine.split(':')[1].trim());
                structure.inputFields.push(fieldInfo.name);
                structure.inputTypes[fieldInfo.name] = fieldInfo.type;
            } else if (trimmedLine.startsWith('Output Field:')) {
                const fieldInfo = this.parseFieldInfo(trimmedLine.split(':')[1].trim());
                structure.outputFields.push(fieldInfo.name);
                structure.outputTypes[fieldInfo.name] = fieldInfo.type;
            }
        }

        return structure;
    }

    parseFieldInfo(fieldString) {
        // Parse "list<int> arr" or "int result"
        const parts = fieldString.trim().split(/\s+/);
        const type = parts[0];
        const name = parts[1];
        
        return { type, name };
    }

    async generateBoilerplateFiles(problemPath, structure) {
        const boilerplatePath = path.join(problemPath, 'boilerplate');
        
        for (const lang of this.supportedLanguages) {
            const generator = new ProblemDefinitionGenerator();
            const code = generator.generateBoilerplate(structure, lang);
            
            const fileName = `function.${this.getFileExtension(lang)}`;
            await fs.writeFile(path.join(boilerplatePath, fileName), code);
        }
    }

    async generateFullProblemFiles(problemPath, structure) {
        const fullPath = path.join(problemPath, 'boilerplate-full');
        
        for (const lang of this.supportedLanguages) {
            const generator = new FullProblemDefinitionGenerator();
            const code = generator.generateFullProblem(structure, lang);
            
            const fileName = `function.${this.getFileExtension(lang)}`;
            await fs.writeFile(path.join(fullPath, fileName), code);
        }
    }

    async createTestCaseFiles(problemPath, testCases) {
        const inputsPath = path.join(problemPath, 'testcases', 'inputs');
        const outputsPath = path.join(problemPath, 'testcases', 'outputs');

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            
            // Write input file
            await fs.writeFile(
                path.join(inputsPath, `input${i + 1}.txt`),
                testCase.input
            );
            
            // Write output file
            await fs.writeFile(
                path.join(outputsPath, `output${i + 1}.txt`),
                testCase.output
            );
        }
    }

    getFileExtension(language) {
        const extensions = {
            'cpp': 'cpp',
            'java': 'java',
            'python': 'py'
        };
        return extensions[language] || 'txt';
    }
}

module.exports = BoilerplateGeneratorService;

// Example usage and main function
if (require.main === module) {
    const service = new BoilerplateGeneratorService();
    
    // Example structure file content
    const exampleStructure = `Problem Name: "Max Element"
Function Name: getmax
Input Structure:
Input Field: vector<int> arr
Output Structure:
Output Field: int result`;

    // Example test cases
    const exampleTestCases = [
        {
            input: "4\n1 3 2 4",
            output: "4"
        },
        {
            input: "3\n5 1 3",
            output: "5"
        }
    ];

    // Generate boilerplate
    service.generateBoilerplateForProblem(
        'contest_1',
        'max-element',
        exampleStructure,
        exampleTestCases
    ).then(result => {
        console.log('Generation result:', result);
    }).catch(error => {
        console.error('Generation failed:', error);
    });
}