<script setup lang="ts">
import portfolioProjects from "@/data/portfolio-projects.json";

// SEO
const title = 'PixelVision - Web & App Development Services'
const description = 'PixelVision - Web & App Development Services'
useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description,
});

// DATA
const portfolio = portfolioProjects.filter(project => project.work_category.includes('web'));

let hoveredStepIndex = ref<number | null>(null);
let activeStepIndex = ref<number>(0)
const indexOfColoredSteps = [1, 2, 3, 7, 8]
const getSelectedStep = (index: number): boolean => index === activeStepIndex.value;

// METHODS
function setHoveredStep(index: number) {
	hoveredStepIndex.value = index;
}

function clearHoveredStep() {
	hoveredStepIndex.value = null;
}

function isHoveredStep(index: number): boolean {
	return hoveredStepIndex.value === index;
}

function getSquareClasses(stepNumber: number, index: number) {
	const classes = [`graph__square--${stepNumber}`]
	if (indexOfColoredSteps.includes(stepNumber)) {
		classes.push('graph__square--color')
	}
	if (getSelectedStep(index)) {
		classes.push('graph__square--selected')
	}
	if (isHoveredStep(index)) {
		classes.push('graph__square--hovered');
	}
	return ['graph__square', ...classes]
}

function increaseStep() { (activeStepIndex.value) === 7 ? (activeStepIndex.value) = 0 : (activeStepIndex.value)++ }
function decreaseStep() { (activeStepIndex.value) === 0 ? (activeStepIndex.value) = 7 : (activeStepIndex.value)-- }

defineExpose({ activeStepIndex })
</script>


<template lang="pug">
.page--web
	//- HEADER
	HeaderMain(title="Web & App", :description="$t('web.header.description')", :button-text="$t('web.header.button')", media="web_programmer.svg")

	//- SECTION WITH IMAGE AND MESSAGE - Your Design Concept Within 1 Week
	section.section.pt-0
		.container.section-heading__container
			NuxtImg.section-heading__img(src="/illustrations/web_time-calendar.svg", alt="person working with computer", title="person working with computer", loading="lazy")
			SectionHeading(:isH2="true", :title-one="$t('web.section_message1.title1')", :title-two="$t('web.section_message1.title2')", :description="$t('web.section_message1.description')", alignment="left")

	//- SECTION WITH IMAGE AND MESSAGE - We Create According To Your Needs
	section.section
		.container.section-heading__container.has-text-right
			SectionHeading(:title-one="$t('web.section_message2.title1')", :title-two="$t('web.section_message2.title2')", :description="$t('web.section_message2.description')", alignment="right")
			NuxtImg.section-heading__img.section-heading__img--padding(src="/illustrations/web_tools.svg", alt="online website building platforms, WebFlow, WooCOmmerce, Shopify, Wordpress, Custom Dev", 
				title="online website building platforms, WebFlow, WooCOmmerce, Shopify, Wordpress, Custom Dev", loading="lazy", data-aos="fade-left", data-aos-duration="1000", data-aos-delay="0")

	//- CTA - GET STARTED & WORK STEPS
	section.section
		.container.section-heading__container.section-heading__container--cta(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="0")
			SectionHeading.mb-0(:title-one="$t('web.section_message3.title1')", :title-two="$t('web.section_message3.title2')", alignment="left")
			hr.section-heading__hr
			CTAButton.section-heading__button(:button-text="$t('home.section_message2.button')", page="web")

		//- WORK STEPS
		.container.is-max-widescreen.work-steps.work-steps--web
			//- DESKTOP only
			.work-steps__graph.is-hidden-mobile
				.graph__row
					a.graph__square(v-for="(n, index) in 8", 
						:class="getSquareClasses(n, index)", 
						@click="activeStepIndex = index"
						@mouseover="setHoveredStep(index)",
						@mouseout="clearHoveredStep")
						.graph__square.graph__square--2b(v-if="index === 1", 
							:class="{'graph__square--selected': getSelectedStep(index), 'graph__square--hovered': isHoveredStep(index) }")

				.graph__row
					a.graph__title(v-for="(n, index) in 8"
						:class="[`graph__title--${n}`, {'graph__title--selected': getSelectedStep(index), 'graph__title--hovered': isHoveredStep(index) }]"
						@click="activeStepIndex = index",
						@mouseover="setHoveredStep(index)",
						@mouseout="clearHoveredStep") 
						| {{ $t(`web.section_message3.steps[${index}].title`) }}

			//- MOBILE only
			.work-steps__graph.is-hidden-tablet(:style="{ transform: `translateX(-${ (100/8 * activeStepIndex) }%)`}")
				.graph__row(v-for="(n, index) in 8", @click="activeStepIndex = index", :style="{ opacity: index === activeStepIndex ? 1 : 0 }")
					.graph__square(:class="[`graph__square--${n}`]")
						.graph__square.graph__square--2b(v-if="index === 1")
					.graph__title(:class="[`graph__title--${n}`]") {{ $t(`web.section_message3.steps[${index}].title`) }}

			//- MOBILE only - Arrows for Navigation
			.work-steps__nav-mobile.is-hidden-tablet
				SVGIcon(icon-name="chevron-left" @click="decreaseStep")
				SVGIcon(icon-name="chevron-right" @click="increaseStep")

			//- WORK DESCRIPTION
			p.work-steps__description(v-html="$t(`web.section_message3.steps[${activeStepIndex}].description`)")

	//- PORTFOLIO PROJECTS
	section.section
		.container.is-max-desktop
			SectionHeading.mb-6(:title-one="$t('web.section_portfolio.title1')", :title-two="$t('web.section_portfolio.title2')", data-aos="fade-down", data-aos-duration="1000", data-aos-delay="0")
			PortoflioProject(
				v-for="project in portfolio", 
				:key="project.name", componentType="hor", :showFlag="false", :name="project.name", :description="project.description", :workCategory="project.work_category", :skills="project.skills", 
				:media="project.media", :objectives="project.objectives", :technology="project.technology", :link="project.link")
</template>