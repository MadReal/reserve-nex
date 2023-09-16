<script setup lang="ts">
import { storeToRefs } from "pinia";
const route = useRoute();
import { directive as VNumber } from "@coders-tm/vue-number-format";
const number = { suffix: "", precision: 13, separator: "" };
// @ts-ignore
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

// *************
// STORE IMPORTS
// *************
import { useRestaurantsStore } from "@/stores/Restaurants";
const storeRestaurants = useRestaurantsStore();
import { useWorkTimesStore } from "~/stores/WorkTimes";
const storeWorkTimes = useWorkTimesStore();
import { useDiscountsStore } from "~/stores/Discounts";
const storeDiscounts = useDiscountsStore();
import { useBlocksStore } from "~/stores/Blocks";
const storeBlocks = useBlocksStore();
import { useReservationsStore } from "@/stores/Reservations";
const storeReservations = useReservationsStore();

// https://nuxt.com/modules/gtag
// const { gtag } = useGtag();

const telOptions = {
  id: "person-phone",
  name: "person-phone",
  placeholder: "Telefono*",
  showDialCode: true,
  required: true,
  // maxlength: 20,
};
const preferredCountries = ["it", "ch", "gb", "fr", "de", "us", "cn"];

// route params
const restaurantIdParam = parseInt(route.params.restaurantId[0]);
// logic to move between steps
const activeStep = ref(1);
const goToStep = (stepToGo: number) => {
  newReservation.value.time = "";
  // if already finished, can't go back
  if (activeStep.value === 4) return;
  // always go to previous stepToGo
  if (stepToGo < activeStep.value) activeStep.value = stepToGo;
};

// init reservation object
const newReservation = ref<Partial<Reservation>>({
  date: null!,
  time: "",
  discountAmount: null,
  personName: undefined,
  personEmail: undefined,
  personPhone: undefined,
  peopleAmount: 1,
  personInstagram: null,
  restaurantId: restaurantIdParam,
});

// step 1
// ====================
const { activeRestaurant } = storeToRefs(storeRestaurants);
storeRestaurants.fetchSingleRestaurant(restaurantIdParam);
storeBlocks.fetchBlockedDates(restaurantIdParam);
storeBlocks.fetchBlockedDaysOfWeek(restaurantIdParam);
//
function setReservationDate(date: Date) {
  newReservation.value.date = date;
  let dayOfWeek = date.getDay();
  // adjust sunday, because it's 0 but 7 is app=s sunday
  dayOfWeek === 0 ? (dayOfWeek = 7) : (dayOfWeek = dayOfWeek);
  // api calls
  storeBlocks.fetchBlockedTimeRangeOnDate(restaurantIdParam);
  storeBlocks.fetchBlockedTimeRangeOnDayOfWeek(restaurantIdParam);
  storeWorkTimes.fetchWorkTimes(restaurantIdParam);
  storeDiscounts.fetchDiscountsByDayOfWeek(dayOfWeek, restaurantIdParam);
  // advance activeStep
  activeStep.value++;
}

// step 2
// ====================
const setReservationTimeAndDiscountAmount = (time: WorkTime["time"], discountAmount: DiscountAmount["value"]) => {
  newReservation.value.time = time;
  newReservation.value.discountAmount = discountAmount;
  activeStep.value++;
};

// step 3
// ====================
const isFormEmpty = computed(() => {
  const { id, time, date, restaurantId, discountAmount, personInstagram, ...otherDetails } = newReservation.value;
  return Object.values(otherDetails).some((value) => value === "" || value === null || value === undefined);
});
const errorOnInput = ref({
  personEmail: false,
  personPhone: false,
});
function validateEmail(email: string | undefined) {
  if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return (errorOnInput.value.personEmail = false);
  else return (errorOnInput.value.personEmail = true);
}
function validatePhone(phoneNumber: number | undefined) {
  if (!phoneNumber || phoneNumber.toString().length < 8) return (errorOnInput.value.personPhone = true);
  else return (errorOnInput.value.personPhone = false);
}
async function addReservation() {
  // exit if there are any errors
  validateEmail(newReservation.value.personEmail);
  validatePhone(newReservation.value.personPhone);
  if (errorOnInput.value.personEmail || errorOnInput.value.personPhone) return;

  const reservation = await storeReservations.addReservation(newReservation.value);

  // ******** UPDATE DEPENING ON RESTAURANT ********
  // const avgClientValueAmount = 20;
  // // calculate event value
  // const clientReservationValue = avgClientValueAmount * (newReservation.value?.peopleAmount || 1);
  // const discountAmountInEUR = (newReservation.value?.discountAmount! / 100) * clientReservationValue;
  // const clientReservationValueMinusDiscount = clientReservationValue - discountAmountInEUR;
  // gtag("event", "reservation_sent", {
  //   event_category: "reservation",
  //   event_action: "finished",
  //   value: clientReservationValueMinusDiscount,
  // });

  // @ts-ignore
  newReservation.value = reservation;
  activeStep.value++;
}
</script>

