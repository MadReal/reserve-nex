<script setup lang="ts">
import { storeToRefs } from "pinia";
const route = useRoute();
import { directive as VNumber } from "@coders-tm/vue-number-format";
const number = { suffix: "", precision: 13, separator: "" };

// https://nuxt.com/modules/gtag
// const { gtag } = useGtag();

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

// route params
const restaurantIdParam = parseInt(route.params.restaurantId[0]);
// logic to move between steps
const activeStep = ref(1);
const goToStep = (stepToGo: number) => {
  // if already finished, can't go back
  if (activeStep.value === 4) return;
  // always go to previous stepToGo
  if (stepToGo < activeStep.value) activeStep.value = stepToGo;
  if (stepToGo === 3 && newReservation.value.time) activeStep.value = stepToGo;
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
import { useBlocksStore } from "~/stores/Blocks";
const storeBlocks = useBlocksStore();
const { blockedDatesListFullCalendar, blockedDaysOfWeekList } = storeToRefs(storeBlocks);
import { useRestaurantsStore } from "@/stores/Restaurants";
const storeRestaurants = useRestaurantsStore();
const { activeRestaurant } = storeToRefs(storeRestaurants);
storeRestaurants.fetchSingleRestaurant(restaurantIdParam);
//
const daysClosed = computed(() => {
  const isActive = blockedDaysOfWeekList.value.length > 0;
  const dayOrDaysWord = blockedDaysOfWeekList.value.length > 1 ? "Giorni" : "Giorno";
  const mainSentence = `${dayOrDaysWord} di chiusura: `;
  const listOfDays = blockedDaysOfWeekList.value.map((item) => useTranslateDayOfWeek(item.dayOfWeek!)).join(", ");
  return { isActive, mainSentence, listOfDays };
});
const hiddenDaysOfWeek = computed(() => blockedDaysOfWeekList.value.map((item) => (item.dayOfWeek === 7 ? 0 : item.dayOfWeek)));
const blockedDates = computed(() =>
  blockedDatesListFullCalendar.value.map((item) => ({
    ...item,
    display: "background",
  })),
);

// step 2
// ====================
import { useWorkTimesStore } from "~/stores/WorkTimes";
const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes);
import { useDiscountsStore } from "~/stores/Discounts";
const storeDiscounts = useDiscountsStore();
//
const selectReservationTimeAndDiscountAmount = (time: WorkTime["time"], discountAmount: number) => {
  newReservation.value.time = time;
  newReservation.value.discountAmount = discountAmount;
  activeStep.value++;
};

// step 3
// ====================
import { useReservationsStore } from "@/stores/Reservations";
const storeReservations = useReservationsStore();
//
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

//************
// CALENDAR
//************
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dateClick(), to drag and create events
import itLocale from "@fullcalendar/core/locales/it";

const handleDateClick = (dateClickInfo: any) => {
  // Get the date as a string without the time
  const selectedDate = dateClickInfo.date;
  const selectedDateFixed = new Date(dateClickInfo.dateStr);

  const currentDate = new Date(); // Get the current date and time
  currentDate.setHours(0, 0, 0, 0); // Set the time component to midnight for comparison

  // Check if the selectedDate is inside the blockedDates array
  const isDateBlocked = blockedDates.value.some((blockedDate) => {
    // @ts-ignore
    const blockStartDate = new Date(blockedDate.dateStart);
    // @ts-ignore
    const blockEndDate = new Date(blockedDate.dateEnd);
    return selectedDateFixed >= blockStartDate && selectedDateFixed < blockEndDate;
  });

  //  if the selected date is before today's date or is inside blockedDates exit the function
  if (selectedDate < currentDate || isDateBlocked) return;

  dateClickInfo.dayEl.style.backgroundColor = "rgb(0 143 220 / 30%)";

  let dayOfWeek = selectedDate.getDay();
  // adjust sunday, because it's 0 but 7 is app=s sunday
  dayOfWeek === 0 ? (dayOfWeek = 7) : (dayOfWeek = dayOfWeek);

  newReservation.value.date = selectedDate;
  storeWorkTimes.fetchWorkTimes(restaurantIdParam);
  storeDiscounts.fetchDiscountsByDayOfWeek(dayOfWeek, restaurantIdParam);
  // advance checkout step
  activeStep.value++;
  // gtag("event", "reservation_started", {
  //   event_category: "reservation",
  //   event_action: "started",
  // });
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  locale: itLocale,
  headerToolbar: { left: "prev", center: "title", right: "next" },
  initialView: "dayGridMonth",
  selectable: false,
  dayMaxEvents: true,
  contentHeight: 320,
  progressiveEventRendering: true,
  events: blockedDates,
  hiddenDays: hiddenDaysOfWeek,
  dateClick: handleDateClick,
});

