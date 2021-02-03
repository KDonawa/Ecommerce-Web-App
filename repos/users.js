const fs = require('fs');
const crypto = require('crypto');
const {promisify} = require('util');

const scrypt = promisify(crypto.scrypt);
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
    async insert(data) {
        const records = await this.findAll();        

        const salt = crypto.randomBytes(8).toString('hex');
        data.password = await this.saltPassword(data.password, salt);

        const id = this.randomId();
        records.push({id, ...data});

        await this.writeAll(records);
        return id;
    }

    async findAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename)
        );
    }
    async findById(id){
        const records = await this.findAll();
        return records.find(data => data.id === id);
    }
    async findOne(filters){
        const records = await this.findAll();
        
        for (const record of records) {
            let found = true;
            for (const key in filters) {
                if(record[key] !== filters[key]){
                    found = false;
                    break;
                }        
            }
            if(found) return record;
        }
        return null;
    }
    async find(filters){
        const records = await this.findAll();
        if(Object.keys(filters).length === 0) return records;
        
        const result = [];
        for (const record of records) {
            let found = true;
            for (const key in filters) {
                if(record[key] !== filters[key]){
                    found = false;
                    break;
                }        
            }
            if(found) result.push(record);
        }
        return result;
    }
    
    async deleteById(id){
        const records = await this.findAll();
        const updated = records.filter(data => data.id !== id);
        await this.writeAll(updated);
    }

    async updateById(id, update){
        const records = await this.findAll();
        const record = records.find(data => data.id === id); 
        if(!record){
            throw new Error(`There is no record with the id: ${id}`);
        }
        Object.assign(record, update);
        await this.writeAll(records);
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }
    randomId(){
        return crypto.randomBytes(4).toString('hex');
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