import axios from 'axios';
import { type EntityModel } from '@/utils/setTable';

const api = axios.create({baseURL: 'http://localhost:5150'});

export default {
  fetchEnts() {
    return api.get<EntityModel[]>('api/entity');
  },
  stringFilterAPI(from: string | number, sorting: string, sortingCol: string, type?: string, column?: string, str?: string) {
    console.log('from filter api:', sorting);
    return api.get<EntityModel[]>(`api/filtered?from=${from}&sorting=${sorting}
    &sortingCol=${sortingCol}&type=${type}&col=${column}&str=${str}`);
  },
  getLastEntAPI(sortingCol: string) {
    return api.get<EntityModel>(`api/last?sortingCol=${sortingCol}`);
  },
  addEnt(ent: EntityModel) {
    return api.post('api/entity', ent);
  },
  editEnt(ent: EntityModel) {
    return api.put(`api/entity/${ent._id}`, ent);
  },
  deleteEnt(id: string) {
    return api.delete(`api/entity/${id}`);
  }
}
