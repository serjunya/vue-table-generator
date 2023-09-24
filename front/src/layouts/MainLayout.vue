<template>
  <div class="q-pa-md">
    <q-layout view="lhh Lpr lff">
      <q-header reveal class="bg-primary">
        <q-toolbar>
          <q-btn
            round
            size="md"
            class="q-ma-sm"
            color="white"
            text-color="primary"
            icon="add"
            @click="add"
          />
        </q-toolbar>
      </q-header>
      <DrawerForm />
      <q-page-container>
        <q-table
          dense
          :columns="entityStore.columns"
          :rows="entityStore.entities"
          row-key="name"
          :sort-method="sortEnts"
          binary-state-sort
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          :table-class="{ 'data': true }"
          :loading="entityStore.loading"
          @row-click="edit"
        >
          <template v-slot:body="props">
            
          </template>
        </q-table>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useEntityStore } from 'src/stores/entityStore';
import { useQuasar } from 'quasar';
import { useRepo } from 'pinia-orm';
import PopupForm from 'src/components/PopupForm.vue';
import DrawerForm from 'src/components/DrawerForm.vue';
import { Entity, generatePassword, generateText, highlightRow, randomDate, randomNumber, unhighlightRow } from 'src/utils/setQTable';
import EntityModel from 'src/stores/models/EntityModel';

const entityStore = useEntityStore();
const rep = useRepo(EntityModel);

(async () => {
  entityStore.loading = true;
  await entityStore.fetchEntities();
  entityStore.loading = false;
})();

  // for (let i = 0; i < 8000; i++) {
  //   entityStore.addEntity({
  //     _createUser: generateText(),
  //     _updateUser: generateText(),
  //     _createDt: randomDate(),
  //     _updateDt: randomDate(),
  //     Login: generateText(),
  //     Name: generateText(),
  //     Password: generatePassword(),
  //     Lang: generateText(),
  //     LoginsCount: randomNumber()
  //   })
  // }

const $q = useQuasar();
const pagination = ref({
  rowsPerPage: 0
});

const add = () => {
  if (!entityStore.drawer) {
    $q.dialog({
      component: PopupForm
    }).onOk((ent: Entity) => {
      entityStore.addEntity(ent);
    });
  }
}

const edit = (evt: Event, row: Entity, index: number) => {
  if (!entityStore.drawer) {
    if (entityStore.selectedRow >= 0) {
      unhighlightRow(entityStore.selectedRow);
    }
    entityStore.selectedRow = index;
    highlightRow(index);
    entityStore.setCurrentEnt(row);
    entityStore.showDrawer();
  }
}

const sortEnts = (rows: readonly Entity[], sortBy: string, descending: boolean) => {
  const sorted: Entity[] = rep.orderBy(sortBy, descending ? 'desc' : 'asc').get();
  Object.assign(entityStore.entities, sorted);
  return sorted;
}
</script>
