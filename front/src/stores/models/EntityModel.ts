import { Model } from 'pinia-orm';

export default class EntityModel extends Model {
    static entity = 'ents';
    static primaryKey = '_id';
    static fields() {
        return {
            _id: this.uid(),
            _createUser: this.string(''),
            _updateUser: this.string(''),
            _createDt: this.string(''),
            _updateDt: this.string(''),
            Login: this.string(''),
            Name: this.string(''),
            Password: this.string(''),
            Lang: this.string(''),
            LoginsCount: this.number(0)
        }
    }
}