<template lang="pug">
.page.relative.z-0.h-screen
    .fixed.inset-0.z-0.h-full.bg-cover(class="bg-[url('/images/jason-leung.webp')]")
        .w-full.h-full.flex.justify-center.items-center(class="bg-black/40 backdrop-brightness-50")

    section.max-w-screen-xl.mx-auto.px-4.pt-8.pb-20.md_pt-36
        .w-full.mx-auto.min-h-min.shadow-xl.relative.z-10(class="md_w-6/12 shadow-[rgba(0,0,0,0.03)]")

            ClientReservationSteps(:activeStep="activeStep" @goToStep="goToStep")
            .bg-white.z-10.relative.rounded-b-lg.border.border-t-0
                ClientReservation1Calendar(v-if="activeStep === 1" @setReservationDate="setReservationDate")
                ClientReservation2Time(v-else-if="activeStep === 2" :reservation="newReservation" @setReservationTimeAndDiscountAmount="setReservationTimeAndDiscountAmount")
                div(v-else-if="activeStep === 3")
                    .px-4.py-6.md_px-10
                        ClientReservationInfo(
                          :reservationDate="newReservation.date", 
                          :reservationTime="newReservation.time", 
                          :reservationDiscountAmount="newReservation.discountAmount", 
                          :restaurant="activeRestaurant")
                        .md_mt-6
                            .flex.mb-2.gap-4
                                .flex-grow
                                    label.text-xs(for="person-name") Nome
                                    input.w-full.h-10.text-xs.rounded-md.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-300.focus_outline-none(
                                        v-model="newReservation.personName", name="person-name", id="person-name", type="text", placeholder="Nome*", autocomplete="name" required)
                                .basis-20
                                    label.text-xs(for="people-amount") Persone
                                    .w-full.h-10.bg-transparent.border.border-grey-100.text-xs.rounded-md.flex
                                        select.w-full.py-1.px-2.border-r-4.border-transparent.bg-transparent.focus_ring-transparent.focus_border-transparent(
                                            v-model="newReservation.peopleAmount", name="people-amount", id="people-amount")
                                            option(v-for="number in 10", :key="number", :value="number") {{ number }}                            

                            label.text-xs(for="person-email") Email
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.bg-transparent.text-black.focus_border-grey-300.focus_outline-none(
                                :class="{ 'border-grey-100 placeholder_text-grey-100' : !errorOnInput.personEmail, 'border-error-200 placeholder_text-error-100' : errorOnInput.personEmail  }",
                                v-model="newReservation.personEmail", name="person-email", id="person-email", type="email", placeholder="Email*", autocomplete="email" required)

                            label.text-xs(for="person-phone") Telefono
                            VueTelInput.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.pl-0.border.bg-transparent.text-black.focus_border-grey-300.focus_outline-none(
                                :class="{ 'border-grey-100 placeholder_text-grey-100' : !errorOnInput.personPhone, 'border-error-200 placeholder_text-error-100' : errorOnInput.personPhone }",
                                v-model="newReservation.personPhone", v-number="number", mode="international", :inputOptions="telOptions", :preferredCountries="preferredCountries")

                            label.text-xs(for="person-instagram") Instagram (opzionale)
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-300.focus_outline-none(
                                v-model="newReservation.personInstagram", name="person-instagram", id="person-instagram", type="text", placeholder="@username")

                            p.mt-2.text-sm.text-error-200.text-center(v-show="errorOnInput.personEmail || errorOnInput.personPhone") Compila le field con dati validi.
                ClientReservation4End(v-else-if="activeStep === 4", :restaurant="activeRestaurant", :reservation="newReservation")
                //- footer
                ClientReservationFooter(:restaurant="activeRestaurant", :activeStep="activeStep", :isButtonDisabled="isFormEmpty" @goBack="goToStep(1)", @addReservation="addReservation")
</template>
