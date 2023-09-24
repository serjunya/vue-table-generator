import axios from 'axios';
import EntityModel from 'src/stores/models/EntityModel';
import { Entity } from 'src/utils/setQTable';

const api = axios.create({baseURL: 'http://localhost:5150'});

export default {
  fetchEnts() {
    return api.get<EntityModel[]>('api/entity');
  },
  addEnt(ent: Entity) {
    return api.post('api/entity', ent);
  },
  editEnt(ent: Entity) {
    return api.put(`api/entity/${ent._id}`, ent);
  },
  deleteEnt(id: string) {
    return api.delete(`api/entity/${id}`);
  }
}
