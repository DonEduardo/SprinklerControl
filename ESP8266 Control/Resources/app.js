/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 *
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *
 */
var hostName = "localhost";
var titleText = "SPRINKLER CONTROL";

if (Ti.App.Properties.hasProperty('hostName'))
	hostName = Ti.App.Properties.getString('hostName');
Ti.API.info('The value of the hostName property is: ' + Ti.App.Properties.getString('hostName'));

if (Ti.App.Properties.hasProperty('titleText'))
	titleText = Ti.App.Properties.getString('titleText');
Ti.API.info('The value of the titleText property is: ' + Ti.App.Properties.getString('titleText'));

//bootstrap and check dependencies

if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with multiple windows in a stack
(function() {
	//render appropriate components based on the platform and form factor
	var osname = Ti.Platform.osname,
	    version = Ti.Platform.version,
	    height = Ti.Platform.displayCaps.platformHeight,
	    width = Ti.Platform.displayCaps.platformWidth;

	//considering tablets to have width over 720px and height over 600px - you can define your own
	function checkTablet() {
		var platform = Ti.Platform.osname;

		switch (platform) {
		case 'ipad':
			return true;
		case 'android':
			var psc = Ti.Platform.Android.physicalSizeCategory;
			var tiAndroid = Ti.Platform.Android;
			return psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_LARGE || psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_XLARGE;
		default:
			return Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) >= 400;
		}
	}

	// countdown timer
	var clockTicker = Titanium.UI.createLabel({
		text : "15 : 00",
		height : 65,
		width : 320,
		top : 160,
		left : 0,
		color : '#fff',
		borderRadius : 10,
		backgroundColor : '#000',
		font : {
			fontSize : 60,
			fontWeight : 'bold'
		},
		textAlign : 'center'
	});

	var countDown = function(m, s, fn_tick, fn_end) {
		return {
			total_sec : m * 60 + s,
			timer : this.timer,
			set : function(m, s) {
				this.total_sec = parseInt(m) * 60 + parseInt(s);
				this.time = {
					m : m,
					s : s
				};
				return this;
			},
			start : function() {
				var self = this;
				this.timer = setInterval(function() {
					if (self.total_sec) {
						self.total_sec--;
						self.time = {
							m : parseInt(self.total_sec / 60),
							s : (self.total_sec % 60)
						};
						fn_tick();
					} else {
						self.stop();
						fn_end();
					}
				}, 1000);
				return this;
			},
			stop : function() {
				clearInterval(this.timer);
				this.time = {
					m : 0,
					s : 0
				};
				this.total_sec = 0;
				return this;
			}
		};
	};

	var my_timer = new countDown(15, 00, function() {
		clockTicker.text = my_timer.time.m + " : " + my_timer.time.s;
	}, function() {
		writeToSocket("CH0OFF\n");
		my_timer.stop();
		clockTicker.text = timerMinutes.value + " : 00";

		alert("The time is up!");
	});

	var isTablet = checkTablet();
	console.log(isTablet);
	console.log(osname);
	//	if (osname == 'android')
	//	hostName = "10.0.2.2";

	// doing this early so the field is ready as soon as we get data
	var clientStatusArea = Ti.UI.createTextArea({
		editable : false,
		value : 'Status Area',
		height : 100,
		width : "100%",
		top : 350,
		textAlign : 'left',
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
		backgroundColor : '#FFF',
		color : '#000',
		suppressReturn : false
	});
	var socket = Ti.Network.Socket.createTCP({
		host : hostName,
		port : 8080,
		connected : function(e) {
			Ti.API.info('Socket opened!');
			Ti.Stream.pump(e.socket, readCallback, 1024, true);
			Ti.Stream.write(socket, Ti.createBuffer({
				//value: 'GET http://google.com/index.html HTTP/1.1\r\n\r\n'
				value : 'HELLO From App\n\r\n'
			}), writeCallback);
		},
		error : function(e) {
			Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
		},
	});
	socket.connect();

	function writeToSocket(msg) {
		Ti.Stream.write(socket, Ti.createBuffer({
			//  value: 'GET http://google.com/index.html HTTP/1.1\r\n\r\n'
			value : msg
		}), writeCallback);
	}

	function writeCallback(e) {
		Ti.API.info('Successfully wrote to socket.');
	}

	var readCallback = function(e) {
		if (e.bytesProcessed == -1) {
			// Error / EOF on socket. Do any cleanup here.
			Ti.API.info('Some error occured');
		}
		try {
			if (e.buffer) {
				var received = e.buffer.toString();
				clientStatusArea.value = received;
				Ti.API.info('Received: ' + received);
			} else {
				Ti.API.error('Error: read callback called with no buffer!');
			}
		} catch (ex) {
			Ti.API.error(ex);
		}
	};

	// Create a Button.
	var turnON = Ti.UI.createButton({
		title : 'Turn ON',
		height : 50,
		width : 100,
		top : 100,
		left : 5,
		color : 'white',
		backgroundImage : 'btn_green_matte.9.png'
	});

	// Listen for click events.
	turnON.addEventListener('click', function() {
		//alert('\'turnON\' was clicked!');
		writeToSocket("CH0ON\n");
		my_timer.set(timerMinutes.value, 0);
		my_timer.start();
	});

	// Create a Button.
	var turnOFF = Ti.UI.createButton({
		title : 'Turn OFF',
		height : 50,
		width : 100,
		top : 100,
		right : 5,
		color : 'white',
		backgroundImage : 'btn_red_matte.9.png'
	});

	// Listen for click events.
	turnOFF.addEventListener('click', function() {
		//alert('\'turnOFF\' was clicked!');
		writeToSocket("CH0OFF\n");
		my_timer.stop();
		clockTicker.text = timerMinutes.value + " : 00";
	});
	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	} else {
		// Android uses platform-specific properties to create windows.
		// All other platforms follow a similar UI pattern.
		if (osname === 'android') {
			Window = require('ui/handheld/android/ApplicationWindow');
		} else {
			Window = require('ui/handheld/ApplicationWindow');
		}
	}

	var win1 = new Window();

	//Create your scrollView
	var scrollView1 = Ti.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : true
	});

	//Create a View
	var view1 = Ti.UI.createView({
		left : 0,
		right : 0,
		height : 'auto',
		top : 0
	});

	//Instantiate
	scrollView1.add(view1);
	win1.add(scrollView1);

	// Add to the parent view.
	view1.add(turnON);
	view1.add(turnOFF);
	view1.backgroundColor = 'black';

	// Create a Label.
	var titleLabel = Ti.UI.createLabel({
		text : titleText,
		color : 'white',
		backgroundColor : '#74AB42',
		font : {
			fontSize : 18
		},
		height : '30',
		width : '100%',
		top : 20,
		left : 0,
		textAlign : 'center'
	});

	titleLabel.addEventListener('click', function(e) {
		dialog.show();
	});

	// Add to the parent view.
	view1.add(titleLabel);

	// Create a Label.
	var timerLabel = Ti.UI.createLabel({
		text : '  Auto Turn OFF (in minutes):',
		color : 'black',
		backgroundColor : '#FFCB76',
		font : {
			fontSize : 18
		},
		height : 40,
		width : '100%',
		top : 55,
		left : 0,
		textAlign : 'left',

	});

	// Add to the parent view.
	view1.add(timerLabel);

	var hostLabel = Ti.UI.createLabel({
		text : '  Host IP Address (port 8080)',
		color : 'black',
		backgroundColor : '#FFCB76',
		font : {
			fontSize : 18
		},
		height : 40,
		width : '100%',
		top : 250,
		left : 0,
		textAlign : 'left',

	});

	// Add to the parent view.
	view1.add(hostLabel);

	// Create a TextField.
	var timerMinutes = Ti.UI.createTextField({
		height : 40,
		top : 55,
		right : 5,
		width : 60,
		value : 15,
		color : 'Black',
		//softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_DEFAULT_ON_FOCUS, // Android only

		keyboardType : Titanium.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	// Listen for return events.
	timerMinutes.addEventListener('return', function(e) {
		timerMinutes.blur();
		clockTicker.text = timerMinutes.value + " : 00";
	});

	var textFocusFirstTime = true;

	timerMinutes.addEventListener('focus', function(e) {
		if (textFocusFirstTime) {
			timerMinutes.blur();
			textFocusFirstTime = false;
		}
	});

	// Add to the parent view.
	view1.add(timerMinutes);
	var hostIP = Ti.UI.createTextField({
		height : 40,
		top : 300,
		//right : 5,
		//left: 10,
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,

		width : '100%',
		value : hostName,
		keyboardType : Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	//	if (osname == "android")
	//	hostIP.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_DEFAULT_ON_FOCUS;
	// Android only

	// Listen for return events.
	hostIP.addEventListener('return', function(e) {
		hostIP.blur();
		//socket.close();
		hostName = hostIP.value;
		Ti.App.Properties.setString('hostName', hostName);

		socket = Ti.Network.Socket.createTCP({
			host : hostName,
			port : 8080,
			connected : function(e) {
				Ti.API.info('Socket opened!');
				Ti.Stream.pump(e.socket, readCallback, 1024, true);
				Ti.Stream.write(socket, Ti.createBuffer({
					//value: 'GET http://google.com/index.html HTTP/1.1\r\n\r\n'
					value : 'HELLO From App\n\r\n'
				}), writeCallback);
			},
			error : function(e) {
				Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
			},
		});
		socket.connect();

		alert('Input was: ' + hostIP.value);
	});

	var dialog;

	if (osname == 'android') {
		var titleName = Ti.UI.createTextField();

		dialog = Ti.UI.createAlertDialog({
			title : 'Enter Title for App',
			androidView : titleName,
			buttonNames : ['OK', 'cancel']
		});
		dialog.addEventListener('click', function(e) {
			Ti.API.info(titleName.value);
			titleText = titleName.value;
			Ti.App.Properties.setString('titleText', titleName.value);
			titleLabel.text = titleText;
		});

		//dialog.show();
	} else {
		dialog = Ti.UI.createAlertDialog({
			title : 'Enter text',
			style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames : ['OK', 'cancel']
		});
		dialog.addEventListener('click', function(e) {
			Ti.API.info('e.text: ' + e.text);
			titleText = e.text;
			Ti.App.Properties.setString('titleText', titleText);
			titleLabel.text = titleText;

		});
		//dialog.show();
	}
	// Add to the parent view.
	view1.add(hostIP);

	view1.add(clientStatusArea);
	view1.add(clockTicker);
	win1.open();

})();

