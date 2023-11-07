<script setup lang="ts">
import { formatCurrency, fillCorrectColor } from "@/mixins/features";
import deals from "../../store/index";
import { watchDebounced } from "@vueuse/core";
import { onMounted, reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { getUserData } from "@/auth/jwtService";
/* import { useRouter } from "vue-router"; */

const store = deals();

const { locale, t } = useI18n();

const observerRef = ref<HTMLElement | null>(null);
let deal = reactive({
  registration: null,
  seller: null,
  buyer: getUserData().id,
});

const createObserver = () => {
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const callback: IntersectionObserverCallback = (entries, _) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        if (store.dealsList.next) {
          try {
            console.log(store.dealsList.next);

            const next = store.dealsList.next.split("page=");
            const nextpg = next[1].split("&");
            console.log(nextpg[0]);

            await store.getDeals({
              page: nextpg[0],
              page_size: 10,
              isLazy: true,
            });
          } catch (error: any) {
            toast.error(
              error.response.data.msg || error.response.data.error || "Error"
            );
          }
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);
  if (observerRef.value) {
    observer.observe(observerRef.value);
  }
};

watchDebounced(
  store.dealsList,
  async () => {
    try {
      await store.getDeals({
        ...store.dealsList,
        page: 1,
        page_size: 10,
        isLazy: true,
      });
      /*       emit("loadConfirmed"); */
    } catch (error: any) {
      toast.error(
        error.response.data.msg || error.response.data.error || "Error"
      );
    }
  },
  { debounce: 500, maxWait: 5000 }
);

watch(store.getDeals, async () => {
  try {
    await store.getDeals({
      ...store.dealsList,
      ...store.dealsList,
      isLazy: true,
    });
  } catch (error: any) {
    toast.error(
      error.response.data.msg || error.response.data.error || "Error"
    );
  }
});
watch(locale, async () => {
  store.getDeals({
    ...store.dealsList,
    page: 1,
    page_size: 10,
    isLazy: true,
  });
});

onMounted(() => {
  store.getDeals({
    ...store.dealsList,
    page: 1,
    page_size: 10,
    isLazy: true,
  });
  createObserver();
});
</script>

<template>
  <pre></pre>
  <div class="flex flex-wrap gap-10">
    <div
      class="p-3 cursor-pointer w-80 card max-sm:w-full"
      v-for="(item, index) in store.dealsList.results"
      :key="index"
      @click="$router.push({ name: 'deals-details', params: { id: item.id } })"
    >
      <div class="flex col-span-2 pb-3 place-content-between">
        <h2 class="text-lg font-semibold dark:text-white">
          {{ item.car_model.name }}
        </h2>
        <span
          :class="`${fillCorrectColor('info')} 
          rounded-full px-4 py-1 font-semibold text-sm`"
        >
          {{ "Выбор рассрочки" }}
        </span>
      </div>
      <div class="flex items-center justify-between mt-1">
        <h2 class="text-sm text-gray-500 dark:text-gray-300">ID</h2>
        <p class="text-sm dark:text-gray-300">
          <span class="text-dark dark:text-white">
            {{ item.id }}
          </span>
        </p>
      </div>
      <div class="flex items-center justify-between mt-1">
        <h2 class="text-sm text-gray-500 dark:text-gray-300">
          <!--      {{ $t("seller") }} -->
          {{ $t("date1") }}
        </h2>
        <p class="text-sm dark:text-gray-300">
          <span class="text-dark dark:text-white">
            {{ item.created_date }}
          </span>
        </p>
      </div>
      <div class="flex items-center justify-between mt-1">
        <h2 class="text-sm text-gray-500 dark:text-gray-300">
          <!--            {{ $t("year_and_color") }} -->
          {{ $t("model") }}
        </h2>
        <p class="text-sm dark:text-gray-300 text-end">
          <span class="text-dark dark:text-white"> </span>
          {{ item.car_model.name }}
        </p>
      </div>
      <div class="flex items-center justify-between mt-1">
        <h2 class="text-sm text-gray-500 dark:text-gray-300">
          <!--            {{ $t("year_and_color") }} -->
          {{ $t("state_license_plate") }}
        </h2>
        <p class="text-sm dark:text-gray-300 text-end">
          <span class="text-dark dark:text-white"> </span>
          {{ item.car_number }}
        </p>
      </div>
      <div class="flex items-center justify-between mt-1">
        <h2 class="mr-4 text-sm text-gray-500 dark:text-gray-300">
          {{ $t("year_and_color") }}
        </h2>
        <p class="text-sm dark:text-gray-300 text-end">
          <span class="text-dark dark:text-white">
            {{ item.year }}
          </span>
          <span class="mx-1 text-xl text-primary">/</span> {{ item.color }}
        </p>
      </div>
      <div class="flex items-center justify-between mt-5">
        <h2 class="text-sm text-gray-500 dark:text-gray-300">
          {{ $t("price") }} {{ $t("bank") }}
        </h2>
        <p class="text-sm dark:text-gray-300">
          <span class="text-xl font-medium text-primary">
            {{ formatCurrency(item.price) }} сум
          </span>
        </p>
      </div>
    </div>
  </div>
  <div ref="observerRef" style="height: 1px"></div>
</template>
<style></style>
