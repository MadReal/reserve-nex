<script setup lang="ts">
import portfolioProjects from "@/data/portfolio-projects.json";

// SEO
const title = 'PixelVision - Portfolio'
const description = 'Get in touch with us to discuss your project or ask any questions. We\'re here to help!'
useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description,
});

</script>


<template lang="pug">
.page--creative
	header.hero.is-medium
		.container.is-max-desktop(data-aos="fade-right", data-aos-duration="1000", data-aos-delay="0")
			.hero-body
				h1.title.is-1 Portfolio
	//- PORTFOLIO PROJECTS
	section.section
		.container.container__grid.is-max-desktop
			//- SectionHeading(:title-one="$t('web.section_portfolio.title1')", :title-two="$t('web.section_portfolio.title2')", data-aos="fade-down", data-aos-duration="1000", data-aos-delay="0")
			PortoflioProject(
				v-for="project in portfolioProjects", 
				:key="project.name", componentType="ver", :showFlag="true", :name="project.name", :description="project.description", :workCategory="project.work_category"
				:skills="project.skills", :media="project.media", :technology="project.technology", :objectives="project.objectives",
				:link="project.link")
</template>