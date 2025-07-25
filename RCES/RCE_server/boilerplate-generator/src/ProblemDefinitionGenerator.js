class ProblemDefinitionGenerator {
    constructor() {
        this.languageTemplates = {
            cpp: this.generateCppBoilerplate.bind(this),
            java: this.generateJavaBoilerplate.bind(this),
            python: this.generatePythonBoilerplate.bind(this)
        };
    }

    generateBoilerplate(structure, language) {
        const generator = this.languageTemplates[language];
        if (!generator) {
            throw new Error(`Unsupported language: ${language}`);
        }
        return generator(structure);
    }

    generateCppBoilerplate(structure) {
        const { functionName, inputFields, inputTypes, outputFields, outputTypes } = structure;
        
        // Convert types to C++ types
        const cppParams = inputFields.map(field => {
            const cppType = this.convertToCppType(inputTypes[field]);
            return `${cppType} ${field}`;
        }).join(', ');

        const returnType = this.convertToCppType(outputTypes[outputFields[0]]);

        return `${returnType} ${functionName}(${cppParams}) {
    // Implementation goes here
    return ${this.getDefaultValue(returnType)};
}`;
    }

    generateJavaBoilerplate(structure) {
        const { functionName, inputFields, inputTypes, outputFields, outputTypes } = structure;
        
        const javaParams = inputFields.map(field => {
            const javaType = this.convertToJavaType(inputTypes[field]);
            return `${javaType} ${field}`;
        }).join(', ');

        const returnType = this.convertToJavaType(outputTypes[outputFields[0]]);

        return `public static ${returnType} ${functionName}(${javaParams}) {
    // Implementation goes here
    return ${this.getJavaDefaultValue(returnType)};
}`;
    }

    generatePythonBoilerplate(structure) {
        const { functionName, inputFields } = structure;
        
        const pythonParams = inputFields.join(', ');

        return `def ${functionName}(${pythonParams}):
    # Implementation goes here
    pass`;
    }

    convertToCppType(type) {
        const typeMap = {
            'int': 'int',
            'string': 'string',
            'float': 'float',
            'double': 'double',
            'bool': 'bool',
            'vector<int>': 'vector<int>',
            'list<int>': 'vector<int>',
            'vector<string>': 'vector<string>',
            'list<string>': 'vector<string>'
        };
        return typeMap[type] || 'int';
    }

    convertToJavaType(type) {
        const typeMap = {
            'int': 'int',
            'string': 'String',
            'float': 'float',
            'double': 'double',
            'bool': 'boolean',
            'vector<int>': 'int[]',
            'list<int>': 'int[]',
            'vector<string>': 'String[]',
            'list<string>': 'String[]'
        };
        return typeMap[type] || 'int';
    }

    getDefaultValue(cppType) {
        const defaults = {
            'int': '0',
            'string': '""',
            'float': '0.0f',
            'double': '0.0',
            'bool': 'false',
            'vector<int>': '{}',
            'vector<string>': '{}'
        };
        return defaults[cppType] || '0';
    }

    getJavaDefaultValue(javaType) {
        const defaults = {
            'int': '0',
            'String': '""',
            'float': '0.0f',
            'double': '0.0',
            'boolean': 'false',
            'int[]': 'new int[0]',
            'String[]': 'new String[0]'
        };
        return defaults[javaType] || '0';
    }
}

module.exports = ProblemDefinitionGenerator;