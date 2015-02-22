var TimeCalculator = function(){
	this.currTime = null;
	this.tempTime = null;

	this.init = function() {
		this.currTime = new Date();
		return;

	};

	this.getTodayTimeStamp = function(){
		console.log(this.currTime.toISOString());
		return this.currTime.toISOString();
	};

	this.getYesterdayTimeStamp = function(){
		var day = 1;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		epochConversionString = epochConversion.toISOString;

		return epochConversionString;
	};

	this.getPastWeekTimeStamp = function(){
		var day = 7;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		epochConversionString = epochConversion.toISOString;
		return epochConversionString;

	};

	this.getPastMonthTimeStamp = function(){
		var day = 30;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		epochConversionString = epochConversion.toISOString;
		return epochConversionString;
	};

	this.getPastYearTimeStamp = function(){
		var day = 365;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		epochConversionString = epochConversion.toISOString;
		return epochConversionString;
	};

	this.init();





	
};