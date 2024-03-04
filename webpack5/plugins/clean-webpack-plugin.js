const path = require('path');

class CleanWebpackPlugin {
    constructor() { };
    apply(compiler) {
        compiler.hooks.emit.tap('CleanWebpackPlugin', () => {
            // 1.获取输出的目录
            const fs = compiler.outputFileSystem;
            // webpack执行到此时，才得到输出路径
            const path = compiler.outputPath;
            // 2.文件处理使用内置的outputFileSystem
            removeDirectoryRecursive(fs, path);
        });
    }
}

function removeDirectoryRecursive(fs, dirPath) {
    // 首先读取目录内容
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            // 如果是文件，则直接删除
            fs.unlinkSync(filePath);
        } else {
            // 如果是子目录，则递归删除
            removeDirectoryRecursive(fs, filePath);
        }
    }
    // 当子目录及文件都删除后，删除空的父目录
    fs.rmdirSync(dirPath);
}

module.exports = CleanWebpackPlugin;