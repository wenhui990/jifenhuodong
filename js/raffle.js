var prizeLevel = new Array();
var prizeName = new Array();
prizeLevel[0] = 0;
prizeName[0] = "未中奖";
var prizeAngle = {};
var pointerAngle;
var aid = 0;
var type = -1;
var raffleCount = 0;
var maxCount = 0;

function raffleView(a) {
	$.ajax({
		type: "post",
		url: getPath() + "/web/raffle/activity.do",
		data: {
			type: a
		},
		dataType: "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(b) {
			raffleViewCallBack(b)
		},
		error: function(b, d, c) {
			console.log(b.responseText);
			console.log(b.status);
			console.log(b.readyState);
			console.log(b.statusText);
			console.log(d);
			console.log(c)
		}
	})
}

function raffleViewCallBack(c) {
	if(c) {
		if(c.s != 200) {
			raffleTip(c.r);
			return
		}
		aid = c.r.id;
		type = c.r.type;
		var b = c.u.availableRaffleCount;
		raffleCount = c.rt;
		maxCount = c.r.param1;
		$("#availableCount").html(b);
		$("#ticketLeft").html(c.lt);
		if(c.r && c.r.apList) {
			var e = c.r.apList;
			for(var a in e) {
				var d = e[a];
				prizeLevel[d.level] = d.level;
				prizeName[d.level] = d.name
			}
			pointerAngle = 90;
			prizeAngle[0] = 90;
			prizeAngle[1] = 30;
			prizeAngle[2] = 330;
			prizeAngle[3] = 270;
			prizeAngle[4] = 150;
			prizeAngle[5] = 210
		}
		if(b > 0) {
			$("#ticketRaffle").hide();
			$("#raffle").show()
		} else {
			if(Number(raffleCount) >= Number(maxCount) * 3) {
				$("#raffle").hide();
				$("#ticketRaffle").show();
				raffleTip("今日抽奖机会已用完，明天再来吧！");
				$("#btn_run").click(function() {
					raffleTip("今日抽奖机会已用完，明天再来吧！")
				});
				return
			} else {
				$("#raffle").hide();
				$("#ticketRaffle").show()
			}
		}
		$("#btn_run").click(function() {
			raffleSumbit()
		})
	}
}

function raffleTip(a) {
	showTipsWindown("", "worn", 300, 200);
	$("#windown-content p[name=message]").html(a)
}

function raffleFromTicket() {
	$("#ticketDiv").hide();
	if(Number($("#availableCount").html()) > 0) {
		$("#ticketRaffle").hide();
		$("#raffle").show()
	} else {
		$("#raffle").hide();
		$("#ticketRaffle").show()
	}
}

function raffleSumbit() {
	if($("#ticketDiv").is(":visible")) {
		return
	}
	if(Number(raffleCount) >= Number(maxCount) * 3) {
		raffleTip("今日抽奖机会已用完，明天再来吧！");
		reutrn
	}
	if(Number($("#availableCount").html()) <= 0) {
		$("#ticketDiv").show();
		$("#submitButton").show();
		return
	}
	$("#run").rotate({
		duration: 3600000,
		angle: 0,
		animateTo: 648000,
		easing: $.easing.easeOutSine
	});
	var a = "";
	$("#btn_run").unbind("click");
	$.ajax({
		type: "post",
		url: getPath() + "/web/raffle/sumbit.do",
		dataType: "json",
		data: {
			id: aid,
			type: type
		},
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(b) {
			$("#btn_run").click(function() {
				raffleSumbit()
			});
			if(b.s == 200 || b.s == 300) {
				raffleCount = b.rt;
				var c = 720 + pointerAngle + (360 - prizeAngle[b.l]);
				$("#run").rotate({
					duration: 3000,
					angle: 0,
					animateTo: c,
					easing: $.easing.easeOutSine,
					callback: function() {
						if(b.l == 0) {
							$("#cov1").html("很遗憾您没有中奖<br /><span style='color:#597de4'>请再接再厉</span>");
//							$("#cov2").html("<span style='color:#597de4'>请再接再厉</span>");
							$(".win-img").hide();
							$(".lose-img").show()
						} else {
							$("#cov1").html("<span style='color:#fff'>恭喜您中得<br />"+prizeName[b.l]+"</span>");
//							$("#cov2").html();
							$(".lose-img").hide();
							$(".win-img").show();
							if(b.r.type == 1) {
								$("#win1").hide();
								$("#win2").show()
							} else {
								$("#win2").hide();
								$("#win1").show()
							}
						}
						$("#cov").show()
					}
				})
			} else {
				$("#run").rotate({
					duration: 1000,
					angle: 0,
					animateTo: 360,
					easing: $.easing.easeOutSine
				});
				raffleTip(b.r)
			}
		},
		error: function(b, d, c) {
			console.log(b.responseText);
			console.log(b.status);
			console.log(b.readyState);
			console.log(b.statusText);
			console.log(d);
			console.log(c)
		}
	})
}

