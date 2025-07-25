class FullProblemDefinitionGenerator {
    constructor() {
        this.languageGenerators = {
            cpp: this.generateCppFull.bind(this),
            java: this.generateJavaFull.bind(this),
            python: this.generatePythonFull.bind(this)
        };
    }

    generateFullProblem(structure, language) {
        const generator = this.languageGenerators[language];
        if (!generator) {
            throw new Error(`Unsupported language: ${language}`);
        }
        return generator(structure);
    }

    generateCppFull(structure) {
        const { functionName, inputFields, inputTypes, outputFields, outputTypes } = structure;
        
        // Generate includes based on types used
        const includes = this.generateCppIncludes(inputTypes, outputTypes);
        
        // Generate input reading code
        const inputCode = this.generateCppInputCode(inputFields, inputTypes);
        
        // Generate function signature
        const cppParams = inputFields.map(field => {
            const cppType = this.convertToCppType(inputTypes[field]);
            return `${cppType} ${field}`;
        }).join(', ');

        const returnType = this.convertToCppType(outputTypes[outputFields[0]]);

        return `${includes}

// USER CODE HERE
${returnType} ${functionName}(${cppParams}) {
    // Implementation goes here
    return ${this.getDefaultValue(returnType)};
}

int main() {
${inputCode}
    
    ${returnType} result = ${functionName}(${inputFields.join(', ')});
    
    cout << result << endl;
    
    return 0;
}`;
    }

    generateJavaFull(structure) {
        const { functionName, inputFields, inputTypes, outputFields, outputTypes } = structure;
        
        const javaParams = inputFields.map(field => {
            const javaType = this.convertToJavaType(inputTypes[field]);
            return `${javaType} ${field}`;
        }).join(', ');

        const returnType = this.convertToJavaType(outputTypes[outputFields[0]]);
        
        // Generate input reading code
        const inputCode = this.generateJavaInputCode(inputFields, inputTypes);

        return `import java.util.*;
import java.io.*;

public class Solution {
    // USER CODE HERE
    public static ${returnType} ${functionName}(${javaParams}) {
        // Implementation goes here
        return ${this.getJavaDefaultValue(returnType)};
    }
    
    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        
${inputCode}
        
        ${returnType} result = ${functionName}(${inputFields.join(', ')});
        
        System.out.println(result);
        
        scanner.close();
    }
}`;
    }

    generatePythonFull(structure) {
        const { functionName, inputFields, inputTypes } = structure;
        
        // Generate input reading code
        const inputCode = this.generatePythonInputCode(inputFields, inputTypes);

        return `# USER CODE HERE
def ${functionName}(${inputFields.join(', ')}):
    # Implementation goes here
    pass

if __name__ == "__main__":
${inputCode}
    
    result = ${functionName}(${inputFields.join(', ')})
    
    print(result)`;
    }

    generateCppIncludes(inputTypes, outputTypes) {
        const allTypes = { ...inputTypes, ...outputTypes };
        const includes = new Set(['#include <iostream>']);
        
        for (const type of Object.values(allTypes)) {
            if (type.includes('vector')) {
                includes.add('#include <vector>');
            }
            if (type.includes('string')) {
                includes.add('#include <string>');
            }
        }
        
        includes.add('using namespace std;');
        
        return Array.from(includes).join('\n');
    }

    generateCppInputCode(inputFields, inputTypes) {
        let code = '';
        
        for (const field of inputFields) {
            const type = inputTypes[field];
            const cppType = this.convertToCppType(type);
            
            if (type.includes('vector') || type.includes('list')) {
                code += `    int size_${field};\n`;
                code += `    cin >> size_${field};\n`;
                code += `    ${cppType} ${field}(size_${field});\n`;
                code += `    for(int i = 0; i < size_${field}; ++i) {\n`;
                code += `        cin >> ${field}[i];\n`;
                code += `    }\n`;
            } else {
                code += `    ${cppType} ${field};\n`;
                code += `    cin >> ${field};\n`;
            }
        }
        
        return code;
    }

    generateJavaInputCode(inputFields, inputTypes) {
        let code = '';
        
        for (const field of inputFields) {
            const type = inputTypes[field];
            const javaType = this.convertToJavaType(type);
            
            if (type.includes('vector') || type.includes('list')) {
                code += `        int size_${field} = scanner.nextInt();\n`;
                code += `        ${javaType} ${field} = new int[size_${field}];\n`;
                code += `        for(int i = 0; i < size_${field}; i++) {\n`;
                code += `            ${field}[i] = scanner.nextInt();\n`;
                code += `        }\n`;
            } else if (javaType === 'int') {
                code += `        ${javaType} ${field} = scanner.nextInt();\n`;
            } else if (javaType === 'String') {
                code += `        ${javaType} ${field} = scanner.next();\n`;
            } else {
                code += `        ${javaType} ${field} = scanner.next${javaType}();\n`;
            }
        }
        
        return code;
    }

    generatePythonInputCode(inputFields, inputTypes) {
        let code = '';
        
        for (const field of inputFields) {
            const type = inputTypes[field];
            
            if (type.includes('vector') || type.includes('list')) {
                code += `    size_${field} = int(input())\n`;
                code += `    ${field} = list(map(int, input().split()))\n`;
            } else if (type === 'int') {
                code += `    ${field} = int(input())\n`;
            } else if (type === 'string') {
                code += `    ${field} = input().strip()\n`;
            } else {
                code += `    ${field} = input().strip()\n`;
            }
        }
        
        return code;
    }

    // Reuse methods from ProblemDefinitionGenerator
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

module.exports = FullProblemDefinitionGenerator; 