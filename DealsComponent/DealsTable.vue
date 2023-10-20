<template>
  <EasyDataTable :headers="headers" hide-footer :items="items" @click-row="(item) => $router.push({ name: 'deals-details', params: { id: item.id } })
    ">
    <template #item-status="item">
      <!--    <Button
             :btn="false"
             /> -->
      <div class="flex py-3 pt-2">
        <span :class="`${fillCorrectColor('info')} text-${'info'} rounded-full px-4 py-1 font-semibold text-sm`">
          {{ 'Выбор рассрочки' }}
        </span>

      </div>
    </template>
  </EasyDataTable>
  <TwPagination class="mt-10 tw-pagination" :current="current" :total="0" :per-page="10"
    :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')" @page-changed="changePagionation" />
</template>
  
<script lang="ts" setup>
import type { Header, Item } from "vue3-easy-data-table";
import { formatCurrency, fillCorrectColor } from "@/mixins/features";
import { reactive, ref } from "vue";
const formatCurrency = (amount: number): string => {
  // const roundedAmount = Math.round(amount * 100) / 100;
  const roundedAmount = Math.floor(amount);
  const formattedAmount = roundedAmount.toLocaleString();
  const formattedCurrency = formattedAmount;

  return formattedCurrency;
}
const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});
const current = ref<number>(1);
const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
};

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "ДАТА", value: "data" },
  { text: "МОДЕЛЬ", value: "model" },
  { text: "ГОС. НОМЕР", value: "gosNumber" },
  { text: "ГОД/ЦВЕТ", value: "year" },
  { text: "ЦЕНА БАНКА", value: "BankPrice" },
  { text: "СТАТУС", value: "status" },
];

const items: Item[] = [
  {
    id: 1,
    data: `25.09.2023`,
    model: `Cobalt`,
    gosNumber: `896J5654A`,
    year: `2017 black`,
    BankPrice: 2780000000,
    status: `завершено`
  },
  {
    id: 2,
    data: `25 сентября 2023`,
    model: `Cobalt`,
    gosNumber: `896J5654A`,
    year: `2017 black`,
    BankPrice: 280000000,
    status: `выбор рассрочки`
  },
];
for (let index = 0; index < items.length; index++) {
  items[index].BankPrice = formatCurrency(items[index].BankPrice)


}

</script>
<style></style>
