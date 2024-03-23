// 不同的用户使用不同的菜单
class User {
    constructor(name, role, menus) {
        this.name = name;
        this.role = role;
        this.menus = menus;
    }
}

function factory(name, role) {
    switch (role) {
        case 'ordinary':
            return new User(name, role, ['menu1', 'menu2']);
        case 'admin':
            return new User(name, role, ['menu1', 'menu2', 'menu3', 'menu4']);
        default:
            break;
    }
}

// 给一份清单，用于批量分配菜单
function handle(users) {
    let result = [];
    for (const user of users) {
        let { name, role } = user;
        result.push(factory(name, role));
    }
    return result;
}

let users = [
    { name: 'zhang', role: 'ordinary' },
    { name: 'li', role: 'admin' }
];

console.log(handle(users));