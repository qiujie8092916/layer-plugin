/***
 * 漫画Jquery弹出层插件
 * 编写时间：2016年12月15号
 * version: Dialog.1.0.js
***/
(function() {
		var Dialog = function(ele, option){
				this.init(ele, option)
		}
		
		Dialog.prototype = {
				constructor: Dialog,
				
				init : function(element, option){
						this.ele = $(element);
						this.options = $.extend({}, this.defaultOptions, option)
				},
				
				show: function(){
						var that = this
						//设置背景
						if(that.options.bg){
								bg = "<div class='floatBoxBg'></div>"
								that.bg = $(bg)
								that.bg.css({height: $(document).height()})
								$(document.body).append(that.bg)
								
								if(typeof that.options.bg === 'number'){
										that.bg.css({backgroundColor: "rgba(0, 0, 0, "+that.options.bg+")"})
								} else if(typeof that.options.bg == 'object' && that.options.bg.constructor == Array){
										var rgba = that.options.bg[1].colorRgb()
										rgba = rgba.substring(0, rgba.lastIndexOf(")")) + ',' + that.options.bg[0] + rgba.substring(rgba.lastIndexOf(")"))
										that.bg.css({backgroundColor: rgba})
								}
								that.bg.animate({opacity: 1}, 300)
						}
						//设置弹出层
						if(!that.template){
								that.template = that.getDialog()
								//设置标题		
								that.template.find('title').text(that.options.title)
								//设置内容
								if(that.options.type.toLowerCase() === 'text'){
										that.template.find('.content').text(that.options.content)
								} else if(that.options.type.toLowerCase() === 'img'){
										that.template.find('.content').append("<img src='"+that.options.content+"' />")
										that.template.find('.content').css({padding: 0, fontSize: 0})
								} else if(that.options.type.toLowerCase() === 'iframe'){
										that.template.find('.content').append("<iframe frameborder='0' scrolling='yes' src='"+that.options.content+"'></iframe>")
										that.template.find('.content').css({padding: 0})
										that.template.css({borderBottomLeft: 0, borderBottomRight: 0})
								}
								//添加到DOM
								$(document.body).append(that.template)
								//设置位置
								that.setPosition()
								if(that.options.moveable)
										that.draggable()
								that.trigger("show.done")
						} else{
								that.template.css({display: 'block'})
						}

						if(parseInt(this.template[0].style.opacity)){		//再次点击原元素toggle效果
								this.trigger("hide")
								return;
						}
						that.template.animate({'opacity': 1}, 200)
				},
					
				hide: function(){
						var that = this
						that.template.animate({opacity: 0}, 200, function(){
								that.template.css({display: 'none'})
						})
						$('.floatBoxBg').animate({opacity: 0}, function(){
								$('.floatBoxBg').remove()
						})
				},
				
				shown: function(){
						var that = this
						//监听关闭
						that.template.find('.close').on('click', function(){
								that.trigger("hide")
						})

						//监听点击空白可以退出
						if(that.options.bgClose){
								$(document).off('click').on('mousedown', function(event){
										if((!$(event.target).closest('.floatBox').length) && event.target.id!==that.options.id){
												that.trigger("hide")
										}
								})
						}
				},
				
				getDialog: function(){
						var template = "<div class='floatBox'><div class='title'><title></title><img src='img/fancy_closebox.png' class='close' alt='close'/></div><div class='content'></div></div>"
						return $(template);
				},
				
				setPosition: function(){
						var _this = this.ele,		//原元素
								refLeft = _this[0].offsetWidth / 2 + _this[0].offsetLeft,		//原元素中心的left
								refTop = _this[0].offsetHeight / 2 + _this[0].offsetTop,		//原元素中心的top
								offset = 10,		//与原元素位置的偏移量
								top, left 
								
						this.template.css({height : this.options.height ? this.options.height : 'auto',
															 width : this.options.width ? this.options.width : 'auto',
															 position: 'absolute'})
						this.template.find(".content").css({height: this.template.outerHeight() - this.template.find('.title').outerHeight()})
						switch(this.options.direction){
								case 'top':
										top = _this[0].offsetTop - this.template.outerHeight() - offset
										left = refLeft - this.template.outerWidth() / 2
										this.template.css({top: top, left: left})
										break
								case 'bottom':
										top = _this[0].offsetTop + _this[0].offsetHeight + offset
										left = refLeft - this.template.outerWidth() / 2
										this.template.css({top: top, left: left})
										break
								case 'left':
										top = refTop - this.template.outerHeight()/2
										left = _this[0].offsetLeft - this.template.outerWidth() - offset
										this.template.css({top: top, left: left})
										break
								case 'right':
										top = refTop - this.template.outerHeight()/2
										left = _this[0].offsetLeft + _this[0].offsetWidth + offset
										this.template.css({top: top, left: left})
										break
								case 'center':
										top = ($(window).height() - this.template.outerHeight()) / 2 > 0 ? ($(window).height() - this.template.outerHeight()) / 2 : 0
										left = ($(window).width() - this.template.outerWidth()) / 2 > 0 ? ($(window).width() - this.template.outerWidth()) / 2 : 0
										this.template.css({top: top, left: left})
										if(!top){
												this.template.css({position: 'fixed'})
										}
								default:
										break
						}
						//this.template.css({position: this.options.position})
				},
				
				draggable: function(){
						var that = this, _move = false, left_o, top_o, x_o, y_o
						that.template.find(".title").on({
								'mousedown': function(ev){
										_move = true
										left_o = that.template[0].offsetLeft		//原来的位置
										top_o = that.template[0].offsetTop			//原来的位置
										x_o = ev.clientX
										y_o = ev.clientY
										$(document).on({
												'mousemove': function(event){
														if(_move){
																that.template.css({top: top_o - (y_o - event.clientY), 
																		 							 left: left_o - (x_o - event.clientX)})
																that.template.find(".title").css({cursor: 'all-scroll'})
														}
												},
												'mouseup': function(event){
														_move = false
														that.template.find(".title").css({cursor: 'default'})
												}
										})
								}
						})
				},
				
				defaultOptions: {
						title    : "",										//弹出层的标题
						type     : "text",								//弹出层类型(text、容器ID、URL、Iframe)
						content  : '',										//弹出层的内容(text文本、容器ID名称、URL地址、Iframe的地址)
						width    : null,									//弹出层的宽度
						height   : null,									//弹出层的高度
						closeID  : "closeId",							//关闭对话框的ID
						isAuto   : false,									//是否自动弹出
						time     : 1000,									//设置自动弹出层时间，前提是isAuto=true
						isClose  : false,  								//是否自动关闭		
						timeOut  : 2000,									//设置自动关闭时间，前提是isClose=true
						direction: 'top',									//弹出层方向
						bg       : 0.4,										//遮罩层背景颜色  bg: [0.8, '#393D49'](tring/Array/Boolean)
						bgClose  : true,		 							//是否点击遮罩关闭
						id       : null,									//元素id
						position : 'absolute', 						//弹出层定位
						moveable : false									//弹出层是否可以拖动
				},
				
				trigger: function(triggernName) {
						triggernName += ".bs"
						this[Dialog.events[triggernName]].apply(this)
				}
		}
		
		Dialog.events = {
			"show.done.bs": "shown",
			"hide.bs": "hide"
		}
		
		$.fn.Dialog = function(option) {
				return this.each(function(i, e){
						var $this = $(this),
								data = $this.data("dl"),
								options = typeof option == 'object' && option;

						if(!data)
								$this.data("dl", new Dialog(this, options))
						if(typeof option == 'string')
								data[option]()
				})
		}
		
/*** 16进制颜色转为RGB格式 ***/ 
		String.prototype.colorRgb = function(){
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
						sColor = this.toLowerCase();  
		    if(sColor && reg.test(sColor)){  
		        if(sColor.length === 4){  
		            var sColorNew = "#";  
		            for(var i=1; i<4; i+=1){  
		                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
		            }  
		            sColor = sColorNew;  
		        }  
		        //处理六位的颜色值  
		        var sColorChange = [];  
		        for(var i=1; i<7; i+=2){  
		            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
		        }  
		        return "RGBA(" + sColorChange.join(",") + ")";  
		    }else{  
		        return sColor;    
		    }  
		}
}) (jQuery);