storeBlocks.fetchBlockedDates(restaurantIdParam);
storeBlocks.fetchBlockedDaysOfWeek(restaurantIdParam);
storeBlocks.fetchBlockedTimeRangeOnDate(restaurantIdParam);
storeBlocks.fetchBlockedTimeRangeOnDayOfWeek(restaurantIdParam);
</script>

<template lang="pug">
.page.relative.z-0.h-screen
    .fixed.inset-0.z-0.h-full.bg-cover(class="bg-[url('/images/jason-leung.webp')]")
        .w-full.h-full.flex.justify-center.items-center(class="bg-black/40 backdrop-brightness-50")


    section.max-w-screen-xl.mx-auto.px-4.pt-8.pb-20.md_pt-36
        .w-full.mx-auto.min-h-min.shadow-xl.relative.z-10(class="md_w-6/12 shadow-[rgba(0,0,0,0.03)]")

            ClientReservationSteps(:activeStep="activeStep" @goToStep="goToStep")

            .bg-white.z-10.relative.rounded-b-lg.border.border-t-0
                div(v-if="activeStep === 1")
                    .px-4.py-6.md_px-10
                        FullCalendar.calendar-client(:options="calendarOptions")
                        p.bg-slate-50.py-1.text-center.text-xs.text-grey-100.w-full.whitespace-nowrap.tracking-wide(v-show="daysClosed.isActive") {{ daysClosed.mainSentence }} {{ daysClosed.listOfDays }}

                div(v-if="activeStep === 2")
                    .px-4.py-6.md_px-10
                        ClientReservationInfo(:reservationDate="newReservation.date")
                        .md_my-6(v-if="lunchWorkTimesList.length")
                            p.mb-4 Pranzo
                            .grid.grid-cols-3.md_grid-cols-5.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in lunchWorkTimesList", :key="workTime.id",
                                    :time="workTime.time", :dateSelected="newReservation.date", :isSelected="workTime.time === newReservation.time", @selectTime="selectReservationTimeAndDiscountAmount")

                        .md_my-6(v-if="dinnerWorkTimesList.length")
                            p.mb-4 Cena
                            .grid.grid-cols-3.md_grid-cols-5.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in dinnerWorkTimesList", :key="workTime.id",
                                    :time="workTime.time", :dateSelected="newReservation.date", :isSelected="workTime.time === newReservation.time", @selectTime="selectReservationTimeAndDiscountAmount")

                div(v-if="activeStep === 3")
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

                div(v-if="activeStep === 4")
                    .py-16.px-4.md_py-24.md_px-10.flex.items-center.justify-center.gap-5
                        div.text-center
                            SVGIcon.text-primary-100.mx-auto.mb-4(svg="check", :size="60")
                            p.text-base.md_text-lg Congratulazioni {{ newReservation.personName }},
                            p.mt-1.text-sm.md_text-base ti aspettiamo il {{ useDateFormatting(newReservation.date) }} alle {{ newReservation.time }}
                            p.mt-4.text-xs.text-primary-100.leading-relaxed Ordine ID: #[span.bg-slate-100.rounded.p-1 {{ newReservation.id }}]
                            p.mt-5.pt-4.border-t.text-sm.text-grey-200 {{ activeRestaurant.name }} - {{ activeRestaurant.address }}, {{ activeRestaurant.city }} {{ activeRestaurant.zipCode }}

                //- footer
                ClientReservationFooter(:restaurant="activeRestaurant", :activeStep="activeStep", :isButtonDisabled="isFormEmpty" @goBack="activeStep = 1", @addReservation="addReservation")
</template>
