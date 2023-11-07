<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IDealParams } from "../interfaces/Deals";
import deals from "../store/index";
import DealsTable from "@/modules/Deals/views/DealsComponent/DealsTable.vue";
import DealsSearch from "@/modules/Deals/views/DealsComponent/DealsSearch.vue";
import DealsCard from "@/modules/Deals/views/DealsComponent/DealsCard.vue";

const store = deals();
const cardView = ref<boolean>(false);
const toggle = (e: string) => {
  cardView.value = e === "dealCard" ? true : false;
};

onMounted(() => {
  store.getDeals({} as IDealParams);
});
</script>
<template>
  <div>
    <div class="card">
      <DealsSearch @toggle="toggle" />
    </div>
    <div class="mt-4 max-sm:hidden" v-if="cardView">
      <DealsCard />
    </div>

    <div v-else class="mt-6 card max-sm:hidden">
      <DealsTable />
    </div>
    <div class="hidden mt-6 max-sm:flex">
      <DealsCard />
    </div>
  </div>
</template>

<style scoped></style>
