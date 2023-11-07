<script setup lang="ts">
import { toast } from "vue3-toastify";
/* import DealDetailsModal from "../../components/modals/DealDetailsModal.vue"; */
import { reactive, ref, onMounted, watchEffect, watch } from "vue";

import deals from "../../store/index";
import { knowledbaseStore as _knowledbaseStore } from "@/modules/Reference/store";

const knowledbaseStore = _knowledbaseStore();
const store = deals();
const filterAuto = reactive({
  name: ``,
  year: ``,
  status: ``,
});

const emit = defineEmits();
const ClickBTN = ({ target }) => {
  emit("toggle", target.value);
};

// get auto
const autoList = ref<Array>([]);

const refresh = async (filter) => {
  console.log(filter);

  try {
    await store.getDeals(filter);
    autoList.value = store.dealsList.results;
    PushInfo(autoList);
  } catch (error: any) {
    console.log(`тут работает!3`);
    toast.error(
      error.response.data.msg || error.response.data.error || "Error"
    );
  }
};

watch(
  () => filterAuto.name,
  () => {
    refresh(filterAuto.name);
  }
);
watch(
  () => filterAuto.year,
  () => {
    refresh(filterAuto.year);
  }
);
watch(
  () => filterAuto.status,
  () => {
    refresh(filterAuto.status);
  }
);
onMounted(() => {
  store.getDeals();
});

const validYears = reactive<Array<number>>([]);
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= currentYear - 4; i--) {
  validYears.push(i);
}
</script>

<template>
  <div
    class="flex flex-wrap gap-4 place-content-between max-lg:flex-wrap max-lg:gap-6"
  >
    <div class="flex gap-4 max-md:flex-wrap max-sm:flex-col max-sm:w-full">
      <form>
        <p class="text-sm text-gray-600 dark:text-gray-200">
          {{ $t("model") }}
        </p>
        <LazySelect
          id="model"
          :options="knowledbaseStore.car_models"
          :reduce="(el) => el.id"
          :placeholder="$t('choose_a_model')"
          :fetch="knowledbaseStore.FETCH_CAR_MODELS"
          :getOptionLabel="(v) => v.name || ''"
          class="w-52 max-sm:w-full"
          v-model="filterAuto.name"
        />
      </form>
      <form>
        <p class="text-sm text-gray-600 dark:text-gray-200">
          {{ $t("year_of_issue") }}
        </p>

        <v-select
          class="w-52 max-sm:w-full"
          :options="validYears"
          :placeholder="$t('choose_year_of_issue')"
          v-model="filterAuto.year"
        >
          <template #no-options> {{ $t("no_matching_options") }} </template>
        </v-select>
      </form>
      <form>
        <p class="text-sm text-gray-600 dark:text-gray-200">
          {{ $t("Status") }}
        </p>
        <v-select
          class="w-52 max-sm:w-full"
          :options="[]"
          :placeholder="$t('sells_status')"
          v-model="filterAuto.status"
        >
          <template #no-options> {{ $t("no_matching_options") }}</template>
        </v-select>
      </form>
    </div>

    <div class="md:flex md:w-auto w-full items-center gap-3">
      <div class="flex items-center gap-x-7">
        <div
          class="flex items-center justify-end w-full gap-8 pt-3 pr-3 max-sm:hidden"
        >
          <ul class="flex">
            <li>
              <input
                id="dealList"
                type="radio"
                name="deal"
                value="dealList"
                class="hidden peer"
                checked
                @input="ClickBTN"
              />
              <label
                for="dealList"
                class="px-3 pt-4 pb-1 text-xs bg-transparent border cursor-pointer rounded-l-md border-primary text-primary peer-checked:bg-primary/10"
              >
                <span uk-icon="table"></span>
              </label>
            </li>
            <li>
              <input
                id="dealCard"
                type="radio"
                name="deal"
                value="dealCard"
                class="hidden peer"
                @input="ClickBTN"
              />
              <label
                for="dealCard"
                class="px-3 pt-4 pb-1 text-xs bg-transparent border cursor-pointer rounded-r-md border-primary text-primary peer-checked:bg-primary/10"
              >
                <span uk-icon="thumbnails"></span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <button class="btn-success md:w-auto w-full" uk-toggle="target: #modal-edit-deal">
        {{ $t("Add") }}
      </button>
    </div>

    <DealDetailsModal />
  </div>
</template>
