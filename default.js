$(function () {

	$('body').on('submit', '#staff_login_form', function (event) {
		event.preventDefault();
		var emp_id = $("#employee_id").val();
		var data = $(this).serialize();
		var action = "manage_staff/staffLogins";
		$.ajax({
			type: 'POST',
			url: action,
			data: data,
			dataType: 'html',
			success: function (data) {
				// console.log(data);
				$('#login_div').empty();
				$('#login_div').append(data);
				
			},
		});
	});

	$('body').on('submit', '#Adjustments_form', function (event) {
		event.preventDefault();
		var emp_id = $("#employee_id").val();
		var data = $(this).serialize();
		var action = "manage_staff/staffAdjustments";
		$.ajax({
			type: 'POST',
			url: action,
			data: data,
			dataType: 'html',
			success: function (data) {
				// console.log(data);
				$('#adjustments_div').empty();
				$('#adjustments_div').append(data);
			},
		});
	});


	$('body').on('submit', '#time_off', function (event) {
		event.preventDefault();
		var emp_id = $("#employee_id").val();
		var data = $(this).serialize();
		var action = "manage_staff/staffTimeoff";
		$.ajax({
			type: 'POST',
			url: action,
			data: data,
			dataType: 'html',
			success: function (data) {
				// console.log(data);
				$('#time_off_div').empty();
				$('#time_off_div').append(data);
				$('[data-leave-type="sick leave"]').each(function() {
					var leaveTypeColor = $(this).attr('data-leave-type-color');
					$(this).css('background-color', leaveTypeColor);
				});
			},
		});
	});

	$('body').on('submit', '#staff_lateness_form', function (event) {
		event.preventDefault();
		var emp_id = $("#employee_id").val();
		var data = $(this).serialize();
		var action = "manage_staff/staffLateLogin";
		$.ajax({
			type: 'POST',
			url: action,
			data: data,
			dataType: 'html',
			success: function (data) {
				// console.log(data);
				$('#staff_late_div').empty();
				$('#staff_late_div').append(data);
			},
		});
	});

	$('body').on('submit', '#addAllowancesForm', function (event) {
		event.preventDefault();
		// var form_data = new FormData($('#addAllowancesForm')[0]);
		// 	// form_data.append('employee_id', emp_id);
		// 	console.log(form_data)
		var emp_id = $("#employee_id").val();
		var form_data = $(this).serialize();
		var action = "addLeaves/updateLeaves";
		$.ajax({
			type: 'POST',
			url: action,
			data: form_data,
			async: false,
			cache: false,
			dataType: 'json',
			success: function (data) {
				// console.log(data);
				var action = "manage_staff/getstaffAbsenceAllowances";
				$.ajax({
					type: 'GET',
					url: action,
					data: {
						'employee_id': emp_id,
						'_token': $('input[name=_token]').val()
					},
					dataType: 'html',
					success: function (data) {
						// event.stopPropagation();
						// console.log(data);
						$('#allownaces_div').empty();
						$('#allownaces_div').append(data);
					},
				});
			},
		});
	});


	$('body').on('submit', '#addNoteForm', function (event) {
		event.preventDefault();
		var penality_id = $("#penality_id").val();
		var notes = $('#notes_id').val();
		var action = $('#addNoteForm').attr('action');
		$.ajax({
			type: 'POST',
			url: action,
			data: {
				'id': penality_id,
				'_token': $('input[name=_token]').val(),
				'notes': notes
			},
			dataType: 'json',
			success: function (data) {
				if (data.code == 200) {
					var action = data.data.url;
					$.ajax({
						type: 'GET',
						url: action,
						dataType: 'html',
						success: function (data) {
							$('#penalityDetailPopup').empty();
							$('#penalityDetailPopup').append(data);

						},
					});
					$.toast({
						heading: 'Success',
						text: 'Successfully Contested',
						position: 'top-right',
						stack: false,
						showHideTransition: 'fade',
						icon: 'success',
						hideAfter: 5000
					});
					// window.setTimeout(function() {
					// 	redirectUrl = redirectUrl.replace(/&amp;/g, '&');
					// 	window.location.href = redirectUrl;
					// }, 1000);

				} else if (data.code == 422) {
					$.toast({
						heading: data.message,
						text: getErrorHtml(data.errors),
						position: 'top-right',
						stack: false,
						showHideTransition: 'fade',
						icon: 'error',
						hideAfter: 10000,
					});


					if (data.errors) {

						let keys = Object.keys(data.errors);

						keys.forEach(key => {
							var inputElement = $(`${formId} input[name="${key}"]`);
							inputElement.addClass('is-invalid');

							var classElement = $(`.${key}`);
							classElement.addClass('is-invalid');

							let errors = data.errors[key];

							let errorString = errors.join(" ");

							inputElement.after(
								`<label class="custom-error-p error invalid-feedback">${errorString}</label>`
							);
							classElement.append(
								`<strong class="custom-error-p  text-danger">${errorString}</strong>`
							);
						});
					}


				} else {
					$.toast({
						heading: 'Error',
						text: data.message,
						position: 'top-right',
						stack: false,
						showHideTransition: 'fade',
						icon: 'error',
						hideAfter: message_show_time
					});
				}

			},
		});
	});

	$('body').on('submit', '#penalityDetail', function (event) {
		event.preventDefault();
		$('#penalityDetailPopup').addClass('open');
		$('body').addClass('o-hidden');
		var form_data = $(this).serializeArray();
		dataObj = {};
		$(form_data).each(function (i, field) {
			dataObj[field.name] = field.value;
		});

		var penality_id = dataObj['penality_id'];
		console.log(penality_id);
		var action = $(this).attr('action');
		console.log(action)
		$.ajax({
			type: 'GET',
			url: action,
			dataType: 'html',
			async: false,
			cache: false,
			success: function (data) {
				$('#penalityDetailPopup').empty();
				$('#penalityDetailPopup').append(data);

			},
		});

		scrollToBottom();

	})


	// $('body').on('submit', '#leaveTypeDetail', function (event) {
	// 	event.preventDefault();
	// 	$('#leaveAuthorisationPopup').addClass('open');
	// 	$('body').addClass('o-hidden');
	// 	var action = $('#leaveTypeDetail').attr('action');
	// 	console.log(action)
	// 	$.ajax({
	// 		type: 'GET',
	// 		url: action,
	// 		dataType: 'html',
	// 		async: false,
	// 		cache: false,
	// 		success: function (data) {
	// 			$('#leaveAuthorisationPopup').empty();
	// 			$('#leaveAuthorisationPopup').append(data);

	// 		},
	// 	});

	// });

	// $('[data-leave-type="sick leave"]').each(function() {
	// 	var leaveTypeColor = $(this).attr('data-leave-type-color');
	// 	$(this).css('background-color', leaveTypeColor);
	// })


});