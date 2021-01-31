const { json } = require('express');
const fs = require('fs');

class UsersRepository{
    constructor(filename) {
        if (!filename) {
            throw new Error('Must provide a file name');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (error) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename)
        );
    }
    async insert(data) {
        const records = await this.getAll();
        records.push(data);
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }
}

async function test(){
    const userRepo = new UsersRepository('users.json');
    userRepo.insert({email:'test@email.com', password:'password'});
    const users = await userRepo.getAll();
    console.log(users);
}

test();