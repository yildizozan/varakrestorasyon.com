/*
 * SimpleModal Login
 * Theme: education
 */
jQuery(function ($) {
	var SimpleModalLogin = {
		init: function () {
			var s = this;
			s.error = [];

			$('.simplemodal-login, .simplemodal-register, .simplemodal-forgotpw').live('click.simplemodal-login', function (e){
				s.login = $('#loginform'),
					s.lostpw = $('#lostpasswordform'),
					s.register = $('#registerform');

				if ($(this).hasClass('simplemodal-login')) {
					s.form = '#loginform';
					s.login.show(); s.lostpw.hide(); s.register.hide();
				}
				else if ($(this).hasClass('simplemodal-register')) {
					s.form = '#registerform';
					s.register.show(); s.login.hide(); s.lostpw.hide();
				}
				else {
					s.form = '#lostpasswordform';
					s.lostpw.show(); s.login.hide(); s.register.hide();
				}
				s.url = this.href;

				if (!$('#simplemodal-login-container-education').length) {
					$('#simplemodal-login-form').modal({
						overlayId: 'simplemodal-login-overlay-education',
						containerId: 'simplemodal-login-container-education',
						closeHTML: '<div class="close"><a href="#" class="simplemodal-close"><img src="'+SimpleModalLoginL10n.NBT_SL_URL+'icon-cancel-5.png"></a></div>',
						opacity:68,
						fixed: true,
						onShow: SimpleModalLogin.show,
						position: ['50px', null],
                        close: true ,
                        overlayClose: true,
						zIndex:10000,
					});

				}
				else {
					SimpleModalLogin.show();
				}

                $('#simplemodal-login-container-education').css({
                    'top': '50px',
					'width' : '458px'
                });

				return false;
			});

			if (SimpleModalLoginL10n['shortcut'] === "true") {
				$(document).bind('keydown.simplemodal-login', SimpleModalLogin.keydown);
			}


		},
		show: function (obj) {
			var s = SimpleModalLogin;
			s.dialog = obj || s.dialog;
			s.modal = s.modal || this;
            var form = $(s.form, s.dialog.data[0]),
                fields = $('.simplemodal-login-fields', form[0]),
                ffooter = $('.simplemodal__footer',form[0]),
				activity = $('.simplemodal-login-activity', form[0]);

			// update and focus dialog
			s.dialog.container.css({height:'auto'});

			// remove any existing errors or messages
			s.clear(s.dialog.container[0]);

			form.unbind('submit.simplemodal-login').bind('submit.simplemodal-login', function (e) {
				e.preventDefault();
                $('p.has-errors', form[0]).remove();
				// remove any existing errors or messages
				s.clear(s.dialog.container[0]);

				if (s.isValid(form)) {
					fields.hide(); ffooter.hide(); activity.show();

					if (s.url && s.url.indexOf('redirect_to') !== -1) {
						var p = s.url.split('=');
						form.append($('<input type="hidden" name="redirect_to">').val(unescape(p[1])));
					}


					if (s.form !== '#registerform'){
                        $.ajax({
                            url: form[0].action,
                            data: form.serialize(),
                            type: 'POST',
                            cache: false,
                            success: function (resp) {
                                var data = $(document.createElement('div')).html(resp),
                                    redirect = $('#simplemodal-login-redirect', data[0]);

                                if (redirect.length) {
                                    var href = location.href;
                                    if (redirect.html().length) {
                                        href = redirect.html();
                                    }
                                    window.location = href;
                                }
                                else {
                                    var error = $('#login_error', data[0]),
                                        message = $('.message', data[0]),
                                        loginform = $(s.form, data[0]);

                                    if (error.length) {
                                        error.addClass('alert alert-danger');
                                        error.find('a').addClass('simplemodal-forgotpw');
                                        $('p:first', form[0]).before(error);
                                        activity.hide(); fields.show();
                                    }
                                    else if (message.length) {
                                        if (s.form === '#lostpasswordform' || s.form === '#registerform') {
                                            form = s.login;
                                            s.lostpw.hide(); s.register.hide();
                                            s.login.show();
                                        }
                                        $('p:first', form[0]).before(message);
                                        activity.hide(); fields.show();
                                    }
                                    else if (loginform.length) {
                                        s.showError(form, ['empty_all']);
                                        activity.hide(); fields.show();
                                    }
                                }
                            },
                            error: function (xhr) {

                                $('p:first', form[0]).before(
                                    $(document.createElement('div'))
                                        .html('<strong>ERROR</strong>: ' + xhr.statusText)
                                        .attr('id', 'login_error')
                                        .attr('class', 'alert alert-danger')
                                );
                                activity.hide(); fields.show();
                            }
                        });
					}else {

                        var ajaxRegister = SimpleModalLoginL10n.ajax_register;

                        var urlPath = SimpleModalLoginL10n.root_path;
                        // var pluginDir = SimpleModalLoginL10n.plugin_dir;
                        var data = form.serialize() + "&url=" + urlPath;

                        $.ajax({
                            url: ajaxRegister,
                            data: data,
                            type: 'POST',
							dataType:'json',
                            cache: false,
                            success: function (resp) {

                            	if (resp.success == 'true') {
                                    form = s.login;
                                    s.lostpw.hide(); s.register.hide();
                                    s.login.show();
                                    var message = 'you have already registered an account . Please login to continue !';
                                    $('p:first', form[0]).before($(document.createElement('p')).html(message).attr('class','success-register alert alert-success'));
                                    activity.hide(); fields.show();
                                }else {
                                    var message = resp.message.errors;
                                    $('p.has-errors', form[0]).remove();
									for (var key in message) {

                                        if (message.hasOwnProperty(key)) {
                                            $('p:first', form[0]).before(
                                                $(document.createElement('p'))
                                                    .html(message[key])
                                                    .attr('class', 'has-errors alert alert-danger')
                                            );
                                        }

                                    }

                                    activity.hide(); fields.show();
                                }


                            },
                            error: function (xhr) {

                                $('p:first', form[0]).before(
                                    $(document.createElement('div'))
                                        .html('<strong>ERROR</strong>: ' + xhr.statusText)
                                        .attr('id', 'login_error')
                                        .attr('class', 'alert alert-danger')
                                );
                            }
                        });


                    }

				}
				else {
					s.showError(form, s.error);
				}
			});
		},
		/* utility functions */
		clear: function (context) {
			$('#login_error, .message', context).remove();
		},
		isValid: function (form) {
			var log = $('.user_login', form[0]),
				pass = $('.user_pass', form[0]),
				email = $('.user_email', form[0]),
				fields = $(':text, :password', form[0]),
				valid = true;

			SimpleModalLogin.error = [];

			if (log.length && !$.trim(log.val())) {
				SimpleModalLogin.error.push('empty_username');
				valid = false;
			}
			else if (pass.length && !$.trim(pass.val())) {
				SimpleModalLogin.error.push('empty_password');
				valid = false;
			}
			else if (email.length && !$.trim(email.val())) {
				SimpleModalLogin.error.push('empty_email');
				valid = false;
			}

			var empty_count = 0;
			fields.each(function () {
				if (!$.trim(this.value)) {
					empty_count++;
				}
			});
			if (fields.length > 1 && empty_count === fields.length) {
				SimpleModalLogin.error = ['empty_all'];
				valid = false;
			}

			return valid;
		},
		keydown: function (e) {
			if (e.altKey && e.ctrlKey && e.keyCode === 76) {
				if (SimpleModalLoginL10n['logged_in'] === "true") {
					window.location = SimpleModalLoginL10n['admin_url'];
				}
				else {
					$('.simplemodal-login').trigger('click.simplemodal-login');
				}
			}
		},
		message: function (key) {
			return SimpleModalLoginL10n[key] ?
				SimpleModalLoginL10n[key].replace(/&gt;/g, '>').replace(/&lt;/g, '<') :
				key;
		},
		showError: function (form, keys) {
			keys = $.map(keys, function (key) {
				return SimpleModalLogin.message(key);
			});
			$('p:first', form[0])
				.before($('<div id="login_error" class="alert alert-danger"></div>').html(
					keys.join('<br/>')
				));
		}
	};

	SimpleModalLogin.init();

});