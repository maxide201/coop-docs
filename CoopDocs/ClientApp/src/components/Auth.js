

export default class Auth{
    constructor() {
        this.isAuthenticated = false;
        this.login = null;
    }

    static async SignIn(login, password) {
        let sendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ "login": login, "password": password })
        };
        await fetch('api/account/signin', sendData);
    }

    static async SignUp(login, password) {
        let sendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ "login": login, "password": password })
        };
        await fetch('api/account/signup', sendData);
    }

    static SignOut() {

    }
}
