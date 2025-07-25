const fs = require('fs-extra');
const path = require('path');

async function build() {
    try {
        console.log('🔨 Building boilerplate-generator...');
        
        const srcDir = path.join(__dirname, 'src');
        const distDir = path.join(__dirname, 'dist');
        
        // Clean and create dist directory
        await fs.remove(distDir);
        await fs.ensureDir(distDir);
        
        // Copy all JS files from src to dist
        await copyJSFiles(srcDir, distDir);
        
        console.log('✅ Build completed!');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

async function copyJSFiles(srcDir, destDir) {
    const items = await fs.readdir(srcDir);
    
    for (const item of items) {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);
        const stat = await fs.stat(srcPath);
        
        if (stat.isDirectory()) {
            await fs.ensureDir(destPath);
            await copyJSFiles(srcPath, destPath);
        } else if (item.endsWith('.js')) {
            await fs.copy(srcPath, destPath);
            console.log(`📄 Copied: ${item}`);
        }
    }
}

build();