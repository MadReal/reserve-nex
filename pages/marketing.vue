<script setup lang="ts">
import portfolioProjects from "@/data/portfolio-projects.json";

// SEO
const title = 'PixelVision - Marketing Services'
const description = 'Our marketing services are tailored to help you achieve success. Whether it\'s ad creation or social media management, we\'re here to help you connect with customers and drive results.'
useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description,
});

// DATA
const portfolio = portfolioProjects.filter(project => project.work_category.includes('marketing'));
let hoveredStepIndex = ref<number | null>(null);
let activeStepIndex = ref<number>(0)
const indexOfColoredSteps = [2, 4, 5]
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

function increaseStep() { (activeStepIndex.value) === 6 ? (activeStepIndex.value) = 0 : (activeStepIndex.value)++ }
function decreaseStep() { (activeStepIndex.value) === 0 ? (activeStepIndex.value) = 6 : (activeStepIndex.value)-- }


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
</script>


<template lang="pug">
.page--marketing
	//- HEADER
	HeaderMain(title="Marketing", :description="$t('marketing.header.description')", :button-text="$t('marketing.header.button')", media="marketing_man-social-media.svg")

	//- SECTION WITH IMAGE AND MESSAGE
	section.section.pt-0
		.container.section-heading__container
			NuxtImg.section-heading__img(src="/illustrations/marketing_computer-social.svg", alt="Computer with social icons around", loading="lazy")
			SectionHeading(:isH2="true", :title-one="$t('marketing.section_message1.title1')", :title-two="$t('marketing.section_message1.title2')", :description="$t('marketing.section_message1.description')", alignment="left")

	//- ADVERTISING + COLUMNS 
	section.section
		.container.is-smaller.is-max-widescreen
			SectionHeading.mb-6(:title-one="$t('marketing.section_message2.title1')", :title-two="$t('marketing.section_message2.title2')", :description="$t('marketing.section_message2.description')", alignment="left")

		.container.is-max-desktop
			.columns.is-variable.is-2-desktop.is-2-tablet.is-0-mobile
				.column(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="0", data-aos-offset="-100")
					.marketing-column
						SVGIcon.marketing-column__main-icon(icon-name="icon-search")
						h4.marketing-column__title {{ $t('marketing.section_message2.table1_title') }}
						p.marketing-column__description {{ $t('marketing.section_message2.table1_description') }}
						p.marketing-column__stat {{ $t('marketing.section_message2.table1_stat') }}
						.marketing-column__icons
							SVGIcon.marketing-column__icon(icon-name="icon-google")
							SVGIcon.marketing-column__icon(icon-name="icon-bing")
							SVGIcon.marketing-column__icon(icon-name="icon-amazon")
				.column(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="200", data-aos-offset="-100")
					.marketing-column.marketing-column--color
						SVGIcon.marketing-column__main-icon(icon-name="icon-users")
						h4.marketing-column__title {{ $t('marketing.section_message2.table2_title') }}
						p.marketing-column__description  {{ $t('marketing.section_message2.table2_description') }}
						p.marketing-column__stat {{ $t('marketing.section_message2.table2_stat') }}
						.marketing-column__icons
							SVGIcon.marketing-column__icon(icon-name="icon-facebook")
							SVGIcon.marketing-column__icon(icon-name="icon-instagram")
							SVGIcon.marketing-column__icon(icon-name="icon-tiktok")
							SVGIcon.marketing-column__icon(icon-name="icon-twitter")

	//- CTA - GET STARTED & WORK STEPS
	section.section.mt-6
		.container.section-heading__container.section-heading__container--cta(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="0")
			SectionHeading.mb-0(:title-one="$t('marketing.section_message3.title1')", :title-two="$t('marketing.section_message3.title2')", alignment="left")
			hr.section-heading__hr.is-hidden-mobile
			CTAButton.section-heading__button(:button-text="$t('marketing.section_message3.button')", page="marketing")

		//- WORK STEPS
		.container.is-max-widescreen.work-steps.work-steps--marketing
			//- DESKTOP only
			.work-steps__graph.is-hidden-mobile
				.graph__row
					a.graph__square(v-for="(n, index) in 7", 
						:class="getSquareClasses(n, index)", 
						@click="activeStepIndex = index"
						@mouseover="setHoveredStep(index)",
						@mouseout="clearHoveredStep")

				.graph__row
					a.graph__title(v-for="(n, index) in 7" 
						:class="[`graph__title--${n}`, {'graph__title--selected': getSelectedStep(index), 'graph__title--hovered': isHoveredStep(index) }]"
						@click="activeStepIndex = index"
						@mouseover="setHoveredStep(index)",
						@mouseout="clearHoveredStep")
						| {{ $t(`marketing.section_message3.steps[${index}].title`) }}

			//- MOBILE only
			.work-steps__graph.is-hidden-tablet(:style="{ transform: `translateX(-${ (100/7 * activeStepIndex) }%)`}")
				.graph__row(v-for="(n, index) in 7", @click="activeStepIndex = index", :style="{ opacity: index === activeStepIndex ? 1 : 0 }")
					.graph__square(:class="[`graph__square--${n}`]")
					.graph__title(:class="[`graph__title--${n}`]") {{ $t(`marketing.section_message3.steps[${index}].title`) }}

			//- MOBILE only - Arrows for Navigation
			.work-steps__nav-mobile.is-hidden-tablet
				SVGIcon(icon-name="chevron-left" @click="decreaseStep")
				SVGIcon(icon-name="chevron-right" @click="increaseStep")

			//- WORK DESCRIPTION
			p.work-steps__description(v-html="$t(`marketing.section_message3.steps[${activeStepIndex}].description`)")

	//- PORTFOLIO PROJECTS
	section.section
		.container.is-max-desktop
			SectionHeading.mb-6(:title-one="$t('marketing.section_portfolio.title1')", :title-two="$t('marketing.section_portfolio.title2')")
			PortoflioProject(
				v-for="project in portfolio", 
				:key="project.name", componentType="hor", :showFlag="false", :name="project.name", :description="project.description", :workCategory="project.work_category", :skills="project.skills", 
				:media="project.media", :objectives="project.objectives", :technology="project.technology", :link="project.link")
</template>