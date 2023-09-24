import { defineStore } from 'pinia';
import { setColumns, type EntityModel } from '@/utils/setTable';
import apiMethods from '@/api';

import { randomNumber, randomDate, generatePassword, generateText } from '@/utils/setTable';

const metaData: { properties: [] } = JSON.parse(`{
	"properties": [
		{
			"name": "_id",
			"title": "Идентификатор объекта",
			"nullable": false,
			"dataType": "number"
		},
		{
			"name": "_createUser",
			"title": "Имя пользователя, создавшего элемент",
			"dataType": "string",
			"nullable": false,
			"defaultValue": ""
		},
		{
			"name": "_createDt",
			"title": "Дата и время создания элемента",
			"className": "_sysElement",
			"nullable": false,
			"dataType": "Date"
		},
		{
			"description": "Имя пользователя, изменившего элемент",
			"name": "_updateUser",
			"title": "Изменил",
			"className": "_sysElement",
			"dataType": "string"
		},
		{
			"name": "_updateDt",
			"title": "Дата и время обновления элемента",
			"className": "_sysElement",
			"dataType": "Date"
		},
		{
			"name": "Login",
			"title": "Login",
			"className": "User",
			"summary.ru": "Логин",
			"dataType": "string"
		},
		{
			"name": "Name",
			"title": "Name",
			"className": "User",
			"summary.ru": "Имя",
			"nullable": false,
			"dataType": "string",
			"maxLength": 150
		},
		{
			"name": "Password",
			"title": "Password",
			"className": "User",
			"summary.ru": "Пароль",
			"dataType": "password",
			"defaultValue": ""
		},
		{
			"name": "Lang",
			"title": "User Language",
			"className": "User",
			"summary.ru": "Язык пользователя",
			"dataType": "string",
			"defaultValue": ""
		},
		{
			"name": "LoginsCount",
			"title": "Logins Count",
			"className": "User",
			"summary.ru": "Количество логинов",
			"dataType": "number",
			"defaultValue": 0
		}
	],
	"name": "User",
	"title": "Пользователь"
}`);
const rows: EntityModel[] = [];
export const useEntityStore = defineStore('entities', {
  state: () => ({
    cols: setColumns(metaData),
    rows,
	from: '',
	filterType: '',
	filterColumn: '',
	sortingColumn: '"_createUser"',
	filterVal: '',
	sorting: '',
	noSort: true,
	loading: false
  }),
  actions: {
    async fetchEntities() {
      try {
        const fetchedEnts = await apiMethods.fetchEnts();
        this.rows = fetchedEnts.data;
		//this.sortingColumn = '_id';
		//this.from = `'${this.rows[this.rows.length - 1]._id}'`;
		//this.sorting = 'asc';
		//this.noSort = true;
      }
      catch (error) {
        console.log(error);
      }
    },

	async loadMore() {
		try {
			this.loading = true;
			const last = this.rows[this.rows.length - 1] ?? await this.getLastEnt();
			switch(this.sortingColumn) {
				case '_id':
					this.from = `${last._id}`;
					break;
				case '"_createUser"':
					this.from = `'${last._createUser}'`;
					break;
				case '"_updateUser"':
					this.from = `'${last._updateUser}'`;
					break;
				case '"_createDt"':
					this.from = `'${last._createDt}'`;
					break;
				case '"_updateDt"':
					this.from = `'${last._updateDt}'`;
					break;
				case '"Login"':
					this.from = `'${last.Login}'`;
					break;
				case '"Name"':
					this.from = `'${last.Name}'`;
					break;
				case '"Password"':
					this.from = `'${last.Password}'`;
					break;
				case '"Lang"':
					this.from = `'${last.Lang}'`;
					break;
				case '"LoginsCount"':
					this.from = `'${last.LoginsCount}'`;
			}
			console.log(this.from);
			const uploadedEnts = await apiMethods.stringFilterAPI(
				this.from, this.sorting, this.sortingColumn,
				this.filterType, this.filterColumn, this.filterVal
			);
			this.rows = [...this.rows, ...uploadedEnts.data];
			this.loading = false;
		}
		catch (error) {
			console.log(error);
		}
	},

    async addEntity(entity: EntityModel) {
      try {
        const res = await apiMethods.addEnt(entity);
        const newEnt = res.data;
        this.rows.push(newEnt);
      }
      catch (error) {
        console.log(error);
      }
    },

    async editEntity(entity: EntityModel) {
      try {
        await apiMethods.editEnt(entity);
      }
      catch (error) {
        console.log(error);
      }

    },

    async deleteEntity(id: string) {
      try {
        await apiMethods.deleteEnt(id);
      }
      catch (error) {
        console.log(error);
      }
    },

	async generateMoreEnts() {
		try {
			for (let i = 0; i < 5000000; i++) {
				await this.addEntity({
					_id: randomNumber(),
					_createUser: generateText(),
					_updateUser: generateText(),
					_createDt: randomDate(),
					_updateDt: randomDate(),
					Login: generateText(),
					Name: generateText(),
					Password: generatePassword(),
					Lang: generateText(),
					LoginsCount: randomNumber()
				});
			}
		}
		catch (error) {
			console.log(error);
		}
	},

	async getLastEnt() {
		try {
			const lastEnt = await apiMethods.getLastEntAPI(this.sortingColumn);
			return lastEnt.data;
		}
		catch (error) {
			console.log(error);
		}
	},

	async stringFilter() {
		try {
			const filteredEnts = await apiMethods.stringFilterAPI(
				'\'\'', this.sorting, this.sortingColumn,
				this.filterType, this.filterColumn, this.filterVal
			);
			this.rows = filteredEnts.data;
		}
		catch (error) {
			console.log(error);
		}
	}
  }
})
