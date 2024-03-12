import Scanner from '@/js/scanner';
// 解析模板字符串
const parseTemplate = function (template) {
    let tokens = [];
    let scanner = new Scanner(template);
    while (scanner.end()) {
        let text = scanner.scanUtil('{{');
        if (text) {
            text = text.replace(/\s+/g, '');
            tokens.push(['text', text]);
        }
        scanner.scan('{{');
        let name = scanner.scanUtil('}}');
        if (name) {
            name = name.replace(/\s+/g, '');
            if (name[0] == '#') {
                tokens.push(['#', name.substring(1)]);
            } else if (name[0] == '/') {
                tokens.push(['/', name.substring(1)]);
            } else {
                tokens.push(['name', name]);
            }
        }
        scanner.scan('}}');
    }
    return tokens;
}

export default parseTemplate;