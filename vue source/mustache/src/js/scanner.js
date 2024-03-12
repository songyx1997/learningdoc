class Scanner {
    constructor(template) {
        // 需要解析的全部字符串
        this.all = template;
        // 剩余需要解析的字符串
        this.tail = template;
        this.pos = 0;
    }
    scanUtil(stopTag) {
        // 记录开始时的位置
        const backup_pos = this.pos;
        // 当剩余字符串的开头是stopTag时，跳出循环
        while (this.end() && this.tail.indexOf(stopTag) != 0) {
            this.pos++;
            this.tail = this.all.substring(this.pos);
        }
        return this.all.substring(backup_pos, this.pos);
    }
    scan(stopTag) {
        this.pos += stopTag.length;
    }
    end() {
        // 指针是否已经走到字符串尾
        return this.pos < this.all.length;
    }
}

export default Scanner;