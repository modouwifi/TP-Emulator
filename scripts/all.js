var navStack = new Array();

var globeColor = {
		blue: "#0080ff",
		lightGrey: "#ddd",
		grey: "#999"
	}

var globeDuration = 300;

function stateMachine () {
	var data = {
		"internet_connection"	: "connected",
		"download_speed"		: 16,
		"upload_speed"			: 16,
		"download_speed_max"	: 512,
		"upload_speed_max"		: 256,
	};
	var ALPHA = 1;



	setInterval (function(){
		var prev_download_speed = data.download_speed;
		var prev_upload_speed = data.upload_speed;

		data.download_speed = Math.random() * data.download_speed_max / 2;
		if (data.download_speed == NaN) {
			data.download_speed = 0;
		};

		data.upload_speed = Math.random() * data.upload_speed_max/4;
		if (data.upload_speed == NaN) {
			data.upload_speed = 0;
		};

		data.download_speed = ALPHA * data.download_speed + (1.0 - ALPHA) * prev_download_speed;
		data.upload_speed = ALPHA * data.upload_speed + (1.0 - ALPHA) * prev_upload_speed;

	}, 1000);

	return data;
}

var state = stateMachine();

var TPdata = {
	boot:{
		"first_boot" : true,
	},

	launcher: {
		"apps_list": ["networkMonitor", "devices", "time", "networkConfig", "expertMode", "twofactorAuth", "systemUpdate", "gameAccelerater"],
		"apps_name": {
			"networkMonitor"	: "状态",
			"devices"			: "设备列表",
			"time"				: "时钟",
			"networkConfig"		: "网络设置",
			"expertMode"		: "极客模式",
			"twofactorAuth"		: "防蹭网",
			"wirelessNetwork"	: "无线网络",
			"gameAccelerater"	: "游戏模式",
			"systemUpdate"		: "系统升级",
		},
	},

	system : {
		"internet_connection"	: "connected",
		"AP_wifi_connection"	: "connected",
		"internet_mode"			: "dhcp",
		"wifi_switch"			: true,
		"wifi_ssid"				: "modou_12345",
		"wifi_encrypt"			: true,
		"wifi_password"			: "12345678",
		"AP_mode"				: false,
		"AP_wifi_ssid"			: "",
		"AP_wifi_password"		: "",
		"dhcp_ip"				: "192.168.1.1",
		"dhcp_subnet_mask"		: "255.255.255.0",
		"dhcp_gateway"			: "10.0.0.1",
		"pppoe_account"			: "modou_2004",
		"pppoe_password"		: "12345678",
		"internet_mode"			: "dhcp",
		"twofactorAuth_switch"	: false,
		"expertMode_switch"		: false,
		"expertMode_password"	: null,
		"gameAccelerater_switch": false,
		"system_version"		: "0.5.20",	
	},

	apps:{
		networkMonitor: {
			"available"			: true,
		},
		devices: {
			"available"			: true,
		},
		time: {
			"available"			: true,
		},
		networkConfig: {
			"available"			: true,
		},
		expertMode: {
			"available"			: true,
		},
		twofactorAuth: {
			"available" 		: true,
		},
		wirelessNetwork: {
			"available"			: true,
		},
		gameAccelerater: {
			"available"			: true,
			"statue"			: "none",
			"score"				: 18321,
		},
		systemUpdate: {
			"available"			: true,
			"newVersion"		: true,
		}
	},
	wifi_list: ["modou-001", "modou-002", "modou-003", "modou-004", "modou-005", "modou-006", "modou-007", "modou-008"],

	devices: {
		whiteList: [
			{
				"name"	: "Dzs-MacbookPro",
				"ip"	: "10.0.0.2",
			},

			{
				"name"	: "Payohone-s-iPad",
				"ip"	: "10.0.0.3",
			},

			{
				"name"	: "Payohone-s-iPhone",
				"ip"	: "10.0.0.4",
			},

			{
				"name"	: "Amberde-iPad",
				"ip"	: "10.0.0.5",
			}
		],

		blackList: [
			{
				"name"	: "Dzs-MacbookPro",
				"ip"	: "10.0.0.2",
			},

			{
				"name"	: "Payohone-s-iPad",
				"ip"	: "10.0.0.3",
			},

			{
				"name"	: "Payohone-s-iPhone",
				"ip"	: "10.0.0.4",
			},

			{
				"name"	: "Amberde-iPad",
				"ip"	: "10.0.0.5",
			},

			{
				"name"	: "Dzs-MacbookPro",
				"ip"	: "10.0.0.2",
			},

			{
				"name"	: "Payohone-s-iPad",
				"ip"	: "10.0.0.3",
			},

			{
				"name"	: "Payohone-s-iPhone",
				"ip"	: "10.0.0.4",
			},

			{
				"name"	: "Amberde-iPad",
				"ip"	: "10.0.0.5",
			}
		],
	}

}

var TPdataBackup = $.extend(true, {}, TPdata);


