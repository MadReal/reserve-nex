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
  date: undefined,
  time: undefined,
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

<template>
  <div class="page relative z-0 h-screen">
    <div class="fixed inset-0 z-0 h-full bg-[url('/images/jason-leung.webp')] bg-cover">
      <div class="flex h-full w-full items-center justify-center bg-black/40 backdrop-brightness-50"></div>
    </div>
    <section class="mx-auto max-w-screen-xl px-4 pb-20 pt-8 md_pt-36">
      <div class="relative z-10 mx-auto min-h-min w-full shadow-xl shadow-[rgba(0,0,0,0.03)] md_w-6/12">
        <ClientReservationSteps :activeStep="activeStep" @goToStep="goToStep" />
        <div class="relative z-10 rounded-b-lg border border-t-0 bg-white">
          <ClientReservation1Calendar v-if="activeStep === 1" @setReservationDate="setReservationDate" />
          <ClientReservation2Time
            v-else-if="activeStep === 2"
            :reservation="newReservation"
            @setReservationTimeAndDiscountAmount="setReservationTimeAndDiscountAmount"
          />

          <div v-else-if="activeStep === 3 && newReservation.date">
            <div class="px-4 py-6 md_px-10">
              <ClientReservationInfo
                :reservationDate="newReservation.date"
                :reservationTime="newReservation.time"
                :reservationDiscountAmount="newReservation.discountAmount"
                :restaurant="activeRestaurant"
              />
              <div class="md_mt-6">
                <div class="mb-2 flex gap-4">
                  <div class="flex-grow">
                    <label class="text-xs" for="person-name">Nome</label>
                    <input
                      class="h-10 w-full rounded-md border border-grey-100 bg-transparent px-2 py-1 text-xs text-black placeholder_text-grey-100 focus_border-grey-300 focus_outline-none"
                      v-model="newReservation.personName"
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
                        v-model="newReservation.peopleAmount"
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
                  v-model="newReservation.personEmail"
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
                  v-model="newReservation.personPhone"
                  v-number="number"
                  mode="international"
                  :inputOptions="telOptions"
                  :preferredCountries="preferredCountries"
                />
                <label class="text-xs" for="person-instagram">Instagram (opzionale)</label>
                <input
                  class="mb-2 h-10 w-full rounded-md border border-grey-100 bg-transparent px-2 py-1 text-xs text-black placeholder_text-grey-100 focus_border-grey-300 focus_outline-none"
                  v-model="newReservation.personInstagram"
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
          </div>
          <ClientReservation4End v-else-if="activeStep === 4" :reservation="newReservation" :restaurant="activeRestaurant" />
          <ClientReservationFooter
            :restaurant="activeRestaurant"
            :activeStep="activeStep"
            :isButtonDisabled="isFormEmpty"
            @goBack="goToStep(1)"
            @addReservation="addReservation"
          />
        </div>
      </div>
    </section>
  </div>
</template>
