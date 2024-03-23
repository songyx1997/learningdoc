// 使用策略模式处理文件
function processFile(fileType, content) {
    const handler = getFileHandler(fileType);
    handler.handleFile(content);
}

// 工厂方法或其他方式根据文件类型获取对应的处理策略
function getFileHandler(fileType) {
    switch (fileType) {
        case 'txt':
            return new TxtFileHandler();
        case 'excel':
            return new ExcelFileHandler();
        case 'pdf':
            return new PdfFileHandler();
        default:
            throw new Error('Unsupported file type');
    }
}

// 定义文件处理策略接口
class FileHandler {
    constructor(fileType) {
        this.fileType = fileType;
    }
    handleFile(content) {
        throw new Error('handleFile method should be overridden');
    }
}

// 创建具体的文件处理策略
class TxtFileHandler extends FileHandler {
    constructor() {
        super('txt');
    }
    handleFile(content) {
        console.log('Handling TXT file:', content);
    }
}

class ExcelFileHandler extends FileHandler {
    constructor() {
        super('excel');
    }
    handleFile(content) {
        console.log('Handling Excel file:', content);
    }
}

class PdfFileHandler extends FileHandler {
    constructor() {
        super('pdf');
    }
    handleFile(content) {
        console.log('Handling PDF file:', content);
    }
}