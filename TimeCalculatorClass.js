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
		var epochConversionString = epochConversion.toISOString();
		var urlCompatibleString = epochConversionString.replace(/:/g, '%3A');
		return urlCompatibleString;
	};

	this.getPastWeekTimeStamp = function(){
		var day = 7;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		var epochConversionString = epochConversion.toISOString();
		var urlCompatibleString = epochConversionString.replace(/:/g, '%3A');
		console.log(urlCompatibleString);
		return urlCompatibleString;

	};

	this.getPastMonthTimeStamp = function(){
		var day = 30;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		var epochConversionString = epochConversion.toISOString();
		var urlCompatibleString = epochConversionString.replace(/:/g, '%3A');
		console.log(urlCompatibleString);
		return urlCompatibleString;
	};

	this.getPastYearTimeStamp = function(){
		var day = 365;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		var epochConversionString = epochConversion.toISOString();
		var urlCompatibleString = epochConversionString.replace(/:/g, '%3A');
		console.log(urlCompatibleString);
		return urlCompatibleString;
	};

	this.getPastDecadeTimeStamp = function(){
		var day = 3650;
		this.tempTime = this.currTime;
		var epochSeconds = this.tempTime.setDate(this.tempTime.getDate() - day);//epoch seconds
		var epochConversion = new Date(epochSeconds);
		var epochConversionString = epochConversion.toISOString();
		var urlCompatibleString = epochConversionString.replace(/:/g, '%3A');
		console.log(urlCompatibleString);
		return urlCompatibleString;
	};


	this.init();





	
};