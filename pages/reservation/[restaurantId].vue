<script setup lang="ts">
import { storeToRefs } from "pinia";
const route = useRoute();
import "vue-tel-input/vue-tel-input.css";

// *************
// STORE IMPORTS
// *************
const storeRestaurants = useRestaurantsStore();
const storeWorkTimes = useWorkTimesStore();
const storeDiscounts = useDiscountsStore();
const storeBlocks = useBlocksStore();
const storeReservations = useReservationsStore();

// route params
const restaurantIdParam = parseInt(route.params.restaurantId.toString());
// logic to move between steps
const activeStep = ref(1);
const goToStep = (stepToGo: number) => {
  // if already finished or click is on 4, exit
  if (stepToGo === 4 || activeStep.value === 4) return;
  // always reset time, but when on step 3
  if (stepToGo !== 3 && activeStep.value !== 3) newReservation.value.time = "";
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
const { trackEventReservationStarted, trackEventReservationFinished } = useEventTracking();
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
  // trackFacebookEvent("InitiateCheckout", { restaurant: activeRestaurant.value.name });
  trackEventReservationStarted(activeRestaurant.value.name);
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
const errorOnInput = ref({ personEmail: false, personPhone: false });
function validateEmail(email: string | undefined) {
  errorOnInput.value.personEmail = email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ? false : true;
}
function validatePhone(phoneNumber: number | string | undefined) {
  errorOnInput.value.personPhone = !phoneNumber || phoneNumber.toString().length < 8 ? true : false;
}
async function addReservation() {
  // validate fiels and exit if there are any errors
  validateEmail(newReservation.value.personEmail);
  validatePhone(newReservation.value.personPhone);
  if (errorOnInput.value.personEmail || errorOnInput.value.personPhone) return;

  const reservation = await storeReservations.addReservation(newReservation.value);

  // ******** UPDATE DEPENING ON RESTAURANT ********
  const avgClientValueAmount = 20;
  // calculate event value
  const clientReservationValue = avgClientValueAmount * (newReservation.value?.peopleAmount || 1);
  const discountAmountInEUR = newReservation.value.discountAmount
    ? (newReservation.value.discountAmount / 100) * clientReservationValue
    : 0;
  const clientReservationValueMinusDiscount = clientReservationValue - discountAmountInEUR;
  // send event
  trackEventReservationFinished(activeRestaurant.value.name, clientReservationValueMinusDiscount, reservation?.id!);
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

          <ClientReservation3Form
            v-else-if="activeStep === 3"
            :reservation="newReservation"
            v-model:personName="newReservation.personName"
            v-model:peopleAmount="newReservation.peopleAmount"
            v-model:personEmail="newReservation.personEmail"
            v-model:personPhone="newReservation.personPhone"
            v-model:personInstagram="newReservation.personInstagram"
            :errorOnInput="errorOnInput"
          />

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
