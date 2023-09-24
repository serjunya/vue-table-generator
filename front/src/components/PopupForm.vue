<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="row">
          <div class="text-h6">Новая сущность</div>
          <q-space />
          <q-btn
            round
            color="primary"
            icon="shuffle"
            @click="randomize(models, entityStore.inputs)"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-form @submit="onOKClick">
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
              :mask="input.mask"
              :label="input.label"
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
                    <q-time v-model="models[input.model].value" mask="YYYY/MM/DD HH:mm" format24h>
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
          <q-btn outline color="primary" label="Отмена" @click="onDialogCancel" />
          <q-space />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
  
<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import { useEntityStore } from 'src/stores/entityStore';
import { Entity, defineModels, randomize } from 'src/utils/setQTable';

const entityStore = useEntityStore();

const models = defineModels();
defineEmits([
  ...useDialogPluginComponent.emits
]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const onOKClick = () => {
  const ent: Entity = {};
  for (const model in models) {
    ent[model] = models[model].value;
  }
  onDialogOK(ent);
}
</script>
