const fs = require('fs');
const crypto = require('crypto');
const {promisify} = require('util');
const Repository = require('./repo');

const scrypt = promisify(crypto.scrypt);
class UsersRepository extends Repository {
    async insert(data) {
        const records = await this.findAll();        

        const salt = crypto.randomBytes(8).toString('hex');
        data.password = await this.saltPassword(data.password, salt);

        const id = this.randomId();
        records.push({id, ...data});

        await this.writeAll(records);
        return id;
    }

    async saltPassword(password, salt){
        const buffer = await scrypt(password, salt, 64);
        return `${buffer.toString('hex')}.${salt}`;
    }

    async comparePasswords(saved, supplied){
        const [hashed, salt] = saved.split('.');
        return saved === await this.saltPassword(supplied, salt);
    }
}

module.exports = new UsersRepository('users.json')