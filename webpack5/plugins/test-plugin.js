class TestPlugin {
    constructor() {
        console.log('TestPlugin constructor');
    };
    apply(compiler) {
        console.log('TestPlugin apply');
    }
}

module.exports = TestPlugin;