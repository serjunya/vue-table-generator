<template>
  <q-drawer
    @before-show="changeEnt"
    v-model="entityStore.drawer"
    :width="400"
    :breakpoint="700"
    elevated
    overlay
  >
    <q-form @submit="onSubmit">
      <q-card-section>
        <div class="q-gutter-y-md column">
          <q-input
            v-for="input in entityStore.inputs"
            clearable
            filled
            :stack-label="input.stackLabel"
            :type="input.type"
            :key="input.model"
            v-model="models[input.model].value"
            :label="input.label"
            :mask="input.mask"
            lazy-rules
            :rules="input.rules"
          >
            <template v-slot:prepend v-if="input.mask">
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="models[input.model].value" mask="YYYY/MM/DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append v-if="input.mask">
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="models[input.model]/*.value*/" mask="YYYY/MM/DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions class="q-ma-sm" align="left">
        <q-btn color="primary" type="submit" label="Сохранить" />
        <q-btn outline color="primary" label="Отмена" @click="hide" />
        <q-space />
        <q-btn color="negative" icon="delete" @click="deleteEntity" />
      </q-card-actions>
    </q-form>
  </q-drawer>
</template>

<script lang="ts" setup>
import { useEntityStore } from 'src/stores/entityStore';
import { Entity, defineModels, highlightRow, unhighlightRow, getDateString } from 'src/utils/setQTable';

const entityStore = useEntityStore();

let models = defineModels();
const changeEnt = () => {
  for (const model in models) {
    const newValue = entityStore.currentEntity[model];
    if (entityStore.metaData.properties.find(el => el['name'] === model)['dataType'] === 'Date')
      models[model].value = getDateString(new Date(newValue));
    else
      models[model].value = newValue;
  }
}
const hide = () => {
  entityStore.hideDrawer();
}
const deleteEntity = async () => {
  await entityStore.deleteEntity(entityStore.currentEntity._id);
  const size = entityStore.entities.length;
  if (size !== 0) {
    entityStore.selectedRow === size ?
      '' : unhighlightRow(entityStore.selectedRow);
    entityStore.selectedRow === 0 ? '' : entityStore.selectedRow--;
    highlightRow(entityStore.selectedRow);
    entityStore.pullCurrentEnt();
    changeEnt();
  }
  else {
    hide();
  }
}
const onSubmit = async () => {
  const ent: Entity = {};
  for (const model in models) {
    const newValue = models[model].value;
    if (entityStore.metaData.properties.find(el => el['name'] === model)['dataType'] === 'Date')
      ent[model] = new Date(newValue).toISOString();
    else
      ent[model] = newValue;
  }
  console.log('updated ent', ent);
  await entityStore.editEntity(ent);
  hide();
}
</script>
