<script setup lang="ts">
import { storeToRefs } from "pinia";
import { directive as VNumber } from "@coders-tm/vue-number-format";
const number = { suffix: "", precision: 13, separator: "" };
// @ts-ignore
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

const telOptions = {
  id: "person-phone",
  name: "person-phone",
  placeholder: "Telefono*",
  showDialCode: true,
  required: true,
  // maxlength: 20,
};
const preferredCountries = ["it", "ch", "gb", "fr", "de", "us", "cn"];

interface Props {
  reservation: Partial<Reservation>;
  errorOnInput: { personEmail: boolean; personPhone: boolean };
}
const props = defineProps<Props>();
const personName = defineModel<string>("personName", { default: "" });
const peopleAmount = defineModel<number>("peopleAmount", { default: 1 });
const personEmail = defineModel<string>("personEmail", { default: "" });
const personPhone = defineModel<string>("personPhone", { default: "" });
const personInstagram = defineModel<string | null>("personInstagram", { default: null });

const storeRestaurants = useRestaurantsStore();
const { activeRestaurant } = storeToRefs(storeRestaurants);
</script>

<template>
  <div class="px-4 py-6 md_px-10" v-if="reservation && reservation.date">
    <ClientReservationInfo
      :reservationDate="reservation.date"
      :reservationTime="reservation.time"
      :reservationDiscountAmount="reservation.discountAmount"
      :restaurant="activeRestaurant"
    />
    <div class="md_mt-6">
      <div class="mb-2 flex gap-4">
        <div class="flex-grow">
          <label class="text-xs" for="person-name">Nome</label>
          <input
            class="h-10 w-full rounded-md border border-grey-100 bg-transparent px-2 py-1 text-xs text-black placeholder_text-grey-100 focus_border-grey-300 focus_outline-none"
            v-model="personName"
            name="person-name"
            id="person-name"
            type="text"
            placeholder="Nome*"
            autocomplete="name"
            required
          />
        </div>
        <div class="basis-20">
          <label class="text-xs" for="people-amount">Persone</label>
          <div class="flex h-10 w-full rounded-md border border-grey-100 bg-transparent text-xs">
            <select
              class="w-full border-r-4 border-transparent bg-transparent px-2 py-1 focus_border-transparent focus_ring-transparent"
              v-model="peopleAmount"
              name="people-amount"
              id="people-amount"
            >
              <option v-for="number in 10" :key="number" :value="number">{{ number }}</option>
            </select>
          </div>
        </div>
      </div>
      <label class="text-xs" for="person-email">Email</label>
      <input
        class="mb-2 h-10 w-full rounded-md border bg-transparent px-2 py-1 text-xs text-black focus_border-grey-300 focus_outline-none"
        :class="{
          'border-grey-100 placeholder_text-grey-100': !errorOnInput.personEmail,
          'border-error-200 placeholder_text-error-100': errorOnInput.personEmail,
        }"
        v-model="personEmail"
        name="person-email"
        id="person-email"
        type="email"
        placeholder="Email*"
        autocomplete="email"
        required
      /><label class="text-xs" for="person-phone">Telefono</label>
      <VueTelInput
        class="mb-2 h-10 w-full rounded-md border bg-transparent px-2 py-1 pl-0 text-xs text-black focus_border-grey-300 focus_outline-none"
        :class="{
          'border-grey-100 placeholder_text-grey-100': !errorOnInput.personPhone,
          'border-error-200 placeholder_text-error-100': errorOnInput.personPhone,
        }"
        v-model="personPhone"
        v-number="number"
        mode="international"
        :inputOptions="telOptions"
        :preferredCountries="preferredCountries"
      />
      <label class="text-xs" for="person-instagram">Instagram (opzionale)</label>
      <input
        class="mb-2 h-10 w-full rounded-md border border-grey-100 bg-transparent px-2 py-1 text-xs text-black placeholder_text-grey-100 focus_border-grey-300 focus_outline-none"
        v-model="personInstagram"
        name="person-instagram"
        id="person-instagram"
        type="text"
        placeholder="@username"
      />
      <p class="mt-2 text-center text-sm text-error-200" v-show="errorOnInput.personEmail || errorOnInput.personPhone">
        Compila le field con dati validi.
      </p>
    </div>
  </div>
</template>
