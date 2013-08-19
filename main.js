/**
 * Создает экземпляр объекта для взаимодействия с формой.
 * @name Questions
 * @param {Number} max Количество вопросов в форме.
 */
function Questions(max) {
/**
*	Определяет текущий открытый таб.
*	@param {Number} i Индекс.
*	@name set 
*/
	this.set = function(i) {
		this.current = i;
	}
/**
*	Показывает требуемый таб, либо закрывает все.
*	@param {Number} i Индекс.
*	@name toggle 
*/	
	this.toggle = function(i) {
		if (this.current == i) {
			this.set(0);
			$('.current').removeClass('current');
		} else {
			this.set(i);
			$('.current').removeClass('current');
			$('.questions li:eq(' + (--i) + ')').toggleClass('current');
		}
		//checkForm();
	}
/**
*	Переходит к следующему табу, если это возможно.
*	@name next 
*/		
	this.next = function() {
		this.current < this.max ? this.toggle(this.current + 1) : void(0);
	}
/**
*	Переходит к следующему табу, если это возможно.
*	@name prev 
*/		
	this.prev = function() {
		this.current > 1 ? this.toggle(this.current - 1) : void(0);
	}
/**
*	Помечает таб, содержащий ошибку.
*	@param {Number} i Индекс.
*	@name error 
*/		
	this.error = function(i) {
		$('.questions li:eq(' + (i - 1) + ')')
			.addClass('error')
			.removeClass('success')
			.find('.answer')
			.children('.errorMessage').text(this.errors[i]);
	//		.after('<div class="errorMessage">' + this.errors[i] + '</div>');
	}
/**
*	Помечает таб с верным заполением.
*	@param {Number} i Индекс.
*	@name success 
*/		
	this.success = function(i) {
		$('.questions li:eq(' + (i - 1) + ')')
			.addClass('success')
			.removeClass('error')
			.find('.errorMessage')
			.remove();
	}
/**
*	Устанавливает процент заполнения анкеты.
*	Если анкета заполнена, разблокирует отправку формы.
*	@param {Number} completed Число правильно заполненных ответов.
*	@name setProgress 
*/			
	this.setProgress = function(completed) {
		this.completed = completed;
		var state = parseInt(completed / this.max * 100);
		$('#current-state').animate({
			'width' : state + '%'
		},"slow");
		if (completed == this.max) {
			$('#submit').removeAttr('disabled');
		} else {
			$('#submit').attr('disabled','disabled');		
		}
	}
/**
*	Выполняет проверку правильности заполнения указанного поля.
*	@param {Number} i Индекс.
*	@name validate 
*/			
	this.validate = function(i) {
		var success = false;
		var answer = $('#q1_' + i).val();
		if (answer) {
			switch (i) {
				case 1 :	/[0-9]{2,4}/.test(answer) ? success = true : this.errors[i] = 'Кажется, вы не указали год рождения.';
							break;
				case 4 :	/[0-9]{2,4}/.test(answer) ? success = true : this.errors[i] = 'Кажется, вы не указали год окончания вуза.';
							break;
				case 13 :	/(http|https)/i.test(answer) ? success = true : this.errors[i] = 'Похоже, вы не приложили никаких ссылок!';
							break;
				case 14 :	/(http|https)/i.test(answer) ? success = true : this.errors[i] = 'Похоже, вы не приложили никаких ссылок!';
							break;
				case 15 :	/(http|https)/i.test(answer) ? success = true : this.errors[i] = 'Похоже, вы не приложили никаких ссылок!';
							break;
				default :	success = true;
							break;
			}
		} else {
			this.errors[i] = 'Так получилось, что в этой анкете ни один вопрос пропустить нельзя.';
		}
		if (success) {
			this.success(i);
			delete this.errors[i];
			return true;
		} else {
			this.error(i);
			return false;
		}		
	}
/**
*	Обновляет прогресс, если поле прошло валидацию.
*	@param {Number} i Индекс.
*	@name checkAnswer 
*/				
	this.checkAnswer = function(i) {
		if (this.validate(i)) {
			this.setProgress($('.success').length);
		} else {
			this.setProgress($('.success').length);
		}
	}
/**
*	Проверяет всю форму.
*	@name checkForm 
*/			
	this.checkForm = function() {
		var success = false;
		var numOfSuccesses = 0;
		for (var i = 1; i <= q.max; i++) {
			if (this.validate(i)) {
				numOfSuccesses++;
			}
		}
		this.setProgress(numOfSuccesses);
		if (progress.finished()) {
			$('#submit').removeAttr('disabled');
			return true;
		} else {
			$('#submit').attr('disabled','disabled');
			return false;
		}	
	}
/**
*	Очищает всю форму.
*	@name resetForm 
*/		
	this.resetForm = function() {
		this.current = 0;
		this.completed = 0;
		this.max = max;
		$('#submit').attr('disabled','disabled');
		$('.questions li').removeClass('error success current');
		this.setProgress(0);
		this.errors = [];
	}
	this.resetForm();
}

$(function(){
	$('html').removeClass('no-js');
	
	if (typeof Handlebars != "undefined") {
		var source   = $("#questions-template").html();
		var template = Handlebars.compile(source);
		var context = {	data: [
		{
			question: "<p>Год рождения.</p>",
			answer: '<input type="text" name="q1_1" id="q1_1">',
		},
		{
			question: "<p>Город, в котором вы живёте.</p>",
		},
		{
			question: "<p>Вуз, факультет, специальность, кафедра.</p>",
		},
		{
			question: "<p>Город, в котором вы живёте.</p>",
		}
		]};
		
		var len = context.data.length;
		context.data[0].control = '<a href="#" title="К следующему вопросу" class="next">></a>';
		context.data[len - 1].control = '<a href="#" title="К предыдущему вопросу" class="back"><</a>';
		
		for (var i = 0; i < len; i++) {
			context.data[i].num = i + 1;
		}
		for (var i = 1; i < len; i++) {
			context.data[i].num = i + 1;
			var name = 'q1_'+(i + 1);
			context.data[i].answer = '<textarea rows="4" cols="80" name="' + name + '" id="' + name + '"></textarea>';
		}
		var html    = template(context);
		$('ul').append(html);
	}
	
	q = new Questions($('.num').length);
	$('#reset').click(function(){
		if (confirm('Очистить форму?')) {
			q.resetForm();
			return true;
		} else {
			return false;
		}
	});
	$('.num').click(function(e){
		q.toggle($(this).text() * 1);
		e.preventDefault();
	});

	$('.next').click(function(){
		q.next();
	});
	$('.back').click(function(){
		q.prev();
	});
	$('.answer input, .answer textarea').blur(function() {
		q.checkAnswer($(this).parents('.current').find('.num').text() * 1);
	});
	$('html').keyup(function(eventObject){
		if ($(':focus').length == 0 && $('.current').length > 0) {
			var currentNum = $('.current .num').text() * 1;
			switch (eventObject.which) {
				case 37 :	q.prev();
							break;
				case 38 :	q.prev();
							break;
				case 39 :	q.next();
							break;
				case 40 :	q.next();
							break;
			}
		}
	});
}); 