$(document).ready(function () {
	FastClick.attach(document.body);
	$.fx.interval = 16;
	var screenHeight = $("#screen").height();
	var viewContainer = $("#screen");
	var launcherPageNum = 0;


	var viewController = {
		guide: function () {;
			var $view = viewLoad(".view-cableCheck", "cable_check");
			var $navbar = control.navbar($view);
			$navbar.button.click(function () {
				setTimeout(function () {
					$view.remove();	
				})
				drillDown("launcher");
			})
			$view.find(".content").click(function() {
				connected();	
			})

			function connected() {
				var $alert = control.alert([
					{
						"text": "拨号上网",
						"click": function () {
							clearTimeout(alert_wifi_timer);
						}
					},

					{
						"text" : "跳过",
						"click" : function() {
							$alert.close();
							control.transitions.fadeOut($("#screen").children(), true);
							drillDown("launcher");
							clearTimeout(alert_wifi_timer);
						}
					}
				])

				$alert.title.text("正在尝试连接网络");
				$(".spin-large").appendTo($alert.content).show().css("top","6px");

				var alert_wifi_timer = setTimeout(function() {
					var $alert_wifi = control.alert()
					$alert_wifi.title.text("网络连接成功").css("margin-top","140px");
					$alert_wifi.content.text("正在开启无线功能").css("margin-top","-10px");

					$(".spin-large").appendTo($alert_wifi.content).show().css("margin-top","-150px");
					setTimeout(function () {
						var $alert_wifi_enabled = control.alert([
							{
								"text" :"无线设置",
								"click":function (){
								}
							},
							{
								"text" :"开始使用",
								"click":function (){
									control.transitions.fadeOut($("#screen").children(), true);
									drillDown("launcher");
								}
							}
						]);

						TPdata.system.wifi_ssid = "modou-" + Math.round(Math.random() * 10000);
						TPdata.system.wifi_password = Math.round(Math.random() * 100000000);
						TPdata.system.wifi_encrypt = true;

						$alert_wifi_enabled.title.text("无线网络已开启");
						$(".boot-wifi-enable-alert").appendTo($alert_wifi_enabled.content).show();
						$(".boot-wifi-enable-alert").find(".ssid").text(TPdata.system.wifi_ssid);
						$(".boot-wifi-enable-alert").find(".password").text(TPdata.system.wifi_password);


					},5000)

				},5000)
			}
			
		},

		networkMonitor: function () {
			var $view = viewLoad(".view-networkMonitor");
			control.navbar($view); 

			$view.find(".devices-number").click(function () {
				drillDown("devices")
			})

			var downloadMeter 	= speedometer("download");
			var uploadMeter 	= speedometer("upload");

			function speedometer (type) {
				if (type == "download") {
					var smoothedValue = state.download_speed;
				}else{
					var smoothedValue = state.upload_speed;
				}
				
				var resultValue;
				var unit;
				var ALPHA = 0.01;

				var timer = setInterval(function () {
					if (type == "download") {
						smoothedValue = ALPHA * state.download_speed + (1.0 - ALPHA) * smoothedValue;
					}else{
						smoothedValue = ALPHA * state.upload_speed + (1.0 - ALPHA) * smoothedValue;
					}

					if (smoothedValue >= 1024 ) {
						resultValue = smoothedValue / 1024;
						resultValue = resultValue.toFixed(1);
						unit = "MB/s";
					}else{
						resultValue = smoothedValue;
						resultValue = Math.round(smoothedValue);
						unit = "kB/s";
					}

					if (type == "download") {
						$view.find(".speedometer-download .speedometer-value").text(resultValue);
						$view.find(".speedometer-download .speedometer-unit").text(unit);
						// $view.find(".speedometer-download .speedometer-level").css("height", smoothedValue / state.download_speed_max * 100 + "%");
					}else{
						$view.find(".speedometer-upload .speedometer-value").text(resultValue);
						$view.find(".speedometer-upload .speedometer-unit").text(unit);
						// $view.find(".speedometer-upload .speedometer-level").css("height", smoothedValue / state.upload_speed_max * 100 + "%");
					}
				}, 600)
				
				var method = {
					"clear"	: function () {
						clearInterval(timer);
					},
				}

				return method;
			}
			$("#screen").on("viewChange", function() {
				$view.trigger("stopTimer")
			})

			$view.on("stopTimer", function () {
				downloadMeter.clear();
				uploadMeter.clear();
				$view.off("stopTimer");
			});

		},

		launcher: function () {
			var $view = viewLoad(".view-launcher")

			var apps_list = TPdata.launcher.apps_list;
			for (var i = 0 ; i < Math.ceil(apps_list.length / 4) * 4; i++) {
				$view.find(".launcher-apps-scroller").append("<div class='launcher-app'></div>");
			 };
			$view.find(".launcher-app").each(function (i) {
				console.log(this);
				$(this).click(function() {
					console.log('click')
				});
				$(this).addClass("launcher-app-" + apps_list[i])
					.text(TPdata.launcher.apps_name[apps_list[i]])
					.click(function () {

						if (TPdata.apps[apps_list[i]].available == true) {
							drillDown(apps_list[i])

						};
					})
			})
			$view.find(".launcher-menu").click(function () {
				drillDown("launcherMenu")
			})

			$view.find(".launcher-pageControl-up").click(function () {
				launcherPageControl().up()
			});

			$view.find(".launcher-pageControl-down").click(function () {
				launcherPageControl().down()
			});

			launcherPageControl().scrollControl(false);

			function launcherPageControl () {
				var totalPageNumber = Math.ceil($view.find(".launcher-app").length / 4);
				var method = {
					up: function () {
						if (launcherPageNum < 1) {
							return;
						}
						launcherPageNum--;
						method.scrollControl();
					},
					down: function () {
						if (launcherPageNum >= totalPageNumber -1) {
							return;
						}
						launcherPageNum++;
						method.scrollControl();
					},
					scrollControl: function (if_animation) {
						var scrollbarHeight = $view.find(".launcher-pageControl-scrollbar").height();
						var scrollbarThumbHeight = scrollbarHeight / totalPageNumber;
						var scrollbarThumbTop = scrollbarThumbHeight * (launcherPageNum);
						$view.find(".launcher-pageControl-scrollbar-thumb").css({
							"height": scrollbarThumbHeight + "px",
							"transform": "translate3d(0," + scrollbarThumbTop + "px,0)",
							"transition"	: "0.3s ease-in-out",
						});

						if (if_animation == false) {
							$view.find(".launcher-apps-scroller").children().css({
								"transform"		: "translate3d(0," + -(launcherPageNum * 236) + "px,0)",
								"transition"	: "0s ease-in-out",
							})
						}else{
							$view.find(".launcher-apps-scroller").children().css({
								"transform"		: "translate3d(0," + -(launcherPageNum * 236) + "px,0)",
								"transition"	: "0.3s ease-in-out",
							})
						}
					},

				}
				return method;
			}


		},

		launcherMenu : function () {
			var $view = viewLoad(".view-menu");
			control.navbar($view);
		},

		devices: function (viewData) {
			var $view = viewLoad(".view-devices");
			var $navbar = control.navbar($view);
			var $tab = $navbar.find(".tab");
			var tab_underline = $view.find(".tab-selected-underline");

			var $white_list = $view.find(".white-list-scroll");
			var $black_list = $view.find(".black-list-scroll");

			loadWhiteList();
			function loadWhiteList() {
				$white_list.children().remove();
				for (n in TPdata.devices.whiteList) {
					$white_list.append("<div class='table-cell table-cell-bullet pressed-bg'><div class='bullet bullet-wifi-4'></div>" + TPdata.devices.whiteList[n].name + "</div>")
				};

				$(".tab-white-list").text("已连接(" + TPdata.devices.whiteList.length + ")");
				$white_list.find(".table-cell").click(function () {
					drillDown("deviceDetail", $(this).index())
				})
			}

			loadBlackList();
			function loadBlackList() {
				$black_list.children().remove();
				for (n in TPdata.devices.blackList) {
					$black_list.append("<div class='table-cell pressed-bg'>" + TPdata.devices.blackList[n].name + "</div>")
				};

				$(".tab-black-list").text("黑名单(" + TPdata.devices.blackList.length + ")");

				blackListClick();
			}

			

			var scrollView_whiteList = control.scroll($white_list);
			var scrollView_blackList = control.scroll($black_list);

			if(!viewData) {
				console.log(viewData)
				var viewData = {};
				viewData.tab = "white_list";
			}

			if(viewData.tab == "white_list") {

				$tab.eq(0).addClass('tab-selected');
				$view.find(".black-list").hide();

			}else if(viewData.tab == "black_list") {

				$tab.eq(1).addClass('tab-selected');
				$view.find(".white-list").hide();
				tab_underline.css({
					"transform": "translate3d(100%,0,0)",
				});

			}

			$tab.click(function () {
				$tab.removeClass("tab-selected");
				$(this).addClass("tab-selected");
				if($(this).index() == 0) {
					tab_underline.css({
						"transform": "translate3d(0,0,0)",
						"transition": "0.3s ease-out"
					});
					$view.find(".black-list").hide();
					$view.find(".white-list").show();
				}else{
					tab_underline.css({
						"transform": "translate3d(100%,0,0)",
						"transition": "0.3s ease-out"
					});
					$view.find(".white-list").hide();
					$view.find(".black-list").show();
				}
			})

			function blackListClick() {

				$black_list.find(".table-cell").click(function () {
					var thisCell = $(this);
					var thisIndex = thisCell.index();
					var $alert = control.alert([
						{"text": "取消", "click": function () {
							$alert.close();
						}},
						{"text": "删除", "click": function () {
							TPdata.devices.blackList.splice(thisIndex,1);
							loadBlackList();
							scrollView_blackList.refresh();
							$alert.ok();
						}},
					]);

					$alert.title.text("确定从黑名单中移除")
					$alert.content.text("从黑名单里移除的设备将能够正常访问路由器网络，您也可以再次将其加入黑名单");

				})
			}
		},

		deviceDetail: function (n) {
			var $view = viewLoad(".view-device-detail");
			var $navbar = control.navbar($view);
			$navbar.title.text(TPdata.devices.whiteList[n].name);
			
			$view.find(".block").click(function () {
				var $alert = control.alert([
					{text:"取消", click: function() {
						$alert.close()
					}},
					{text:"确定", click: function() {
						TPdata.devices.blackList.push(TPdata.devices.whiteList[n]);
						TPdata.devices.whiteList.splice(n,1);
						$alert.ok();
						navStackPop();
					}}
				])

				$alert.title.text("确定加入黑名单");
				$alert.content.text("黑名单里的设备将被禁止接入路由器网络，您也可以将其从黑名单中删除。")

			})
		},


		networkConfig: function () { //网络设置
			var $view = viewLoad(".view-networkConfig")
			control.navbar($view);

			$view.find(".navbar-title").text("网络设置")


			if (TPdata.system.AP_mode == false) {


				$view.find(".view-networkConfig_internet").text("互联网设置")
				$view.find(".view-networkConfig_wifi").text("无线网络设置")
				$view.find(".view-networkConfig_ap").text("扩展现有无线网")
				$view.find(".table-cell:nth-child(1), .table-cell:nth-child(2)").addClass("chevron")

				if (TPdata.system.internet_connection == "connected") {
					$view.find(".view-networkConfig-internet-statue").text("已连接到互联网")
					$view.find(".bullet").eq(0).addClass("bullet-internet-blue");
				}

				else if (TPdata.system.internet_connection == "connecting") {
					$view.find(".view-networkConfig-internet-statue").text("正在连接...")
					$view.find(".bullet").eq(0).addClass("bullet-internet-grey");
				}

				else if (TPdata.system.internet_connection == "failed") {
					$view.find(".view-networkConfig-internet-statue").text("连接失败")
					$view.find(".bullet").eq(0).addClass("bullet-internet-grey");
				}

				else if (TPdata.system.internet_connection == "noConnection") {
					$view.find(".view-networkConfig-internet-statue").text("没有连接")
					$view.find(".bullet").eq(0).addClass("bullet-internet-grey");

				}

				else{
					$view.find(".view-networkConfig-internet-statue").text("")
				}


				if (TPdata.system.wifi_switch == true) {

					$view.find(".view-networkConfig-wifi-statue").text(TPdata.system.wifi_ssid)	/*SSID*/
					$view.find(".bullet").eq(1).addClass("bullet-wifi-blue");

				}else if (TPdata.system.wifi_switch == false) {

					$view.find(".view-networkConfig-wifi-statue").text("无线网络已关闭")	/*SSID*/
					$view.find(".bullet").eq(1).addClass("bullet-wifi-grey");
					
				}

				$view.find(".table-cell:nth-child(1)").click(function () {
					drillDown("networkConfig_internet");
				});
				$view.find(".table-cell:nth-child(2)").click(function () {
					drillDown("networkConfig_wifi");
				})
				$view.find(".bullet").eq(2).addClass("bullet-ap-grey");

				$view.find(".view-networkConfig-ap-statue").text("未启用")

				var APswitch = control.switch($view.find(".switch"), false, false);

				APswitch.on("switch-click", function () {
					drillDown("networkConfig_ap_wifi")
				})


			}else if (TPdata.system.AP_mode == true) {

				$view.find(".view-networkConfig_internet").text("互联网")
				$view.find(".view-networkConfig_wifi").text(TPdata.system.AP_wifi_ssid)
				$view.find(".view-networkConfig_ap").text("扩展现有无线网")
				$view.find(".table-cell:nth-child(2)").addClass("chevron")


				if (TPdata.system.internet_connection == "connected") {
					$view.find(".view-networkConfig-internet-statue").text("已连接")
					$view.find(".bullet").eq(0).addClass("bullet-internet-blue");
					$view.find(".bullet-dotted-line").eq(0).show();
				}

				else if (TPdata.system.internet_connection == "connecting") {
					$view.find(".view-networkConfig-internet-statue").text("正在连接...")
				}

				else if (TPdata.system.internet_connection == "failed") {
					$view.find(".view-networkConfig-internet-statue").text("连接失败")
				}

				else if (TPdata.system.internet_connection == "noConnection") {
					$view.find(".view-networkConfig-internet-statue").text("没有连接")
				}

				else{
					$view.find(".view-networkConfig-internet-statue").text("")
				}




				if (TPdata.system.AP_wifi_connection == "connected") {
					$view.find(".view-networkConfig-wifi-statue").text("已连接")
					$view.find(".bullet").eq(1).addClass("bullet-wifi-blue");
					$view.find(".bullet-dotted-line").eq(1).show();
				}

				else if (TPdata.system.AP_wifi_connection == "connecting") {
					$view.find(".view-networkConfig-wifi-statue").text("正在连接...")
				}

				else if (TPdata.system.AP_wifi_connection == "failed") {
					$view.find(".view-networkConfig-wifi-statue").text("连接失败")
				}

				else{
					$view.find(".view-networkConfig-wifi-statue").text("")
				}

				$view.find(".bullet").eq(2).addClass("bullet-ap-blue");

				$view.find(".view-networkConfig-ap-statue").text("已启用")

				var APswitch = control.switch($view.find(".switch"), true, false);
				APswitch.on("switch-click", function () {
					modalViewController("networkConfig_ap_close_alert");
				})
			}

		},



		networkConfig_internet: function () {
			var $view = viewLoad(".view-networkConfig-internet")
			control.navbar($view);

			if (TPdata.system.internet_mode == "dhcp") {
				$view.find(".segmentedControl-cell:nth-child(1)").addClass("segmentedControl_selected");
				$view.find(".segmentedControl-child:nth-child(2)").hide();

			}else if (TPdata.system.internet_mode == "pppoe") {
				$view.find(".segmentedControl-cell:nth-child(2)").addClass("segmentedControl_selected");
				$view.find(".segmentedControl-child:nth-child(1)").hide();

				$view.find(".pppoe-account-text").text(TPdata.system.pppoe_account);
				$view.find(".pppoe-password-text").text(TPdata.system.pppoe_password);

			};


			$(".segmentedControl-cell").click(function () {
				if ( $(this).hasClass("segmentedControl_selected")) {
					return;
				};

				$view.find(".segmentedControl-cell").removeClass("segmentedControl_selected");
				$(this).addClass("segmentedControl_selected");
				$view.find(".segmentedControl-child")
					.hide()
					.eq($(this).index()).show();
			})

			$view.find(".pppoe-account").click(function () {
				var $keyboard_account = control.keyboard();
				$keyboard_account.placeholder.text("账号: ");
				$keyboard_account.textfield.text($view.find(".pppoe-account-text").text());

				$keyboard_account.button.click(function () {
					$view.find(".pppoe-account-text").text($keyboard_account.textfield.text());
					$keyboard_account.close();
				})
			})

			$view.find(".pppoe-password").click(function () {
				var $keyboard_account = control.keyboard();
				$keyboard_account.placeholder.text("密码: ");
				$keyboard_account.textfield.text($view.find(".pppoe-password-text").text());

				$keyboard_account.button.click(function () {
					$view.find(".pppoe-password-text").text($keyboard_account.textfield.text());
					$keyboard_account.close();
				})
			})



			$view.find(".navbar-button").click(function () {
				if ($(".segmentedControl_selected").index() == 0) {
					TPdata.system.internet_mode = "dhcp";
				}else if($(".segmentedControl_selected").index() == 1){
					TPdata.system.internet_mode = "pppoe";
					TPdata.system.pppoe_account = $view.find(".pppoe-account-text").text();
					TPdata.system.pppoe_password = $view.find(".pppoe-password-text").text();
				}

				navStackPop ();
			});
		},



		networkConfig_wifi: function () {
			var $view = viewLoad(".view-networkConfig-wifi")
			var $navbar = control.navbar($view);

			var wifi_setting_section = $view.find(".wifi-settings");

			if(TPdata.system.wifi_switch == true) {
				var wifi_switch = control.switch($view.find(".wifi-switch"), true);
				wifi_setting_section.show();
				$view.find(".wifi-switch-statue").text("已开启");
			}else{
				var wifi_switch = control.switch($view.find(".wifi-switch"), false);
				wifi_setting_section.hide();
				$view.find(".wifi-switch-statue").text("已关闭");
			}

			$view.find(".wifi-ssid").text(TPdata.system.wifi_ssid);
			$view.find(".wifi-password").text(TPdata.system.wifi_password);
			

			wifi_switch.on("on", function () {
				wifi_setting_section.fadeIn(globeDuration);
				$view.find(".wifi-switch-statue").text("已开启");
			})

			wifi_switch.on("off", function () {
				wifi_setting_section.fadeOut(globeDuration);
				$view.find(".wifi-switch-statue").text("已关闭");
			})

			if(TPdata.system.wifi_encrypt == true) {
				var wifi_encrypt_switch = control.switch($view.find(".wifi-encrypt-switch"), true);
				$view.find(".wifi-encrypt-statue").text("已开启");
			}else{
				var wifi_encrypt_switch = control.switch($view.find(".wifi-encrypt-switch"), false);
				$view.find(".wifi-encrypt-statue").text("已关闭");
				$view.find(".wifi-encrypt-cell").hide();
			}

			wifi_encrypt_switch.on("on", function () {
				$view.find(".wifi-encrypt-cell").fadeIn(globeDuration);
				$view.find(".wifi-encrypt-statue").text("已开启");
			});

			wifi_encrypt_switch.on("off", function () {
				$view.find(".wifi-encrypt-cell").fadeOut(globeDuration);
				$view.find(".wifi-encrypt-statue").text("已关闭");
			})

			$view.find(".wifi-ssid-cell").click(function () {
				var wifi_ssid_keyboard = control.keyboard();
				wifi_ssid_keyboard.placeholder.text("网络名: ");
				wifi_ssid_keyboard.textfield.text($view.find(".wifi-ssid").text());

				wifi_ssid_keyboard.button.click(function () {
					$view.find(".wifi-ssid").text(wifi_ssid_keyboard.textfield.text());
					wifi_ssid_keyboard.close();
				})
			})

			$view.find(".wifi-password-cell").click(function () {
				var wifi_password_keyboard = control.keyboard();
				wifi_password_keyboard.placeholder.text("密码: ");
				wifi_password_keyboard.textfield.text($view.find(".wifi-password").text());
				
				wifi_password_keyboard.button.click(function () {
					$view.find(".wifi-password").text(wifi_password_keyboard.textfield.text());
					wifi_password_keyboard.close();
				})
			})
			console.log($navbar.button)
			$navbar.button.click(function () {
				TPdata.system.wifi_switch = wifi_switch.statue;
				TPdata.system.wifi_encrypt = wifi_encrypt_switch.statue;
				TPdata.system.wifi_ssid = $view.find(".wifi-ssid").text();
				TPdata.system.wifi_password = $view.find(".wifi-password").text();

				navStackPop();
			})
		},



		networkConfig_ap_wifi: function () {
			var $view = viewLoad(".view-wifi-list")
			control.navbar($view);

			$view.find(".navbar-title").text("请选择无线网络")
			$view.find(".navbar-button").text("确定")

			$view.find(".navbar-button").hide();
			var wifi_list = TPdata.wifi_list;
			for (var i = 0; i < wifi_list.length; i++) {
				$view.find(".scroller-content")
					.append("<div class='table-cell pressed-bg'>" + wifi_list[i] + "</div>");
			};

			var scrollView = control.scroll($view.find(".scroller-content"))

			var ssid;
			$view.find(".table-cell").click(function () {
				$view.find(".navbar-button").show();
				$view.find(".table-cell").removeClass("selected");

				ssid = $(this).addClass("selected").text();
			})

			$view.find(".navbar-button").click(function () {
				
				var $keyboard = control.keyboard();
				$keyboard.placeholder = $keyboard.find(".navbar-textfield-placeholder").text("密码: ");
				$keyboard.button = $keyboard.find(".navbar-button").text("确定");

				$keyboard.button.click(function () {
					var password = $keyboard.textfield.text();
					TPdata.system.AP_wifi_ssid = ssid;
					TPdata.system.AP_wifi_password = password;
					TPdata.system.AP_mode = true;


					var $alert = control.alert([
						{"text": "确定", "click": function () {
							$alert.ok();
							navStackPop();
							$keyboard.close();
						}},
					])

					$alert.content.text(ssid + " 现在拥有更大的覆盖范围");
					$alert.title.text("无线扩展已开启");


				})

			});
		},


		networkConfig_ap_close_alert : function (ssid) {
			var $alert = control.alert([
				{"text": "取消", "click": function () {
					$alert.close();
				}},
				{"text": "关闭", "click": function () {
					$alert.ok();
					TPdata.system.AP_mode = false;
					viewRefresh();
				}},
			])

			$alert.content.text("这将减小 " + TPdata.system.AP_wifi_ssid + " 的覆盖范围");
			$alert.title.text("关闭无线扩展功能");

		},


		expertMode: function () {
			var $view = viewLoad(".view-expertMode")
			control.navbar($view);

			if (TPdata.system.expertMode_switch == false) {
			
				$view.find(".expertMode-on").hide()
				var $switch = control.switch($view.find(".switch"), false, true)

			}
			else if (TPdata.system.expertMode_switch == true) {

				$view.find(".expertMode-off").hide()
				var $switch = control.switch($view.find(".switch"), true, true);
			}

			$switch.on("on", function () {
				$view.find(".expertMode-off").fadeOut(globeDuration);
				$view.find(".expertMode-on").fadeIn(globeDuration);
				TPdata.system.expertMode_switch = true;
				TPdata.system.expertMode_password = parseInt(Math.random()*100000000);
				$view.find(".expertMode-password").text(TPdata.system.expertMode_password);
			})
			$switch.on("off", function () {
				$view.find(".expertMode-off").fadeIn(globeDuration);
				$view.find(".expertMode-on").fadeOut(globeDuration);
				TPdata.system.expertMode_switch = false;
			})

			$view.find(".expertMode-password-container").click(function () {
				var $keyboard = control.keyboard();
				$keyboard.placeholder.text("密码: ");
				$keyboard.textfield.text($view.find(".expertMode-password").text());

				$keyboard.button.click(function () {
					TPdata.system.expertMode_password = $keyboard.textfield.text();
					$view.find(".expertMode-password").text(TPdata.system.expertMode_password);
					$keyboard.close();
				})

			})

		},

		twofactorAuth: function () {
			var $view = viewLoad(".view-twoFactorAuth");
			control.navbar($view);
			if (TPdata.system.twofactorAuth_switch == false) {
				
				var $switch = control.switch($view.find(".switch"), false, true);
				$view.find(".twoFactorAuth-on").hide();

			}else if (TPdata.system.twofactorAuth_switch == true) {

				var $switch = control.switch($view.find(".switch"), true, true);
				$view.find(".twoFactorAuth-off").hide();

			}
			
			$switch.on("on", function () {
				$view.find(".twoFactorAuth-on").fadeIn();
				$view.find(".twoFactorAuth-off").fadeOut();
			})

			$switch.on("off", function () {
				$view.find(".twoFactorAuth-on").fadeOut();
				$view.find(".twoFactorAuth-off").fadeIn();
			})
		},

		wirelessNetwork: function () {
			var $view = viewLoad(".view-wirelessNetwork")
			control.navbar($view);
			
			if (TPdata.system.wifi_switch == false) {
			
				$view.find(".wirelessNetwork-on").hide()
				var $switch = control.switch($view.find(".navbar .switch"), false, true);	

			}else if (TPdata.system.wifi_switch == true) {

				$view.find(".wirelessNetwork-off").hide()
				var $switch = control.switch($view.find(".navbar .switch"), true, false);
				$switch.on("switch-click", function () {
					wirelessNetwork_close_alert();
				})
			}


			if(TPdata.system.wifi_encrypt == true) {
				$view.find(".wifi-encrypt-text").text("已开启");
				var wifi_encrypt_switch = control.switch($view.find(".wifi-encrypt-switch"), "on", true);

			}else if(TPdata.system.wifi_encrypt == false) {
				$view.find(".wifi-encrypt-text").text("已关闭");
				var wifi_encrypt_switch = control.switch($view.find(".wifi-encrypt-switch"), "off", true);
				$(".wifi-password").hide();
			}

			$switch.on("on", function () {
				$view.find(".wirelessNetwork-off").fadeOut(globeDuration);
				$view.find(".wirelessNetwork-on").fadeIn(globeDuration);
				TPdata.system.wifi_switch = true;
				$switch.available(false);
				$switch.on("switch-click", function () {
					modalViewController("wirelessNetwork_closeAlert", $switch);
				})
			})


			$switch.on("off", function () {
				$view.find(".wirelessNetwork-off").fadeIn(globeDuration);
				$view.find(".wirelessNetwork-on").fadeOut(globeDuration);
				TPdata.system.wifi_switch = false;
				$switch.off("switch-click").available(true);
			})

			wifi_encrypt_switch.on("on", function () {
				$view.find(".wifi-encrypt-text").text("已开启");
				TPdata.system.wifi_encrypt = true;
				$(".wifi-password").show(globeDuration);
			})

			wifi_encrypt_switch.on("off", function () {
				$view.find(".wifi-encrypt-text").text("已关闭");
				TPdata.system.wifi_encrypt = false;
				$(".wifi-password").hide(globeDuration);
			})


			function wirelessNetwork_close_alert() {

				var $alert = control.alert([
					{"text": "取消", "click": function() {
						$alert.close();
					}},
					{"text": "确定", "click": function () {
						TPdata.system.wifi_switch = false;
						$alert.ok();
						$switch.switchOff();
					}},
				])

				$alert.content.text("这将停用路由器的无线网络功能，您确定要这样做？");
				$alert.title.text("关闭无线网络");

			}
		},


		gameAccelerater: function () {
			var $view = viewLoad(".view-gameAccelerater");
			control.navbar($view);

			if (TPdata.system.gameAccelerater_switch == false) {
				var $switch = control.switch($view.find(".navbar .switch"), false, true);
				$view.find(".gameAccelerater-on").hide();

			}else if (TPdata.system.gameAccelerater_switch == true) {
				var $switch = control.switch($view.find(".navbar .switch"), true, true);
				$view.find(".gameAccelerater-off").hide();

			};

			$switch.on("on", function () {
				$view.find(".gameAccelerater-off").fadeOut(globeDuration);
				$view.find(".gameAccelerater-on").fadeIn(globeDuration);
				TPdata.system.gameAccelerater_switch = true;
			})

			$switch.on("off", function () {
				$view.find(".gameAccelerater-on").fadeOut(globeDuration);
				$view.find(".gameAccelerater-off").fadeIn(globeDuration);
				TPdata.system.gameAccelerater_switch = false;
			})

			gameAcceleraterStatue ();

			$view.find(".gameAccelerater-score").text("累计加速 " + TPdata.apps.gameAccelerater.score + " 个数据包");

			$view.find(".gameAccelerater-refresh").click(function () {
				$view.find(".gameAccelerater-refresh").fadeOut(globeDuration);
				TPdata.apps.gameAccelerater.statue = "none";
				gameAcceleraterStatue ();
				setTimeout(function () {
					TPdata.apps.gameAccelerater.statue = "accelerating";
					gameAcceleraterStatue ();
					$view.find(".gameAccelerater-refresh").fadeIn(globeDuration);

					setInterval(function () {
						TPdata.apps.gameAccelerater.score += 4; 
						$view.find(".gameAccelerater-score").text("累计加速 " + TPdata.apps.gameAccelerater.score + " 个数据包");
					},1000)
				}, 1000);
			})

			function gameAcceleraterStatue () {
				if (TPdata.apps.gameAccelerater.statue == "none") {
					$(".gameAccelerater-statue").text("游戏模式已开启，智能检测中").removeClass("two-lines")
					$(".gameAccelerater-gameName").text("");

				}else if (TPdata.apps.gameAccelerater.statue == "accelerating") {
					$(".gameAccelerater-statue").text("当前加速游戏:").addClass("two-lines")
					$(".gameAccelerater-gameName").text("魔兽世界");
				}
			}
		},


		resetConfirmAlert: function () {

			var $alert = control.alert([
				{"text": "取消", "click": function() {
					$alert.close();
				}},
				{"text": "确定", "click": function () {
					$alert.ok();
					system.reset()
				}},
			])

			$alert.content.text("这将还原所有设置和用户数据，确认清除？");
			$alert.title.text("恢复出厂设置");

		},


		time: function() {
			var $view = viewLoad($(".view-time"))
			control.navbar($view);

			if (TPdata.system.internet_connection == "connected") {
				dateUpdate ();
				var timer = setInterval (function (){
					dateUpdate ();
				},1000)
			}else{
				$view.find(".navbar-title").text("时钟");
				$view.find(".time-number").text("--:--");
				$view.find(".timeform-mark").text("");
				var time_marginLeft = ($view.width() - $view.find(".time-number").width()) / 2;
				$view.find(".time-number").css("left",time_marginLeft + "px")
		
			}

			
			function dateUpdate () {
				var date = new Date();
				var date_years = date.getFullYear();
			    var date_month = date.getMonth();
			    var date_date = date.getDate();
			    var date_day = date.getDay();
				var date_hours = date.getHours();
				var date_minutes = date.getMinutes();

				if (date_minutes < 10) {
					date_minutes = "0" + date_minutes;
				};

			    switch(date_day){
			    	case 0 :
			    		date_day = "星期日";
			    		break;
			    	case 1 :
			    		date_day = "星期一";
			    		break;
			    	case 2 :
			    		date_day = "星期二";
			    		break;
			    	case 3 :
			    		date_day = "星期三";
			    		break;
			    	case 4 :
			    		date_day = "星期四";
			    		break;
			    	case 5 :
			    		date_day = "星期五";
			    		break;
			    	case 6 :
			    		date_day = "星期六";
			    		break;
			    }

			    var navbarText = date_years + "." + date_month + "." + date_date + " " + date_day;

			    $view.find(".navbar-title").text(navbarText)

				if (true) {
					
					if (date_hours > 12) {
						date_hours -= 12;
						var timeform_mark = "下午";
					}else{
						var timeform_mark = "上午";
					}

					date = date_hours + ":" + date_minutes;
					$view.find(".time-number").text(date);
					$view.find(".timeform-mark").text(timeform_mark);

					var time_width = $view.find(".time-number").width();
					var time_marginLeft = ($view.width() - time_width - $view.find(".timeform-mark").width()) / 2 + 10;
					var timeform_Left = ($view.width() - time_width) / 2 + time_width;
					$view.find(".timeform-mark").css("left",timeform_Left + "px")

				}else{
					var time_marginLeft = ($view.width() - time_width) / 2;	
				}

				$view.find(".time-number")
					.css("left",time_marginLeft + "px")
				}

			
		},

		systemUpdate: function() {
			var $view = viewLoad(".view-systemUpdate");
			var $navbar = control.navbar($view);

			$navbar.button.text("更新").hide().click(function() {
				drillDown("systemUpdate_download");
			});

			$view.find(".current-version").text("当前系统版本 " + TPdata.system.system_version);

			$view.find(".checking-statue").text("正在检查更新");

			setTimeout(function () {
				if(TPdata.system.internet_connection != "connected") {
					$view.find(".checking-statue").text("无法获取最新版本，请检查网络连接");
				}else if(TPdata.apps.systemUpdate.newVersion == true){
					$view.find(".checking-statue").text("发现新版本");
					$navbar.button.show();
				}else{
					$view.find(".checking-statue").text("已升级到最新版本");
				}
			},3000)
			
		},

		systemUpdate_download: function () {
			var $view = viewLoad(".view-systemUpdate-download");
			var $navbar = control.navbar($view);

			var $progressbar = control.progressbar($view.find(".progressbar"));

			$navbar.back.click(function() {
				clearInterval(timer);
			})

			var startValue = 0;
			var endValue = 19;
			var value = startValue;
			var timer = setInterval(function () {
				if(value >= endValue) {
					$progressbar.value(value);
					clearInterval(timer);
					setTimeout(function () {
						drillDown("systemUpdate_setup");
					},800)
				};
				$progressbar.value(value/endValue);
				$progressbar.labelRight.text(value + "/" + endValue + "MB")
				value += 1;
			},300)
		},

		systemUpdate_setup: function () {
			var $view = viewLoad(".view-systemUpdate-setup");
			TPdata.apps.systemUpdate.newVersion = false;

			var $progressbar = control.progressbar($view.find(".progressbar"));

			var startValue = 0;
			var endValue = 100;
			var value = startValue;
			var timer = setInterval(function () {
				if(value >= endValue) {
					$progressbar.value(value);
					clearInterval(timer);
					setTimeout(function () {
						var $alert = control.alert([
							{
								"text":"确定",
								"click": function () {
									$alert.ok();
									system.reset()
								}
							}
						]);
						$alert.title.text("系统升级完成");
						$alert.content.text("升级成功，请点击确定重启路由器。");
						
					},800)
				};
				$progressbar.value(value/endValue);
				$progressbar.labelRight.text(value + "%")
				value += 5;
			},300)
		},

	}

	var control = {
		navbar: function (targetView, option) {
			if (option == undefined) {
				var option = {};
			};
			option = $.extend({
				back: true,
			},option);
			
			var $navbar = targetView.find(".navbar");
			$navbar.title = $navbar.find(".navbar-title");
			$navbar.button = $navbar.find(".navbar-button");
			$navbar.back = $navbar.find(".nav-back");

			if (option.back == true) {
				$navbar.back.click(function () {
					navStackPop();
				});
			};

			return $navbar;
		},

		switch: function (elem, statue, available) {
			elem.statue = statue;

			if (statue == true) {
				elem.removeClass("switch-off").addClass("switch-on");
				setTimeout(function () {
					elem.addClass("switch-transition");
				})
			}else if(statue == false){
				elem.removeClass("switch-on").addClass("switch-off");
				setTimeout(function () {
					elem.addClass("switch-transition");
				})
			}

			if (available == false) {
				elem.addClass("unavailable")
			};

			elem.click(function () {
				$(this).trigger("switch-click");
				if($(this).hasClass("unavailable")) {
					
				}else if($(this).hasClass("switch-on")) {
					elem.switchOff()

				}else if ($(this).hasClass("switch-off")){
					elem.switchOn()

				}

			});
			elem.switchOn = function () {
				elem.removeClass("switch-off").addClass("switch-on").trigger("on");
				elem.statue = true;
				return elem;
			}

			elem.switchOff = function () {
				elem.statue = false;
				elem.removeClass("switch-on").addClass("switch-off").trigger("off");
				return elem;
			}

			elem.available = function (BOOL) {
				if (BOOL == true) {
					elem.removeClass("unavailable")
				}else if (BOOL == false) {
					elem.addClass("unavailable")
				}
				return elem;
			}

			return elem;

		},

		scroll: function scroller (elem, pageControlStep) {
			var scrollView = elem.wrap("<div class='scroller'></div>")
				.parent()
				.wrap("<div class='scroller-container'></div>")
				.parent()
				.append(
					"<div class='scroller-pageController'><div class='scroller-up'></div><div class='scrollbar'><div class='scrollbar-thumb'></div></div><div class='scroller-down'></div></div>"
				);

			scrollView.thumb = scrollView.find(".scrollbar-thumb");
			scrollView.scroller = scrollView.find(".scroller");

			scrollerInit();
			function scrollerInit() {

				scrollView.viewHeight = scrollView.height();
				scrollView.step = scrollView.viewHeight / 2 || pageControlStep;

				scrollView.contentHeight = elem.height();

				if(scrollView.contentHeight <= scrollView.viewHeight) {
					scrollView.find(".scroller-pageController").hide()
				}

				
				scrollView.thumb.height(scrollView.viewHeight / scrollView.contentHeight * 100 + "%");
				scrollView.scrollTopMax = scrollView.contentHeight - scrollView.viewHeight;

				var targetScroll;
				scrollView.up = function () {
					if (scrollView.scroller.scrollTop() - scrollView.step <= 0) {
						targetScroll = 0;
					}else{
						targetScroll = scrollView.scroller.scrollTop() - scrollView.step;
					}

					scrollView.scroller.animate({"scrollTop" : targetScroll}, globeDuration);
					scrollView.thumb.animate({"top": targetScroll / scrollView.contentHeight * 100 + "%"},globeDuration)
				}

				scrollView.down = function () {
					if (scrollView.scroller.scrollTop() + scrollView.step >= scrollView.scrollTopMax) {
						targetScroll = scrollView.scrollTopMax;
					}else{
						targetScroll = scrollView.scroller.scrollTop() + scrollView.step;
					}

					scrollView.scroller.animate({"scrollTop" : targetScroll}, globeDuration);
					scrollView.thumb.animate({"top": targetScroll / scrollView.contentHeight * 100 + "%"},globeDuration)
				}
			}
			

			scrollView.find(".scroller-up").click(function () {
				scrollView.up();				
			});

			scrollView.find(".scroller-down").click(function () {
				scrollView.down();				
			});

			scrollView.refresh = function() {
				scrollerInit()
			};

			return scrollView;
		},

		
		alert: function (buttons) {
			var $alert = viewLoad(".view-alert", "alert");
			if(buttons){

				var buttonsLength = buttons.length;
				for (var i = 0; i < buttonsLength; i++) {			
					$("<div class='alert-buttons'></div>")
					.appendTo($alert.find(".alert-footer"))
					.text(buttons[i].text)
					.click(buttons[i].click)
				};
				
				$alert.find(".alert-buttons").css("width", 100/buttonsLength + "%");

			}

			return {
				"title" : $alert.find(".alert-title"),
				"content": $alert.find(".alert-content"),
				"close": function () {
					$alert.css({
						"opacity" : "0",
						"transition": "0.3s ease-out"
					});

					$alert.find(".alert-container").css({
						"transform" : "scale(0.9)",
						"transition": "0.3s ease-out"
					});

					setTimeout(function () {
						$alert.remove();
					}, 300)
				},

				"ok": function (callback) {
					$alert.css({
						"opacity" : "0",
						"transition": "0.3s ease-out",
						"transform" : "scale(1.1)",
					});

					setTimeout(function () {
						$alert.remove();
					}, 300)
				}
			}
		},

		"keyboard" : function () {
			var $keyboard = viewLoad(".view-keyboard", "keyboard");

			$keyboard.placeholder = $keyboard.find(".navbar-textfield-placeholder").text("密码: ");
			$keyboard.button = $keyboard.find(".enter").text("确定");

			$keyboard.find(".navbar-back").click(function () {
				control.transitions.slideOut($keyboard, true);
				control.transitions.fadeIn(currentPage);
				$(document).off("keypress");
			});


			$keyboard.textfield = $keyboard.find(".navbar-textfield");
			$keyboard.textfield.text = function(aug) {
				if(aug != undefined){
					$keyboard.textfield[0].innerHTML = aug;
					placeholder_switch();
				}else{
					return $keyboard.textfield[0].innerHTML;
				}
			}

			placeholder_switch();

			function placeholder_switch(){	
				if($keyboard.textfield.text() == ""){
					$keyboard.placeholder.show();
				}else{
					$keyboard.placeholder.hide();
				}	
			}


			$keyboard.content = $keyboard.find(".content");
			var btn_shift = $keyboard.find(".shift");

			var upper_case = false;
			$keyboard.find(".shift").click(function () {
				if (upper_case == false) {
					upper_case = true;
					$keyboard.content.removeClass("lower-case");
					btn_shift.removeClass('shift-normal').addClass('shift-active');

				}else if (upper_case == true){
					upper_case = "shiftLock";
					btn_shift.removeClass('shift-active').addClass('shift-lock');

				}else {
					upper_case = false;
					$keyboard.content.addClass("lower-case");
					btn_shift.removeClass('shift-lock').addClass('shift-normal');

				}
			})

			$keyboard.find(".letter").click(function(){
				if (upper_case == false) {
					inputChar(this.innerHTML.toLowerCase())
				}else{
					inputChar(this.innerHTML.toUpperCase())
				}
			})

			$keyboard.find(".delete").click(function () {
				deleteChar();
			})

			$keyboard.find(".navbar-textfield-clear").click(function () {
				$keyboard.textfield[0].innerHTML = "";
				placeholder_switch();
			})

			$(document).keypress(function(e) {
				e.preventDefault(e);
				if (e.keyCode == 8) {
					deleteChar();
					return;
				}
				inputChar(String.fromCharCode(e.keyCode))
			});

			function inputChar(char) {
				$keyboard.textfield[0].innerHTML += char;
				placeholder_switch();
				if (upper_case == "shiftLock"){
					return;
				}else{
					upper_case = false;
					$keyboard.content.addClass("lower-case");
					btn_shift.removeClass('shift-active').addClass('shift-normal');
				}
			}

			function deleteChar () {
				var str = $keyboard.textfield[0].innerHTML;
				$keyboard.textfield[0].innerHTML = str.substring(0, str.length - 1);
				placeholder_switch();
			}

			$keyboard.close = function () {
				control.transitions.fadeOut($keyboard, true);
				control.transitions.fadeIn(currentPage);
				$(document).off("keypress");
			}

			return $keyboard;
		},

		"progressbar": function (elem){
			elem.value = function (percent) {
				elem.find(".progressbar-value").css("width",percent * 100 + "%");
			}

			elem.labelLeft = elem.find(".progressbar-label-left");
			elem.labelRight = elem.find(".progressbar-label-right");

			return elem;
		},

		"transitions" : {
			slideIn : function (elem) {
				elem.css({
					"transform": "translate3d(100%,0,0)",
					"opacity"	:"0",
				});

				setTimeout(function () {
					elem.css({
						"opacity"	:"1",
						"transform": "translate3d(0,0,0)",
						"transition": "0.3s ease-out"
					});
				})
			},
			slideOut: function (elem, if_remove) {
				elem.css({
					"transform": "translate3d(100%,0,0)",
					"transition": "0.3s ease-out",
					"opacity"	:0,
				});

				if (if_remove == true) {
					setTimeout(function () {
						elem.remove();
					},300)	
				};
			},

			fadeIn :  function (elem) {
				elem.css({
					"opacity": "0",
					"transition":"0"
				});

				setTimeout(function () {
					elem.css({
						"opacity": "1",
						"transition":"0.3s ease-out"
					});
				})
			},

			fadeOut : function (elem, if_remove) {
				elem.css({
					"opacity": "1",
					"transition":"0"
				});

				setTimeout(function () {
					elem.css({
						"opacity": "0",
						"transition":"0.3s ease-out"
					});
				})

				if (if_remove == true) {
					setTimeout(function () {
						elem.remove();
					},300)	
				};
			}
		},

		simulatorToolbar: function (elem) {
			elem.find(".toolbar-button").click(function () {
				var eventName = "systemEvent_" + $(this).data("event").eventName;
				$("#screen").trigger(eventName)
			})

			if (TPdata.system.internet_connection == "connected") {
				var internetConnection_switch = control.switch($(".toolbar-internetConnection .switch"),true,true)	
			}else{
				var internetConnection_switch = control.switch($(".toolbar-internetConnection .switch"),true,true)	
			}

			internetConnection_switch.on("on", function () {
				TPdata.system.internet_connection = "connected";
				$("#screen").trigger("internetConnectionOn")
			})
			internetConnection_switch.on("off", function () {
				TPdata.system.internet_connection = "noConnection";
				$("#screen").trigger("internetConnectionOff")
			})
		},

		
	}



	var currentPage;

	function viewLoad (elem,type) {
		if(type == "alert") {
			var $view = $(".view-collection").find(elem).clone().appendTo(viewContainer).show();
			$view.css({
				"opacity"	: "0",
			});

			$view.find(".alert-container").css({
				"transform": "scale(0.9)",
			});

			setTimeout(function () {
				$view.css({
					"opacity"	: "1",
					"transition": "0.3s ease-out",
				})
				$view.find(".alert-container").css({
					"transform": "",
					"transition": "0.3s ease-out",
				});
			})
		}else if (type == "keyboard"){
			var $view = $(".view-collection").find(elem).clone().appendTo(viewContainer).show();
			setTimeout(function () {
				control.transitions.fadeOut(currentPage);
				control.transitions.slideIn($view);	
			})
		}else if (type == "cable_check"){
			var $view = $(".view-collection").find(elem).clone().appendTo(viewContainer).show();
			setTimeout(function () {
				control.transitions.fadeIn($view);
			})
		}else{
			var $view = $(".view-collection").find(elem).clone().appendTo(viewContainer).show();
			currentPage = $view;
		}
		
		return $view;
	}

	function viewRefresh (target) {
		if (target == undefined) {
			// viewContainer.html("");
			if(viewContainer.children().length != 0){
				viewContainer.children().fadeOut(globeDuration, function () {
					$(this).remove();
				})
			}

			viewController[navStack[navStack.length-1]]();

		}else {
			navStack.pop();
			drillDown(target);
		}
	};

	function drillDown (navTarget, viewData) {
		if (viewData == undefined) {
			var viewData = "";                                                                                                                                                                                                                                                            
		};

		$("#screen").trigger("viewChange");

		var prevPage = currentPage;

		if(prevPage){
			control.transitions.fadeOut(prevPage, true)
		}
		
		viewController[navTarget](viewData);
		
		if(navTarget == "launcher"){
			control.transitions.fadeIn(currentPage);
		}else{
			control.transitions.slideIn(currentPage);
		}

		navStack.push(navTarget);
	}


	function navStackPop (steps) {
		if (steps == undefined) {
			var steps = 1;
		}

		for (var i = 0; i < steps; i++) {
			navStack.pop();
		}

		$("#screen").trigger("viewChange");


		var prevPage = currentPage;

		control.transitions.slideOut(prevPage, true)

		viewController[navStack[navStack.length - 1]]();

		control.transitions.fadeIn(currentPage)
	}


	function modalViewController (navTarget, viewData) {
		if (viewData == undefined) {
			var viewData = "";
		};

		viewController[navTarget](viewData);
	}


	var system = {
		boot: function () {
			var $view = viewLoad(".view-Uboot");
			setTimeout(function () {
				$view.remove();
				setTimeout(function() {
					var $view = viewLoad(".view-boot");

					setTimeout(function () {
						if(TPdata.boot.first_boot == true) {
							viewController.guide();
						}else{
							control.transitions.fadeOut($view,true)
							drillDown("launcher");
						}
					}, 0);
				})
			},0)
				
		},
		reset: function() {
			// TPdata = $.extend(true, {}, TPdataBackup);
			navStack = new Array();
			currentPage.remove();
			launcherPageNum = 0;
			TPdata.boot.first_boot = false;
			// system.boot();
		},

		wifiSwitch: function(BOOL) {
			if (BOOL) {
				TPdata.system.wifi_switch = true;
			} 
		}
	}

	system.boot();
	// control.keyboard()

	control.simulatorToolbar($(".toolbar"));

	$("#screen").on("systemEvent_reset", function () {
		viewController.resetConfirmAlert();
	})


	function segmentedController (elem_control, elem_child, nth_child) {

	}

})




// 正在尝试链接网络
// 网络连接成功
// 正在开启无线网络
// 升级成功，请点击确定重启路由器
