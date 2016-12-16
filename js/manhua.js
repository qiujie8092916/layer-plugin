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
						$('.floatBox').hide()
						if(!this.template){
								that.template = that.getDialog()
								
								//设置标题		
								that.template.find('title').text(that.options.title)	
								
								//设置内容
								that.template.find('.content').text(that.options.content)
								
								
								//添加到DOM
								$(document.body).append(that.template)
								
								//设置样式
								that.setStyle()
						} else{
							that.template.css({display: 'block'})
						}
						that.shown()
				},
					
				hide: function(){
						this.template.css({display: 'none'})
						$('.floatBoxBg').animate({opacity: 0}, function(){
								$('.floatBoxBg').remove()
						})
				},
				
				shown: function(){
						var that = this
						//监听关闭
						that.template.find('.close').on('click', function(){
							that.hide()
						})
						
						//监听点击背景可以退出
						if(that.options.bgClose){	
								$(document).on('click', function(e){
										if(!($('.floatBox').find(e.target).length || $(e.target).outerHTML === $('.floatBox')[0].outerHTML)){
												that.hide()
										}
								})
						}
				},
				
				getDialog: function(){
						var template = "<div class='floatBox'><div class='title'><title></title><img src='img/fancy_closebox.png' class='close' height='20' width='20'/></div><div class='content'></div></div>"
						return $(template);
				},
				
				setStyle: function(){
						var _this = this.ele,		//原元素
								refLeft = _this[0].offsetWidth / 2 + _this.offset().left,		//原元素中心的left
								refTop = _this[0].offsetHeight / 2 + _this.offset().top,		//原元素中心的top
								offset = 10,		//与原元素位置的偏移量
								top, left 
								
						this.template.css({height : this.options.height ? this.options.height : 'auto',
															 width : this.options.width ? this.options.width : 'auto'})
						switch(this.options.direction){
								case 'top':
										top = _this.offset().top - this.template[0].offsetHeight - offset
										left = refLeft - this.template[0].offsetWidth / 2
										this.template.css({top: top, left: left})
										break
								case 'bottom':
										top = _this.offset().top + _this[0].offsetHeight + offset
										left = refLeft - this.template[0].offsetWidth / 2
										this.template.css({top: top, left: left})
										break
								case 'left':
										top = refTop - this.template[0].offsetHeight/2
										left = _this.offset().left - this.template[0].offsetWidth - offset
										this.template.css({top: top, left: left})
										break
								case 'right':
										top = refTop - this.template[0].offsetHeight/2
										left = _this.offset().left + _this[0].offsetWidth + offset
										this.template.css({top: top, left: left})
										break
								default:
										break
						}
				},
				
				defaultOptions: {
						Event    : "onload",							//触发响应事件
						title    : "title",								//弹出层的标题
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
				}
		}

		$.fn.Dialog = function(option) {
				return this.each(function(){
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