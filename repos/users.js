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
    async insert(data) {
        const records = await this.findAll();
        records.push({id: this.randomId(), ...data});
        await this.writeAll(records);
        
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
}

async function test(){
    const userRepo = new UsersRepository('users.json');
    //await userRepo.insert({email:'test@email.com', password:'password'});
    const users = await userRepo.findAll();
    //await userRepo.updateById('e21ff5b7', {password: 'new-password'});
    //const user = await userRepo.find({email: 'test@email.com'});
    console.log(users);
}

test();