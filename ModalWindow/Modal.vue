<script setup lang="ts">
import { Ref, computed, inject, onMounted, reactive, ref, watch } from "vue";
import useVuelidate, { Validation } from "@vuelidate/core";
import { helpers, minValue, required } from "@vuelidate/validators";
import UIkit from "uikit";
import { toast } from "vue3-toastify";
import { knowledbaseStore as _knowledbaseStore } from "@/modules/Reference/store";
import { useI18n } from "vue-i18n";
import { IDeal, IDealParams } from "@/modules/Deals/interfaces/Deals";
import deals from "@/modules/Deals/store/index";
import { ICar } from "@/modules/Reference/views/cars/interfaces";

import clients from '@/modules/Clients/store/index'
// constants
const { t } = useI18n();
const storeClients = clients()
const store = deals();
const knowledbaseStore = _knowledbaseStore();
const isClicked = ref<boolean>(false);
const validYears = reactive<number[]>([]);
const formData = reactive<IDeal>({
  client: null,
  id: null,
  created_date: "",
  car_number: "",
  year: "",
  price: "",
  car_model: null,
  color: "",
  status: null,
});

const rules = computed(() => {
  return {
    client: {
      required: helpers.withMessage("required", required),
    },
    car_number: {
      required: helpers.withMessage("required", required),
    },
    car_model: {
      required: helpers.withMessage("required", required),
    },
    color: {
      required: helpers.withMessage("required", required),
    },
    year: {
      required: helpers.withMessage("required", required),
      minValue: helpers.withMessage(
        "validate_5_year",
        minValue(new Date().getFullYear() - 4)
      ),
    },
    price: {
      required: helpers.withMessage("required", required),
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, formData);

const pastYears = () => {
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 4; i--) {
    validYears.push(i);
  }
};

const clearFormData = () => {
  const { id, car_model, ...rest } = formData;
  Object.keys(rest).forEach((key) => {
    formData[key] = "";
  });
  formData.id = null;
  formData.car_model = null;
};

const sendData = async () => {
  const success = await validate.value.$validate();
  if (!success) {
    focusToRequiredField();
    return;
  }

  try {
    isClicked.value = true;
    if (formData.id) {
      await store.updateDeals(formData);
      store.getDealById(formData.id);
    } else {
      await store.createDeals(formData);
      store.getDeals({} as IDealParams);
    }
    UIkit.modal("#modal-edit-deal").hide();
    toast.success(t("success"));
    setTimeout(() => {
      clearFormData();
    }, 200);
    isClicked.value = false;
  } catch (error: any) {
    isClicked.value = false;
    toast.error(
      error.response.data.msg || error.response.data.error || "Error"
    );
  }
};

const showModal = inject("showModal");

const onModalChange = (newVal: any) => {
  if (newVal) {
    const { car_model, ...rest } = store.deal;
    Object.assign(formData, rest);
    formData.car_model =
      (typeof car_model == "object" && car_model?.id) || ({} as ICar);
  }
};

const focusToRequiredField = () => {
  const required: HTMLElement | undefined | null = document
    .getElementById("modal-edit-deal")
    ?.querySelector(".required-input");

  if (required) {
    required.focus();
    required.scrollIntoView();
    return;
  }
};

const defocusOnFilled = () => {
  if (formData.car_number.length === 10) {
    document.getElementById("numberSign")?.blur();
  }
};

watch(showModal, onModalChange);

onMounted(() => {
  UIkit.util.on("#modal-edit-deal", "hidden", validate.value.$reset);
  pastYears();
});
</script>

<template>
  <div id="modal-edit-deal" class="uk-flex-top" uk-modal>
    <div
      class="overflow-hidden rounded-md uk-modal-dialog uk-margin-auto-vertical">
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("edit_car") }}
        </h2>
      </div>
      <form @submit.prevent="sendData">
        <div class="uk-modal-body">
          <div class="gap-12 md:px-6">
            <!-- 1st column -->
            <div class="my-5">
                <label
                  for="model"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("owner") }} <span class="text-danger">*</span>
                </label>

                <LazySelect
                  v-model="formData.client"
                  id="model"
                  :options="storeClients.clientsList"
                  :reduce="(el) => el.id"
                  :getOptionLabel="(v) => v.name || ''"
                  :placeholder="$t('owner')"
                  :fetch="storeClients.getclients"
                  class="mt-1"
                  :class="
                    validate.client.$errors.length ? 'required-input' : ''
                    " 
                />
                <p
                  v-for="error in validate.client.$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div>

            <div class="mt-5 lg:mt-0">
              <div>
                <label
                  for="numberSign"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("state_license_plate") }}
                  <span class="text-danger">*</span>
                </label>

                <input
                  v-model="formData.car_number"
                  v-maska
                  data-maska="## @### @@"
                  id="numberSign"
                  type="text"
                  name="numberSign"
                  :placeholder="$t('state_license_plate')"
                  class="uppercase form-input"
                  :class="
                    validate.car_number.$errors.length ? 'required-input' : ''
                  "
                  @input="defocusOnFilled" />
                <p
                  v-for="error in validate.car_number.$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div>

              <div class="my-5">
                <label
                  for="model"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("model") }} <span class="text-danger">*</span>
                </label>

                <LazySelect
                  id="model"
                  :options="knowledbaseStore.car_models"
                  v-model="formData.car_model"
                  :reduce="(el) => el.id"
                  :placeholder="$t('choose_a_model')"
                  :fetch="knowledbaseStore.FETCH_CAR_MODELS"
                  :getOptionLabel="(v) => v.name || ''"
                  class="mt-1"
                  :class="
                    validate.car_model.$errors.length ? 'required-input' : ''
                  " />
                <p
                  v-for="error in validate.car_model.$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div>

              <div>
                <label
                  for="year"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("year_of_issue") }} <span class="text-danger">*</span>
                </label>

                <!-- class="open-to-top" -->
                <v-select
                  id="year"
                  :options="validYears"
                  v-model="formData.year"
                  :placeholder="$t('choose_year_of_issue')"
                  :class="
                    validate.year.$errors.length ? 'required-input' : ''
                  " />
                <p
                  v-for="error in validate.year.$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div>

              <div class="my-5">
                <label
                  for="color"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("color") }} <span class="text-danger">*</span>
                </label>

                <input
                  type="text"
                  v-model="formData.color"
                  :placeholder="t('color')"
                  class="form-input"
                  :class="
                    validate.color.$errors.length ? 'required-input' : ''
                  " />
                <p
                  v-for="error in validate.color.$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div>
            </div>

            <!-- 2nd column -->
            <div class="mt-5 lg:mt-0">
              <!--   <div>
                <label
                  for="numberBody"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("chassis_body_number") }}
                  <span class="text-danger">*</span>
                </label>

                <input
                  v-model="formData.vehicle_identification_number"
                  id="numberBody"
                  type="text"
                  name="numberBody"
                  :placeholder="$t('chassis_body_number')"
                  class="form-input"
                  :class="
                    validate.vehicle_identification_number.$errors.length
                      ? 'required-input'
                      : ''
                  " />
                <p
                  v-for="error in validate.vehicle_identification_number
                    .$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div> -->

              <!-- <div class="my-5">
                <label
                  for="engineNumber"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("engine_number") }} <span class="text-danger">*</span>
                </label>

                <input
                  v-model="formData.engine_number"
                  id="engineNumber"
                  type="text"
                  name="engineNumber"
                  :placeholder="$t('engine_number')"
                  class="form-input"
                  :class="
                    validate.engine_number.$errors.length
                      ? 'required-input'
                      : ''
                  " />
                <p
                  v-for="error in validate.engine_number.$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div> -->

              <div class="my-5">
                <label
                  for="costAuto"
                  class="text-sm text-gray-600 dark:text-gray-200">
                  {{ $t("car_cost") }} (UZS)
                  <span class="text-danger">*</span>
                </label>

                <cleave
                  v-model="formData.price"
                  id="costAuto"
                  :options="{
                    numeral: true,
                    numeralThousandsGroupStyle: 'thousand',
                  }"
                  name="costAuto"
                  :placeholder="$t('car_cost')"
                  class="form-input"
                  :class="
                    validate.price.$errors.length ? 'required-input' : ''
                  " />
                <p
                  v-for="error in validate.price.$errors"
                  :key="error.$uid"
                  class="text-sm whitespace-nowrap text-danger">
                  {{ $t(error.$message) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex justify-end px-5 py-3 bg-white uk-modal-footer uk-text-right">
          <button
            type="button"
            uk-toggle="target: #modal-edit-deal"
            class="mr-2 btn-small btn-danger">
            {{ $t("cancel2") }}
          </button>
          <button
            type="submit"
            class="btn-small btn-success"
            :disabled="isClicked"
            @click="sendData">
            {{ $t("Save") }}
            <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin"
              v-if="isClicked" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
