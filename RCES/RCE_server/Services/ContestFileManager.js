const fs = require('fs').promises;
const path = require('path');

class ContestFileManager {
    static async createContestFolder(contestName) {
        const contestPath = path.join(__dirname, '../../Contests', contestName);
        await fs.mkdir(contestPath, { recursive: true });
        return contestPath;
    }

    static async createProblemFolder(contestName, problemName) {
        const problemPath = path.join(__dirname, '../../Contests', contestName, problemName);
        await fs.mkdir(problemPath, { recursive: true });
        // Create subfolders
        await fs.mkdir(path.join(problemPath, 'boilerplate'), { recursive: true });
        await fs.mkdir(path.join(problemPath, 'boilerplate-full'), { recursive: true });
        await fs.mkdir(path.join(problemPath, 'testcases', 'inputs'), { recursive: true });
        await fs.mkdir(path.join(problemPath, 'testcases', 'outputs'), { recursive: true });
        return problemPath;
    }

    static async saveFile(filePath, content) {
        await fs.writeFile(filePath, content, 'utf8');
    }

    static async saveTestcases(problemPath, testCases) {
        for (let i = 0; i < testCases.length; i++) {
            const inputPath = path.join(problemPath, 'testcases', 'inputs', `input${i + 1}.txt`);
            const outputPath = path.join(problemPath, 'testcases', 'outputs', `output${i + 1}.txt`);
            await this.saveFile(inputPath, testCases[i].input);
            await this.saveFile(outputPath, testCases[i].output);
        }
    }
}

module.exports = ContestFileManager;