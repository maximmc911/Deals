<script lang="ts" setup>
import { formatCurrency, fillCorrectColor } from "@/mixins/features";
import { reactive, ref } from "vue";
import deals from "../../store/index";
import { headers } from "../../constants";
import { IDealParams, IDeal } from "../../interfaces/Deals";
import { toast } from "vue3-toastify";

// constants
const store = deals();
const isLoading = ref<boolean>(false);
const current = ref<number>(1);
let autoList = ref<IDeal[]>([]);

const filter = reactive<IDealParams>({
  status: null,
  page_size: 10,
  page: 1,
});

// functions
const changePagionation = (e: number) => {
  filter.page = e;
  current.value = e;
  refresh(filter);
};

const refresh = async (filter: IDealParams) => {
  isLoading.value = true;

  try {
    await store.getDeals(filter);
    autoList.value = store.dealsList.results;
  } catch (error: any) {
    toast.error(
      error.response.data.msg || error.response.data.error || "Error"
    );
  }
  isLoading.value = false;
};
</script>
<template>
  <EasyDataTable
    hide-footer
    :headers="headers"
    :loading="isLoading"
    :items="store.dealsList.results || []"
    @click-row="
      (item) => $router.push({ name: 'deals-details', params: { id: item.id } })
    ">
    <template #empty-message>
      <div class="dark:text-white">{{ $t("no_available_data") }}</div>
    </template>

    <template #header="header">
      {{ $t(header.text).toUpperCase() }}
    </template>

    <template #item-car_model="item">
      <div class="my-2 text-start">
        {{ item.car_model.name }}
      </div>
    </template>

    <template #item-yearAndColor="item">
      <div class="my-2 text-start">
        <span>
          {{ item.year }}
        </span>
        /
        <span>
          {{ item.color }}
        </span>
      </div>
    </template>

    <template #item-car_number="item">
      <div class="my-2 text-start">
        {{ item.car_number.toUpperCase() }}
      </div>
    </template>

    <template #item-price="item">
      <div>
        <span> {{ formatCurrency(item.price) }} сум </span>
      </div>
    </template>

    <template #item-status="item">
      <div class="flex py-3 pt-2">
        <span
          :class="`${fillCorrectColor(
            'primary'
          )} rounded-full px-4 py-1 font-semibold text-sm`">
          {{ item.status || $t("not_specified") }}
        </span>
      </div>
    </template>
  </EasyDataTable>

  <TwPagination
    class="mt-10 tw-pagination"
    :current="current"
    :total="store.dealsList.count"
    :per-page="10"
    :text-before-input="$t('go_to_page')"
    :text-after-input="$t('forward')"
    @page-changed="changePagionation" />
</template>
