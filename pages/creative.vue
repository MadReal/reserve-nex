<script setup lang="ts">
// SEO
const title = 'PixelVision - Creative Design Services'
const description = 'From logo design to marketing materials, we craft visually stunning solutions that effectively communicate your brand\'s message and values.'
useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description,
});
</script>


<template lang="pug">
.page--creative
	HeaderMain(title="Creative", :description="$t('creative.header.description')", :button-text="$t('creative.header.button')", media="creative_computer.svg")

	//- COLUMN - ILLUSTRATIONS From Vision To Creation
	section.section
		.container.section-heading__container
			SectionHeading(:isH2="true", :title-one="$t('creative.section_message1.title1')", :title-two="$t('creative.section_message1.title2')", alignment="left")

		.container.mb-6
			.columns.is-multiline.is-mobile
				.column.creative-column.is-half-mobile(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="0")
					NuxtImg(src="/illustrations/icon-logo.svg", alt="icon-logo", title="icon-logo", loading="lazy")
					p.creative-column__title Logo
				.column.creative-column.is-half-mobile(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="100")
					NuxtImg(src="/illustrations/icon-web-design.svg", alt="icon-web-design", title="icon-web-design", loading="lazy")
					p.creative-column__title Web Design
				.column.creative-column.is-half-mobile(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="200")
					NuxtImg(src="/illustrations/icon-illustration.svg", alt="icon-illustration", title="icon-illustration", loading="lazy")
					p.creative-column__title Illustration
				.column.creative-column.is-half-mobile(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="300")
					NuxtImg(src="/illustrations/icon-photo-video.svg", alt="icon-photo-video", title="icon-photo-video", loading="lazy")
					p.creative-column__title Photo & Video
				.column.creative-column.is-half-mobile(data-aos="fade-down", data-aos-duration="1000", data-aos-delay="400")
					NuxtImg(src="/illustrations/icon-creative-ads.svg", alt="icon-creative-ads", title="icon-creative-ads", loading="lazy")
					p.creative-column__title Creative Ads

	//- Power of Creativity
	section.section
		.container.is-max-desktop.section-heading__container
			SectionHeading(:title-one="$t('creative.section_message2.title1')", :title-two="$t('creative.section_message2.title2')", :description="$t('creative.section_message2.description')", alignment="left",
				data-aos="fade-down", data-aos-duration="800", data-aos-delay="0")
			NuxtImg.section-heading__img(src="/illustrations/creative_girl-paint.svg", alt="girl with brush and paint", title="girl with brush and paint", loading="lazy", 
				data-aos="fade-left", data-aos-duration="1000", data-aos-delay="0")

	//- Why Logos Matter
	section.section
		.container.is-max-desktop.section-heading__container(data-aos="fade-up", data-aos-duration="800", data-aos-delay="0")
			NuxtImg.section-heading__img#logo-work-img(src="/illustrations/creative_logo-work.png", alt="logo work process illustration", title="logo work process illustration", loading="lazy")
			SectionHeading#logo-work-text(:title-one="$t('creative.section_message3.title1')", :title-two="$t('creative.section_message3.title2')", :description="$t('creative.section_message3.description')", alignment="left")

	section.section
		.container.section-heading__container.section-heading__container--cta(data-aos="fade-up", data-aos-duration="1000", data-aos-delay="0")
			SectionHeading.mb-0(:title-one="$t('creative.section_message4.title1')", :title-two="$t('creative.section_message4.title2')", alignment="left")
			hr.section-heading__hr
			CTAButton.section-heading__button(:button-text="$t('creative.section_message4.button')", page="creative")

	//- How to Harness Creativity
	section.section(data-aos="fade-up", data-aos-duration="800", data-aos-delay="0")
		.container.is-max-desktop.section-heading__container
			SectionHeading(:title-one="$t('creative.section_message5.title1')", :title-two="$t('creative.section_message5.title2')", :description="$t('creative.section_message5.description')", alignment="left")
			NuxtImg.section-heading__img(src="/illustrations/creative_phone-socials.png", alt="phones on social media apps", title="phones on social media apps", loading="lazy")
</template>