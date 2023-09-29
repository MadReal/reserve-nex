const htmlContent = (body: any) => /* HTML */`
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
	<meta charset="utf-8"> <!-- utf-8 works for most cases -->
	<meta name="viewport" content="width=device-width">
	<!-- Forcing initial-scale shouldn't be necessary -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<!-- Use the latest (edge) version of IE rendering engine -->
	<meta name="x-apple-disable-message-reformatting">
	<!-- Disable auto-scale in iOS 10 Mail entirely -->
	<title></title>
	<!-- The title tag shows in email notifications, like Android 4.4. -->
	<link href="https://fonts.googleapis.com/css?family=Poppins:400,400i,700" rel="stylesheet">
	<!-- CSS Reset : BEGIN -->
	<style>
		html,
		body {
			margin: 0 auto !important;
			padding: 0 !important;
			height: 100% !important;
			width: 100% !important;
			background: #f1f1f1;
		}

		/* What it does: Stops email clients resizing small text. */
		* {
			-ms-text-size-adjust: 100%;
			-webkit-text-size-adjust: 100%;
		}

		/* What it does: Centers email on Android 4.4 */
		div[style*="margin: 16px 0"] {
			margin: 0 !important;
		}

		/* What it does: Stops Outlook from adding extra spacing to tables. */
		table,
		td {
			mso-table-lspace: 0pt !important;
			mso-table-rspace: 0pt !important;
		}

		/* What it does: Fixes webkit padding issue. */
		table {
			border-spacing: 0 !important;
			border-collapse: collapse !important;
			table-layout: fixed !important;
			margin: 0 auto !important;
		}

		/* What it does: Uses a better rendering method when resizing images in IE. */
		img {
			-ms-interpolation-mode: bicubic;
		}

		/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
		a {
			text-decoration: none;
		}

		/* What it does: A work-around for email clients meddling in triggered links. */
		*[x-apple-data-detectors],
		/* iOS */
		.unstyle-auto-detected-links *,
		.aBn {
			border-bottom: 0 !important;
			cursor: default !important;
			color: inherit !important;
			text-decoration: none !important;
			font-size: inherit !important;
			font-family: inherit !important;
			font-weight: inherit !important;
			line-height: inherit !important;
		}

		/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
		.a6S {
			display: none !important;
			opacity: 0.01 !important;
		}

		/* What it does: Prevents Gmail from changing the text color in conversation threads. */
		.im {
			color: inherit !important;
		}

		/* If the above doesn't work, add a .g-img class to any image in question. */
		img.g-img+div {
			display: none !important;
		}

		/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
		/* Create one of these media queries for each additional viewport size you'd like to fix */

		/* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
		@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
			u~div .email-container {
				min-width: 320px !important;
			}
		}

		/* iPhone 6, 6S, 7, 8, and X */
		@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
			u~div .email-container {
				min-width: 375px !important;
			}
		}

		/* iPhone 6+, 7+, and 8+ */
		@media only screen and (min-device-width: 414px) {
			u~div .email-container {
				min-width: 414px !important;
			}
		}
	</style>
	<!-- CSS Reset : END -->

	<!-- Progressive Enhancements : BEGIN -->
	<style>
		.primary {
			background: #7F90FC;
		}

		.bg_white {
			background: #fafafa;
		}

		.bg_light {
			background: #f1f1f1;
		}

		.bg_black {
			background: #000000;
		}

		.bg_dark {
			background: rgba(0, 0, 0, .8);
		}

		.email-section {
			padding: 2.5em 2em;
		}

		.text_primary {
			color: #7F90FC;
		}

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			font-family: 'Poppins', serif;
			color: #000000;
			margin-top: 0;
		}

		body {
			font-family: 'Poppins', serif;
			font-weight: 400;
			font-size: 15px;
			line-height: 1.8;
			color: rgba(0, 0, 0, .4);
		}

		a {
			color: #7F90FC;
		}

		.italic {
			font-style: italic;
		}

		.footer {
			color: rgba(255, 255, 255, .5);
			font-size: 14px;
		}

		/*LOGO*/
		.logo h1 {
			margin: 0;
		}

		.logo h1 a {
			color: #000;
			font-size: 18px;
			font-weight: 700;
		}

		/*HERO*/
		.hero {
			position: relative;
			background-position: center;
		}

		.hero .text {
			color: rgba(255, 255, 255, .8);
		}

		.hero .text h2 {
			color: #ffffff;
			font-size: 30px;
			margin-bottom: 0;
		}

		/*HEADING SECTION*/
		.heading-section h2 {
			color: #000000;
			font-size: 28px;
			margin-top: 0;
			line-height: 1.4;
		}

		.heading-section .subheading {
			margin-bottom: 20px !important;
			display: inline-block;
			font-size: 13px;
			text-transform: uppercase;
			letter-spacing: 2px;
			color: rgba(0, 0, 0, .4);
			position: relative;
		}

		.heading-section .subheading::after {
			position: absolute;
			left: 0;
			right: 0;
			bottom: -10px;
			content: '';
			width: 100%;
			height: 2px;
			background: #7F90FC;
			margin: 0 auto;
		}
	</style>
</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly;">
	<center style="width: 100%; background-color: #f1f1f1;">
		<div
			style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
			&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
		</div>
		<div style="max-width: 600px; margin: 0 auto;" class="email-container">
			<!-- BEGIN BODY -->
			<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
				style="margin: auto;">
				<tr>
					<td class="bg_light logo" style="padding: 0.5em 2.5em; text-align: center">
						<h1><a href="https://restaurant-reservation-ashy.vercel.app/">${body.restaurant.name
	}</a></h1>
					</td>
				</tr>
				<!-- end tr -->

				<tr>
					<td valign="middle" class="hero"
						style="background-image: url(https://www.investireoggi.it/news/wp-content/uploads/sites/12/2021/11/Nuovi-ristoranti-dItalia-ecco-la-top-ten-secondo-gli-esperti-di-The-Fork.jpeg); background-size: cover; height: 140px;">
					</td>
				</tr>
				<!-- end tr -->

				<tr>
					<td class="bg_white">
						<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
							<tr>
								<td class="bg_white email-section" style="text-align:center;">
									<div class="heading-section">
										<span class="subheading">Reservation</span>
										<h2>Confirmed</h2>
										<p>Dear ${body.personName},<br>
											We are pleased to confirm your reservation for the day <strong>${body.date
	}</strong> at
											<strong>${body.time}</strong>
											for ${body.peopleAmount}
											person${body.peopleAmount > 1 ? "s" : ""}.
										</p>
										<p>Reservation ID: #${body.reservationId}
											${body.discountAmount
		? `<br><span style="color: #F06A6A;">Discount:
												${body.discountAmount}%</span>`
		: ""
	}</p>
										<p>Please let us know any food intolerances or allergies, in order to inform the chef.</p>
										<p class="italic text_primary">Your table will be reserved for 1 hour and 30min.</p>
									</div>
								</td>
							</tr>
							<!-- end: tr -->
						</table>

						<!-- footer -->
						<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
							style="margin: auto">
							<tr>
								<td valign="middle" class="bg_black footer email-section">
									<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
										style="margin: auto">
										<tr>
											<td width="100%" style="text-align: center">
												<p style="font-size: 14px; margin-top: 0; margin-bottom: 0">
													${body.restaurant.name}
													<br />
													${body.restaurant.address}, ${body.restaurant.city}
													${body.restaurant.zipCode}
												</p>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<!-- end: Footer -->

					</td>
				</tr>
				<!-- end:tr -->
		</div>
	</center>
</body>

</html>
`;

export default htmlContent;