function inputTicket() {
	var b = true;
	var a = 0;
	$("#ticketDiv .ticket-num").each(function() {
		var f = $(this).html();
		for(var d = 0; d < f.length; ++d) {
			var e = f.charCodeAt(d);
			if(e < 48 || e > 57) {
				b = false;
				return false
			}
			a++
		}
		var c = Number($(this).attr("maxlength"));
		if(f.length > c) {
			b = false;
			return false
		}
	});
	if(!b || a != 24) {
		raffleTip("请输入正确票号");
		return
	}
	refreshCc();
	showTipsWindown("", "captchaTip", 300, 200)
}

function refreshCaptcha() {
	var a = $("#windown-box #checkCodeImg");
	a.attr("src", getPath() + "/manage/captcha.do?" + Math.random().toString())
}

function validateCaptcha() {
	var a = $("#windown-box #captchaId").val();
	if(a && a.length == 4) {
		inputRealTicket(a)
	} else {
		alert("请输入正确的验证码")
	}
}

function inputRealTicket(a) {
	var b = $("#ticket1").html() + $("#ticket2").html() + $("#ticket3").html() + $("#ticket4").html();
	$.ajax({
		type: "post",
		url: getPath() + "/web/raffle/ticket.do",
		data: {
			id: aid,
			ticket: b,
			type: type,
			captcha: a
		},
		dataType: "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(c) {
			inputTicketCallBack(c)
		},
		error: function(c, e, d) {
			console.log(c.responseText);
			console.log(c.status);
			console.log(c.readyState);
			console.log(c.statusText);
			console.log(e);
			console.log(d)
		}
	})
}

function inputTicketCallBack(a) {
	if(a) {
		if(a.s != 200) {
			alert(a.r);
			refreshCaptcha();
			return
		}
		closeWindow();
		$("#ticketLeft").html(a.lt);
		$("#availableCount").html(a.at);
		if(a.lt > 0) {
			$("#submitButton").hide();
			$("#raffleButton").show();
			$("#inputButton").show();
			clearTicket();
			raffleTip("恭喜获得3次抽奖机会")
		} else {
			$("#ticketDiv").hide();
			raffleTip("恭喜获得3次抽奖机会, 今日输入票号机会已用完")
		}
		$("#ticketRaffle").hide();
		$("#raffle").show()
	}
}

function clearTicket() {
	$("#ticket1").empty();
	$("#ticket2").empty();
	$("#ticket3").empty();
	$("#ticket4").empty();
	if(!$("#ticket1").hasClass("selected")) {
		$("#ticketDiv .ticket-num.selected").removeClass("selected");
		$("#ticket1").addClass("selected")
	}
}

function getRaffleRecord(b, a) {
	$.ajax({
		type: "post",
		url: getPath() + "/web/raffle/record.do",
		dataType: "json",
		data: {
			type: b
		},
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(c) {
			raffleRecordCallBack(c, a)
		},
		error: function(c, e, d) {
			console.log(c.responseText);
			console.log(c.status);
			console.log(c.readyState);
			console.log(c.statusText);
			console.log(e);
			console.log(d)
		}
	})
}

