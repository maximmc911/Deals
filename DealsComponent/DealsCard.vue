<template>
<div class="flex flex-wrap gap-10 " >
  <div class="p-3 w-80 card max-sm:w-full" v-for="(item, index) in items" :key="index" >
    <div class="flex col-span-2 pb-3 place-content-between">
      <h2 class="text-lg font-semibold dark:text-white">
            {{ item.model }}
          </h2>
          <span 
                 :class="`${fillCorrectColor('info')} text-${'info'} rounded-full px-4 py-1 font-semibold text-sm`"
                >
                  {{ 'Выбор рассрочки' }}
               </span>
                
    </div>
    <div  class="flex items-center justify-between mt-1">
          <h2 class="text-sm text-gray-500 dark:text-gray-300">
       <!--      {{ $t("seller") }} --> ID
          </h2>
          <p class="text-sm dark:text-gray-300">
            <span class="text-dark dark:text-white">
            {{item.id}}
            </span>
          </p>
        </div>
    <div  class="flex items-center justify-between mt-1">
          <h2 class="text-sm text-gray-500 dark:text-gray-300">
       <!--      {{ $t("seller") }} --> Дата
          </h2>
          <p class="text-sm dark:text-gray-300">
            <span class="text-dark dark:text-white">
            {{item.data}}
            </span>
          </p>
        </div>
        <div class="flex items-center justify-between mt-1">
          <h2 class="text-sm text-gray-500 dark:text-gray-300">
 <!--            {{ $t("year_and_color") }} --> Модель
          </h2>
          <p class="text-sm dark:text-gray-300 text-end">
            <span class="text-dark dark:text-white">

            </span> 
            {{item.model}}
         
          </p>
        </div>
        <div class="flex items-center justify-between mt-1">
          <h2 class="text-sm text-gray-500 dark:text-gray-300">
 <!--            {{ $t("year_and_color") }} --> Гос. Номер
          </h2>
          <p class="text-sm dark:text-gray-300 text-end">
            <span class="text-dark dark:text-white">

            </span> 
              {{item.number}}
           
          </p>
        </div>
        <div class="flex items-center justify-between mt-1">
          <h2 class="mr-4 text-sm text-gray-500 dark:text-gray-300">
              Год / цвет
          </h2>
          <p class="text-sm dark:text-gray-300 text-end">
            <span class="text-dark dark:text-white">
         {{item.year}}
        </span>
        <span class="mx-1 text-xl text-primary">/</span>    {{item.color}}
      </p>
        </div>
        <div class="flex items-center justify-between mt-5">
          <h2 class="text-sm text-gray-500 dark:text-gray-300">
             Цена банка
          </h2>
          <p class="text-sm dark:text-gray-300">
            <span class="text-xl font-medium text-primary">
              {{item.BankPrice}} сум
            </span>
          </p>
        </div>  
  </div> 
    
</div>
</template>
    
<script setup lang='ts'>
import { formatCurrency, fillCorrectColor } from "@/mixins/features";
const formatCurrency = (amount: number): string => {
  // const roundedAmount = Math.round(amount * 100) / 100;
  const roundedAmount = Math.floor(amount);
  const formattedAmount = roundedAmount.toLocaleString();
  const formattedCurrency = formattedAmount;

  return formattedCurrency;
}
     const items: any[] = [
    {
        id: 1 ,
        data: `25.09.2023`,
        number: `896J5654A`,
        model: ` Cobalt`,
        year: 2017,
        color:` black`,
        BankPrice: 250000000,
        status: `завершено`
    },
    {
        id: 2 ,
        data: `25 сентября 2023`,
        number: `896J5654A`,
        model: `Cobalt`,
        year: 2017,
        color:` black`,
        BankPrice: 250000000,
        status: `выбор рассрочки`
    },
];
for (let index = 0; index < items.length; index++) {
  items[index].BankPrice = formatCurrency(items[index].BankPrice)
  
  
}
</script>
    
<style>
    
</style>