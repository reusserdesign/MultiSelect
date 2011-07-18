/*httpdocs/media/common/scripts/js/multiSelect/multiselect.min.js*/
/*
 Implementation made by Eric Kever, for Reusser Design, LLC.
*/

(function($){	
	methods = {
		rewrite : function(arg){
			var $this = this,
				opts = arg || {},
				data = $this.data('multiSelect') || {},
				defaults = {
					//expand : false,
					list : false,
					paginate : {
						at : 5,
						less : 3,
						more : 3
						//on : 'internal'
					},
					//animate : true,
					indices : [],
					page : 1,
					bindInput : '#multiselectinput',
					arrayOutput : false,
					inputDelimiter : '|',
					pairDelimiter : '%',
					pageDelimiter : '|',
					pageSectionSeparator : '&hellip;'
				},
				//expand = opts.expand || data.expand || defaults.expand,
				list = opts.list || data.list || defaults.list,
				paginate = (opts.paginate || opts.paginate === false ? opts.paginate : (data.paginate || data.paginate === false ? data.paginate : defaults.paginate)),
				//animate = opts.animate || data.animate || defaults.animate,
				indices = opts.indices || data.indices || defaults.indices,
				page = opts.page || data.page || defaults.page,
				bindInput = opts.bindInput || data.bindInput || defaults.bindInput,
				arrayOutput = opts.arrayOutput || data.arrayOutput || defaults.arrayOutput,
				inputDelimiter = opts.inputDelimiter || data.inputDelimiter || defaults.inputDelimiter,
				pageDelimiter = opts.pageDelimiter || data.pageDelimiter || defaults.pageDelimiter,
				pageSectionSeparator = opts.pageSectionSeparator || data.pageSectionSeparator || defaults.pageSectionSeparator,
				currentList = data.currentList || [],
				acc = 0,
				stop = 0,
				out = '',
				pag = '',
				pages = [],
				len = 0,
				maxpages = 0,
				top = 0,
				bot = 0;
			
			paginate.at = paginate.at || defaults.paginate.at;
			paginate.less = paginate.less || defaults.paginate.less;
			paginate.more = paginate.more || defaults.paginate.more;
			
			$this.data('multiSelect', {
				list : list,
				paginate : paginate,
				page : page,
				currentList : currentList,
				bindInput : bindInput,
				arrayOutput : arrayOutput,
				inputDelimiter : inputDelimiter,
				pageDelimiter : pageDelimiter,
				pageSectionSeparator : pageSectionSeparator
			});
			
			if(currentList.length === 0 && list !== false){
				if(!$.isArray(list)){
					$.getJSON(list, function(data){
						$(data).each(function(){
							currentList.push([this.name, this.value, this.checked || ($.inArray(this.value, indices) > -1)]);
						});
					}).error(function(){
						$.error('An AJAX error occurred.  Please ensure that the list link is correct.');
					});
				}else{
					$(list).each(function(){
						currentList.push([this.name, this.value, this.checked || ($.inArray(this.value, indices) > -1)]);
					});
				}
			}
			
			maxpages = Math.ceil(currentList.length / paginate.at);
			
			if(currentList.length > 0){
				if(paginate !== false){
					for(acc = (page - 1) * paginate.at, stop = (acc + paginate.at), len = currentList.length; acc < stop && acc < len; acc++)
						out += '<div class="ms-option ' + (acc % 2 ? 'ms-even' : 'ms-odd') + (currentList[acc][2] ? ' ms-selected' : '') + '"><label><input type="checkbox"' + (currentList[acc][2] ? ' checked="checked"' : '') + ' value="' + currentList[acc][1] + '" name="' + currentList[acc][0] + '" /> <span>' + currentList[acc][1] + '</span></label></div>';
					if(maxpages > 1){
						top = page + paginate.more;
						bot = page - paginate.less;
						if(page > 1) pag += '<li class="ms-first" title="First Page">&laquo;</li><li class="ms-prev" title="Previous Page">&lsaquo;</li><li class="ms-nav-separator">' + pageSectionSeparator + '</li>';
						for(acc = (top > maxpages ? maxpages : top), stop = (bot < 1 ? 1 : bot); acc >= stop; acc--) pages.unshift('<li class="' + (acc !== page ? 'ms-page' : 'ms-current') + '" title="Page ' + acc + '">' + acc + '</li>');
						pag += pages.join('<li class="ms-page-separator">' + pageDelimiter + '</li>');
						if(page < maxpages) pag += '<li class="ms-nav-separator">' + pageSectionSeparator + '</li><li class="ms-next" title="Next Page">&rsaquo;</li><li class="ms-last" title="Last Page">&raquo;</li>';
						out += '<div class="ms-pages">' + pag + '</div>';
					}
				}else
					for(acc = 0, stop = currentList.length; acc < stop; acc++)
						out += '<div class="ms-option ' + (acc % 2 ? 'ms-even' : 'ms-odd') + (currentList[acc][2] ? ' ms-selected' : '') + '"><label><input type="checkbox"' + (currentList[acc][2] ? ' checked="checked"' : '') + ' value="' + currentList[acc][1] + '" name="' + currentList[acc][0] + '" /> <span>' + currentList[acc][1] + '</span></label></div>';
			}
			
			if(arrayOutput === false){
				for(pag = '', acc = 0, len = currentList.length; acc < len; acc++) if(currentList[acc][2]) pag += currentList[acc][1] + inputDelimiter;
				if(pag.substr(0 - inputDelimiter.length) === inputDelimiter) pag = pag.substr(0, (pag.length - inputDelimiter.length));
				$(bindInput).val(pag);
			}else{
				for(pag = '', acc = 0, len = currentList.length; acc < len; acc++) if(currentList[acc][2]) pag += '<input type="hidden" name="' + arrayOutput + '[' + currentList[acc][0] + ']" value="' + currentList[acc][1] + '" />';
				top = $(bindInput);
				if(top.length === 0)
					$('#__mcarrinput').html(pag);
				else{
					top.replaceWith('<span id="__mcarrinput"></span>');
					$('#__mcarrinput').html(pag);
				}
			}
			
			$this.html(out);
			
			$this.find('>div.ms-option>label>input').unbind('click').click(function(){
				$this.multiSelect('toggle', $(this).next().html());
			});
			$this.find('>div.ms-pages>li.ms-page').unbind('click').click(function(){
				$this.multiSelect('topage', $(this).html());
			});
			$this.find('>div.ms-pages>li.ms-first').unbind('click').click(function(){
				$this.multiSelect('topage', 1);
			});
			$this.find('>div.ms-pages>li.ms-last').unbind('click').click(function(){
				$this.multiSelect('topage', maxpages);
			});
			$this.find('>div.ms-pages>li.ms-prev').unbind('click').click(function(){
				$this.multiSelect('topage', parseInt($(this).parent().find('>li.ms-current').html()) - 1);
			});
			$this.find('>div.ms-pages>li.ms-next').unbind('click').click(function(){
				$this.multiSelect('topage', parseInt($(this).parent().find('>li.ms-current').html()) + 1);
			});
			
			return $this.addClass('multi-select');
		},
		
		toggle : function(id){
			var data = this.data('multiSelect'),
				list = data.currentList,
				acc, len;
			for(acc = 0, len = list.length; acc < len; acc++) if(list[acc][1] == id){
				list[acc][2] = !list[acc][2];
				break;
			}
			return methods['rewrite'].apply(this);
		},
		
		topage : function(page){
			var data = this.data('multiSelect');
			data.page = parseInt(page);
			return methods['rewrite'].apply(this);
		}
	};
	
	$.fn.multiSelect = function(mth){
		var vers = $().jquery.split('.'),
			version = parseInt([vers[0], vers[1] || 0, vers[2] || 0].join(''));
		if(version < 141) return $.error('jQuery 1.4.1 or greater is required to use multiSelect.');  //#todo needs to be compatible with earlier versions.
		if(methods[mth]) return methods[mth].apply(this, Array.prototype.slice.call(arguments, 1));
		else if(typeof mth === typeof {} || !mth) return methods.rewrite.apply(this, arguments);
		else return $.error(mth + ' is not a valid multiSelect method.');  //Needs return, to keep within strict JavaScript standards.
	}
	$.fn.dropDown=function(a,b){  //All of this dropDown source is optimized for minification.
		var c=false,
			d=this.hide(),
			e=true,
			f=$(a),
			g='fast',
			h=a+'>div',
			i='click',
			j='slideDown',
			k='slideUp',
			l='addClass',
			m='removeClass',
			n='width',
			o='folded';
		d[n](f[n]()).add(a).mouseenter(function(){
			c=true
		}).mouseleave(function(){
			c=false
		});
		f.html('<div>'+b+'</div>').find('>div').andSelf()[i](function(a){
			a.stopPropagation();
			if(e){
				d[j](g,function(){
					$(h)[l](o)
				});
				e=false
			}else{
				d[k](g,function(){
					$(h)[m](o)
				});
				e=true
			}
		});
		$(':not('+a+'):not('+h+')')[i](function(){
			if(c){
				d[j](g,function(){
					$(h)[l](o)
				});
				e=false
			}else{
				d[k](g,function(){
					$(h)[m](o)
				});
				e=true
			}
		});
		f[l]('drop-down');
		return d
	}
})(jQuery);