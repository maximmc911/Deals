import $axios from "@/plugins/axios";
import { defineStore } from "pinia";
import { IResponse } from "@/stores/interfaces";
import { IDeal, IDealParams, IFiles, IFileParams } from './../interfaces/Deals';

export default defineStore("deals", {
  state: () => {
    return {
      deal: {} as IDeal,
      dealsList: {} as IResponse<IDeal>,
      files: {} as IResponse<IFiles>
    }
  },

  actions: {
    // deals
    async getDeals(params: IDealParams) {
      const { data } = await $axios.get("/deals/deals", { params });
      this.dealsList = data
    },

    async getDealById(id: number) {
      const { data } = await $axios.get(`/deals/deals/${id}`);
      this.deal = data;
    },

    createDeals(data: IDeal) {
      return $axios.post("/deals/deals", data);
    },

    updateDeals(data: IDeal) {
      return $axios.patch(`/deals/deals/${data.id}/`, data);
    },

    deleteDeal(id: number) {
      return $axios.delete(`/deals/deals/${id}/`);
    },

    // files
    async getFiles(params: IFileParams) {
      const { data } = await $axios.get("/files/attachments/", { params });
      this.files = data
    },

    createFile(data: IFiles) {
      return $axios.post("/files/attachments/", data);
    },

    deleteFile(id: number) {
      return $axios.delete(`/files/attachments/${id}/`);
    },
  },
})
