const { json } = require('express');
const fs = require('fs');
const crypto = require('crypto');

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
    async getById(id){
        const records = await this.getAll();
        return records.find(data => data.id === id);
    }
    async insert(data) {
        const records = await this.getAll();
        records.push({id: this.randomId(), ...data});
        await this.writeAll(records);
        
    }
    async deleteById(id){
        const records = await this.getAll();
        const updated = records.filter(data => data.id !== id);
        await this.writeAll(updated);
    }
    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }
    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }
}

async function test(){
    const userRepo = new UsersRepository('users.json');
    //await userRepo.insert({email:'test@email.com', password:'password'});
    //const users = await userRepo.getAll();
    const user = await userRepo.deleteById('98ba24f0');
    //console.log(user);
}

test();