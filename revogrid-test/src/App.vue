<template>
    <v-grid
      resize
      theme='compact'
      :source="entityStore.rows"
      :columns="entityStore.cols"
      :column-types="plugin"
      row-headers
      :filter="{
        localization: {
          captions: {
            cancel: 'Закрыть',
            reset: 'Сброс',
            title: 'Фильтр по условию',
            save: 'Сохранить'
          },
          filterNames: {
            'eqN': 'eqN',
            'neqN': 'neqN',
            'none': 'Нет',
            'empty': 'Пусто',
            'notEmpty': 'Не пусто',
            'eq': 'Равно',
            'notEq': 'Неравно',
            'begins': 'Начинается с',
            'contains': 'Содержит',
            'notContains': 'Не содержит',
            'gt': '>',
            'gte': '>=',
            'lt': '<',
            'lte': '<='
          }
        }
      }"
      range
      can-move-columns
      @viewportscroll="onBottomScrolled"
      @beforefilterapply="onBeforeFilterApplied"
      @beforesorting="onBeforeSorting"
    />
</template>

<script setup lang="ts">
import { useEntityStore } from '@/stores/entities';
import VGrid from '@revolist/vue3-datagrid';
import { type RevoGrid } from '@revolist/revogrid/dist/types/interfaces';
import { type FilterCollection } from '@revolist/revogrid/dist/types/plugins/filter/filter.plugin';
import { plugin } from '@/utils/setTable';
import { ref } from 'vue';

const entityStore = useEntityStore();
const scroll = ref<HTMLRevogrScrollVirtualElement>();

(async () => {
  await entityStore.fetchEntities();
  scroll.value = document.getElementsByTagName('revogr-scroll-virtual')[0];
})()

const onBottomScrolled = async () => {
  const offsetHeight = scroll.value?.offsetHeight ?? 0;
  const scrollTop = scroll.value?.scrollTop ?? 0;
  const scrollHeight = scroll.value?.scrollHeight ?? 0;
  if (!entityStore.loading && offsetHeight && offsetHeight + scrollTop >= scrollHeight - 0.7) {
    await entityStore.loadMore();
  }
}

const onBeforeFilterApplied = (event: CustomEvent<{
  collection: FilterCollection;
}>) => {
  const filters = Object.entries(event.detail.collection);

  console.log('raw filter object', event.detail.collection);
  console.log('filters', filters);

  if (filters.length === 0 && entityStore.filterColumn != '') {
    entityStore.filterColumn = '';
    entityStore.filterType = '';
    entityStore.filterVal = '';
    entityStore.stringFilter();
  }
  else if (filters[0] && (filters[0][1].type !== entityStore.filterType
  || filters[0][1].value !== entityStore.filterVal)) {
    entityStore.filterColumn = filters[0][0];
    entityStore.filterType = filters[0][1].type;
    entityStore.filterVal = filters[0][1].value;
    entityStore.stringFilter();
  }

  event.preventDefault();
}

const onBeforeSorting = async (event: CustomEvent<{
  column: RevoGrid.ColumnRegular;
  order: 'desc' | 'asc';
  additive: boolean;
}>) => {
  event.preventDefault();

  entityStore.sortingColumn = `"${event.detail.column.prop}"`;
  if (!entityStore.sorting/* || entityStore.noSort*/) {
    entityStore.sorting = 'asc';
    // entityStore.noSort = false;
  }
  else if (entityStore.sorting === 'asc') entityStore.sorting = 'desc';
  else if (entityStore.sorting === 'desc') {
    entityStore.sorting = '';
    entityStore.from = '';
  }

  if (entityStore.sorting === 'desc') {
    await entityStore.getLastEnt()
    .then(lastEnt => entityStore.from = lastEnt?._createUser ?? '')
    .then(() => entityStore.stringFilter());
  }
  else if (entityStore.sorting === '') {
    await entityStore.fetchEntities();
  }
  else {
    entityStore.stringFilter();
  }
}
</script>