function raffleRecordCallBack(e, a) {
	if(e.s == 200) {
		if(!e.r || e.r.length <= 0) {
			$("#res").html("<tr><td colspan=2>暂无记录</td></tr>");
			return
		}
		var d = "";
		for(var c = 0; c < e.r.length; ++c) {
			var b = e.r[c];
			if(a && (b.name == undefined || b.worth == undefined)) {
				continue
			}
			d += "<tr>";
			d += "<td>";
			d += formatDateYMDHM(b.raffleTime);
			d += "</td>";
			d += "<td>";
			if(b.name != undefined && b.worth != undefined) {
				if(b.type == 1) {
					d += b.name
				} else {
					d += b.name;
					if(b.status == 2 && b.code != undefined) {
						d += "<br>" + b.code
					} else {
						d += "<br>派奖中"
					}
				}
			} else {
				d += "未中奖"
			}
			d += "</td>";
			d += "</tr>"
		}
		if(d == "") {
			d = "<tr><td colspan=3>暂无记录</td></tr>"
		}
		$("#res").html(d)
	} else {
		raffleTip(e.r)
	}
}
$(".close-btn").click(function() {
	$(".ticketDiv").hide()
});

function userInfoInit() {
	$.ajax({
		type: "post",
		url: getPath() + "/web/raffle/user/get.do",
		dataType: "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(b) {
			if(b.s == 404) {
				raffleTip("关注中国竞彩订阅号，回复“好礼码上来”参加吧！");
				return
			}
			var a = b.u;
			if(a) {
				if(a.postAddress) {
					$("#address").val(a.postAddress)
				}
				if(a.realName) {
					$("#realName").val(a.realName)
				}
				if(a.idnum) {
					$("#idnum").val(a.idnum)
				}
				if(a.phone) {
					$("#mobile").val(a.phone)
				}
				formatValue()
			} else {
				raffleTip("查询失败");
				return
			}
		},
		error: function(a, c, b) {
			console.log(a.responseText);
			console.log(a.status);
			console.log(a.readyState);
			console.log(a.statusText);
			console.log(c);
			console.log(b)
		}
	})
}

function isPhoneNo(a) {
	var b = /^1[34578]\d{9}$/;
	return b.test(a)
}

function isCardNo(a) {
	var b = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	return b.test(a)
}

function userInfoUpdate() {
	var c = $.trim($("#realName").val()),
		d = $.trim($("#address").val()),
		b = $.trim($("#mobile").val()),
		a = $.trim($("#idnum").val());
	if(!c || c.length < 2) {
		$("#realName").focus();
		$("#tipInfo").show();
		$("#errorMsg").html("请填写真实姓名");
		return
	}
	if(!b || !isPhoneNo(b)) {
		$("#mobile").focus();
		$("#tipInfo").show();
		$("#errorMsg").html("请填写正确的手机号");
		return
	}
	if(!d || d.length < 6) {
		$("#address").focus();
		$("#tipInfo").show();
		$("#errorMsg").html("请填写真实地址");
		return
	}
	if(!a || !isCardNo(a)) {
		$("#idnum").focus();
		$("#tipInfo").show();
		$("#errorMsg").html("请填写真实的身份证号");
		return
	}
	$.ajax({
		type: "POST",
		url: getPath() + "/web/raffle/user/update.do",
		data: "realName=" + c + "&detailAddrs=" + d + "&mobile=" + b + "&idCard=" + a,
		dataType: "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(e) {
			raffleTip(e.r);
			returnIndex()
		},
		error: function(e, g, f) {
			console.log(e.responseText);
			console.log(e.status);
			console.log(e.readyState);
			console.log(e.statusText);
			console.log(g);
			console.log(f)
		}
	})
}

function returnIndex() {
	window.location = getPath() + "/htmlwx/hd_raffle.html"
};