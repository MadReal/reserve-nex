<script setup lang="ts">
// SEO
const title = 'PixelVision - Contact Us'
const description = 'Get in touch with us to discuss your project or ask any questions. We\'re here to help!'
useSeoMeta({
	title,
	ogTitle: title,
	description,
	ogDescription: description,
});

const message = ref('');

const handleSubmit = async (event: any) => {
	console.log('handleSubmit start');

	event.preventDefault();

	console.log('	event.preventDefault()');

	const myForm = event.target;

	console.log(myForm);

	try {
		await $fetch("/form", {
			method: "POST",
			body: new FormData(myForm),
		})

		message.value = "Message sent"
		console.log("Message sent");


	} catch (error: any) {
		console.error(error);
		// message.value = "Error! Please try again"
		message.value = error
	}


	// fetch("/form", {
	// 	method: "POST",
	// 	body: new FormData(myForm),
	// })
	// 	.then(res => {
	// 		if (res.status) message.value = "Message sent"
	// 		else message.value = "Error! Please try again"
	// 	})
};
</script>


<template lang="pug">
.page--contact
	header.hero.is-medium
		.container.is-max-desktop(data-aos="fade-right", data-aos-duration="1000", data-aos-delay="0")
			.hero-body
				h1.title.is-1#break-line {{ $t('contact.header.title') }}
					NuxtImg.emoji(src="/illustrations/hand-emoji.png" alt="hand-emoji", title="hand-emoji", loading="eager")

	section.section
		.container.is-max-desktop
			h2.title.is-4 {{ $t('contact.form.checkbox') }}

			form.form.mb-6(name="contact", method="post", data-netlify="true", data-netlify-honeypot="bot-field", @submit.prevent="handleSubmit")
				<input type="hidden" name="form-name" value="contact"/>
				<p hidden>
					<label>Don’t fill this out: <input name="bot-field" /></label>
				</p>
				// CHECKBOX SELECTION
				.field
					.checkboxes.clearfix
						.checkbox
							label
								input(type='checkbox', name="website")
								span Website
						.checkbox
							label
								input(type='checkbox', name="app")
								span App
						.checkbox
							label
								input(type='checkbox', name="logo")
								span Logo
						.checkbox
							label
								input(type='checkbox', name="creative-work")
								span Creative Work
						.checkbox
							label
								input(type='checkbox', name="photo-video")
								span Photo & Video
					.checkboxes.clearfix
						.checkbox
							label
								input(type='checkbox', name="ads")
								span Advertisement
						.checkbox
							label
								input(type='checkbox', name="social-media-management")
								span Social Media Management

				.field.mt-6
					.columns
						.column.is-half
							.field
								label.label.label--normal(for="name") {{ $t('contact.form.name_label') }}
								input.input(type="text", id="name", name="name", :placeholder="$t('contact.form.name_placeholder') || 'Your Name'", autocomplete="name", required)

						.column.is-half
							.field
								label.label.label--normal(for="email") Email
								input.input(type="email", id="email", name="email", :placeholder="$t('contact.form.email_placeholder') || 'Your Email'", autocomplete="email", required)


				.field.mt-6
					label.label.label--normal(for="textarea") {{ $t('contact.form.details_label') }}
					.control
						textarea.textarea(id="textarea", name="textarea", :placeholder="$t('contact.form.details_placeholder') || 'Tell us about your project'", autocomplete="off")

				.field
					.control
						button.button.form__button(type="submit") {{ $t('contact.form.button') }}

				.field
					.control
						p {{ message }}
</template>


<style lang="sass" scoped>
@import "../node_modules/bulma/sass/utilities/mixins.sass"
@import @/assets/css/variables
@import @/assets/css/mixins


.hero 
	display: block

	@include mobile
		.title.is-1
			font-size: 3.6rem		

	@include tablet
		#break-line
			width: 65%

	.emoji
		margin-left: 0.3rem
		transform: scale(0.75)
		margin-bottom: -1rem
		margin-top: -1rem

.title.is-4
	color: $grey-darker
	font-weight: 300

.form
	input, textarea
		box-shadow: none
		border: 0
		border-bottom: 1px solid $grey-darker	
	
	.label.label--normal
		font-weight: 300
		font-size: 1rem


.checkbox
	margin: 0 0.8rem 0.8rem 0
	background-color: transparent
	border: 2px solid $black
	overflow: hidden
	float: left
	color: $black

	label
		float: left
		line-height: 3.0em
		height: 3.0em

		span
			display: block
			text-align: center
			padding: 3px 1rem
			font-weight: 400
			transition: background-color $transition-normal
			cursor: pointer

			&:hover
				background-color: rgba($black, 0.1)

		input
			position: absolute
			display: none
			color: #fff !important
			& + span
				color: $black

	input
		&:checked
			& + span
				color: $white
				background-color: $black

.button.form__button
	margin-top: 1rem
	background-color: $color-primary
	color: $white

	&:hover
		+hover-darken($color-primary)

.clearfix:after
	visibility: hidden
	display: block
	font-size: 0
	content: ""
	clear: both
	height: 0
</style>