<template>
    <div class="flex flex-wrap gap-4 place-content-between max-lg:flex-wrap max-lg:gap-6 ">
        <div class="flex gap-4 max-md:flex-wrap max-sm:flex-col max-sm:w-full">
            <form>


                <p>Модель</p>

                <v-select class="w-52 max-sm:w-full" :options="[]" placeholder="Выберите модель ">
                    <template #no-options> {{ $t("no_matching_options") }} </template>
                </v-select>


            </form>
            <form>

                <p>Год</p>

                <v-select class="w-52 max-sm:w-full" :options="[]" placeholder="Выберите год выпуска">
                    <template #no-options> {{ $t("no_matching_options") }} </template>
                </v-select>

            </form>
            <form>

                <p class="">Статус</p>
                <v-select class="w-52 max-sm:w-full" :options="[]" placeholder="Статус продажи">
                    <template #no-options> {{ $t("no_matching_options") }} </template>
                </v-select>

            </form>
        </div>

        <div class="flex items-center gap-3">
            <div class="flex items-center gap-x-7">
                <div class="flex items-center justify-end w-full gap-8 pt-3 pr-3 max-sm:hidden">
                    <ul class="flex">
                        <li>
                            <input id="dealList" type="radio" name="deal" value="dealList" class="hidden peer" checked
                                @input="ClickBTN" />
                            <label for="dealList"
                                class="px-3 pt-4 pb-1 text-xs bg-transparent border cursor-pointer rounded-l-md border-primary text-primary peer-checked:bg-primary/10">
                                <span uk-icon="table"></span>
                            </label>
                        </li>
                        <li>
                            <input id="dealCard" type="radio" name="deal" value="dealCard" class="hidden peer"
                                @input="ClickBTN" />
                            <label for="dealCard"
                                class="px-3 pt-4 pb-1 text-xs bg-transparent border cursor-pointer rounded-r-md border-primary text-primary peer-checked:bg-primary/10">
                                <span uk-icon="thumbnails"></span>
                            </label>
                        </li>
                    </ul>
                </div>

            </div>
            <button class="btn-success" uk-toggle="target: #modal-edit-deal"> Добавить</button>
        </div>


        <EditDealModal />
    </div>
</template>
    
<script setup lang='ts'>
import EditDealModal from '../../components/modals/EditDealModal.vue';
const emit = defineEmits()
const ClickBTN = ({ target }) => {
    emit('toggle', target.value)
}

</script>
    
<style scoped></style>