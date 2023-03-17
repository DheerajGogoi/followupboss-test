const { Datastore } = require('@google-cloud/datastore');
const path = require('path');
// Datastore is a noSQL database that is used to store data.
// Just for example, kind corresponds to the relations in sql. And name corresponds to the "primary key" in sql.  

class DatastoreClient {
    constructor() {
        this.datastore = new Datastore({
            projectId: "follow-up-boss-testing",
            // keyfile json can be downloaded from the section "API and services in the left menu" and then selecting credentials > service accounts > keys > Add key > Create new key   
            keyFilename: path.join(__dirname, './keyfile.json')
        });
    }

    async save(kind, name, data) {
        /* 
        save data obj in datastore with custom key.
        returns void
        eg- save("Task", "pk1", {fname: "task1", description: "task1 description"})
         */
        const taskKey = this.datastore.key([kind, name]);
        const task = {
            key: taskKey,
            data: data
        };
        await this.datastore.save(task);
    }

    async defaultSave(kind, data) {
        const taskKey = this.datastore.key(kind);
        const task = {
            key: taskKey,
            data: data
        };
        await this.datastore.save(task);
    }

    async get(kind, name) {
        /* 
        get data obj from datastore with custom key.
        returns the data obj for the "name" if found.
        eg- get("Task", "pk1")
         */
        const taskKey = this.datastore.key([kind, name]);
        const [task] = await this.datastore.get(taskKey);
        return task;
    }

    async defaultGet(kind) {
        const taskKey = this.datastore.key(kind);
        const [task] = await this.datastore.get(taskKey);
        return task;
    }

    async getSubTask(parentkind, parentname, kind, name) {
        /* 
        get data obj from datastore in cases with parent-child relations.(parentkind > parentname > kind > name )
        returns JS object.
        eg- save("Task", "pk1", {fname: "task1", description: "task1 description"})
         */
        const taskKey = this.datastore.key([
            parentkind,
            parentname,
            kind,
            name,
        ]);
        const task = await this.datastore.get(taskKey);
        return task;
    }
    async delete(kind, name) {
        /* 
        delete data obj in datastore for the corresponding kind and name.
        doesn't returns anything
        eg- delete("Task", "pk1")
         */
        const taskKey = this.datastore.key([kind, name]);
        await this.datastore.delete(taskKey);
    }
    async Exists(kind, name) {
        /* 
        check if an entry exists in datastore for the corresponding kind and name.
        returns boolean
        eg- Exists("Task", "pk1")
         */
        const data = this.get(kind, name);
        if (data) return true;
        else return false;
    }
    async ArrLookUp(kind, arrName, val) {
        /* 
        search for a field in an array in datastore for the corresponding kind and name.
        and return all the entries that match the value in their array field.
        eg- ArrLookUp("User", "phoneNumbers", "+91656654565")
         */
        const query = await this.datastore.createQuery(kind).filter(arrName, '=', val);
        const [result] = await this.datastore.runQuery(query);
        return result;
    }
    async FilterEquals(kind, v1, v2) {
        /* 
        returns entity where v1==v2.
        with v1 being the field name and v2 being the value.
        returns js object
        eg- save("User", "name","Thame")
         */
        const query = await this.datastore.createQuery(kind).filter(v1, v2);
        const [result] = await this.datastore.runQuery(query);
        return result;
    }
    async Filtercompare(kind, v1, v2) {
        const query = await this.datastore.createQuery(kind).filter(v1, '<=', v2);
        const [result] = await this.datastore.runQuery(query);
        return result;
    }
    async GetAll(kind) {
        const query = await this.datastore.createQuery(kind);
        const [result] = await this.datastore.runQuery(query);
        return result;
    }
}
module.exports = new DatastoreClient();

