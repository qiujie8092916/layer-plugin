/***
 * 漫画Jquery弹出层插件
 * 编写时间：2012年7月23号
 * version:Dialog.1.0.js
***/
var _move = false;//移动标记
var _x, _y;//鼠标离控件左上角的相对位置
var newz = 1;//新对象的z-index
var oldz = 1;//旧对象的z-index

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
						//设置背景
						var that = this, 
								bg = "<div class='floatBoxBg'></div>"
								
						that.bg = $(bg)
						$(document.body).append(that.bg)
						that.bg.animate({opacity: 1}, 300)
						
						if(!this.template){
								that.template = that.getDialog()
								
								//设置标题		
								that.template.find('h4').text(that.options.title)	
								
								//设置内容
								that.template.find('.content').text(that.options.content)
								
								//监听关闭
								that.template.find('.close').on('click', function(){
									that.hide()
								})
								
								//设置样式
								that.setStyle(that)
								
								//添加到DOM
								$(document.body).append(that.template)
								
						} else{
							this.template.css({display: 'block'})
						}
				},

				hide: function(){
						this.template.css({display: 'none'})
						$('.floatBoxBg').animate({opacity: 0}).remove()
				},

				getDialog: function(){
						var template = "<div class='floatBox'><div class='title'><h4></h4><img src='fancy_closebox.png' class='close' height='20' width='20'/></div><div class='content'></div></div>"
						return $(template);
				},
				
				setStyle: function(element){
						var 
						switch(that.options.direction){
								case 'top':
										
								case 'bottom':
										
								case 'left':
										
								case 'right':
									
								default:
										break;
						}
						that.template.css({height : that.options.height ? that.options.height : 'auto',
															 width : that.options.width ? that.options.width : 'auto'})
				},
				
				defaultOptions: {
						Event   : "onload",								//触发响应事件
						title   : "title",								//弹出层的标题
						type    : "text",									//弹出层类型(text、容器ID、URL、Iframe)
						content : "",							//弹出层的内容(text文本、容器ID名称、URL地址、Iframe的地址)
						width   : null,									//弹出层的宽度
						height  : null,									//弹出层的高度
						closeID : "closeId",							//关闭对话框的ID
						isAuto  : false,									//是否自动弹出
						time    : 1000,										//设置自动弹出层时间，前提是isAuto=true
						isClose : false,  								//是否自动关闭		
						timeOut : 2000,										//设置自动关闭时间，前提是isClose=true
						direction: 'top'
				}
		}

/****************************************************
	
		var init = function (options){
			var background = 
			var dialog = 
			
		}
		
		init(options)
	}
		
		
		
		var $this = $(this);					//当然响应事件对象
		var $blank = $("#fb"+options.title);						//遮罩层对象 bg
		var $dialog = $("#"+options.title);						//弹出层对象
		var $title = $("#"+options.title+" .title h4");				//弹出层标题对象
		var $content = $("#"+options.title+" .content");				//弹出层内容对象
		var $close = $("#c"+options.title);						//关闭层按钮对象
		var $ttt =  $("#t"+options.title);	//title
		var $closeId = $("#"+options.closeID);
		var stc,st;
		
		$this.options = options
		$close.on("click",function(){
			if ($("#hangyedialog")){
				$("#hangyedialog").hide();
			}
			$blank.animate({"opacity": 0}).hide();
			$dialog.hide();			
			if(st){
				clearTimeout(st);//清除定时器
			}
			if(stc){
				clearTimeout(stc);//清除定时器
			}
		});	
		$closeId.on("click",function(){
			if ($("#hangyedialog")){
				$("#hangyedialog").hide();
			}
			$blank.animate({"opacity": 0}).hide();
			$dialog.hide();			
			if(st){
				clearTimeout(st);//清除定时器
			}
			if(stc){
				clearTimeout(stc);//清除定时器
			}
		});	
		$ttt.on("mousedown",function(e){									  
			 _move=true;
			newz = parseInt($dialog.css("z-index"))
			$dialog.css({"z-index":newz+oldz});
			//t =  $dialog;//初始化当前激活层的对象
			_x=e.pageX-parseInt($dialog.css("left"));//获得左边位置
			_y=e.pageY-parseInt($dialog.css("top"));//获得上边位置
			$dialog.fadeTo(50, 0.5);//点击后开始拖动并透明显示								 
		});
		$(document).on("mousemove",function(e){
			 if(_move){
				var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
				var y=e.pageY-_y;
				 $dialog.css({top:y,left:x});//控件新位置			
			}							 
		});
		$ttt.on("mouseup",function(e){
			_move=false;
			 $dialog.fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
			oldz = parseInt($dialog.css("z-index"));//获得最后激活层的z-index							 
		});
		
		$content.css("height",parseInt(options.height)-30);
		//文本框绑定事件
		$this.on(options.Event,function(e){
			$title.html(options.title);
			switch(options.type){
				case "url":									//当类型是地址的时候					
					$content.ajaxStart(function(){
						$(this).html("loading...");
					});
					$.get(options.content,function(html){
						$content.html(html);						
					});
					break;
				case "text":								//当类型是文本的时候
					$content.html(options.content);
					break;
				case "id":									//当类型是容器ID的时候
					$content.html($("#"+options.content+"").html());
					break;
				case "iframe":								//当类型是Iframe的时候
					$content.html("<iframe src=\""+options.content+"\" width=\"100%\" height=\""+(parseInt(options.height)-40)+"px"+"\" scrolling=\"auto\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\"></iframe>");
					break;
				default:									//默认情况下的时候
					$content.html(options.content);
					break;
			}
			
			$blank.show();
			$blank.animate({opacity:"0.5"},"normal");		
			$dialog.css({display:"block",left:(($(document).width())/2-(parseInt(options.width)/2)-5)+"px",top:((document.documentElement.clientHeight)/2-(parseInt(options.height)/2))+"px",width:options.width,height:options.height});
			//$dialog.animate({top:($(document).scrollTop()+options.scrollTop)+"px"},"normal");
			//$dialog.animate({top:options.scrollTop+"px"},"normal");
			if (options.isClose){
				stc = setTimeout(function (){			
					$close.trigger("click");
					clearTimeout(stc);
				},options.timeOut);	
			}
			
		});	
		if (options.isAuto){
			st = setTimeout(function (){			
				$this.trigger(options.Event);
				clearTimeout(st);
			},options.time);	
		}
//	}
	
	
	$.fn.Dialog.prototype.show = function(){
		$(this).trigger(options.Event)
	}
	
	$.fn.Dialog.prototype.hide = function(){
		$("#c"+options.title).trigger("click")
	}
	
	*/
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
	
}) (jQuery);