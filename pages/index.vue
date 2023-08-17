<script setup lang="ts">
import portfolioProjects from "@/data/portfolio-projects.json";

// SEO
const title = 'PixelVision - Creative Agency'
const description = 'We\'re passionate about helping businesses bring their vision to life through innovative marketing, web development, and creative design. Let’s make your vision a reality!'
useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description,
});

// DATA
const portfolio = portfolioProjects.filter(project => project.showOnHome)
</script>


<template lang="pug">
.page--home
	HeaderHero

	section.section.is-large
		.container.is-max-desktop
			p#home-message1(data-aos="fade-right", data-aos-duration="1000", data-aos-delay="0", data-aos-offset="50", data-aos-once="true") {{ $t('home.section_message1.description') }}

	section.section.our-services
		.our-services__background
		.container
			h2.title.is-4.our-services__title {{ $t('home.section_services.title') }}
			.columns.is-variable.is-7-desktop.is-2-tablet.is-0-mobile
				ServiceBox(icon-name="icon-code", title="App & Website", :description="$t('home.section_services.service1_description')", link="web",
					data-aos="fade-up", data-aos-duration="1000", data-aos-delay="0")
				ServiceBox(icon-name="icon-bulb", title="Marketing", :description="$t('home.section_services.service3_description')", link="marketing",
					data-aos="fade-up", data-aos-duration="1000", data-aos-delay="200")
				ServiceBox(icon-name="icon-brush", title="Creative", :description="$t('home.section_services.service2_description')", link="creative",
					data-aos="fade-up", data-aos-duration="1000", data-aos-delay="400")

	section.section.is-large
		.container.is-max-desktop.has-text-right(data-aos="fade-left", data-aos-duration="1000", data-aos-delay="0")
			SectionHeading(:title-one="$t('home.section_message2.title1')", :title-two="$t('home.section_message2.title2')", :description="$t('home.section_message2.description')", :short-description="true", alignment="right")
			CTAButton.section-heading__button(:button-text="$t('home.section_message2.button')", page="home")

	section.section
		.container.is-max-desktop
			SectionHeading.mb-6(:title-one="$t('home.section_portfolio.title1')", :title-two="$t('home.section_portfolio.title2')")
			PortoflioProject(
				v-for="project in portfolio", 
				:key="project.name", componentType="hor", :showFlag="true", :name="project.name", :description="project.description", :workCategory="project.work_category", :skills="project.skills", 
				:media="project.media", :objectives="project.objectives", :technology="project.technology", :link="project.link")
</template>
